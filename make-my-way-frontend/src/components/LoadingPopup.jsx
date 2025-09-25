// src/components/LoadingPopup.jsx
import React from "react"
import "../styles/LoadingPopup.css"

export default function LoadingPopup() {
    return (
        <div className="loading-overlay">
            <img
                src="../../media/favicon.png"
                alt="Loading..."
                className="loading-icon"
            />
        </div>
    )
}
