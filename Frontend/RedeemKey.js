import React, { useState } from "react";
import axios from "axios";

const RedeemKey = () => {
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");

  const handleRedeem = () => {
    axios.post("http://localhost:3000/redeem-key", { key }, { withCredentials: true })
      .then((response) => {
        setMessage("Key erfolgreich eingelöst: Fahrzeug hinzugefügt!");
      })
      .catch((error) => {
        console.error("Fehler beim Einlösen des Keys:", error);
        setMessage("Fehler: Key ungültig oder bereits verwendet.");
      });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Key Einlösen</h2>
      <input
        type="text"
        placeholder="Key eingeben"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <br />
      <button
        onClick={handleRedeem}
        style={{
          backgroundColor: "#003366",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Key Einlösen
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RedeemKey;
