import React from "react";

const Login = () => {
  const discordLogin = () => {
    window.location.href = "http://localhost:3000/discord/login"; // Back-End-Login-Endpoint
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Willkommen im User Control Panel</h2>
      <p>Melde dich mit Discord an, um fortzufahren.</p>
      <button
        onClick={discordLogin}
        style={{
          backgroundColor: "#7289DA",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Mit Discord Anmelden
      </button>
    </div>
  );
};

export default Login;
