const express = require("express");

const app = express();

const path = require("path");
const publicPath = path.join(__dirname, "build");

app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});