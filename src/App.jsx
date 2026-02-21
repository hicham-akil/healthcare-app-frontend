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
function App() {
  return(
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ShowMed" element={<ShowMedecin />} />
        <Route path="/Takeapointement/:id" element={<Takeapointement />} />
                <Route
          path="/confirm-appointment/:idHoraire"
          element={<ConfirmAppointment />}
        />

        <Route path="/workinghours" element={<WorkingHours />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/edit-profile" element={<EditProfileForm/>} />
        <Route path="/auth" element={<AuthLayout/>} />
      </Routes>
    </Router>
  )
}

export default App;
