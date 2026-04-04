import { useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router"
import { useAuthStore } from "../../store/authStore"
import { useClerk } from "@clerk/clerk-react"
import { CalendarIcon, CirclePlusIcon, HomeIcon, UserPlusIcon, UsersIcon, CalendarIconSolid, CirclePlusIconSolid, HomeIconSolid, UserPlusIconSolid, UsersIconSolid, LogOutIcon } from "../../components/icons/Icons"

function DashboardLayout() {
	const navigate = useNavigate()
	const location = useLocation()
	const clearUser = useAuthStore((state) => state.clearUser)
	const { signOut } = useClerk()
	const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false)

	const isActive = (path: string) => location.pathname === path

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
				// Sign out from Clerk (handles session cleanup)
				await signOut()
				// Clear local user data
				clearUser()
				setHamburgerOpen(false)
				navigate("/")
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="sm:grid sm:grid-cols-[280px_1fr] min-h-screen max-h-screen sm:overflow-hidden">
			{/* Mobile Overlay */}
			{hamburgerOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 sm:hidden"
					onClick={handleHamburger}
				/>
			)}

			{/* Sidebar - Fixed on desktop */}
			<div
				className={`fixed inset-y-0 right-0 w-[280px] z-50 bg-surface shadow-2xl border-l border-border-light flex flex-col gap-4 p-4 transition-transform duration-300 overflow-y-auto ${hamburgerOpen ? "translate-x-0" : "translate-x-full"
					} sm:translate-x-0 sm:flex sm:right-auto sm:sticky sm:top-0 sm:h-screen`}
			>
				{/* Close Button (Mobile Only) */}
				<button
					type="button"
					onClick={handleHamburger}
					className="sm:hidden self-end p-2 rounded-lg hover:bg-gray-100 transition"
				>
					<svg
						className="w-6 h-6 text-text-dark"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M18 6L6 18M6 6L18 18"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>

				{/* Navigation Items */}
				<nav className="space-y-2 mb-6">
					<button
						type="button"
						onClick={() => handleNavigation("/dashboard")}
						className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all border ${isActive("/dashboard")
								? "bg-trainer-primary text-white shadow-lg border-trainer-primary"
								: "text-text-medium hover:bg-sidebar-item-hover-trainer hover:text-trainer-dark hover:shadow-md border-transparent hover:border-sidebar-border-trainer"
							}`}
					>
						{isActive("/dashboard") ? (
							<HomeIconSolid className="w-6 h-6" />
						) : (
							<HomeIcon className="w-6 h-6" />
						)}
						<span className="flex-1 text-right">לוח ראשי</span>
					</button>

					<button
						type="button"
						onClick={() => handleNavigation("/clients")}
						className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all border ${isActive("/clients")
								? "bg-trainer-primary text-white shadow-lg border-trainer-primary"
								: "text-text-medium hover:bg-sidebar-item-hover-trainer hover:text-trainer-dark hover:shadow-md border-transparent hover:border-sidebar-border-trainer"
							}`}
					>
						{isActive("/clients") ? (
							<UsersIconSolid className="w-6 h-6" />
						) : (
							<UsersIcon className="w-6 h-6" />
						)}
						<span className="flex-1 text-right">מתאמנים</span>
					</button>

					<button
						type="button"
						onClick={() => handleNavigation("/new-client")}
						className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all border ${isActive("/new-client")
								? "bg-trainer-primary text-white shadow-lg border-trainer-primary"
								: "text-text-medium hover:bg-sidebar-item-hover-trainer hover:text-trainer-dark hover:shadow-md border-transparent hover:border-sidebar-border-trainer"
							}`}
					>
						{isActive("/new-client") ? (
							<UserPlusIconSolid className="w-6 h-6" />
						) : (
							<UserPlusIcon className="w-6 h-6" />
						)}
						<span className="flex-1 text-right">הזמן מתאמן</span>
					</button>

					<button
						type="button"
						onClick={() => handleNavigation("/sessions")}
						className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all border ${isActive("/sessions")
								? "bg-trainer-primary text-white shadow-lg border-trainer-primary"
								: "text-text-medium hover:bg-sidebar-item-hover-trainer hover:text-trainer-dark hover:shadow-md border-transparent hover:border-sidebar-border-trainer"
							}`}
					>
						{isActive("/sessions") ? (
							<CalendarIconSolid className="w-6 h-6" />
						) : (
							<CalendarIcon className="w-6 h-6" />
						)}
						<span className="flex-1 text-right">יומן אימונים</span>
					</button>

					<button
						type="button"
						onClick={() => handleNavigation("/new-session")}
						className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all border ${isActive("/new-session")
								? "bg-trainer-primary text-white shadow-lg border-trainer-primary"
								: "text-text-medium hover:bg-sidebar-item-hover-trainer hover:text-trainer-dark hover:shadow-md border-transparent hover:border-sidebar-border-trainer"
							}`}
					>
						{isActive("/new-session") ? (
							<CirclePlusIconSolid className="w-6 h-6" />
						) : (
							<CirclePlusIcon className="w-6 h-6" />
						)}
						<span className="flex-1 text-right">קביעת אימון</span>
					</button>
				</nav>

				{/* Logout - Danger Style */}
				<button
					type="button"
					onClick={handleLogout}
					className="w-full flex items-center gap-4 px-5 py-4 mt-auto rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-md transition-all font-medium border border-transparent hover:border-red-200"
				>
					<LogOutIcon className="w-6 h-6" />
					<span className="flex-1 text-right">התנתקות</span>
				</button>
			</div>

			{/* Main Content Area - Scrollable */}
			<div className="relative min-h-screen bg-trainer sm:h-screen sm:overflow-y-auto">
				{/* Mobile Menu Button - Sticky */}
				<div className="sm:hidden sticky top-4 z-30 flex justify-end p-4">
					<button
						type="button"
						onClick={handleHamburger}
						className="p-3 rounded-lg bg-trainer-primary text-white shadow-lg hover:bg-trainer-dark transition"
					>
						<svg
							className="w-6 h-6"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4 6h16M4 12h16M4 18h16M4 18h16"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>

				{/* Page Content */}
				<Outlet />
			</div>
		</div >)
}

export default DashboardLayout
