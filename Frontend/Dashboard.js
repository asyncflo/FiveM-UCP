import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/dashboard", { withCredentials: true })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        window.location.href = "/";
      });
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Dashboard</h2>
      {userData ? (
        <div>
          <p><strong>Benutzername:</strong> {userData.user}</p>
          <p><strong>Fraktion:</strong> {userData.faction}</p>
          <p><strong>Geld:</strong> ${userData.money}</p>
          <button
            onClick={() => (window.location.href = "/redeem-key")}
            style={{
              backgroundColor: "#003366",
              color: "white",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Key Einlösen
          </button>
        </div>
      ) : (
        <p>Daten werden geladen...</p>
      )}
    </div>
  );
};

export default Dashboard;
