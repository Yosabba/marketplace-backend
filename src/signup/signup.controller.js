const client = require("../../db");
const notFound = require("../errors/NotFound");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isUsernameValid(req, res, next) {
  const { username } = req.body;

  if (username === "" || username === null) {
    return next({
      status: 500,
      message: "username cannot be empty",
    });
  }

  next();
}

function isEmailValid(req, res, next) {
  const { email } = req.body;

  if (email === "" || email === null) {
    return next({
      status: 500,
      message: "email cannot be empty",
    });
  }

  next();
}

function isPasswordValid(req, res, next) {
  const { password } = req.body;

  if (password === "" || password === null) {
   return next({
      status: 500,
      message: "password cannot be empty",
    });
  }
  res.locals.password = password;
  next();
}

async function encryptPassword(req, res, next) {
  try {
    const { password } = res.locals;
    const hashedPassword = await bcrypt.hash(password, 10);

    res.locals.password = hashedPassword;
    next();
  } catch ({ message }) {
    console.log(message)
  }
}

const create = async (req, res) => {
  try {
    const { username, email } = req.body;
    const { password } = res.locals;

    const { rows } = await client.query(
      "INSERT INTO users (username, password, email) VALUES($1, $2, $3) RETURNING *",
      [username, password, email]
    );

    const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);

    res.status(200).json({
      message: "Signed up successfully!",
      token: `Bearer ${accessToken}`,
    });
  } catch ({ message }) {
    console.log(message);
  }
};

const list = async (req, res) => {
  try {
    const { rows } = await client.query("SELECT * FROM users");
    res.status(201).json(rows);
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  signup: [
    isUsernameValid,
    isPasswordValid,
    isEmailValid,
    encryptPassword,
    create,
  ],
  list,
};
