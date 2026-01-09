import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { register } from "../../services/api"
import RoleSelectionView from "../../components/authentication/RoleSelectionView"
import Register from "../../components/authentication/Register"
import type { RegisterData } from "../../types/clientTypes"


const RegisterPage = () => {
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
	const [registerType, setRegisterType] = useState<"trainer" | "client" | null>(null)
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	// checks if there is pending invite token from a trainer
	const pendingToken = searchParams.get('token')
	const hasPendingInvite = Boolean(pendingToken)
	useEffect(() => {
		if (!pendingToken) return // if none return and continue registration normally

		// Automatically set to client registration
		setRegisterType("client")
		setRegisterData(prev => ({ ...prev, profileType: "client", inviteToken: pendingToken }))
	}, [pendingToken])

	const handleRegisterTypeChange = (type: "trainer" | "client" | null) => {
		setRegisterType(type)
		setRegisterData({ ...registerData, profileType: type })
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.currentTarget
		setRegisterData({ ...registerData, [name]: value })
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const response = await register(registerData)
		console.log(response)

		if (!response.success) {
			setError(response.message)
			return
		}

		navigate('/login')
	}

	const handleBack = () => {
		// Don't allow going back if there's a pending invite
		if (hasPendingInvite) return

		setRegisterType(null)
	}

	return (
		<div className={`min-h-screen flex items-center justify-center ${registerType === null ? "bg-sunset" : registerType === "trainer" ? "bg-trainer" : "bg-client"} p-4`}>
			{!registerType && <RoleSelectionView roleChange={handleRegisterTypeChange} />}
			{registerType && <Register
				registerData={registerData}
				onInputChange={handleInputChange}
				onSubmit={handleSubmit}
				registerType={registerType}
				onBack={handleBack}
				hasPendingInvite={hasPendingInvite}
				error={error}
			/>}
		</div>
	)


}

export default RegisterPage
