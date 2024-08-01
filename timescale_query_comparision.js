const { POSTGRES } = require('./constants');
const { Client } = require('pg');
 
const pgConfig = {
 ...POSTGRES
};

async function joinQuery(pgClient){
    console.time("join_500_records_timescale")
    await pgClient.query( `select * from orders join activity_log al ON al.order_no = orders.order_no  limit 500`)
    console.timeEnd("join_500_records_timescale")
   

    console.time("join_1000_records_timescale")
    await pgClient.query( `select * from orders join activity_log al ON al.order_no = orders.order_no  limit 1000`)
    console.timeEnd("join_1000_records_timescale")

    console.time("join_10000_records_timescale")
    await pgClient.query( `select * from orders join activity_log al ON al.order_no = orders.order_no  limit 10000`)
    console.timeEnd("join_10000_records_timescale")

    console.time("join_50000_records_timescale")
    await pgClient.query( `select * from orders join activity_log al ON al.order_no = orders.order_no  limit 50000`)
    console.timeEnd("join_50000_records_timescale")
}

async function timeRangeQuery(pgClient){
    const query = `select * from orders o join activity_log al ON al.order_no = o.order_no where o.created_at > '2020-12-01' or o.dispatch_date < '2024-07-01'`
    console.time("range_500_records_timescale")
    await pgClient.query(`${query} limit 500`)
    console.timeEnd("range_500_records_timescale")

    console.time("range_1000_records_timescale")
    await pgClient.query(`${query} limit 1000`)
    console.timeEnd("range_1000_records_timescale")

    console.time("range_10000_records_timescale")
    await pgClient.query(`${query} limit 10000`)
    console.timeEnd("range_10000_records_timescale")

    console.time("range_50000_records_timescale")
    await pgClient.query(`${query} limit 50000`)
    console.timeEnd("range_50000_records_timescale")
}


async function main(){
    const pgClient = new Client(pgConfig);
    await pgClient.connect();
    console.log("join_query=================")
    await joinQuery(pgClient)
    console.log("time_range_query=================")
    await timeRangeQuery(pgClient)

    await pgClient.end();
}

main()