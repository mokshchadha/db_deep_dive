const mariadb = require('mariadb');
const { MARIA_DB } = require('../constants'); // Ensure you have MYSQL details in constants.js

// MariaDB connection details
const pool = mariadb.createPool({
  host: MARIA_DB.host,
  port: MARIA_DB.port || 3344,
  user: MARIA_DB.user,
  password: MARIA_DB.password,
  database: MARIA_DB.database,
  connectionLimit: 5
});

async function joinQuery(connection) {
    const query = `SELECT * FROM orders JOIN activity_log al ON al.order_id = orders.order_no`;
    
    console.time("join_500_records_mariadb");
    await connection.query(`${query} LIMIT 500`);
    console.timeEnd("join_500_records_mariadb");

    console.time("join_1000_records_mariadb");
    await connection.query(`${query} LIMIT 1000`);
    console.timeEnd("join_1000_records_mariadb");

    console.time("join_10000_records_mariadb");
    await connection.query(`${query} LIMIT 10000`);
    console.timeEnd("join_10000_records_mariadb");

    console.time("join_50000_records_mariadb");
    await connection.query(`${query} LIMIT 50000`);
    console.timeEnd("join_50000_records_mariadb");

    console.time("join_100000_records_mariadb");
    await connection.query(`${query} LIMIT 100000`);
    console.timeEnd("join_100000_records_mariadb");
}

async function timeRangeQuery(connection) {
    const query = `SELECT * FROM orders o JOIN activity_log al ON al.order_id = o.order_no WHERE o.created_at > '2020-12-01' OR o.dispatch_date < '2024-07-01'`;
    
    console.time("range_500_records_mariadb");
    await connection.query(`${query} LIMIT 500`);
    console.timeEnd("range_500_records_mariadb");

    console.time("range_1000_records_mariadb");
    await connection.query(`${query} LIMIT 1000`);
    console.timeEnd("range_1000_records_mariadb");

    console.time("range_10000_records_mariadb");
    await connection.query(`${query} LIMIT 10000`);
    console.timeEnd("range_10000_records_mariadb");

    console.time("range_50000_records_mariadb");
    await connection.query(`${query} LIMIT 50000`);
    console.timeEnd("range_50000_records_mariadb");

    console.time("range_100000_records_mariadb");
    await connection.query(`${query} LIMIT 100000`);
    console.timeEnd("range_100000_records_mariadb");
}

async function main() {
    console.log("===============MariaDB=====================");
    let connection;
    try {
        connection = await pool.getConnection();
        console.log("join_query=================");
        await joinQuery(connection);
        console.log("time_range_query=================");
        await timeRangeQuery(connection);
    } catch (err) {
        console.error('Error during data migration:', err);
    } finally {
        if (connection) connection.end();
    }
}

main().catch(console.error);
