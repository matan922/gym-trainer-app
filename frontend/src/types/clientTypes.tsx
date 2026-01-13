export interface AuthenticatedTrainer {
	firstName: string
	lastName: string
}

export interface ClientInvite {
	email: string
}

export interface Client {
	_id?: string
	firstName: string
	lastName: string
	age: number
	weight: number
	goal: string
	notes: string
	workouts: Workout[] | []
	lastSessionDate?: Date | null
}

export interface Workout {
	_id?: string
	workoutName: string
	// date: Date;
	exercises: Exercise[] | []
}

export interface Exercise {
	_id?: string
	name: string
	sets: number
	reps: number
	rest: number
}

export interface Session {
	_id?: string
	trainerId: string
	clientId: {
		_id?: string
		firstName: string
		lastName: string
	}
	sessionDate: Date
	startTime: Date
	endTime: Date
	sessionType: string
	workoutName?: string
	status: string
	workoutId?: Workout
}

export interface SessionRequest extends Omit<Session, "clientId" | "endTime"> {
	clientId: string
	endTime: Date | null
}

export interface RegisterData {
	firstName: string
	lastName: string
	email: string
	password: string
	age: string
	weight: string
	goal: string
	notes: string
	profileType: "trainer" | "client" | null
	inviteToken?: string
}


