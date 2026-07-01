import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/dashboard/Profile";
import Skills from "../pages/dashboard/Skills";
import Projects from "../pages/dashboard/Projects";
import Experience from "../pages/dashboard/Experience";
import Education from "../pages/dashboard/Education";
import Certificates from "../pages/dashboard/Certificates";
import Messages from "../pages/dashboard/Messages";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={<Dashboard />}
                    />

                    <Route
                        path="profile"
                        element={<Profile />}
                    />

                    <Route
                        path="skills"
                        element={<Skills />}
                    />

                    <Route
                        path="projects"
                        element={<Projects />}
                    />

                    <Route
                        path="experience"
                        element={<Experience />}
                    />

                    <Route
                        path="education"
                        element={<Education />}
                    />

                    <Route
                        path="certificates"
                        element={<Certificates />}
                    />

                    <Route
                        path="messages"
                        element={<Messages />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;