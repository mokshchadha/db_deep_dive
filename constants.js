const TIMESCALEDB = {
  user: "postgres",
  host: "localhost",
  database: "pod",
  password: "_WLy_lbUbtWiC7Yzs-lA6SWfrirmOmlI",
  port: 5433,
};

const TIMESCALEDB_CACHED = {
  user: "postgres",
  host: "localhost",
  database: "pod_cached",
  password: "_WLy_lbUbtWiC7Yzs-lA6SWfrirmOmlI",
  port: 5434,
};

const POSTGRES = {
  user: "myuser",
  host: "localhost",
  database: "mydatabase",
  password: "mypassword",
  port: 5499,
};

const POSTGRES_CACHED = {
  user: "myuser",
  host: "localhost",
  database: "cached_database",
  password: "password",
  port: 5435,
};

const MYSQL = {
  host: "localhost",
  user: "myuser",
  password: "mypassword",
  database: "mydatabase",
  port: 3333,
};

const MARIA_DB = {
  host: 'localhost',
  port: 3344,
  user: 'myuser',
  password: 'mypassword',
  database: 'mydatabase'
};

module.exports = {
  TIMESCALEDB,
  TIMESCALEDB_CACHED,
  POSTGRES,
  POSTGRES_CACHED,
  MYSQL,
  MARIA_DB
};
