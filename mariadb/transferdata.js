const mariadb = require('mariadb');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
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

function convertMongoTimestamp(mongoTimestamp) {
  if (mongoTimestamp && mongoTimestamp.$numberLong) {
    const date = new Date(parseInt(mongoTimestamp.$numberLong, 10));
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

async function migrateOrders(connection, doc, id) {
  const {
    buyerDueDate,
    buyerPaymentTerms,
    companyGST,
    createdAt,
    dispatchDate,
    dueDate,
    freightPayment,
    godownId,
    groupStateOwner,
    orderNo,
    quantity,
    singleQuantity,
    status,
    supplierId,
  } = doc;

  const query = `
    INSERT INTO orders (
       buyer_due_date, buyer_payment_terms, company_gst, created_at, dispatch_date, due_date,
      freight_payment, godown_id, group_state_owner, order_no, quantity, single_quantity, status, supplier_id
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `;

  const values = [
    convertMongoTimestamp(buyerDueDate),
    buyerPaymentTerms,
    companyGST,
    convertMongoTimestamp(createdAt),
    convertMongoTimestamp(dispatchDate),
    convertMongoTimestamp(dueDate),
    freightPayment,
    godownId,
    groupStateOwner,
    orderNo + id,
    parseInt(quantity),
    parseInt(singleQuantity) ?? 0,
    status,
    supplierId,
  ];

  await connection.execute(query, values);
}

async function transferActivityLog(connection, doc, id) {
  const { orderNo, freightPaymentApplicationDetails } = doc;
  const _id = orderNo + id;
  const rest = freightPaymentApplicationDetails ?? {};

  const query = `
    INSERT INTO activity_log (
      order_id, data
    ) VALUES (
      ?, ?
    )
  `;

  const values = [
    _id, JSON.stringify(rest)
  ];

  await connection.execute(query, values);
}

async function transferData() {
  let connection;
  try {
    connection = await pool.getConnection();

    const filePath = path.join(__dirname.replace('mariadb', ''), 'order_tasks.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const orders = JSON.parse(fileContent);

    for (const doc of orders) {
      try {
        const id = crypto.randomUUID();
        await migrateOrders(connection, doc, id);
        await transferActivityLog(connection, doc, id);
      } catch (err) {
        console.error('Error during data migration:', err);
      }
    }
  } catch (err) {
    console.error('Error connecting to the database:', err);
  } finally {
    if (connection) connection.end();
  }
}

transferData().catch(console.error);
