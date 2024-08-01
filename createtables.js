const { Client } = require("pg");
const { POSTGRES, TIMESCALEDB } = require("./constants");

const pgClient = new Client({
  ...TIMESCALEDB,
});

const createTables = async () => {
  await pgClient.connect();
  try {
    await pgClient.query('drop table if exists orders cascade')
    await pgClient.query('drop table if exists activity_log')
    console.log("dropping of table completed ")
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        buyer_due_date DATE,
        buyer_payment_terms VARCHAR(255),
        company_gst VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        dispatch_date DATE,
        due_date DATE,
        freight_payment VARCHAR(255),
        godown_id VARCHAR(255),
        group_state_owner VARCHAR(255),
        order_no VARCHAR(255) UNIQUE,
        quantity INTEGER,
        single_quantity INTEGER,
        status VARCHAR(50),
        supplier_id VARCHAR(255)
      );
    `);


    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id SERIAL PRIMARY KEY,
        order_no VARCHAR(255) REFERENCES orders(order_no),
        data JSONB
      );
    `);

    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables", err.stack);
  } finally {
    await pgClient.end(); // Ensure the connection is properly closed
  }
};

createTables().catch((err) => {
  console.error("Error connecting to the database", err.stack);
});
