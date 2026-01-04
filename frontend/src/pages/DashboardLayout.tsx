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
				className={`fixed inset-y-0 w-[280px] z-50 bg-surface shadow-2xl border-r border-gray-100 text-white flex flex-col gap-4 p-4 transition-transform duration-300 ${hamburgerOpen ? "translate-x-0" : "translate-x-full"} sm:relative sm:translate-x-0 sm:flex`}
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
				{/* Navigation Items */}
				<nav className="space-y-2 mb-6">
					<button
						type="button"
						onClick={() => handleNavigation("/dashboard")}
						className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-text-medium hover:bg-sidebar-item-hover-trainer hover:text-trainer-dark hover:shadow-md transition-all font-medium border border-transparent hover:border-sidebar-border-trainer"
					>
						<span className="text-2xl">🏠</span>
						<span className="flex-1 text-right">לוח ראשי</span>
					</button>

					<button
						type="button"
						onClick={() => handleNavigation("/dashboard/clients")}
						className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-text-medium hover:bg-sidebar-item-hover-trainer hover:text-trainer-dark hover:shadow-md transition-all font-medium border border-transparent hover:border-sidebar-border-trainer"
					>
						<span className="text-2xl">👥</span>
						<span className="flex-1 text-right">מתאמנים</span>
					</button>

					<button
						type="button"
						onClick={() => handleNavigation("/dashboard/new-client")}
						className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-text-medium hover:bg-sidebar-item-hover-trainer hover:text-trainer-dark hover:shadow-md transition-all font-medium border border-transparent hover:border-sidebar-border-trainer"
					>
						<span className="text-2xl">📧</span>
						<span className="flex-1 text-right">הזמן מתאמן</span>
					</button>

					<button
						type="button"
						onClick={() => handleNavigation("/dashboard/sessions")}
						className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-text-medium hover:bg-sidebar-item-hover-trainer hover:text-trainer-dark hover:shadow-md transition-all font-medium border border-transparent hover:border-sidebar-border-trainer"
					>
						<span className="text-2xl">📅</span>
						<span className="flex-1 text-right">אימונים</span>
					</button>

					<button
						type="button"
						onClick={() => handleNavigation("/dashboard/new-session")}
						className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-text-medium hover:bg-sidebar-item-hover-trainer hover:text-trainer-dark hover:shadow-md transition-all font-medium border border-transparent hover:border-sidebar-border-trainer"
					>
						<span className="text-2xl">⚡</span>
						<span className="flex-1 text-right">קביעת אימון</span>
					</button>
				</nav>

				{/* Logout - Danger Style */}
				<button
					type="button"
					onClick={handleLogout}
					className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-md transition-all font-medium border border-transparent hover:border-red-200"
				>
					<span className="text-2xl">🚪</span>
					<span className="flex-1 text-right">התנתקות</span>
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

			<div className="p-4 bg-trainer min-h-screen">
				<Outlet />
			</div>
		</div>
	)
}

export default DashboardLayout
