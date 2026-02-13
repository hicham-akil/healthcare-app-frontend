import React from "react";
import AuthLayout from "./components/Auth/AuthLayout";
import Navbar from "./components/reusable/Navbar";
import HomePage from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile/Profile";
import EditProfileForm from "./components/Profile/updateProfile";
import WorkingHours from "./components/schedule/WorkingTime";
import ShowMedecin from "./Pages/ShowMedecin";
function App() {
  return(
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ShowMed" element={<ShowMedecin />} />
        <Route path="/workinghours" element={<WorkingHours />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/edit-profile" element={<EditProfileForm/>} />
        <Route path="/auth" element={<AuthLayout/>} />
      </Routes>
    </Router>
  )
}

export default App;
