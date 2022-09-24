const client = require("../../db");
const notFound = require("../errors/NotFound");
const bcrypt = require("bcrypt");

function isUsernameValid(req, res, next) {
  const { username } = req.body;

  if (username === "" || username === null) {
    next({
      status: 500,
      message: "username cannot be empty",
    });
  }

  next();
}

function isEmailValid(req, res, next) {
  const { email } = req.body;

  if (email === "" || email === null) {
    next({
      status: 500,
      message: "email cannot be empty",
    });
  }
}

function isPasswordValid(req, res, next) {
  const { password } = req.body;

  if (password === "" || password === null) {
    next({
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
    next({
      status: 500,
      message: "error occurred fetching bcrypt",
    });
  }
}

const create = async (req, res) => {
  try {
    const { username, email } = req.body;
    const { password } = res.locals;

    const { rows } = await client.query(
      "INSERT INTO users (username, password, email) VALUES($1, $2, $3)",
      [username, password, email]
    );
  } catch ({ message }) {
    console.log(message);
  }

  res.status(200).send();
};

module.exports = {
  signUp: [
    isUsernameValid,
    isPasswordValid,
    isEmailValid,
    encryptPassword,
    create,
  ],
};
