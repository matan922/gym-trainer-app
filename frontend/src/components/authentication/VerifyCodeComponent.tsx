import { useState } from "react"

interface VerifyCodeComponentProps {
    email: string
    onVerify: (code: string) => Promise<void>
    onResend: () => Promise<void>
    error?: string
    isLoading?: boolean
}

const VerifyCodeComponent = ({ email, onVerify, onResend, error, isLoading }: VerifyCodeComponentProps) => {
    const [code, setCode] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (code.length === 6) {
            await onVerify(code)
        }
    }

    const handleResend = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        await onResend()
    }

    return (
        <div className="bg-surface p-10 rounded-3xl shadow-2xl w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-text-dark mb-2">
                    אימות אימייל
                </h1>
                <p className="text-text-medium">
                    הקלד את הקוד שנשלח ל:
                </p>
                <p className="text-text-dark font-semibold mt-1">{email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="code"
                        className="block text-sm font-medium text-text-medium mb-2 text-right"
                    >
                        קוד אימות
                    </label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-border-medium rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-client-primary focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="000000"
                    />
                </div>

                {error && (
                    <div className="text-center text-sm text-red-500">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    className="w-full text-white py-3 rounded-lg font-semibold transition duration-200 shadow-xl bg-primary-button hover:bg-primary-button-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "מאמת..." : "אמת"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <p className="text-text-light">
                    לא קיבלת קוד?{" "}
                    <button
                        onClick={handleResend}
                        disabled={isLoading}
                        className="text-primary hover:text-primary-dark font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        שלח שוב
                    </button>
                </p>
            </div>
        </div>
    )
}

export default VerifyCodeComponent
