import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { useSignUp, useAuth } from "@clerk/react"
import { useMutation } from "@tanstack/react-query"
import { createProfile, syncUser, validateClientInvite } from "../../services/authApi"
import { useAuthStore } from "../../store/authStore"
import RoleSelectionView from "../../components/authentication/RoleSelectionView"
import Register from "../../components/authentication/Register"
import type { RegisterData } from "../../types/clientTypes"
import VerifyCodeComponent from "../../components/authentication/VerifyCodeComponent"

const RegisterPage = () => {
	const { signUp } = useSignUp()
	const setUser = useAuthStore((state) => state.setUser)
	const [isVerifying, setIsVerifying] = useState<boolean>(false)
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const [registerData, setRegisterData] = useState<RegisterData>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		age: "",
		weight: "",
		goal: "",
		notes: "",
		profileType: null,
		inviteToken: ""
	})
	const [error, setError] = useState<string>()
	const [successMessage, setSuccessMessage] = useState<string>()
	const [registerType, setRegisterType] = useState<"trainer" | "client" | null>(null)
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	const { isSignedIn, isLoaded } = useAuth()

	// Redirect if already signed in
	useEffect(() => {
		if (isLoaded && isSignedIn) {
			navigate("/dashboard", { replace: true })
		}
	}, [isLoaded, isSignedIn, navigate])

	// checks if there is pending invite token from a trainer
	const pendingToken = searchParams.get('token')
	const hasPendingInvite = Boolean(pendingToken)
	const [inviteEmail, setInviteEmail] = useState<string>()

	useEffect(() => {
		if (!pendingToken) return // if none return and continue registration normally

		// Fetch invite details to get the email
		const fetchInviteDetails = async () => {
			try {
				const response = await validateClientInvite(pendingToken)
				if (response.valid && response.clientEmail) {
					setInviteEmail(response.clientEmail)
					setRegisterData(prev => ({
						...prev,
						profileType: "client",
						inviteToken: pendingToken,
						email: response.clientEmail
					}))
				}
			} catch (error) {
				console.error('Failed to validate invite:', error)
			}
		}

		// Automatically set to client registration
		setRegisterType("client")
		fetchInviteDetails()
	}, [pendingToken])

	// Restore verification state from localStorage on mount
	useEffect(() => {
		const pendingVerification = localStorage.getItem('pendingVerification')
		if (pendingVerification) {
			try {
				const data = JSON.parse(pendingVerification)
				setRegisterData(data.registerData)
				setRegisterType(data.registerType)
				setIsVerifying(true)
			} catch (error) {
				console.error('Failed to restore verification state:', error)
				localStorage.removeItem('pendingVerification')
			}
		}
	}, [])

	const handleRegisterTypeChange = (type: "trainer" | "client" | null) => {
		setRegisterType(type)
		setRegisterData({ ...registerData, profileType: type })
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.currentTarget
		setRegisterData({ ...registerData, [name]: value })
	}

	// Mutation 1: Create MongoDB profile
	const createProfileMutation = useMutation({
		mutationFn: createProfile,
		onSuccess: async (data) => {
			if (!data.success) {
				setError(data.message)
				return
			}
			// Profile created, now sync to get full user data
			syncUserMutation.mutate()
		},
		onError: (err: any) => {
			setError(err.message || "Failed to create profile")
		}
	})

	// Mutation 2: Sync user data
	const syncUserMutation = useMutation({
		mutationFn: syncUser,
		onSuccess: (data) => {
			if (!data.success) {
				setError(data.message)
				return
			}
			setUser(data.user)
			navigate('/dashboard')
		},
		onError: (err: any) => {
			setError(err.message || "Failed to sync user data")
		}
	})

	const handleVerifyCode = async (code: string) => {
		try {
			setError(undefined)
			await signUp.verifications.verifyEmailCode({ code })

			if (signUp.status === "complete") {
				// Clear localStorage
				localStorage.removeItem('pendingVerification')

				// Set active session
				await signUp.finalize()

				// Create MongoDB profile
				// Token is automatically handled by tokenProvider in axios interceptor
				createProfileMutation.mutate({
					firstName: registerData.firstName,
					lastName: registerData.lastName,
					email: registerData.email,
					profileType: registerData.profileType!,
					age: registerData.age,
					weight: registerData.weight,
					goal: registerData.goal,
					notes: registerData.notes,
					trainerType: registerData.profileType === 'trainer' ? 'personal' : undefined,
					inviteToken: registerData.inviteToken
				})
			}
		} catch (err: any) {
			console.error('Verification error:', err)
			setError("קוד לא תקין. נסה שוב")
		}
	}

	const handleResendCode = async () => {
		try {
			setError(undefined)
			setSuccessMessage(undefined)
			await signUp.verifications.sendEmailCode()
			setSuccessMessage("קוד חדש נשלח למייל שלך")
		} catch (err: any) {
			console.error('Resend error:', err)
			setError("שגיאה בשליחת הקוד. נסה שוב")
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(undefined)
		if (!isLoaded || isSubmitting) return

		setIsSubmitting(true)
		try {
			// 1. Sign up with Clerk
			const { error } = await signUp.password({
				emailAddress: registerData.email,
				password: registerData.password,
				firstName: registerData.firstName,
				lastName: registerData.lastName,
			})
			if (error) {
				setError(error.message || "הרשמה נכשלה")
				setIsSubmitting(false)
				return
			}


			// Check if email verification is needed
			if (signUp.status === "complete") {
				// Email already verified (test mode or no verification required)
				await signUp.finalize()

				// Create MongoDB profile
				createProfileMutation.mutate({
					firstName: registerData.firstName,
					lastName: registerData.lastName,
					email: registerData.email,
					profileType: registerData.profileType!,
					age: registerData.age,
					weight: registerData.weight,
					goal: registerData.goal,
					notes: registerData.notes,
					trainerType: registerData.profileType === 'trainer' ? 'personal' : undefined,
					inviteToken: registerData.inviteToken
				})
			} else {
				// Email verification required
				await signUp.verifications.sendEmailCode()

				// Save to localStorage for page refresh persistence
				localStorage.setItem('pendingVerification', JSON.stringify({
					registerData,
					registerType
				}))

				setIsVerifying(true)
				setIsSubmitting(false)
				setError("נשלח קוד אימות למייל שלך. בדוק את תיבת הדואר הנכנס")
			}
		} catch (err: any) {
			console.error("Error:", err)

			// Check if email already exists (might be unverified account)
			if (err.errors?.[0]?.code === "form_identifier_exists") {
				try {
					// Email exists - let user try verification
					await signUp.verifications.sendEmailCode()

					localStorage.setItem('pendingVerification', JSON.stringify({
						registerData,
						registerType
					}))

					setIsVerifying(true)
					setError("כבר נרשמת! נשלח קוד אימות למייל שלך")
				} catch (resendErr) {
					setError("אימייל כבר קיים במערכת")
				}
			} else {
				setError(err.errors?.[0]?.message || "הרשמה נכשלה")
			}
			setIsSubmitting(false)
		}
	}

	const handleBack = () => {
		// Don't allow going back if there's a pending invite
		if (hasPendingInvite) return

		setRegisterType(null)
	}

	return (
		<div className={`min-h-screen flex items-center justify-center ${registerType === null ? "bg-sunset" : registerType === "trainer" ? "bg-trainer" : "bg-client"} p-4`}>
			{!registerType ? (
				<RoleSelectionView roleChange={handleRegisterTypeChange} />
			) : isVerifying ? (
				<VerifyCodeComponent
					email={registerData.email}
					onVerify={handleVerifyCode}
					onResend={handleResendCode}
					error={error}
					successMessage={successMessage}
					isLoading={createProfileMutation.isPending || syncUserMutation.isPending}
				/>
			) : (
				<Register
					registerData={registerData}
					onInputChange={handleInputChange}
					onSubmit={handleSubmit}
					registerType={registerType}
					onBack={handleBack}
					hasPendingInvite={hasPendingInvite}
					inviteEmail={inviteEmail}
					isLoading={isSubmitting || createProfileMutation.isPending || syncUserMutation.isPending}
					error={error}
				/>
			)}
		</div>
	)


}

export default RegisterPage
