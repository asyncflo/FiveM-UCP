const express = require("express");
const axios = require("axios");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(session({ secret: "fivem_ucp_secret", resave: false, saveUninitialized: true }));

// MySQL-Datenbankverbindung
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "fivem_ucp",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database!");
});

// Discord OAuth2-Konfiguration
const discordConfig = {
  clientId: "YOUR_DISCORD_CLIENT_ID",
  clientSecret: "YOUR_DISCORD_CLIENT_SECRET",
  redirectUri: "http://localhost:3000/discord/callback",
  scope: "identify",
};

// Session-Daten für eingeloggte Benutzer speichern
let loggedUsers = {};

// Discord OAuth2 Login URL
app.get("/discord/login", (req, res) => {
  const redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordConfig.clientId}&redirect_uri=${encodeURIComponent(discordConfig.redirectUri)}&response_type=code&scope=${discordConfig.scope}`;
  res.redirect(redirectUrl);
});

// Discord OAuth2 Callback
app.get("/discord/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No code provided!");

  try {
    // Token anfordern
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: discordConfig.clientId,
        client_secret: discordConfig.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: discordConfig.redirectUri,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Benutzerinformationen abrufen
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = userResponse.data;
    loggedUsers[user.id] = user;

    req.session.userId = user.id;
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.send("Fehler beim Discord-Login.");
  }
});

// Benutzer-Dashboard
app.get("/dashboard", (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect("/discord/login");

  const user = loggedUsers[userId];

  // Spielerinformationen aus der Datenbank holen
  db.query(
    "SELECT * FROM users WHERE discord_id = ?",
    [user.id],
    (err, results) => {
      if (err) throw err;

      const playerData = results[0];
      res.json({
        user: user.username,
        faction: playerData ? playerData.faction : "Keine Fraktion",
        money: playerData ? playerData.money : 0,
      });
    }
  );
});

// Key einlösen
app.post("/redeem-key", (req, res) => {
  const { userId, key } = req.body;
  if (!userId || !key) return res.status(400).send("Benutzerdaten oder Key fehlen!");

  // Überprüfen, ob der Key gültig ist
  db.query("SELECT * FROM keys WHERE key_code = ?", [key], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.status(404).send("Ungültiger Key!");

    const keyData = results[0];

    // Fahrzeug in die Garage einfügen
    db.query(
      "INSERT INTO garage (discord_id, vehicle) VALUES (?, ?)",
      [userId, keyData.vehicle],
      (err) => {
        if (err) throw err;

        // Key löschen
        db.query("DELETE FROM keys WHERE key_code = ?", [key], (err) => {
          if (err) throw err;

          res.send("Key erfolgreich eingelöst!");
        });
      }
    );
  });
});

// Key generieren
app.post("/generate-key", (req, res) => {
  const { adminId, vehicle } = req.body;
  const generatedKey = Math.random().toString(36).substr(2, 8);

  // Prüfen, ob der Benutzer berechtigt ist
  db.query(
    "SELECT * FROM admins WHERE discord_id = ?",
    [adminId],
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) return res.status(403).send("Keine Berechtigung!");

      // Key in der Datenbank speichern
      db.query(
        "INSERT INTO keys (key_code, vehicle) VALUES (?, ?)",
        [generatedKey, vehicle],
        (err) => {
          if (err) throw err;
          res.json({ key: generatedKey });
        }
      );
    }
  );
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
