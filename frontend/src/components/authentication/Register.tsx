import type { RegisterData } from "../../types/clientTypes";

interface RegisterProps {
    onBack: () => void;
    registerType: "trainer" | "client";
    registerData: RegisterData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Register = ({ onBack, registerType, registerData, onInputChange, onSubmit }: RegisterProps) => {
    const isTrainer = registerType === "trainer";
    const focusRing = isTrainer ? "focus:ring-trainer-primary" : "focus:ring-client-primary";
    const buttonBg = isTrainer ? "bg-trainer-button hover:bg-trainer-button-hover" : "bg-client-button hover:bg-client-button-hover";

    return (
        <div className="bg-surface flex flex-col p-10 rounded-3xl shadow-2xl w-full max-w-md gap-6">
            <div>
                <button className={`${buttonBg} text-white px-4 py-2 rounded-lg font-semibold transition`} onClick={onBack}>
                    בחירת סוג משתמש
                </button>
            </div>
            <form className="flex flex-col gap-3" onSubmit={onSubmit}>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-text-medium mb-1 text-right"
                        >
                            שם פרטי
                        </label>
                        <input
                            onChange={onInputChange}
                            name="firstName"
                            id="firstName"
                            type="text"
                            value={registerData.firstName}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusRing} focus:border-transparent outline-none transition`}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-text-medium mb-1 text-right"
                        >
                            שם משפחה
                        </label>
                        <input
                            onChange={onInputChange}
                            name="lastName"
                            id="lastName"
                            type="text"
                            value={registerData.lastName}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusRing} focus:border-transparent outline-none transition`}
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-text-medium mb-1 text-right"
                    >
                        אימייל
                    </label>
                    <input
                        onChange={onInputChange}
                        name="email"
                        id="email"
                        type="email"
                        value={registerData.email}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusRing} focus:border-transparent outline-none transition`}
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-text-medium mb-1 text-right"
                    >
                        סיסמה
                    </label>
                    <input
                        onChange={onInputChange}
                        name="password"
                        id="password"
                        type="password"
                        value={registerData.password}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusRing} focus:border-transparent outline-none transition`}
                    />
                </div>

                {registerType === "client" && (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    htmlFor="age"
                                    className="block text-sm font-medium text-text-medium mb-1 text-right"
                                >
                                    גיל
                                </label>
                                <input
                                    onChange={onInputChange}
                                    name="age"
                                    id="age"
                                    type="number"
                                    value={registerData.age}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusRing} focus:border-transparent outline-none transition`}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="weight"
                                    className="block text-sm font-medium text-text-medium mb-1 text-right"
                                >
                                    משקל
                                </label>
                                <input
                                    onChange={onInputChange}
                                    name="weight"
                                    id="weight"
                                    type="number"
                                    value={registerData.weight}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusRing} focus:border-transparent outline-none transition`}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="goal"
                                className="block text-sm font-medium text-text-medium mb-1 text-right"
                            >
                                מטרה
                            </label>
                            <input
                                onChange={onInputChange}
                                name="goal"
                                id="goal"
                                type="text"
                                value={registerData.goal}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusRing} focus:border-transparent outline-none transition`}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="notes"
                                className="block text-sm font-medium text-text-medium mb-1 text-right"
                            >
                                הערות (אופציונלי)
                            </label>
                            <textarea
                                onChange={onInputChange}
                                name="notes"
                                id="notes"
                                rows={2}
                                value={registerData.notes}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusRing} focus:border-transparent outline-none transition resize-none`}
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className={`w-full text-white py-3 rounded-lg font-semibold shadow-xl ${buttonBg} transition`}
                >
                    הירשם
                </button>
            </form>
        </div>

    )
}

export default Register