const client = require("../../db");
const notFound = require("../errors/NotFound");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const crypto = require("crypto");

async function doesExist(req, res, next) {
  const { houseId = null } = req.params;
  const house = await client.query("SELECT * FROM houses WHERE id = $1", [
    houseId,
  ]);

  if (house.rows[0] === null || house.rows.length <= 0) {
    next({
      status: 405,
      message: "House does not exist",
    });
  } else {
    res.locals.house = house.rows[0];
    next();
  }
}

function isBodyValid(req, res, next) {
  const {
    bedroom,
    bathroom,
    house_location,
    furnished,
    price,
    offer,
    description,
    parking,
    type,
    image_url,
  } = req.body;

  if (
    bedroom === 0 ||
    bathroom === 0 ||
    house_location === "" ||
    furnished === null ||
    price === 0 ||
    offer === null ||
    description === "" ||
    parking === null ||
    type === "" ||
    image_url === ""
  ) {
    next({
      status: 500,
      message: "Invalid body value",
    });
  }

  next();
}

function isUpdateDataValid(req, res, next) {
  const {
    bedroom = res.locals.house.bedroom,
    bathroom = res.locals.house.bathroom,
    house_location = res.locals.house.house_location,
    furnished = res.locals.house.furnished,
    price = res.locals.house.price,
    offer = res.locals.house.offer,
    description = res.locals.house.description,
    parking = res.locals.house.parking,
    type = res.locals.house.type,
  } = req.body;

  if (house_location === "" || description === "" || type === "") {
    next({
      status: 500,
      message:
        "Invalid value type. location, description and type cannot be empty",
    });
  } else if (bedroom === 0 || bathroom === 0 || price === 0) {
    next({
      status: 500,
      message: "Invalid value type. bedroom, bathroom and price cannot be 0",
    });
  }

  // check if value is a boolean
  if (
    typeof furnished !== "boolean" ||
    typeof offer !== "boolean" ||
    typeof parking !== "boolean"
  ) {
    next({
      status: 500,
      message:
        "Invalid value type. furnished, offer and parking must be boolean",
    });
  }

  next();
}

const list = async (req, res) => {
  try {
    const allCars = await client.query("SELECT * FROM houses");
    res.status(200).json(allCars.rows);
  } catch (err) {
    console.error(err.message);
  }
};

async function getQueryValue(req, res, next) {
  const { cityState } = req.query;
  if (cityState) {
    try {
      const getHouse = await client.query("SELECT * FROM houses");
      return res.json(getHouse.rows);
    } catch ({ message }) {
      return next({
        status: 500,
        message,
      });
    }
  }

  next();
}

function verifyAuthToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;

    next();
  });
}

const create = async (req, res, next) => {
  try {
    const {
      bedroom,
      bathroom,
      house_location,
      furnished,
      price,
      offer,
      description,
      parking,
      type,
      image_url,
    } = req.body;

    const id = crypto.randomUUID();

    const newHouse = await client.query(
      "INSERT INTO houses (bedroom, bathroom, house_location, furnished, price, offer, description, parking, type, image_url, listingId) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        bedroom,
        bathroom,
        house_location,
        furnished,
        price,
        offer,
        description,
        parking,
        type,
        image_url,
        id,
      ]
    );
    res
      .status(201)
      .json({ msg: "house added successfully", newHouse: newHouse.rows[0] });
  } catch ({ message }) {
    console.error(`Error: ${message}`);
    next({
      status: 500,
      message: `error: ${message}`,
    });
  }
};

const read = async (req, res, next) => {
  res.json(res.locals.house);
};

const destroy = async (req, res) => {
  try {
    const { houseId } = req.params;
    const house = await client.query("DELETE FROM houses WHERE id = $1", [
      houseId,
    ]);
    res.status(201).json({ message: `House ID:${houseId} was was deleted ` });
  } catch ({ message }) {
    console.log(`error!! ${message}`);
  }
};

const update = async (req, res) => {
  try {
    const { houseId } = req.params;

    const {
      bedroom = res.locals.house.bedroom,
      bathroom = res.locals.house.bathroom,
      house_location = res.locals.house.house_location,
      furnished = res.locals.house.furnished,
      price = res.locals.house.price,
      offer = res.locals.house.offer,
      description = res.locals.house.description,
      parking = res.locals.house.parking,
      type = res.locals.house.type,
      image_url = res.locals.house.image_url,
    } = req.body;

    const houseData = await client.query(
      "UPDATE houses SET bedroom = $1, bathroom = $2, house_location = $3, furnished = $4, price = $5, offer = $6, description = $7, parking = $8, type = $9, image_url = $10 WHERE id = $11 ",
      [
        bedroom,
        bathroom,
        house_location,
        furnished,
        price,
        offer,
        description,
        parking,
        type,
        image_url,
        houseId,
      ]
    );

    res.status(201).json({ message: `House ID: ${houseId} was was updated ` });
  } catch ({ message }) {
    console.log(`error!! ${message}`);
  }
};

module.exports = {
  list: [getQueryValue, list],
  create: [verifyAuthToken, isBodyValid, create],
  read: [doesExist, read],
  update: [verifyAuthToken, doesExist, isUpdateDataValid, update],
  destroy: [verifyAuthToken, doesExist, destroy],
};
