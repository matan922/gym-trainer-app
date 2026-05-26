import TextField from "@mui/material/TextField"
import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import { getClient, getClients, postSessions } from "../../../services/trainerApi"
import type { Client, Workout } from "../../../types/clientTypes"
import "react-datepicker/dist/react-datepicker.css"
import { CacheProvider } from "@emotion/react"
import Autocomplete from "@mui/material/Autocomplete"
import { ThemeProvider } from "@mui/material/styles"
import { rtlCache, theme } from "./theme"
import { useNavigate } from "react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useUser } from "@clerk/react"
import { PlusIcon, UserIcon, CalendarIcon, ClockIcon } from "../../../components/icons/Icons"

const NewSessionPage = () => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null)
	const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null)
	const [oneHourCheckbox, setOneHourCheckbox] = useState<boolean>(false)
	const [selectedClient, setSelectedClient] = useState<Client | null>(null)
	const [sessionType, setSessionType] = useState<string>("Studio")
	const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
	const navigate = useNavigate()
	const { user } = useUser()
	const queryClient = useQueryClient()

	// Fetch clients list
	const { data: clients = [], isPending: clientsLoading } = useQuery({
		queryKey: ['clients'],
		queryFn: () => getClients(),
		staleTime: 1000 * 60 * 5, // 5 minutes
	})

	// Fetch workouts when client is selected
	const { data: clientData } = useQuery({
		queryKey: ['client', selectedClient?._id],
		queryFn: () => getClient(selectedClient?._id!),
		enabled: !!selectedClient?._id,
	})

	const workouts = clientData?.workouts || []

	// Clear selected workout when client changes
	useEffect(() => {
		if (!selectedClient) {
			setSelectedWorkout(null)
		}
	}, [selectedClient])

	const handleCheckbox = () => {
		setOneHourCheckbox(!oneHourCheckbox)
	}

	// Create session mutation
	const createSessionMutation = useMutation({
		mutationFn: (sessionData: any) => postSessions(sessionData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sessions'] })
			queryClient.invalidateQueries({ queryKey: ['dashboard'] })
			navigate("/dashboard")
		},
		onError: (error) => {
			console.error("Error creating session:", error)
			alert("שגיאה ביצירת האימון")
		}
	})

	const handleNewSessionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!user?.id || !selectedClient?._id || !selectedDate || !selectedStartTime) return

		const trainerId = user.id
		const clientId = selectedClient?._id

		// Combine selected date with selected start time
		const startTime = new Date(
			selectedDate.getFullYear(),
			selectedDate.getMonth(),
			selectedDate.getDate(),
			selectedStartTime.getHours(),
			selectedStartTime.getMinutes(),
			0
		)

		// Combine selected date with selected end time, or default to 1 hour after start
		const endTime = selectedEndTime
			? new Date(
				selectedDate.getFullYear(),
				selectedDate.getMonth(),
				selectedDate.getDate(),
				selectedEndTime.getHours(),
				selectedEndTime.getMinutes(),
				0
			)
			: new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour later

		const newSessionData = {
			trainerId: trainerId,
			clientId: clientId,
			startTime: startTime,
			endTime: endTime,
			sessionType: sessionType,
			workoutId: selectedWorkout?._id,
			workoutName: selectedWorkout?.workoutName,
			status: "Scheduled",
		}

		createSessionMutation.mutate(newSessionData)
	}

	return (
		<div className="min-h-screen bg-trainer p-4 lg:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6 lg:p-8">
					{/* Header */}
					<div className="flex flex-col items-center gap-2 mb-6 pb-4 border-b-2 border-trainer-primary/20">
						<h1 className="text-3xl lg:text-4xl font-bold text-trainer-dark text-center">אימון חדש</h1>
						<h2 className="text-lg text-text-medium text-center">קביעת אימון חדש למתאמן</h2>
					</div>

					<form onSubmit={(e) => handleNewSessionSubmit(e)}>
						<div className="flex flex-col gap-6">
							{/* Client and Date Selection */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								<div>
									<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
										<UserIcon className="w-5 h-5 text-trainer-primary" />
										מתאמן
									</label>
									<CacheProvider value={rtlCache}>
										<ThemeProvider theme={theme}>
											<div dir="rtl">
												<Autocomplete
													onChange={(_, client) => {
														setSelectedClient(client)
													}}
													value={selectedClient}
													renderInput={(params) => (
														<TextField
															{...params}
															placeholder="בחר מתאמן"
															sx={{
																"& .MuiInputBase-root": {
																	backgroundColor: "white",
																	border: "1px solid rgba(239, 68, 68, 0.2)",
																	borderRadius: "0.5rem",
																	"&:hover": {
																		borderColor: "rgba(239, 68, 68, 0.3)",
																	},
																	"&.Mui-focused": {
																		boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.2)",
																		borderColor: "#EF4444",
																	},
																},
																"& .MuiOutlinedInput-root": {
																	"& fieldset": {
																		border: "none",
																	},
																},
															}}
														/>
													)}
													getOptionLabel={(client) =>
														`${client.firstName} ${client.lastName}`
													}
													options={clientsLoading ? [] : clients}
													noOptionsText={clientsLoading ? "טוען מתאמנים..." : "אין מתאמנים"}
													slotProps={{
														popper: {
															sx: {
																"& .MuiAutocomplete-listbox": {
																	textAlign: "right",
																},
																"& .MuiAutocomplete-option": {
																	justifyContent: "flex-end",
																	direction: "rtl",
																},
																"& .MuiAutocomplete-noOptions": {
																	textAlign: "right",
																},
															},
														},
													}}
												/>
											</div>
										</ThemeProvider>
									</CacheProvider>
								</div>

								<div>
									<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
										<CalendarIcon className="w-5 h-5 text-trainer-primary" />
										תאריך
									</label>
									<DatePicker
										wrapperClassName="w-full"
										name="date"
										placeholderText="בחר תאריך"
										className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
										selected={selectedDate}
										onChange={(date) => setSelectedDate(date)}
										dateFormat="dd/MM/yyyy"
										isClearable
										minDate={new Date()}
										withPortal
									/>
								</div>
							</div>

							{/* Workout Selection (shown only when client is selected) */}
							{selectedClient && workouts.length > 0 && (
								<div>
									<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
										אימון (אופציונלי)
									</label>
									<select
										value={selectedWorkout?._id || ""}
										onChange={(e) => {
											const workout = workouts.find(w => w._id === e.target.value)
											setSelectedWorkout(workout || null)
										}}
										className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right cursor-pointer"
									>
										<option value="">ללא אימון מוגדר</option>
										{workouts.map((workout) => (
											<option key={workout._id} value={workout._id}>
												{workout.workoutName || `אימון - ${workout.exercises?.length || 0} תרגילים`}
											</option>
										))}
									</select>
								</div>
							)}

							{/* Session Type and Time Options */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								<div>
									<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
										סוג אימון
									</label>
									<select
										value={sessionType}
										onChange={(e) => setSessionType(e.target.value)}
										className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right cursor-pointer"
									>
										<option value="Studio">סטודיו</option>
										<option value="Online">אונליין</option>
									</select>
								</div>

								<div>
									<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
										<ClockIcon className="w-5 h-5 text-trainer-primary" />
										משך אימון
									</label>
									<div className="flex items-center gap-3 px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white">
										<input
											onChange={handleCheckbox}
											type="checkbox"
											className="w-4 h-4 cursor-pointer"
										/>
										<span className="text-text-dark">אימון של שעה</span>
									</div>
								</div>
							</div>

							{/* Time Selection */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								<div>
									<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
										<ClockIcon className="w-5 h-5 text-trainer-primary" />
										זמן התחלה
									</label>
									<DatePicker
										wrapperClassName="w-full"
										name="startTime"
										placeholderText="בחר שעת התחלה"
										className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
										showTimeSelect
										showTimeSelectOnly
										timeIntervals={15}
										dateFormat="HH:mm"
										timeFormat="HH:mm"
										showTimeCaption={false}
										selected={selectedStartTime}
										onChange={(date) => setSelectedStartTime(date)}
										filterTime={(time) => {
											if (selectedDate && selectedDate.toDateString() === new Date().toDateString()) {
												return time.getTime() > new Date().getTime();
											}
											return true;
										}}
										withPortal
									/>
								</div>

								{!oneHourCheckbox && (
									<div>
										<label className="text-sm text-text-medium mb-2 text-right flex items-center gap-2">
											<ClockIcon className="w-5 h-5 text-trainer-primary" />
											זמן סיום
										</label>
										<DatePicker
											wrapperClassName="w-full"
											name="endTime"
											placeholderText="בחר שעת סיום"
											className="w-full px-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
											showTimeSelect
											showTimeSelectOnly
											timeIntervals={15}
											dateFormat="HH:mm"
											timeFormat="HH:mm"
											showTimeCaption={false}
											selected={selectedEndTime}
											onChange={(date) => setSelectedEndTime(date)}
											minTime={
												selectedStartTime || new Date(new Date().setHours(0, 0, 0, 0))
											}
											maxTime={new Date(new Date().setHours(23, 45, 0, 0))}
											popperPlacement="bottom"
											withPortal
										/>
									</div>
								)}
							</div>

							{/* Submit Button */}
							<div className="flex justify-center pt-4 border-t-2 border-trainer-primary/20">
								<button
									disabled={createSessionMutation.isPending}
									className={`px-8 py-3 rounded-lg font-semibold shadow-md transition-all ${createSessionMutation.isPending
										? 'bg-trainer-disabled-bg text-trainer-disabled-text border border-trainer-disabled-border cursor-not-allowed'
										: 'bg-trainer-primary hover:bg-trainer-dark text-white'
										}`}
									type="submit"
								>
									{createSessionMutation.isPending ? 'יוצר אימון...' : 'צור אימון'}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default NewSessionPage
