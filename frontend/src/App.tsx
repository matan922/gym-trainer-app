import { Navigate, Route, Routes } from "react-router"
import AddClientPage from "./pages/AddClientPage"
import LoginPage from "./pages/authentication/LoginPage"
import ClientDetailsPage from "./pages/ClientDetailsPage"
import ClientsPage from "./pages/ClientsPage"
import ClientWorkoutsPage from "./pages/ClientWorkoutsPage"
import DashboardLayout from "./pages/DashboardLayout"
import WorkoutPage from "./pages/WorkoutPage"
import "./assets/styles/index.css"
import ProtectedRoutes from "./components/client/ProtectedRoutes"
import RegisterPage from "./pages/authentication/RegisterPage"
import NewSessionPage from "./pages/NewSessionPage/NewSessionPage"
import SessionsPage from "./pages/SessionsPage"
import DashboardMainPage from "./pages/DashboardMainPage"
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/he'
import dayjs from "dayjs"
import VerifyEmailPage from "./pages/authentication/VerifyEmailPage"

dayjs.extend(relativeTime)
dayjs.locale('he')

function App() {

	return (
		<Routes>
			<Route path="/" element={<Navigate to="/register" replace />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/auth/verify-email" element={<VerifyEmailPage />} />

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
				<Route path="/dashboard/clients" element={<ClientsPage />} />
				<Route path="/dashboard/new-client" element={<AddClientPage />} />
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
		</Routes>
	)
}

export default App
