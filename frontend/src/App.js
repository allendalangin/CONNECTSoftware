import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home.js";
import HelloPage from "./HelloPage";
import SignIn from "./SignIn";
import DashboardPage from "./DashboardPage";
import CalView from "./CalView";
import AddEvent from "./AddEvent";
import UpdateEvent from "./UpdateEvent";
import LogIn from "./LogIn";
import AdminDashboardPage from "./AdminDashboardPage.js";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hello" element={<HelloPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admindashboard" element={<AdminDashboardPage />} />
                <Route path="/calview" element={<CalView />} />
                <Route path="/addevent" element={<AddEvent />} />
                <Route path="/updateevent" element={<UpdateEvent />} />
                <Route path="/login" element={<LogIn />} />
            </Routes>
        </Router>
    );
}

export default App;
