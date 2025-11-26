import TextField from "@mui/material/TextField"
import dayjs, { Dayjs } from "dayjs"
import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import { getClients } from "../../services/api"
import type { Client } from "../../types/clientTypes"
import "react-datepicker/dist/react-datepicker.css"
import { CacheProvider } from "@emotion/react"
import Autocomplete from "@mui/material/Autocomplete"
import { ThemeProvider } from "@mui/material/styles"
import { useAuthStore } from "../../store/authStore"
import { rtlCache, theme } from "./theme"

export interface Session {
	trainerId: string
	clientId: string
	sessionDate: string
	startTime: string
	endTime: string
	sessionType: string
	status: string
}

const NewSessionPage = () => {
	const [clients, setClients] = useState<Client[]>([])
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [startTime, setStartTime] = useState<Date | null>(null)
	const [endTime, setEndTime] = useState<Date | null>(null)
	const token = useAuthStore((state) => state.token)

	const [sessionData, setSessionData] = useState<Session>({
		trainerId: "",
		clientId: "",
		sessionDate: "",
		startTime: "",
		endTime: "",
		sessionType: "",
		status: "",
	})

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

	const handleDataChange = (e) => {
		if (!token) return
		// setSessionData({
		// 	trainerId: token,
		// 	clientId: "692023b0313c7895476bdefb",
		// 	startTime: startTime,

		// })
	}

	const handleNewSessionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!startDate || !endTime || !startTime) return null
		const sessionStart = new Date(
			startDate.getFullYear(),
			startDate.getMonth(),
			startDate.getDate(),
			startTime.getHours(),
			startTime.getMinutes(),
			0, // seconds
		)
		const sessionEnd = new Date(
			startDate.getFullYear(),
			startDate.getMonth(),
			startDate.getDate(),
			endTime.getHours(),
			endTime.getMinutes(),
		)

		console.log("SESSION STARTS = ", sessionStart)
		console.log("SESSION ENDS = ", sessionEnd)
	}

	return (
		<div className="p-8  flex flex-col items-center ">
			<div className="rounded-lg bg-white shadow max-w-lg w-full">
				<div className="p-8 flex flex-col gap-8">
					<div className="flex flex-col items-center">
						<h1 className="text-center text-3xl font-bold">אימון חדש</h1>
						<h2 className="text-center text-xl">קביעת אימון חדש למתאמן</h2>
					</div>
					<form onSubmit={(e) => handleNewSessionSubmit(e)}>
						<div className=""></div>

						<div className="flex flex-col gap-4">
							<CacheProvider value={rtlCache}>
								<ThemeProvider theme={theme}>
									<div dir="rtl">
										<Autocomplete
											renderInput={(params) => (
												<TextField
													{...params}
													placeholder="מתאמנים"
													sx={{
														"& .MuiInputBase-root": {
															backgroundColor: "#f3f4f6",
															boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
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
											options={clients.map((client) => {
												return `${client.firstName} ${client.lastName}`
											})}
											slotProps={{
												popper: {
													sx: {
														"& .MuiAutocomplete-listbox": {
															textAlign: "right",
														},
														"& .MuiAutocomplete-option": {
															justifyContent: "flex-end",
														},
													},
												},
											}}
										/>
									</div>
								</ThemeProvider>
							</CacheProvider>

							<DatePicker
								name="date"
								placeholderText="תאריך"
								className="bg-gray-100 shadow rounded p-4"
								selected={startDate}
								onChange={(date) => setStartDate(date)}
							/>
							<DatePicker
								name="startTime"
								placeholderText="זמן התחלה"
								className="bg-gray-100 shadow rounded p-4"
								showTimeSelect
								showTimeSelectOnly
								timeIntervals={15}
								dateFormat="HH:mm"
								timeFormat="HH:mm" // 24-hour format in dropdown
								showTimeCaption={false}
								selected={startTime}
								onChange={(date) => setStartTime(date)}
							/>
							<DatePicker
								name="endTime"
								placeholderText="זמן סיום"
								className="bg-gray-100 shadow rounded p-4"
								showTimeSelect
								showTimeSelectOnly
								timeIntervals={15}
								dateFormat="HH:mm"
								timeFormat="HH:mm" // 24-hour format in dropdown
								showTimeCaption={false}
								selected={endTime}
								onChange={(date) => setEndTime(date)}
								minTime={startTime || new Date(new Date().setHours(0, 0, 0, 0))}
								maxTime={new Date(new Date().setHours(23, 45, 0, 0))}
							/>

							<button className="bg-green-500 rounded p-2" type="submit">אישור</button>

							{/* <input
					name="date"
					onChange={(e) => handleDateChange(e)}
					type="date"
					/> */}
							{/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
					<DateTimePicker
					ampm={false}
					open={dateTimePickerOpen}
					onClose={() => setDateTimePickerOpen(false)}
					reduceAnimations={true}
					disablePast={true}
					format="DD/MM/YY HH:mm"
					value={dateValue}
					enableAccessibleFieldDOMStructure={false}
					onChange={(newValue) => {
						console.log(newValue)
						setDateValue(newValue)
						}}
						localeText={{
								toolbarTitle: "בחר תאריך ושעה",
								cancelButtonLabel: "ביטול",
								okButtonLabel: "אישור",
								nextStepButtonLabel: "הבא",
								}}
								slotProps={{
									textField: {
								placeholder: "תאריך ושעה",
								onClick: () => setDateTimePickerOpen(true),
								sx: {
									cursor: "pointer",
									"& .MuiInputAdornment-root": {
										pointerEvents: "none",
										},
										"& .MuiInputBase-root": {
											backgroundColor: "#f3f4f6",
											boxShadow:
											"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
											
											"&:hover": {
												backgroundColor: "#d1d5dc",
												},
												},
											"& .MuiOutlinedInput-root": {
												"& fieldset": {
													border: "none",
													},
										},
										},
										},
								}}
								/>
								</LocalizationProvider> */}
							{/* <Autocomplete
														popupIcon={false} // remove default icon
														options={clients.map(
															(client) => `${client.firstName} ${client.lastName}`,
														)}
														slotProps={{
															popper: {
																sx: {
																	"& .MuiAutocomplete-option": {
																		justifyContent: "flex-end",
																	},
																},
															},
														}}
														renderInput={(params) => (
															<TextField
																{...params}
																placeholder="מתאמן"
																sx={{
																	"& .MuiInputBase-root": {
																		backgroundColor: "#f3f4f6",
																		boxShadow:
																			"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
																		"&:hover": {
																			backgroundColor: "#d1d5dc",
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
													/> */}
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default NewSessionPage
