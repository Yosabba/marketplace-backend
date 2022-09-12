const { Client } = require("pg");

const client = new Client(`${process.env.PORT}`);

module.exports = client;
