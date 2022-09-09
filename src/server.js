const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const client = require("../db");
const houseRouter = require("./houses/houses.router");
const errorHandler = require("./errors/errorHandler");
const pathNotFound = require("./errors/NotFound");
const NotAllowed = require("./errors/NotAllowed");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/houses", houseRouter);
app.use(pathNotFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    await client.connect();
    console.log("Connected to database");
    console.log(`Server is running on port ${PORT}`);
  } catch (e) {
    console.log(e);
  }
});
