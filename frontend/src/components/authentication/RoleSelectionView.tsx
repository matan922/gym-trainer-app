import { Link } from 'react-router'
import { ClipBoardChecked, UserIcon } from '../icons/Icons';

interface RoleSelectionViewProps {
    roleChange: (type: "trainer" | "client" | null) => void;
}

const RoleSelectionView = ({ roleChange }: RoleSelectionViewProps) => {
    return (
        <div className="bg-surface flex flex-col p-10 rounded-3xl shadow-2xl w-full max-w-md gap-8">
            <div className="text-center flex flex-col gap-4">
                <h1 className="text-4xl font-bold text-text-dark">בוא נתחיל</h1>
                <p className="font-medium text-2xl tracking-wide text-text-medium">בחר את סוג החשבון שלך</p>
            </div>

            <div className="flex flex-col justify-between gap-6 sm:flex-row">
                <button onClick={() => roleChange("trainer")} className="flex-1 text-white p-10 rounded-2xl shadow-xl bg-trainer-button hover:bg-trainer-button-hover">
                    <ClipBoardChecked className='w-12 h-12 mx-auto mb-3' />
                    <span className="text-lg font-semibold">אני מאמן</span>
                </button>

                <button onClick={() => roleChange("client")} className="flex-1 text-white p-10 rounded-2xl shadow-xl bg-client-button hover:bg-client-button-hover">
                    <UserIcon className='w-12 h-12 mx-auto mb-3' />
                    <span className="text-lg font-semibold">אני לקוח</span>
                </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-100">
                <span className="text-text-light">כבר יש לך חשבון? {" "}
                    <Link
                        to={"/login"}
                        className="text-primary hover:text-primary-dark font-semibold transition-colors"
                    >
                        התחבר כאן
                    </Link>
                </span>
            </div>
        </div>
    )
}

export default RoleSelectionView