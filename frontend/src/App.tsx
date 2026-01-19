import { Navigate, Route, Routes } from "react-router"
import InviteClientPage from "./pages/trainer/InviteClientPage"
import LoginPage from "./pages/authentication/LoginPage"
import ClientDetailsPage from "./pages/trainer/ClientDetailsPage"
import ClientsPage from "./pages/trainer/ClientsPage"
import ClientWorkoutsPage from "./pages/trainer/ClientWorkoutsPage"
import DashboardLayout from "./pages/trainer/DashboardLayout"
import WorkoutPage from "./pages/trainer/WorkoutPage"
import "./assets/styles/index.css"
import ProtectedRoutes from "./components/client/ProtectedRoutes"
import RegisterPage from "./pages/authentication/RegisterPage"
import NewSessionPage from "./pages/trainer/NewSessionPage/NewSessionPage"
import SessionsPage from "./pages/trainer/SessionsPage"
import DashboardMainPage from "./pages/trainer/DashboardMainPage"
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/he'
import dayjs from "dayjs"
import VerifyEmailPage from "./pages/authentication/VerifyEmailPage"
import InviteAcceptPage from "./pages/authentication/InviteAcceptPage"
import { useAuthStore } from "./store/authStore"

dayjs.extend(relativeTime)
dayjs.locale('he')

function App() {
	const user = useAuthStore((state) => state.user)

	return (
		<Routes>
			<Route path="/" element={<Navigate to="/register" replace />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/auth/verify-email" element={<VerifyEmailPage />} />
			<Route path="/invite-accept" element={<InviteAcceptPage />} />

			{user && user.activeProfile === 'trainer' ? (
				<Route
					path="/dashboard"
					element={
						<ProtectedRoutes>
							<DashboardLayout />
						</ProtectedRoutes>
					}
				>
					<Route index element={<DashboardMainPage />} />
					<Route path="/dashboard/sessions" element={<SessionsPage />} />
					<Route path="/dashboard/sessions/:clientId" element={<SessionsPage />} />
					<Route path="/dashboard/clients" element={<ClientsPage />} />
					<Route path="/dashboard/new-client" element={<InviteClientPage />} />
					<Route path="/dashboard/client/:id" element={<ClientDetailsPage />} />
					<Route
						path="/dashboard/clients/:id/workouts"
						element={<ClientWorkoutsPage />}
					/>
					<Route
						path="/dashboard/clients/:id/workouts/:workoutId"
						element={<WorkoutPage />}
					/>
					<Route path="/dashboard/new-session" element={<NewSessionPage />} />
				</Route>
			) : (
				<Route
					path="/dashboard"
					element={
						<ProtectedRoutes>
							<DashboardLayout />
						</ProtectedRoutes>
					}
				>
					<Route index element={<DashboardMainPage />} />
					<Route path="/dashboard/sessions" element={<SessionsPage />} />
					<Route path="/dashboard/sessions/:clientId" element={<SessionsPage />} />
					<Route path="/dashboard/clients" element={<ClientsPage />} />
					<Route path="/dashboard/new-client" element={<InviteClientPage />} />
					<Route path="/dashboard/client/:id" element={<ClientDetailsPage />} />
					<Route
						path="/dashboard/clients/:id/workouts"
						element={<ClientWorkoutsPage />}
					/>
					<Route
						path="/dashboard/clients/:id/workouts/:workoutId"
						element={<WorkoutPage />}
					/>
					<Route path="/dashboard/new-session" element={<NewSessionPage />} />
				</Route>
			)}
		</Routes>
	)
}

export default App
