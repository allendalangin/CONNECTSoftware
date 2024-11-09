import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerImage from "./CONNECT Site Banner.png";

function Home() {
    const navigate = useNavigate();
    const [hoveredButton, setHoveredButton] = useState(null); // Track hovered button for style changes

    const handleChoice = (choice) => {
        switch (choice) {
            case "1":
                navigate("/signin");
                break;
            case "2":
                navigate("/login");
                break;
            case "3":
                alert("Exiting program...");
                break;
            default:
                alert("Invalid choice. Please try again.");
                break;
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
                <h1 style={{ color: '#303d46' }}>Welcome to Connect!</h1>

                {/* Buttons for Sign Up, Log In, and Exit */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {['Sign Up', 'Log In', 'Exit'].map((buttonLabel, index) => (
                        <button
                            key={buttonLabel}
                            onClick={() => handleChoice((index + 1).toString())}
                            onMouseEnter={() => handleMouseEnter(buttonLabel)}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                backgroundColor: hoveredButton === buttonLabel ? "crimson" : "#ff4c4c",
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
                            {buttonLabel}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
