const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "",
  port: 5432,
});

async function runQueries() {
  const client = await pool.connect();

  try {
    console.log("\n");
    await simpleTableQueries(client);
    console.log("\n");
    await partitionedTableQueries(client);
    console.log();
    const baseQuery = "select * from wabachats w where w.received_at > '2024-01-16'and  to_tsvector('simple', person_name) @@ to_tsquery('simple', 'swap')"
    await simpleTableQueries(client, baseQuery);
    await partitionedTableQueries(client, baseQuery)
  } catch (err) {
    console.error("Error executing query", err.stack);
  } finally {
    client.release();
  }

  // Close the pool
  await pool.end();
}

runQueries().catch((err) => console.error(err));
//========================= raw queries

async function simpleTableQueries(
  client,
  baseQuery = "select * from wabachats w where w.received_at > '2024-01-16'and whatsapp_number = '9873089003'"
) {
  console.log("Running queries on Simple table")
  console.log("Base query ", baseQuery)
  
  console.log()
  const query1 = `${baseQuery} limit 100;`;
  await queryTime(client, query1, "limit_100");

  const query2 = `${baseQuery} limit 500;`;
  await queryTime(client, query2, "limit_200");

  const query3 = `${baseQuery} limit 1000;`;
  await queryTime(client, query3, "limit_1000");

  const query4 = `${baseQuery} limit 5000;`;
  await queryTime(client, query4, "limit_5000");

  const query5 = `${baseQuery} limit 10000;`;
  await queryTime(client, query5, "limit_10000");
}

async function partitionedTableQueries(
  client,
  baseQuery = "select * from wabachats_partitioned w where w.received_at > '2024-01-16'and whatsapp_number = '9873089003'"
) {
  console.log("Running queries on partitoned table")
  console.log("Base query ", baseQuery)
  
  console.log()
  const query1 = `${baseQuery} limit 100;`;
  await queryTime(client, query1, "limit_100");

  const query2 = `${baseQuery} limit 500;`;
  await queryTime(client, query2, "limit_200");

  const query3 = `${baseQuery} limit 1000;`;
  await queryTime(client, query3, "limit_1000");

  const query4 = `${baseQuery} limit 5000;`;
  await queryTime(client, query4, "limit_5000");

  const query5 = `${baseQuery} limit 10000;`;
  await queryTime(client, query5, "limit_10000");
}

async function queryTime(client, queryString, tag) {
  const id = "";
  const tagId = tag ? tag + ` ${id}` : id;
  console.time(tagId);
  await client.query(`
     ${queryString}
    `);
  console.timeEnd(tagId);
}
