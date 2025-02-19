import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import "./App.css";
import Constants from "./utils/Constants";

const App = () => {
  const isAuthenticated = !!localStorage.getItem(Constants.TOKEN_PROPERTY); // Check if JWT exists

  return (
      <div className="App">
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
      </div>
  );
};

export default App;
