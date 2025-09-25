// src/components/LoadingPopup.jsx
import React from "react"
import "../styles/LoadingPopup.css"
import Favicon from "../assets/favicon.png"

export default function LoadingPopup() {
    return (
        <div className="loading-overlay">
            <img
                src={Favicon}
                alt="Loading..."
                className="loading-icon"
            />
        </div>
    )
}
