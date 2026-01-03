import { useState } from "react"
import { useNavigate } from "react-router"
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
		profileType: null

	})
	const [error, setError] = useState<string>()
	const [registerType, setRegisterType] = useState<"trainer" | "client" | null>(null)
	const navigate = useNavigate()

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

		navigate('/')
	}

	return (
		<div className={`min-h-screen flex items-center justify-center ${registerType === null ? "bg-sunset" : registerType === "trainer" ? "bg-trainer" : "bg-client"} p-4`}>
			{!registerType && <RoleSelectionView roleChange={handleRegisterTypeChange} />}
			{registerType && <Register registerData={registerData} onInputChange={handleInputChange} onSubmit={handleSubmit} registerType={registerType} onBack={() => { setRegisterType(null) }} />}
		</div>
	)


}

export default RegisterPage
