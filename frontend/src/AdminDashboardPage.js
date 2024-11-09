import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bannerImage from "./CONNECT Site Banner.png";
import "./DashboardPage.css";

function AdminDashboardPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");
    const [hoveredButton, setHoveredButton] = useState(null);
    const [events, setEvents] = useState([]); // All events
    const [selectedEvent, setSelectedEvent] = useState(null); // Track the selected event for modal

    const handleMouseEnter = (buttonName) => {
        setHoveredButton(buttonName);
    };

    const handleMouseLeave = () => {
        setHoveredButton(null);
    };

    useEffect(() => {
        // Retrieve the username and type from localStorage
        const storedUsername = localStorage.getItem("username");
        const storedType = localStorage.getItem("type");

        if (storedUsername && storedType) {
            setUsername(storedUsername);
            setUserType(storedType);

            // Fetch all pending events for the current user type (CDMO or OSAAR)
            axios
                .get(`http://localhost:8080/events/admin/${storedType}`)
                .then((response) => {
                    setEvents(response.data.events);
                })
                .catch((error) => {
                    console.error("Error fetching events:", error);
                });
        }
    }, []);

    // Event handler for opening the modal
    const handleEventClick = (event) => {
        setSelectedEvent(event); // Set the selected event data to show in the modal
    };

    // Event handler for closing the modal
    const handleCloseModal = () => {
        setSelectedEvent(null); // Clear the selected event to close the modal
    };

    // Event handler for approving an event
    const handleApproveEvent = (eventName) => {
        axios
            .post(`http://localhost:8080/events/approve/${encodeURIComponent(eventName)}/${userType}`)
            .then((response) => {
                alert(response.data.message); // Use the message from backend response
                if (response.data.success) {
                    setEvents(events.filter(event => event.eventName !== eventName));
                }
            })
            .catch((error) => {
                console.error("Error approving event:", error);
                const errorMessage = error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "An error occurred while approving the event. Please try again.";
                alert(errorMessage);
            });
    };

    // Event handler for denying an event
    const handleDenyEvent = (eventName) => {
        const reason = window.prompt('Please state the reason for denial:');
        if (reason === null || reason.trim() === '') {
            return; // User cancelled or provided no reason
        }
        axios.post(`http://localhost:8080/events/deny/${encodeURIComponent(eventName)}/${userType}`, { reason })
            .then((response) => {
                alert(response.data.message); // Use the message from backend response
                if (response.data.success) {
                    setEvents(events.filter(event => event.eventName !== eventName));
                }
            })
            .catch((error) => {
                console.error("Error denying event:", error);
                const errorMessage = error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "An error occurred while denying the event. Please try again.";
                alert(errorMessage);
            });
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

            {/* Navigation Bar */}
            <div
                style={{
                    display: "flex",
                    backgroundColor: "red",
                    width: "100%",
                    height: "60px",
                    alignItems: "center",
                }}
            >
                <button
                    style={{
                        flex: 1,
                        height: "100%",
                        backgroundColor: hoveredButton === "Calendar" ? "crimson" : "#ff4c4c",
                        color: "white",
                        border: "none",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={() => handleMouseEnter("Calendar")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => navigate("/calview")}
                >
                    Calendar View
                </button>
                <button
                    style={{
                        flex: 1,
                        height: "100%",
                        backgroundColor: hoveredButton === "SignOut" ? "crimson" : "#ff4c4c",
                        color: "white",
                        border: "none",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={() => handleMouseEnter("SignOut")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => navigate("/")}
                >
                    Sign Out
                </button>
            </div>

            {/* Main Dashboard Content */}
            <div style={{ backgroundColor: "#ffde4d", padding: "20px" }}>
                <h2 style={{ color: '#303d46' }}>Welcome to CONNECT's {userType} Dashboard</h2>

                {/* Pending Events Header */}
                <div
                    style={{
                        width: "calc(100% - 40px)",
                        margin: "0 auto 20px auto",
                        padding: "5px 20px",
                        backgroundColor: "#ff4c4c",
                        color: "white",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "20px",
                    }}
                >
                    Pending Events for {userType}
                </div>

                {events.length > 0 ? (
                    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                        {events.map((event, index) => (
                            <li
                                key={index}
                                style={{
                                    marginBottom: "15px",
                                    padding: "20px",
                                    backgroundColor: "#ff4c4c",
                                    color: "white",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    cursor: "pointer",
                                    position: "relative",
                                }}
                                onClick={() => handleEventClick(event)}
                            >
                                <strong>{event.eventName}</strong>
                                <p>{event.eventObjectives}</p>

                                {/* Only show approve/deny buttons for the first item */}
                                {index === 0 && (
                                    <div style={{ position: "absolute", bottom: "10px", right: "10px", display: "flex" }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleApproveEvent(event.eventName);
                                            }}
                                            style={{
                                                marginRight: "10px",
                                                padding: "5px 10px",
                                                cursor: "pointer",
                                                backgroundColor: "#4CAF50",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDenyEvent(event.eventName);
                                            }}
                                            style={{
                                                padding: "5px 10px",
                                                cursor: "pointer",
                                                backgroundColor: "red",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            Deny
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: '#303d46', fontSize: '24px',fontWeight: "bold" }}>No pending events available</p>
                )}
            </div>

            {/* Modal for Event Details */}
            {selectedEvent && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "10px",
                            width: "900px",
                            textAlign: "left",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                        }}
                    >
                        <h3>Event Details</h3>
                        <p><strong>Event Name:</strong> {selectedEvent.eventName}</p>
                        <p><strong>Event Date:</strong> {selectedEvent.eventDate}</p>
                        <p><strong>Event Venue:</strong> {selectedEvent.eventVenue}</p>
                        <p><strong>Event Objectives:</strong> {selectedEvent.eventObjectives}</p>
                        <p><strong>Relevant SDGs:</strong> {selectedEvent.eventSDGs}</p>
                        <hr />
                        <button onClick={handleCloseModal} style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboardPage;
