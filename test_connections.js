const { Client } = require("pg");
const {
  TIMESCALEDB, //works
  TIMESCALEDB_CACHED,
  POSTGRES, // works
  POSTGRES_CACHED,
} = require("./constants");

const DB = {
  ...TIMESCALEDB_CACHED,
 
};

const clientPostgresCached = new Client(DB);

clientPostgresCached
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL with cache");
    return clientPostgresCached.query("SELECT NOW()"); // Simple test query
  })
  .then((res) => {
    console.log("Query result:", res.rows[0]);
  })
  .catch((err) => {
    console.error("Connection error", err.stack);
  })
  .finally(() => clientPostgresCached.end());
