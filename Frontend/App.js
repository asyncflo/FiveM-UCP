import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import RedeemKey from "./components/RedeemKey";

function App() {
  return (
    <Router>
      <div className="App">
        <header style={{ backgroundColor: "#003366", color: "white", padding: "10px" }}>
          <h1>FiveM User Control Panel</h1>
        </header>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/redeem-key" element={<RedeemKey />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
