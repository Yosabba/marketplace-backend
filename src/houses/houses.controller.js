const client = require("../../db");
const notFound = require("../errors/NotFound");

const doesExist = async (req, res, next) => {
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
    res.locals.house = house.rows;
    next();
  }
};

const list = async (req, res) => {
  try {
    const allCars = await client.query("SELECT * FROM houses");
    res.json(allCars.rows);
  } catch (err) {
    console.error(err.message);
  }
};

const create = async (req, res, next) => {
  try {
    const {
      bedroom,
      bathroom,
      house_location,
      furnished,
      price,
      offer,
      _description,
      parking,
      _type,
    } = req.body;

    const newHouse = await client.query(
      "INSERT INTO houses (bedroom, bathroom, house_location, furnished, price, offer, _description, parking, _type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        bedroom,
        bathroom,
        house_location,
        furnished,
        price,
        offer,
        _description,
        parking,
        _type,
      ]
    );
    res.json({ msg: "house added successfully", newHouse: newHouses.rows[0] });
  } catch ({ message }) {
    console.error(`Error: ${message}`);
    next({
      status: 500,
      message: `error: ${message}`,
    });
  }
};

const read = async (req, res, next) => {
  // try {
  //   const { houseId } = req.params;
  //   const house = await client.query("SELECT * FROM houses WHERE id = $1", [
  //     houseId,
  //   ]);

  //   res.json(house.rows[0]);
  // } catch ({ message }) {
  //   console.error(`Error: ${message}`);
  //   next({
  //     status: 500,
  //     message: `error: ${message}`,
  //   });
  // }
  res.json(res.locals.house);
};

const destroy = async (req, res) => {
  try {
    const { houseId } = req.params;
    const house = await client.query("DELETE FROM houses WHERE id = $1", [
      houseId,
    ]);
    res.json({ message: `House ID:${houseId} was was deleted ` });
  } catch ({ message }) {
    console.log(`error!! ${message}`);
  }
};

const update = async (req, res) => {
  try {
    const { houseId } = req.params;
    const {
      bedroom,
      bathroom,
      house_location,
      furnished,
      price,
      offer,
      _description,
      parking,
      _type,
    } = req.body;

    const houseData = await client.query(
      "UPDATE houses SET bedroom = $1, bathrooms = $2, house_location = $3, furnished = $4, price = $5, offer = $6, _description = $7, parking = $8, _type = $9, WHERE id = $10 ",
      [
        bedroom,
        bathroom,
        house_location,
        furnished,
        price,
        offer,
        _description,
        parking,
        _type,
        id,
      ]
    );
    res.json({ status: 201, message: `House ID:${houseId} was was updated ` });
  } catch ({ message }) {
    console.log(`error!! ${message}`);
  }
};

module.exports = {
  list,
  create,
  read: [doesExist, read],
  update,
  destroy,
};
