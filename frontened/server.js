const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

let jwtToken = "";

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Login Route
app.post("/api/v1/login", async (req, res) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/api/v1/login", req.body);
    jwtToken = response.data.access_token;
    res.send({ message: "Login successful" });
  } catch (error) {
    res.status(401).send("Authentication failed");
  }
});

// Prediction Route
app.post("/api/v1/get-prediction", async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/api/v1/predict",
      req.body,
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error in fetching prediction");
  }
});

app.listen(3000, () => {
  console.log("Node.js server running on http://localhost:3000");
});
