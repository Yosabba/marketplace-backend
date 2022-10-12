const client = require("../../db");
const notFound = require("../errors/NotFound");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


function isPasswordValid(req, res, next) {
  const { password } = req.body;

  if (password === "") {
    return next({
      status: 500,
      message: "Password cannot be empty",
    });
  }
  next();
}

function isEmailValid(req, res, next) {
  const { email } = req.body;

  if (email === "") {
    return next({
      status: 500,
      message: "email cannot be empty",
    });
  }
  next();
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const { rows } = await client.query(
      "SELECT email,name, password FROM users WHERE email = $1 ",
      [email]
    );

    if (rows.length <= 0) {
      return next({
        status: 500,
        message: "user does not exists",
      });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next({
        status: 500,
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);

    // res.cookie("jwt", accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 1000 * 60 * 60 * 24,
    // }); //secure: true

    res.status(200).json({
      user: user.name,
      email: user.email,
      message: "Logged in successfully!",
      token: `Bearer ${accessToken}`,
    });
  } catch ({ message }) {
    console.log(message);
  }
}

module.exports = {
  login: [isEmailValid, isPasswordValid, login],
};
