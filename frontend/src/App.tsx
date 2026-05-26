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
import { SignIn, useAuth } from "@clerk/react"
import { useEffect } from "react"
import { syncUser } from "./services/authApi"
import { useMutation } from "@tanstack/react-query"

dayjs.extend(relativeTime)
dayjs.locale('he')

function App() {
	const user = useAuthStore((state) => state.user)
	const setUser = useAuthStore((state) => state.setUser)
	const { getToken, isSignedIn, isLoaded } = useAuth()

	if (!isLoaded) return null
	
	// Show loading while user data is being fetched
	// if (isSignedIn && !user) {
	// 	return (
	// 		<div className="min-h-screen flex items-center justify-center bg-gray-50">
	// 			<div className="text-center">
	// 				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
	// 				<p className="text-text-medium">טוען נתונים...</p>
	// 			</div>
	// 		</div>
	// 	)
	// }

	return (
		<Routes>
			<Route path="/" element={<LoginPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
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
