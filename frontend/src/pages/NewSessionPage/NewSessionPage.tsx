import TextField from "@mui/material/TextField"
import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import { getClients, postSessions } from "../../services/api"
import type { Client } from "../../types/clientTypes"
import "react-datepicker/dist/react-datepicker.css"
import { CacheProvider } from "@emotion/react"
import Autocomplete from "@mui/material/Autocomplete"
import { ThemeProvider } from "@mui/material/styles"
import { useAuthStore } from "../../store/authStore"
import { rtlCache, theme } from "./theme"
import { useNavigate } from "react-router"

const NewSessionPage = () => {
	const [clients, setClients] = useState<Client[]>([])
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [startTime, setStartTime] = useState<Date | null>(null)
	const [endTime, setEndTime] = useState<Date | null>(null)
	const [oneHourCheckbox, setOneHourCheckbox] = useState<boolean>(false)
	const [selectedClient, setSelectedClient] = useState<Client | null>(null)
	const [sessionType, setSessionType] = useState<string>("Studio")
	const navigate = useNavigate()
	const token = useAuthStore((state) => state.token)

	useEffect(() => {
		const getClientsData = async () => {
			try {
				const response = await getClients()
				setClients(response.data)
			} catch (error) {
				console.log(error)
			}
		}

		getClientsData()
	}, [])

	const handleCheckbox = () => {
		setOneHourCheckbox(!oneHourCheckbox)
	}

	const handleNewSessionSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault()
		if (!token || !selectedClient?._id) return null
		const trainerId = token
		const clientId = selectedClient?._id
		if (!startDate || !startTime) return null

		const sessionStart = new Date(
			startDate.getFullYear(),
			startDate.getMonth(),
			startDate.getDate(),
			startTime.getHours(),
			startTime.getMinutes(),
			0, // seconds
		)

		const sessionEnd = endTime
			? new Date(
				startDate.getFullYear(),
				startDate.getMonth(),
				startDate.getDate(),
				endTime.getHours(),
				endTime.getMinutes(),
				0,
			)
			: null

		const newSessionData = {
			trainerId: trainerId,
			clientId: clientId,
			sessionDate: startDate,
			startTime: sessionStart,
			endTime: sessionEnd,
			sessionType: sessionType,
			status: "Scheduled",
		}

		try {
			const response = await postSessions(newSessionData)
			navigate("/dashboard")
			return response.data
		} catch (error) {
			console.log("Error creating session: ", error)
		}
	}

	return (
		<div className="p-8 flex flex-col items-center ">
			<div className="rounded-lg bg-white shadow max-w-lg w-full">
				<div className="p-8 flex flex-col gap-8">
					<div className="flex flex-col items-center">
						<h1 className="text-center text-3xl font-bold">אימון חדש</h1>
						<h2 className="text-center text-xl">קביעת אימון חדש למתאמן</h2>
					</div>

					<form onSubmit={(e) => handleNewSessionSubmit(e)}>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-4 lg:flex-row">
								<CacheProvider value={rtlCache}>
									<ThemeProvider theme={theme}>
										<div dir="rtl" className="flex-1">
											<Autocomplete
												onChange={(_, client) => {
													setSelectedClient(client)
												}}
												value={selectedClient}
												renderInput={(params) => (
													<TextField
														{...params}
														placeholder="מתאמנים"
														sx={{
															"& .MuiInputBase-root": {
																backgroundColor: "#f3f4f6",
																boxShadow:
																	"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
																borderRadius: "0.25rem",
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
												options={Array.isArray(clients) ? clients : []}
												noOptionsText="אין מתאמנים"
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
																textAlign: "endלפ",
															},
														},
													},
												}}
											/>
										</div>
									</ThemeProvider>
								</CacheProvider>
								<DatePicker
									wrapperClassName="flex-1"
									name="date"
									placeholderText="תאריך"
									className="bg-gray-100 shadow rounded p-4 focus:outline-0 w-full"
									selected={startDate}
									onChange={(date) => setStartDate(date)}
									isClearable
									minDate={new Date()} // Can't select dates before today
									withPortal
								/>
							</div>
							<div className="flex items-center gap-4">
								<div className="flex items-center">
									<input onChange={handleCheckbox} type="checkbox" />
									&nbsp;
									<span>אימון של שעה</span>
								</div>

								<select
									value={sessionType}
									onChange={(e) => setSessionType(e.target.value)}
									className="flex-1 shadow rounded p-4 bg-gray-100 outline-none cursor-pointer"
								>
									<option value="Studio">סטודיו</option>
									<option value="Online">אונליין</option>
								</select>
							</div>

							<div className="flex flex-col gap-4 lg:flex-row">
								<DatePicker
									wrapperClassName="flex-1"
									name="startTime"
									placeholderText="זמן התחלה"
									className="bg-gray-100 shadow rounded p-4 focus:outline-0 w-full"
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									dateFormat="HH:mm"
									timeFormat="HH:mm"
									showTimeCaption={false}
									selected={startTime}
									onChange={(date) => setStartTime(date)}
									filterTime={(time) => {
										// If selected date is today only allow future times
										if (startDate && startDate.toDateString() === new Date().toDateString()) {
											return time.getTime() > new Date().getTime();
										}
										// If future date allow all times
										return true;
									}}
									withPortal
								/>
								<DatePicker
									disabled={oneHourCheckbox}
									wrapperClassName="flex-1"
									name="endTime"
									placeholderText="זמן סיום"
									className={`bg-gray-100 shadow rounded p-4 focus:outline-0 w-full ${oneHourCheckbox ? "hidden" : ""}`}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									dateFormat="HH:mm"
									timeFormat="HH:mm" // 24-hour format in dropdown
									showTimeCaption={false}
									selected={endTime}
									onChange={(date) => setEndTime(date)}
									minTime={
										startTime || new Date(new Date().setHours(0, 0, 0, 0))
									}
									maxTime={new Date(new Date().setHours(23, 45, 0, 0))}
									popperPlacement="bottom"
									withPortal
								/>
							</div>

							<div className="flex justify-center">
								<button
									className="bg-blue-500 text-white rounded p-2 shadow"
									type="submit"
								>
									אישור
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
