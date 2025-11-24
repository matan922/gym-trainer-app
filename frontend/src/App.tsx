import { Route, Routes } from "react-router"
import DashboardLayout from "./components/client/DashboardLayout"
import AddClientPage from "./pages/AddClientPage"
import ClientDetailsPage from "./pages/ClientDetailsPage"
import ClientsPage from "./pages/ClientsPage"
import ClientWorkoutsPage from "./pages/ClientWorkoutsPage"
import WorkoutPage from "./pages/WorkoutPage"
import LoginPage from "./pages/authentication/LoginPage"
import "./assets/styles/index.css"
import RegisterPage from "./pages/authentication/RegisterPage"

function App() {
	return (
		<Routes>
			<Route path="/" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/dashboard" element={<DashboardLayout />}>
				<Route index element={<ClientsPage />} />
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
			</Route>
		</Routes>
	)
}

export default App
