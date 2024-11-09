// Calendar.js (React Frontend Component)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bannerImage from "./CONNECT Site Banner.png";
import axios from "axios";

function CalView() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null); 

    useEffect(() => {
        // Fetch approved events from backend
        axios.get("http://localhost:8080/events/calendar/allen@org.mapua")
            .then((response) => {
                const approvedEvents = response.data.events.map(event => ({
                    title: event.eventName,
                    start: event.eventDate,
                    color: "#ff4c4c",
                    extendedProps: { ...event } 
                }));
                setEvents(approvedEvents);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
            });
    }, []);

    const handleMouseEnter = (buttonName) => {
        setHoveredButton(buttonName);
    };

    const handleMouseLeave = () => {
        setHoveredButton(null);
    };

    const handleEventClick = (info) => {
        setSelectedEvent(info.event.extendedProps); 
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    const handleBackToHome = () => {
        const userType = localStorage.getItem("type");

        if (userType) {
            if (userType === "Org") {
                navigate("/dashboard");
            } else if (userType === "CDMO" || userType === "OSAAR") {
                navigate("/admindashboard");
            } else {
                alert("User type not recognized.");
            }
        } else {
            alert("User type not set in localStorage.");
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
                <h1 style={{ color: '#303d46' }}>Calendar View</h1>

                {/* FullCalendar Component */}
                <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '30px' }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        editable={true}
                        selectable={true}
                        events={events}
                        eventClick={handleEventClick} 
                    />
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={handleBackToHome}
                        style={{
                            backgroundColor: hoveredButton === "BackToDashboard" ? "crimson" : "#ff4c4c",
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            padding: '15px 30px',
                            cursor: 'pointer',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s ease',
                            width: '200px',
                            marginBottom: '20px',
                        }}
                        onMouseEnter={() => handleMouseEnter("BackToDashboard")}
                        onMouseLeave={handleMouseLeave}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
            <div style={{ backgroundColor: '#ffde4d', padding: '0px 0px 50px', minHeight: '10px', textAlign: 'center' }}></div>

            {/* Modal for Event Details */}
            {selectedEvent && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000, 
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "10px",
                            width: "600px",
                            textAlign: "left",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            zIndex: 1001, 
                        }}
                    >
                        <h3>Event Details</h3>
                        <p><strong>Event Name:</strong> {selectedEvent.eventName}</p>
                        <p><strong>Event Date:</strong> {selectedEvent.eventDate}</p>
                        <p><strong>Event Venue:</strong> {selectedEvent.eventVenue}</p>
                        <p><strong>Event Objectives:</strong> {selectedEvent.eventObjectives}</p>
                        <p><strong>Relevant SDGs:</strong> {selectedEvent.eventSDGs}</p>
                        <button onClick={handleCloseModal} style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalView;
