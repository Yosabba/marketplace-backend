const client = require("../../db");
const notFound = require("../errors/NotFound");
const bcrypt = require("bcrypt");

function isUsernameValid(req, res, next) {
  const { username } = req.body;

  if (username === "") {
    return next({
      status: 500,
      message: "Username cannot be empty",
    });
  }
  next();
}

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

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const { rows } = await client.query(
      "SELECT username, password FROM users WHERE username = $1 ",
      [username]
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

    res.status(200).send("logged in");
  } catch ({ message }) {
    console.log(message);
  }
}

module.exports = {
  login: [isUsernameValid, isPasswordValid, login],
};
