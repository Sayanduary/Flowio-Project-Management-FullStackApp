import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import Home from "./pages/Home";
import { SignInPage, SignUpPage } from "./pages/AuthPage";

const App = () => {
    return (
        <>
            <Toaster />
            <Routes>
                {/* Public Landing & Marketing Home Page (Accessible without Clerk auth wall) */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />

                {/* Authentication Routes */}
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />

                {/* Workspace App Shortcut */}
                <Route path="/app" element={<Navigate to="/dashboard" replace />} />

                {/* Authenticated Workspace Routes (Wrapped by Layout) */}
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projectsDetail" element={<ProjectDetails />} />
                    <Route path="/taskDetails" element={<TaskDetails />} />
                </Route>

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default App;
