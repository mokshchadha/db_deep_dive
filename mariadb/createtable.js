const mariadb = require('mariadb');
const { MARIA_DB } = require('../constants'); // Ensure you have MYSQL details in constants.js

const pool = mariadb.createPool({
  host: MARIA_DB.host,
  port: MARIA_DB.port || 3344,
  user: MARIA_DB.user,
  password: MARIA_DB.password,
  database: MARIA_DB.database,
  connectionLimit: 5
});

const createTables = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
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
        aid INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(255),
        data JSON,
        FOREIGN KEY (order_id) REFERENCES orders(order_no)
      );
    `);

    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error creating tables', err.stack);
  } finally {
    if (connection) connection.release(); // Ensure the connection is properly closed
  }
};

createTables().catch((err) => {
  console.error('Error connecting to the database', err.stack);
});
