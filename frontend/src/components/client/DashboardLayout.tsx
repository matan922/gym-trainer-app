import { useState } from "react"
import { Outlet, useNavigate } from "react-router"
import { logout } from "../../services/api"
import { useAuthStore } from "../../store/authStore"

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
				<div className="relative">
					<svg
						className="absolute top-1/2 -translate-y-1/2 right-1 h-4 w-5 fill-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
					>
						<path d="m495,466.1l-110.1-110.1c31.1-37.7 48-84.6 48-134 0-56.4-21.9-109.3-61.8-149.2-39.8-39.9-92.8-61.8-149.1-61.8-56.3,0-109.3,21.9-149.2,61.8-39.9,39.8-61.8,92.8-61.8,149.2 0,56.3 21.9,109.3 61.8,149.2 39.8,39.8 92.8,61.8 149.2,61.8 49.5,0 96.4-16.9 134-48l110.1,110c8,8 20.9,8 28.9,0 8-8 8-20.9 0-28.9zm-393.3-123.9c-32.2-32.1-49.9-74.8-49.9-120.2 0-45.4 17.7-88.2 49.8-120.3 32.1-32.1 74.8-49.8 120.3-49.8 45.4,0 88.2,17.7 120.3,49.8 32.1,32.1 49.8,74.8 49.8,120.3 0,45.4-17.7,88.2-49.8,120.3-32.1,32.1-74.9,49.8-120.3,49.8-45.4,0-88.1-17.7-120.2-49.9z" />
					</svg>
					<input
						placeholder="חיפוש"
						className="placeholder:text-gray-400 text-white w-full bg-gray-600 rounded-sm pr-7 py-1"
					/>
				</div>
				<button
					type="button"
					onClick={() => handleNavigation("/dashboard")}
					className="text-white bg-gray-600 rounded-sm px-2 py-1 hover:bg-gray-700"
				>
					מתאמנים
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
