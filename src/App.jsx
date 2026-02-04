import React from "react";
import AuthLayout from "./components/Auth/AuthLayout";
import Navbar from "./components/reusable/Navbar";
import HomePage from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/Reusable/Profile";
function App() {
  return(
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/auth" element={<AuthLayout/>} />
      </Routes>
    </Router>
  )
}

export default App;
