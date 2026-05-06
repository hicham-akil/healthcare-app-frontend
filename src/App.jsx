import React from "react";
import AuthLayout from "./components/Auth/AuthLayout";
import Navbar from "./components/reusable/Navbar";
import HomePage from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile/Profile";
import EditProfileForm from "./components/Profile/updateProfile";
import WorkingHours from "./components/schedule/WorkingTime";
import ShowMedecin from "./Pages/ShowMedecin";
import Takeapointement from "./components/Apointement/Takeapointement";
import ConfirmAppointment from "./components/Apointement/ConfirmAppointment";
import MyRendezVous from "./components/Apointement/MyRendezVous";
import ProtectedRoute from "./components/Security/protectedRoute";
import { useNavigate } from "react-router-dom";
function App() {
  const navigate = useNavigate();
  return(
    <AuthProvider onLogout={() => navigate("/auth", { replace: true })}>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthLayout/>} />
        <Route path="/" element={<HomePage />} />


        <Route element={<ProtectedRoute />}>
        <Route path="/ShowMed" element={<ShowMedecin />} />
        <Route path="/Takeapointement/:id" element={<Takeapointement />} />
        <Route path="/confirm-appointment/:idHoraire" element={<ConfirmAppointment />}/>
        <Route path="/myapoin" element={<MyRendezVous/>} />
        <Route path="/workinghours" element={<WorkingHours />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/edit-profile" element={<EditProfileForm/>} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App;
