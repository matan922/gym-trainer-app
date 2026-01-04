import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { validateClientInvite } from "../../services/api"

const InviteAcceptPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState<"validating" | "error">("validating")
    const [errorMessage, setErrorMessage] = useState<string>("")


    useEffect(() => {
        const inviteToken = searchParams.get('token')

        if (!inviteToken) {
            setErrorMessage("קישור לא תקין - חסר טוקן")
            setStatus("error")
            return
        }

        validateToken(inviteToken)
    }, [])

    const validateToken = async (inviteToken: string) => {
        try {
            const response = await validateClientInvite(inviteToken)
            console.log(response)

            if (!response.valid) {
                setErrorMessage(response.message || "הזמנה לא תקפה או פגה תוקף")
                setStatus("error")
                return
            }

            // Flow #1: User doesn't exist
            if (!response.userExists) {
                console.log("first")
                // Save token to localStorage
                localStorage.setItem("pendingInviteToken", inviteToken)

                // Redirect to register
                navigate("/register")
                return
            }

            // TODO: additional flows #2 and #3
            
        } catch (error) {
            setErrorMessage("שגיאה בבדיקת ההזמנה")
            setStatus("error")
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center">
                    {status === "validating" && (
                        <>
                            <div className="text-4xl mb-4">⏳</div>
                            <h1 className="text-2xl font-bold mb-2">מאמת הזמנה...</h1>
                        </>
                    )}


                    {status === "error" && (
                        <>
                            <div className="text-4xl mb-4">❌</div>
                            <h1 className="text-2xl font-bold mb-2 text-red-600">שגיאה</h1>
                            <p className="text-gray-600 mb-4">EDIT THIS</p>
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                חזור להתחברות
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default InviteAcceptPage