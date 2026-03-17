const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/posts", postRoutes);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});