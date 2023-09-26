import React from "react";
import "./LoadingSpinner.css";

//set css attributes


export default function LoadingSpinner() {

    return (
        <div className="spinner-container" style={
            // center the div
            {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }
        }>
            <div className="loading-spinner"></div>
        </div>
    );
}