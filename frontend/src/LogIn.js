import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bannerImage from "./CONNECT Site Banner.png";

function LogIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState(""); // Tracks the type of login: Org, CDMO, OSAAR
    const [showLoginFields, setShowLoginFields] = useState(false); // Controls visibility of login fields
    const [hoveredButton, setHoveredButton] = useState(null); // Track hovered button for style changes
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8080/login", { username, password, type });
            if (response.data.success) {
                // Store in localStorage
                localStorage.setItem("username", username);
                localStorage.setItem("type", type);

                // Redirect based on user type
                if (type === "Org") {
                    navigate("/dashboard"); // Redirect to dashboard for Org
                } else if (type === "CDMO" || type === "OSAAR") {
                    navigate("/admindashboard"); // Redirect to admin dashboard for CDMO or OSAAR
                }
            } else {
                alert("Invalid credentials. Please try again."); // Show error message on failure
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login. Please try again.");
        }
    };

    const handleMouseEnter = (buttonName) => {
        setHoveredButton(buttonName);
    };

    const handleMouseLeave = () => {
        setHoveredButton(null);
    };

    return (
        <div>
            {/* Image Banner */}
            <div
                style={{
                    width: "100%",
                    height: "300px",
                    overflow: "hidden",
                    marginBottom: "0px",
                }}
            >
                <img
                    src={bannerImage}
                    alt="Banner"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            {/* Yellow Div */}
            <div style={{ backgroundColor: '#ffde4d', padding: '0px', minHeight: '500px', textAlign: 'center' }}>
                
            <div style={{ width: '100%', height: '50px', backgroundColor: '#ff4c4c' }}></div>
                <h1 style={{ color: '#303d46' }}>Log In</h1>

                {/* Display buttons for Org, CDMO, and OSAAR */}
                {!showLoginFields && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {['Org', 'CDMO', 'OSAAR'].map((buttonType) => (
                            <button
                                key={buttonType}
                                onClick={() => { setType(buttonType); setShowLoginFields(true); }}
                                onMouseEnter={() => handleMouseEnter(buttonType)}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    backgroundColor: hoveredButton === buttonType ? "crimson" : "#ff4c4c",
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '30px',
                                    padding: '15px 30px',
                                    margin: '20px 0',
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.3s ease',
                                    width: '200px',
                                }}
                            >
                                {buttonType}
                            </button>
                        ))}
                    </div>
                )}

                {/* Show login fields based on selection */}
                {showLoginFields && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                padding: '10px',
                                marginBottom: '15px',
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                width: '250px',
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                padding: '10px',
                                marginBottom: '15px',
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                width: '250px',
                            }}
                        />
                        <button
                            onClick={handleLogin}
                            style={{
                                backgroundColor: hoveredButton === "GoToDashboard" ? "crimson" : "#ff4c4c",
                                color: 'white',
                                border: 'none',
                                borderRadius: '30px',
                                padding: '15px 30px',
                                marginTop: '10px',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s ease',
                                width: '200px',
                            }}
                            onMouseEnter={() => handleMouseEnter("GoToDashboard")}
                            onMouseLeave={handleMouseLeave}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}

                <button
                    onClick={() => navigate("/")}
                    style={{
                        backgroundColor: hoveredButton === "BackToHome" ? "crimson" : "#ff4c4c",
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        padding: '15px 30px',
                        marginTop: '20px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease',
                        width: '200px',
                    }}
                    onMouseEnter={() => handleMouseEnter("BackToHome")}
                    onMouseLeave={handleMouseLeave}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default LogIn;
