export interface Client {
	_id?: string;
	firstName: string;
	lastName: string;
	age: number;
	weight: number;
	goal: string;
	notes: string;
	workouts: Workout[] | [];
}

// export interface ClientInput {
// 	firstName: string;
// 	lastName: string;
// 	age: number;
// 	weight: number;
// 	goal: string;
// 	notes: string;
// }

export interface Workout {
	_id?: string;
	notes: string;
	// date: Date;
	exercises: Exercise[] | [];
}

// export interface WorkoutInput {
// 	notes: string;
// 	// date: Date;
// 	exercises: Exercise[] | [];
// }

export interface Exercise {
	_id?: string;
	name: string;
	sets: number;
	reps: number;
	rest: number;
}

// export interface ExerciseInput {
// 	name: string;
// 	sets: number;
// 	reps: number;
// 	rest: number;
// }
