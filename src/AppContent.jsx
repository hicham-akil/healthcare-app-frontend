import React from "react";
import AuthLayout from "./Components/Auth/AuthLayout";
import Navbar from "./components/reusable/Navbar";
import HomePage from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./components/Profile/Profile";
import EditProfileForm from "./components/Profile/updateProfile";
import WorkingHours from "./components/schedule/WorkingTime";
import ShowMedecin from "./Pages/ShowMedecin";
import Takeapointement from "./components/Apointement/Takeapointement";
import ConfirmAppointment from "./components/Apointement/ConfirmAppointment";
import MyRendezVous from "./components/Apointement/MyRendezVous";
import RendezVousHistory from "./components/Apointement/RendezVousHistory";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ProtectedRoute from "./components/Security/protectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./Components/Auth/Forgotpassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import NotFound from "./Pages/Notfound";

function AppContent() {
    const navigate = useNavigate();

    return (
        <AuthProvider onLogout={() => navigate("/auth", { replace: true })}>
            <Navbar />

            <Routes>
                <Route path="/auth" element={<AuthLayout />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Routes accessibles à tout utilisateur connecté */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/myapoin" element={<MyRendezVous />} />
                    <Route path="/history" element={<RendezVousHistory />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/edit-profile" element={<EditProfileForm />} />
                </Route>

                {/* Routes PATIENT uniquement */}
                <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
                    <Route path="/ShowMed" element={<ShowMedecin />} />
                    <Route path="/Takeapointement/:id" element={<Takeapointement />} />
                    <Route path="/confirm-appointment/:idHoraire" element={<ConfirmAppointment />} />
                </Route>

                {/* Routes MEDECIN uniquement */}
                <Route element={<ProtectedRoute allowedRoles={["MEDECIN"]} />}>
                    <Route path="/workinghours" element={<WorkingHours />} />
                </Route>

                {/* Routes ADMIN uniquement */}
                <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}
export default AppContent;
