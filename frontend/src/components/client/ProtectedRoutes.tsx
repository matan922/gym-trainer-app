import { Navigate } from "react-router"
import { useAuthStore } from "../../store/authStore"
import { useEffect, useState } from "react"
import { refresh } from "../../services/api"

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
	const token = useAuthStore((state) => state.token)
	const setToken = useAuthStore((state) => state.setToken)
	const [isChecking, setIsChecking] = useState<boolean>(!token)

	// If no access token check for refresh token
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await refresh()
				setToken(response.accessToken)
			} catch (error) {
				console.log("Refresh failed")
			}

			setIsChecking(false)
		}

		if (!token) {
			checkAuth()
		}
	}, [])

	if (isChecking) {
		return <div>טוען...</div>
	}

	if (!token) {
		return <Navigate to="/login" replace />
	}

	return <>{children}</>
}

export default ProtectedRoutes
