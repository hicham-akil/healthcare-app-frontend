import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ConfirmAppointment from "./components/Apointement/ConfirmAppointment";
import MyRendezVous from "./components/Apointement/MyRendezVous";
import RendezVousHistory from "./components/Apointement/RendezVousHistory";
import Takeapointement from "./components/Apointement/Takeapointement";
import AuthLayout from "./components/Auth/AuthLayout";
import ForgotPassword from "./components/Auth/Forgotpassword";
import ResetPassword from "./components/Auth/ResetPassword";
import CliniqueDashboard from "./components/Clinique/CliniqueDashboard";
import Profile from "./components/Profile/Profile";
import ProtectedRoute from "./components/Security/ProtectedRoute";
import Navbar from "./components/reusable/Navbar";
import WorkingHours from "./components/schedule/WorkingTime";
import { AuthProvider } from "./context/AuthContext";
import ShowMedecin from "./Pages/ShowMedecin";
import HomePage from "./Pages/Home";
import OffersPage from "./Pages/OffersPage";
import NotFound from "./Pages/Notfound";
import EditProfileForm from "./components/Profile/updateProfile";

function AppContent() {
  const navigate = useNavigate();

  return (
    <AuthProvider onLogout={() => navigate("/auth", { replace: true })}>
      <Navbar />

      <Routes>
        <Route path="/auth" element={<AuthLayout />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/offres" element={<OffersPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/myapoin" element={<MyRendezVous />} />
          <Route path="/history" element={<RendezVousHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfileForm />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
          <Route path="/ShowMed" element={<ShowMedecin />} />
          <Route path="/Takeapointement/:id" element={<Takeapointement />} />
          <Route path="/confirm-appointment/:idHoraire" element={<ConfirmAppointment />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["MEDECIN"]} />}>
          <Route path="/workinghours" element={<WorkingHours />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["CLINIQUE", "CLINIQUE_ADMIN"]} />}>
          <Route path="/clinique" element={<CliniqueDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default AppContent;
