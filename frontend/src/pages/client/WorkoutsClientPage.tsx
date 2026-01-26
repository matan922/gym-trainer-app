import { useQuery } from "@tanstack/react-query"
import { getWorkouts } from "../../services/clientApi"
import type { Workout } from "../../types/clientTypes"

const WorkoutsClientPage = () => {
    const { data: workouts, isPending, isError, error } = useQuery<Workout[]>({
        queryKey: ['clientWorkouts'],
        queryFn: () => getWorkouts(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    if (isPending) {
        return (
            <div className="min-h-screen bg-client p-4 lg:p-8 flex items-center justify-center">
                <span className="text-2xl text-client-dark">טוען...</span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-client p-4 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-right">
                        שגיאה: {error.message}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-client p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-client-dark mb-2">
                        💪 האימונים שלי
                    </h1>
                    <p className="text-text-dark text-lg font-medium">
                        כל תוכניות האימון שהמאמן שלך הכין עבורך
                    </p>
                </div>

                {/* Workouts Grid or Empty State */}
                {workouts && workouts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {workouts.map((workout) => (
                            <div
                                key={workout._id}
                                className="bg-surface rounded-xl shadow-xl border border-client-primary/20 p-6 hover:shadow-2xl hover:border-client-primary/40 transition-all cursor-pointer"
                            >
                                {/* Workout Header */}
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-client-primary/20">
                                    <span className="text-3xl">🏋️</span>
                                    <h2 className="text-xl font-bold text-client-dark flex-1 text-right">
                                        {workout.workoutName}
                                    </h2>
                                </div>

                                {/* Exercises Count */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-client-primary/5 rounded-lg">
                                        <span className="text-2xl font-bold text-client-primary">
                                            {workout.exercises?.length || 0}
                                        </span>
                                        <span className="text-sm text-text-medium">תרגילים</span>
                                    </div>

                                    {/* Exercise List Preview */}
                                    {workout.exercises && workout.exercises.length > 0 && (
                                        <div className="mt-4 space-y-1">
                                            {workout.exercises.slice(0, 3).map((exercise, index) => (
                                                <div
                                                    key={exercise._id || index}
                                                    className="text-sm text-text-medium flex items-center gap-2"
                                                >
                                                    <span className="text-client-primary">•</span>
                                                    <span>{exercise.name}</span>
                                                </div>
                                            ))}
                                            {workout.exercises.length > 3 && (
                                                <div className="text-sm text-client-primary font-medium">
                                                    + {workout.exercises.length - 3} תרגילים נוספים
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="bg-surface rounded-xl shadow-xl border border-client-primary/20 p-12 text-center">
                        <div className="max-w-md mx-auto">
                            {/* Empty Icon */}
                            <div className="text-8xl mb-6">📋</div>

                            {/* Empty Message */}
                            <h2 className="text-2xl font-bold text-client-dark mb-3">
                                אין תוכניות אימון עדיין
                            </h2>
                            <p className="text-text-medium mb-6">
                                המאמן שלך עדיין לא יצר עבורך תוכניות אימון.
                                <br />
                                ברגע שהוא יוסיף תוכנית, היא תופיע כאן.
                            </p>

                            {/* Motivational Message */}
                            <div className="bg-client-primary/10 rounded-lg p-4 border border-client-primary/20">
                                <p className="text-client-dark font-medium">
                                    💡 בינתיים, שמור על קשר עם המאמן שלך!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default WorkoutsClientPage
