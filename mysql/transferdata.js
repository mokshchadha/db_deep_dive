const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const { MYSQL } = require('../constants'); // Ensure you have MYSQL details in constants.js

// MySQL connection details
const mysqlConfig = {
  ...MYSQL
};

function convertMongoTimestamp(mongoTimestamp) {
  if (mongoTimestamp && mongoTimestamp.$numberLong) {
    const date = new Date(parseInt(mongoTimestamp.$numberLong, 10));
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

async function migrateOrders(mysqlConnection, doc, id) {
  const {
    _id,
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

  await mysqlConnection.execute(query, values);
}

async function transferActivityLog(mysqlConnection, doc, id) {
  const { orderNo, freightPaymentApplicationDetails } = doc;
  const _id = orderNo + id;
  const rest = freightPaymentApplicationDetails ?? {};

  const query = `
    INSERT INTO activity_log (
      order_no, data
    ) VALUES (
      ?, ?
    )
  `;

  const values = [
    _id, JSON.stringify(rest)
  ];

  await mysqlConnection.execute(query, values);
}

async function transferData() {
  // Connect to MySQL
  const mysqlConnection = await mysql.createConnection(mysqlConfig);

  const filePath = path.join(__dirname.replace('mysql', ''), 'order_tasks.json');
  const fileContent = await fs.readFile(filePath, 'utf8');
  const orders = JSON.parse(fileContent);

  for (const doc of orders) {
    try {
      const id = crypto.randomUUID()
      await migrateOrders(mysqlConnection, doc, id);
      await transferActivityLog(mysqlConnection, doc, id);
    } catch (err) {
      console.error('Error during data migration:', err);
    }
  }

  await mysqlConnection.end();
}

transferData().catch(console.error);
