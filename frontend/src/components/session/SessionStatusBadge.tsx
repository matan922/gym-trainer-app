import { useState, useRef, useEffect } from "react"
import type { Session } from "../../types/clientTypes"

interface SessionStatusBadgeProps {
	session: Session
	onStatusChange?: (sessionId: string, newStatus: string) => void
	editable?: boolean
}

const statusTranslations: Record<string, string> = {
	'Scheduled': 'מתוכנן',
	'Completed': 'הושלם',
	'Cancelled': 'בוטל',
	'Overdue': 'ממתין לסיום'
}

function SessionStatusBadge({ session, onStatusChange, editable = false }: SessionStatusBadgeProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
	const buttonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (isOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect()
			setDropdownPosition({
				top: rect.bottom + window.scrollY + 4,
				left: rect.left + window.scrollX
			})
		}
	}, [isOpen])

	const getStatusDisplay = () => {
		if (session.status === 'Completed') {
			return { text: statusTranslations.Completed, color: 'bg-green-100 text-green-700' }
		}
		if (session.status === 'Cancelled') {
			return { text: statusTranslations.Cancelled, color: 'bg-red-100 text-red-700' }
		}
		if (session.status === 'Scheduled') {
			const isPast = new Date() > new Date(session.startTime)
			return isPast
				? { text: statusTranslations.Overdue, color: 'bg-gray-100 text-gray-700' }
				: { text: statusTranslations.Scheduled, color: 'bg-blue-100 text-blue-700' }
		}
		return { text: session.status, color: 'bg-gray-100 text-gray-700' }
	}

	const handleStatusChange = (newStatus: string) => {
		if (onStatusChange && session._id) {
			onStatusChange(session._id, newStatus)
		}
		setIsOpen(false)
	}

	const display = getStatusDisplay()
	const isSessionInFuture = new Date(session.startTime) > new Date()

	if (!editable) {
		return (
			<span className={`text-sm px-3 py-1 rounded-full ${display.color}`}>
				{display.text}
			</span>
		)
	}

	return (
		<>
			<button
				ref={buttonRef}
				type="button"
				onClick={(e) => {
					e.stopPropagation()
					setIsOpen(!isOpen)
				}}
				className={`text-sm px-3 py-1 rounded-full ${display.color} cursor-pointer hover:opacity-80 transition-opacity`}
			>
				{display.text}
			</button>

			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-[100]"
						onClick={(e) => {
							e.stopPropagation()
							setIsOpen(false)
						}}
					/>
					<div
						className="fixed bg-white shadow-lg rounded-lg p-2 z-[101] min-w-[120px]"
						style={{
							top: `${dropdownPosition.top}px`,
							left: `${dropdownPosition.left}px`
						}}
					>
						<button
							onClick={(e) => {
								e.stopPropagation()
								handleStatusChange('Scheduled')
							}}
							className="block w-full text-right px-3 py-2 hover:bg-blue-100 rounded text-sm cursor-pointer"
						>
							{statusTranslations.Scheduled}
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation()
								if (!isSessionInFuture) {
									handleStatusChange('Completed')
								}
							}}
							disabled={isSessionInFuture}
							className={`block w-full text-right px-3 py-2 rounded text-sm ${
								isSessionInFuture
									? 'text-gray-400 cursor-not-allowed'
									: 'hover:bg-green-100 cursor-pointer'
							}`}
						>
							{statusTranslations.Completed}
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation()
								handleStatusChange('Cancelled')
							}}
							className="block w-full text-right px-3 py-2 hover:bg-red-100 rounded text-sm cursor-pointer"
						>
							{statusTranslations.Cancelled}
						</button>
					</div>
				</>
			)}
		</>
	)
}

export default SessionStatusBadge
