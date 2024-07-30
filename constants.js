
const TIMESCALEDB = {
    user: 'postgres',
    host: 'localhost',
    database: 'pod',
    password: '_WLy_lbUbtWiC7Yzs-lA6SWfrirmOmlI',
    port: 5433,  
  };
  
  const TIMESCALEDB_CACHED = {
    user: 'postgres',
    host: 'localhost',
    database: 'pod_cached',
    password: '_WLy_lbUbtWiC7Yzs-lA6SWfrirmOmlI',
    port: 5434, 
  };
  
  const POSTGRES = {
    user: 'postgres',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,  
  };
  
  const POSTGRES_CACHED = {
    user: 'postgres',
    host: 'localhost',
    database: 'your_cached_database',
    password: 'your_password',
    port: 5435,  
  };
  

  module.exports = {
    TIMESCALEDB, 
    TIMESCALEDB_CACHED,
    POSTGRES,
    POSTGRES_CACHED
  }