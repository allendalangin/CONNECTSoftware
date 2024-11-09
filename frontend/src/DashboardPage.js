import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bannerImage from "./CONNECT Site Banner.png";
import "./DashboardPage.css";

function DashboardPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [hoveredButton, setHoveredButton] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // Track the selected event for modal
    const [filter, setFilter] = useState("All"); // Track the selected filter

    const handleMouseEnter = (buttonName) => {
        setHoveredButton(buttonName);
    };

    const handleMouseLeave = () => {
        setHoveredButton(null);
    };

    useEffect(() => {
        // Retrieve the username from localStorage
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);

            // Fetch events for the current user
            axios
                .get(`http://localhost:8080/events/${storedUsername}`)
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

    // Event handler for updating an event
    const handleUpdateEvent = (eventName) => {
        localStorage.setItem("paramEventName", eventName); // Store the event name in local storage
        navigate("/updateevent"); // Navigate to the update event page
    };

    // Event handler for deleting an event
    const handleDeleteEvent = (eventName) => {
        if (window.confirm(`Are you sure you want to delete the event "${eventName}"?`)) {
            axios
                .delete(`http://localhost:8080/events/delete/${encodeURIComponent(eventName)}`)
                .then((response) => {
                    if (response.data.success) {
                        alert("Event deleted successfully!");
                        setEvents(events.filter(event => event.eventName !== eventName));
                    } else {
                        alert("Failed to delete event. Please try again.");
                    }
                })
                .catch((error) => {
                    console.error("Error deleting event:", error);
                    alert("An error occurred while deleting the event. Please try again.");
                });
        }
    };

    // Separate events into Pending and Approved
    const pendingEvents = events.filter(event => event.status !== "Approved");
    const approvedEvents = events.filter(event => event.status === "Approved");

    // Get events based on selected filter
    const filteredEvents = filter === "All" ? [...pendingEvents, ...approvedEvents] : filter === "Pending" ? pendingEvents : approvedEvents;

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
                        backgroundColor: hoveredButton === "AddEvent" ? "crimson" : "#ff4c4c",
                        color: "white",
                        border: "none",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={() => handleMouseEnter("AddEvent")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => navigate("/addevent")}
                >
                    Add Event
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
                <h2 style={{ color: "#303d46" }}>Welcome to CONNECT Event Filer!</h2>

                {/* Filter Buttons */}
                <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                    {["All", "Pending", "Approved"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            style={{
                                backgroundColor: hoveredButton === status ? "crimson" : "#ff4c4c",
                                color: "white",
                                border: "none",
                                fontWeight: "bold",
                                borderRadius: "20px",
                                padding: "10px 20px",
                                margin: "0 10px",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease",
                                fontSize: "16px",
                            }}
                            onMouseEnter={() => handleMouseEnter(status)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Filtered Events Section */}
                {filteredEvents.length > 0 ? (
                    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                        {filteredEvents.map((event, index) => (
                            <li
                                key={index}
                                style={{
                                    marginBottom: "15px",
                                    padding: "20px",
                                    backgroundColor: event.status === "Approved" ? "#4CAF50" : "#ff4c4c",
                                    color: "white",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    position: "relative",
                                    cursor: "pointer",
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                    whiteSpace: "normal",
                                }}
                                onClick={() => handleEventClick(event)}
                            >
                                <strong>{event.eventName}</strong>
                                <p>{event.eventObjectives}</p>
                                <p><strong>Status:</strong> {event.status}</p>
                                {event.status !== "Approved" && (
                                    <div style={{ position: "absolute", bottom: "10px", right: "10px", display: "flex" }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateEvent(event.eventName);
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
                                            Update
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteEvent(event.eventName);
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
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: "#303d46", fontSize: "20px" }}>No events available</p>
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
                        <hr />
                        <p><strong>Status of Approval:</strong> {selectedEvent.status}</p>
                        <p><strong>Relevant SDGs:</strong> {selectedEvent.eventSDGs}</p>
                        <p><strong>CDMO Status:</strong> {selectedEvent.CDMO === "No" ? "No response yet" : selectedEvent.CDMO}</p>
                        <p><strong>OSAAR Status:</strong> {selectedEvent.OSAAR === "No" ? "No response yet" : selectedEvent.OSAAR}</p>
                        <button onClick={handleCloseModal} style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;
