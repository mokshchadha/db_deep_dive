const mysql = require('mysql2/promise');
const { MYSQL } = require('../constants'); // Ensure you have MYSQL details in constants.js

const mysqlClient = mysql.createPool({
  ...MYSQL,
});

const createTables = async () => {
  const connection = await mysqlClient.getConnection();
  try {
    await connection.query('DROP TABLE IF EXISTS orders CASCADE');
    await connection.query('DROP TABLE IF EXISTS activity_log');
    console.log('Dropping of tables completed');
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
        quantity INT,
        single_quantity INT,
        status VARCHAR(50),
        supplier_id VARCHAR(255)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_no VARCHAR(255),
        data JSON
      );
    `);

    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error creating tables', err.stack);
  } finally {
    connection.release(); // Ensure the connection is properly closed
  }
};

createTables().catch((err) => {
  console.error('Error connecting to the database', err.stack);
});
