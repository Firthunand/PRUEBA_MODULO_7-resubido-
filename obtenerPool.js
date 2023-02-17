const { Pool } = require("pg");
require("dotenv").config();

const config = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
    max: process.env.PG_MAX ,
    idleTimeoutMillis: process.env.PG_IDLE_TIMEOUT_MILLIS ,
    connectionTimeoutMillis: process.env.PG_CONNECTION_TIMEOUT_MILLIS,
}

const pool = new Pool(config);

module.exports = {
    pool
}