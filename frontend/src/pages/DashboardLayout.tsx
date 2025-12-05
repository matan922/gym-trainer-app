import { useState } from "react"
import { Outlet, useNavigate } from "react-router"
import { logout } from "../services/api"
import { useAuthStore } from "../store/authStore"

function DashboardLayout() {
	const navigate = useNavigate()
	const clearToken = useAuthStore((state) => state.clearToken)

	const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false)

	const handleNavigation = (path: string) => {
		navigate(path)
		setHamburgerOpen(false)
	}

	const handleHamburger = () => {
		setHamburgerOpen(!hamburgerOpen)
	}

	const handleLogout = async () => {
		try {
			if (confirm("אישור התנתקות")) {
				await logout()
				clearToken()
				setHamburgerOpen(false)
				navigate("/")
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="sm:grid sm:grid-cols-[280px_1fr] min-h-screen">
			<div
				className={`fixed inset-y-0 w-[280px] z-50 bg-gray-800 text-white flex flex-col gap-4 p-4 transition-transform duration-300 ${hamburgerOpen ? "translate-x-0" : "translate-x-full"} sm:relative sm:translate-x-0 sm:flex`}
			>
				<button
					type="button"
					onClick={handleHamburger}
					className="sm:hidden text-white bg-gray-800 "
				>
					<svg
						className="w-10 h-10"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						role="img"
						aria-label="Toggle menu"
					>
						<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
						<g
							id="SVGRepo_tracerCarrier"
							strokeLinecap="round"
							strokeLinejoin="round"
						></g>
						<g id="SVGRepo_iconCarrier">
							{" "}
							<path
								d="M20 7L4 7"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							></path>{" "}
							<path
								d="M20 12L4 12"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							></path>{" "}
							<path
								d="M20 17L4 17"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							></path>{" "}
						</g>
					</svg>
				</button>
				<button
					type="button"
					onClick={() => handleNavigation("/dashboard")}
					className="text-white bg-gray-600 rounded-sm px-2 py-1 hover:bg-gray-700"
				>
					לוח ראשי
				</button>
				<button
					type="button"
					onClick={() => handleNavigation("/dashboard/sessions")}
					className="text-white bg-gray-600 rounded-sm px-2 py-1 hover:bg-gray-700"
				>
					אימונים
				</button>
				<button
					type="button"
					onClick={() => handleNavigation("/dashboard/clients")}
					className="text-white bg-gray-600 rounded-sm px-2 py-1 hover:bg-gray-700"
				>
					מתאמנים
				</button>
				<button onClick={() => handleNavigation("/dashboard/new-session")} className="text-white bg-gray-600 rounded-sm px-2 py-1 hover:bg-gray-700">
					קביעת אימון
				</button>
				<button
					type="button"
					onClick={() => handleNavigation("/dashboard/new-client")}
					className="text-white bg-blue-500 rounded-sm px-2 py-1 hover:bg-blue-700"
				>
					הוספת מתאמן
				</button>
				<button
					type="button"
					onClick={handleLogout}
					className="text-white bg-red-600 rounded-sm px-2 py-1 hover:bg-red-700"
				>
					התנתקות
				</button>
			</div>

			<button
				type="button"
				onClick={handleHamburger}
				className="sm:hidden text-white bg-gray-800 p-2"
			>
				<svg
					className="w-10 h-10"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
					<g
						id="SVGRepo_tracerCarrier"
						strokeLinecap="round"
						strokeLinejoin="round"
					></g>
					<g id="SVGRepo_iconCarrier">
						{" "}
						<path
							d="M20 7L4 7"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						></path>{" "}
						<path
							d="M20 12L4 12"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						></path>{" "}
						<path
							d="M20 17L4 17"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						></path>{" "}
					</g>
				</svg>
			</button>

			<div className="p-4 bg-[#F5F5F5] min-h-screen">
				<Outlet />
			</div>
		</div>
	)
}

export default DashboardLayout
