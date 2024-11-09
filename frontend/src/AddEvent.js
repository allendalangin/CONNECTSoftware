import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bannerImage from "./CONNECT Site Banner.png";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddEvent() {
    const navigate = useNavigate();
    const [hoveredButton, setHoveredButton] = useState(null); // Track hovered button for style changes
    const [existingEvents, setExistingEvents] = useState([]); // Holds events already fetched from the backend

    // State to track form field values
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState(null);
    const [eventVenue, setEventVenue] = useState("");
    const [eventObjectives, setEventObjectives] = useState("");
    const [relevantSDGs, setRelevantSDGs] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        // Retrieve the username from localStorage
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }

        // Fetch approved events from backend
        axios
            .get("http://localhost:8080/events/calendar/allen@org.mapua")
            .then((response) => {
                const approvedEvents = response.data.events.map((event) => ({
                    title: event.eventName,
                    start: event.eventDate,
                    color: "#ff4c4c",
                    eventVenue: event.eventVenue, // To track venue availability
                }));
                setExistingEvents(approvedEvents);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
            });
    }, []);

    const handleSubmit = async () => {
        // Set the time to midnight to prevent timezone offset issues
        const selectedDate = eventDate
            ? new Date(Date.UTC(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())).toISOString().split("T")[0]
            : "";
    
        // Check if the eventVenue is available for the selected eventDate
        const isVenueUnavailable = existingEvents.some(
            (event) => {
                const eventDateFormatted = new Date(event.start).toISOString().split("T")[0];
                return eventDateFormatted === selectedDate && event.eventVenue === eventVenue;
            }
        );
    
        if (isVenueUnavailable) {
            alert("Event venue unavailable at this date");
            return;
        }
    
        // Create an event object to send to the backend
        const newEvent = {
            eventName,
            eventDate: selectedDate, // Format as YYYY-MM-DD
            eventVenue,
            eventObjectives,
            eventSDGs: relevantSDGs,
            username,
        };
    
        try {
            // Send a POST request to the backend
            const response = await axios.post("http://localhost:8080/addevent", newEvent);
    
            if (response.data.success) {
                alert("Event created successfully!");
                navigate("/dashboard"); // Redirect to dashboard after successful submission
            } else {
                alert("Failed to create event. Please try again.");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            alert("An error occurred while creating the event. Please try again.");
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
            <div style={{ backgroundColor: "#ffde4d", padding: "0px", minHeight: "500px", textAlign: "center" }}>
                <div style={{ width: "100%", height: "50px", backgroundColor: "#ff4c4c" }}></div>
                <h1 style={{ color: "#303d46" }}>Add Event</h1>

                {/* Form Fields for Event Details */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
                    <div style={{ marginBottom: "20px", textAlign: "left" }}>
                        <label style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold", color: "#303d46" }}>
                            Event Name:
                        </label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="Enter event name"
                            style={{
                                padding: "10px",
                                borderRadius: "10px",
                                border: "1px solid #ccc",
                                fontSize: "16px",
                                width: "300px",
                                marginBottom: "10px",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "20px", textAlign: "left" }}>
                        <label style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold", color: "#303d46" }}>
                            Event Date:
                        </label>
                        <DatePicker
                            selected={eventDate}
                            onChange={(date) => setEventDate(date)}
                            placeholderText="Select event date"
                            minDate={new Date()} // Disable past dates
                            dateFormat="MM-dd-yyyy"
                            style={{
                                padding: "10px",
                                borderRadius: "10px",
                                border: "1px solid #ccc",
                                fontSize: "18px",
                                width: "300px",
                                marginBottom: "10px",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "20px", textAlign: "left" }}>
                        <label
                            style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold", color: "#303d46" }}
                            htmlFor="eventVenue"
                        >
                            Select Venue:
                        </label>
                        <select
                            id="eventVenue"
                            value={eventVenue}
                            onChange={(e) => setEventVenue(e.target.value)}
                            style={{
                                padding: "10px",
                                borderRadius: "10px",
                                border: "1px solid #ccc",
                                fontSize: "16px",
                                width: "300px",
                                marginBottom: "10px",
                            }}
                        >
                            <option value="">--Choose an option--</option>
                            <option value="Seminar Room">Seminar Room</option>
                            <option value="Smart Room">Smart Room</option>
                            <option value="AVR 1">AVR 1</option>
                            <option value="AVR 2">AVR 2</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: "20px", textAlign: "left" }}>
                        <label style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold", color: "#303d46" }}>
                            Event Objectives:
                        </label>
                        <textarea
                            value={eventObjectives}
                            onChange={(e) => setEventObjectives(e.target.value)}
                            placeholder="Enter event objectives"
                            style={{
                                padding: "10px",
                                borderRadius: "10px",
                                border: "1px solid #ccc",
                                fontSize: "16px",
                                width: "300px",
                                height: "100px",
                                marginBottom: "10px",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "20px", textAlign: "left" }}>
                        <label style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold", color: "#303d46" }}>
                            Relevant SDGs (separated by commas):
                        </label>
                        <input
                            type="text"
                            value={relevantSDGs}
                            onChange={(e) => setRelevantSDGs(e.target.value)}
                            placeholder="1,2, etc."
                            style={{
                                padding: "10px",
                                borderRadius: "10px",
                                border: "1px solid #ccc",
                                fontSize: "16px",
                                width: "300px",
                                marginBottom: "10px",
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        style={{
                            backgroundColor: hoveredButton === "CreateEvent" ? "crimson" : "#ff4c4c",
                            color: "white",
                            border: "none",
                            borderRadius: "30px",
                            padding: "15px 30px",
                            cursor: "pointer",
                            fontSize: "20px",
                            fontWeight: "bold",
                            transition: "background-color 0.3s ease",
                            width: "200px",
                            marginTop: "20px",
                        }}
                        onMouseEnter={() => handleMouseEnter("CreateEvent")}
                        onMouseLeave={handleMouseLeave}
                    >
                        Create Event
                    </button>
                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    style={{
                        backgroundColor: hoveredButton === "BackToDashboard" ? "crimson" : "#ff4c4c",
                        color: "white",
                        border: "none",
                        borderRadius: "30px",
                        padding: "15px 30px",
                        marginTop: "20px",
                        cursor: "pointer",
                        fontSize: "20px",
                        fontWeight: "bold",
                        transition: "background-color 0.3s ease",
                        width: "200px",
                    }}
                    onMouseEnter={() => handleMouseEnter("BackToDashboard")}
                    onMouseLeave={handleMouseLeave}
                >
                    Back to Dashboard
                </button>
            </div>
            <div style={{ backgroundColor: "#ffde4d", padding: "0px 0px 50px", minHeight: "10px", textAlign: "center" }}></div>
        </div>
    );
}

export default AddEvent;
