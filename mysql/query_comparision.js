const mysql = require('mysql2/promise');
const { MYSQL } = require('../constants');

// MySQL connection details
const mysqlConfig = {
  ...MYSQL
};

async function joinQuery(mysqlConnection){
    const query = `SELECT * FROM orders JOIN activity_log al ON al.order_no = orders.order_no`;
    
    console.time("join_500_records_mysql");
    await mysqlConnection.query(`${query} LIMIT 500`);
    console.timeEnd("join_500_records_mysql");

    console.time("join_1000_records_mysql");
    await mysqlConnection.query(`${query} LIMIT 1000`);
    console.timeEnd("join_1000_records_mysql");

    console.time("join_10000_records_mysql");
    await mysqlConnection.query(`${query} LIMIT 10000`);
    console.timeEnd("join_10000_records_mysql");

    console.time("join_50000_records_mysql");
    await mysqlConnection.query(`${query} LIMIT 50000`);
    console.timeEnd("join_50000_records_mysql");
}

async function timeRangeQuery(mysqlConnection){
    const query = `SELECT * FROM orders o JOIN activity_log al ON al.order_no = o.order_no WHERE o.created_at > '2020-12-01' OR o.dispatch_date < '2024-07-01'`;
    
    console.time("range_500_records_mysql");
    await mysqlConnection.query(`${query} LIMIT 500`);
    console.timeEnd("range_500_records_mysql");

    console.time("range_1000_records_mysql");
    await mysqlConnection.query(`${query} LIMIT 1000`);
    console.timeEnd("range_1000_records_mysql");

    console.time("range_10000_records_mysql");
    await mysqlConnection.query(`${query} LIMIT 10000`);
    console.timeEnd("range_10000_records_mysql");

    console.time("range_50000_records_mysql");
    await mysqlConnection.query(`${query} LIMIT 50000`);
    console.timeEnd("range_50000_records_mysql");
}

async function main(){
    const mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log("join_query=================");
    await joinQuery(mysqlConnection);
    console.log("time_range_query=================");
    await timeRangeQuery(mysqlConnection);

    await mysqlConnection.end();
}

main().catch(console.error);
