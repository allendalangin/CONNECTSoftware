import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerImage from "./CONNECT Site Banner.png";
import axios from "axios";

function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState(""); // Track login type (Org, CDMO, OSAAR)
    const [hoveredButton, setHoveredButton] = useState(null); // Track hovered button for style changes
    const [hoveredPassword, setHoveredPassword] = useState(false); // Track hover state for password field
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            const response = await axios.post("http://localhost:8080/signin", { username, password, type });

            // Log the response to see what is returned by the server
            console.log(response.data);

            // Check the success status and show the appropriate message
            if (response.data.success) {
                alert(response.data["message"]);
                navigate("/"); // Redirect to the home page or wherever you want after successful signup
            } else {
                alert(response.data["message"]); // Display the message for errors
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred during sign up. Please try again.");
        }
    };

    const handleMouseEnter = (buttonName) => {
        setHoveredButton(buttonName);
    };

    const handleMouseLeave = () => {
        setHoveredButton(null);
    };

    // Determine the domain text based on the selected type
    const getDomainText = () => {
        if (type === "Org") {
            return "@org.mapua";
        } else if (type === "CDMO") {
            return "@cdmo.mapua";
        } else if (type === "OSAAR") {
            return "@osaar.mapua";
        } else {
            return "";
        }
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
                <h1 style={{ color: '#303d46' }}>Sign Up</h1>

                {/* Dropdown to select type */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                    <label htmlFor="signupType" style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold', color: '#303d46' }}>Select Type:</label>
                    <select
                        id="signupType"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            fontSize: '16px',
                            width: '250px',
                            marginBottom: '20px',
                            color: '#303d46',
                        }}
                    >
                        <option value="">--Choose an option--</option>
                        <option value="Org">Organization</option>
                        <option value="CDMO">CDMO</option>
                        <option value="OSAAR">OSAAR</option>
                    </select>
                </div>

                {/* Sign up form fields */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                padding: '10px',
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                width: '250px',
                                marginRight: '10px',
                            }}
                        />
                        {type && <span style={{ fontSize: '16px' }}>{getDomainText()}</span>}
                    </div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onMouseEnter={() => setHoveredPassword(true)}
                        onMouseLeave={() => setHoveredPassword(false)}
                        style={{
                            padding: '10px',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            fontSize: '16px',
                            width: '250px',
                            marginBottom: '20px',
                            position: 'relative',
                            color: '#303d46',
                        }}
                    />
                    {hoveredPassword && (
                        <div style={{
                            position: 'absolute',
                            backgroundColor: 'white',
                            color: '#303d46',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px',
                            top: '420px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1,
                        }}>
                            Password must include a capital and small letters and numbers
                        </div>
                    )}
                    <button
                        onClick={handleSignUp}
                        style={{
                            backgroundColor: hoveredButton === "SignUp" ? "crimson" : "#ff4c4c",
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            padding: '15px 30px',
                            cursor: 'pointer',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s ease',
                            width: '200px',
                        }}
                        onMouseEnter={() => handleMouseEnter("SignUp")}
                        onMouseLeave={handleMouseLeave}
                    >
                        Sign Up
                    </button>
                </div>

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

export default SignUp;
