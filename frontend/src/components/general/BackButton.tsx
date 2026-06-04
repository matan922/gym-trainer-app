import React from 'react'
import { useNavigate } from 'react-router'
import { BackIcon } from '../icons/Icons'

const BackButton = ({ className }: { className?: string }) => {
    const navigate = useNavigate()

    return (
        <button
            className={className || "p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all"}
            onClick={() => navigate(-1)}
            aria-label="חזור"
        >
            <BackIcon className="w-6 h-6" />
        </button>
    )
}

export default BackButton