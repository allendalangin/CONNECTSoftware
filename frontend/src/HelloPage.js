import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function HelloPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state?.message || "No message provided";

    const handleBackClick = () => {
        navigate("/");
    };

    return (
        <div>
            <h1>{message}</h1>
            <button onClick={handleBackClick}>Back to Home</button>
        </div>
    );
}

export default HelloPage;
