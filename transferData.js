// transferData.js

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream');
const { POSTGRES } = require('./constants');

// PostgreSQL connection details
const pgConfig = {
 ...POSTGRES
};

function convertMongoTimestamp(mongoTimestamp) {
  if (mongoTimestamp && mongoTimestamp.$numberLong) {
    const date = new Date(parseInt(mongoTimestamp.$numberLong, 10));
    return date.toISOString();
  }
  return new Date().toISOString();
}

async function migrateOrders(pgClient, doc) {
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
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
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
    orderNo,
    parseInt(quantity),
    parseInt(singleQuantity) ?? 0,
    status,
    supplierId,
  ];

  await pgClient.query(query, values);
}

async function transferActivityLog(pgClient, doc) {
  const { orderNo, freightPaymentApplicationDetails } = doc;
  const _id = orderNo
  const rest = freightPaymentApplicationDetails ?? {}

  const query = `
    INSERT INTO activity_log (
      order_no, data
    ) VALUES (
      $1, $2
    )
  `;

  const values = [
    _id, rest
  ];

  await pgClient.query(query, values);
}

async function transferData() {
  // Connect to PostgreSQL
  const pgClient = new Client(pgConfig);
  await pgClient.connect();

 
  const filePath = path.join(__dirname, 'order_tasks.json');
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

  const jsonStream = JSONStream.parse('*');

  stream.pipe(jsonStream);

  jsonStream.on('data', async (doc) => {
    try {
      await migrateOrders(pgClient, doc);
      await transferActivityLog(pgClient, doc);
    } catch (err) {
      console.error('Error during data migration:', err);
    }
  });

  jsonStream.on('end', async () => {
    console.log('Data transfer complete.');
    await pgClient.end();
  });

  jsonStream.on('error', async (err) => {
    console.error('Error during data migration:', err);
    await pgClient.end();
  });
}

transferData().catch(console.error);
