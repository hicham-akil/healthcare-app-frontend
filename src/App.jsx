import React from "react";
import AppContent from "./AppContent";
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;