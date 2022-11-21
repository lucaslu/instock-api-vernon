require("dotenv").config();

const express = require("express");
const path = require("node:path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5500;

app.get("/", (_request, response) => {
  response.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀 `);
});
