import { Navigate, Route, Routes } from "react-router"
import InviteClientPage from "./pages/trainer/InviteClientPage"
import LoginPage from "./pages/authentication/LoginPage"
import ClientDetailsPage from "./pages/trainer/ClientDetailsPage"
import ClientsPage from "./pages/trainer/ClientsPage"
import ClientWorkoutsPage from "./pages/trainer/ClientWorkoutsPage"
import DashboardLayout from "./pages/trainer/DashboardLayout"
import DashboardClientLayout from "./pages/client/DashboardClientLayout"
import WorkoutPage from "./pages/trainer/WorkoutPage"
import "./assets/styles/index.css"
import ProtectedRoutes from "./components/client/ProtectedRoutes"
import RegisterPage from "./pages/authentication/RegisterPage"
import NewSessionPage from "./pages/trainer/NewSessionPage/NewSessionPage"
import SessionsPage from "./pages/trainer/SessionsPage"
import DashboardMainPage from "./pages/trainer/DashboardMainPage"
import DashboardClientPage from "./pages/client/DashboardClientPage"
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/he'
import dayjs from "dayjs"
import VerifyEmailPage from "./pages/authentication/VerifyEmailPage"
import InviteAcceptPage from "./pages/authentication/InviteAcceptPage"
import { useAuthStore } from "./store/authStore"
import SessionsClientPage from "./pages/client/SessionsClientPage"
import WorkoutsClientPage from "./pages/client/WorkoutsClientPage"
import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react"
import { setClerkTokenGetter } from "./utils/tokenProvider"
import { syncUser } from "./services/authApi"
import { useMutation } from "@tanstack/react-query"

dayjs.extend(relativeTime)
dayjs.locale('he')

function App() {
	const user = useAuthStore((state) => state.user)
	const setUser = useAuthStore((state) => state.setUser)
	const { getToken, isSignedIn, isLoaded } = useAuth()

	// Mutation for syncing user data
	const syncUserMutation = useMutation({
		mutationFn: syncUser,
		onSuccess: (data) => {
			if (data.success) {
				setUser(data.user)
			}
		},
		onError: (err: any) => {
			console.error('Failed to sync user:', err)
		}
	})

	// Register Clerk token getter and auto-sync user data
	useEffect(() => {
		// Register token getter for axios interceptor
		setClerkTokenGetter(getToken)

		// Auto-sync: If Clerk says user is signed in but we don't have user data, fetch it
		if (isLoaded && isSignedIn && !user) {
			syncUserMutation.mutate()
		}
	}, [getToken, isSignedIn, isLoaded, user])

	if (!isLoaded) return null

	return (
		<Routes>
			<Route path="/" element={<Navigate to={isSignedIn ? "/dashboard" : "/register"} replace />} />
			<Route path="/login" element={isSignedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
			<Route path="/register" element={isSignedIn ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
			<Route path="/auth/verify-email" element={<VerifyEmailPage />} />
			<Route path="/invite-accept" element={<InviteAcceptPage />} />


			{user && user.activeProfile === 'trainer' ? (
				<Route
					path="*"
					element={
						<ProtectedRoutes>
							<DashboardLayout />
						</ProtectedRoutes>
					}
				>
					<Route path="dashboard" element={<DashboardMainPage />} />
					<Route path="sessions" element={<SessionsPage />} />
					<Route path="sessions/:clientId" element={<SessionsPage />} />
					<Route path="clients" element={<ClientsPage />} />
					<Route path="new-client" element={<InviteClientPage />} />
					<Route path="clients/:id" element={<ClientDetailsPage />} />
					<Route path="clients/:id/workouts" element={<ClientWorkoutsPage />} />
					<Route path="clients/:id/workouts/:workoutId" element={<WorkoutPage />} />
					<Route path="new-session" element={<NewSessionPage />} />
				</Route>
			) : (
				<Route
					path="*"
					element={
						<ProtectedRoutes>
							<DashboardClientLayout />
						</ProtectedRoutes>
					}
				>
					<Route path="dashboard" element={<DashboardClientPage />} />
					<Route path="sessions" element={<SessionsClientPage />} />
					<Route path="workouts" element={<WorkoutsClientPage />} />
				</Route>
			)}
		</Routes>
	)
}

export default App
