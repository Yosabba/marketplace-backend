const client = require("../../db");
const notFound = require("../errors/NotFound");
const bcrypt = require("bcrypt");

function isUsernameValid(req, res, next) {
  const { username } = req.body;

  if (username === "") {
    next({
      status: 500,
      message: "Invalid body value",
    });
  }

  next();
}

function isPasswordValid(req, res, next) {
  const { password } = req.body;

  if (password === "") {
    next({
      status: 500,
      message: "Invalid body value",
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

async function login(req, res, next) {}

const create = (req, res) => {
  const { username } = req.body;
  const { password } = res.locals;

  console.log({ username, password });

  res.status(200).send();
};

module.exports = {
  signUp: [isUsernameValid, isPasswordValid, encryptPassword, create],
};
