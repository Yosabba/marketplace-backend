const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const client = require("../db");
const houseRouter = require("./houses/houses.router");
const loginRouter = require("./login/login.router");
const signUpRouter = require("./signup/signup.router");
const errorHandler = require("./errors/errorHandler");
const cookieParser = require("cookie-parser");

app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/houses", houseRouter);
app.use("/login", loginRouter);
app.use("/signup", signUpRouter);
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
