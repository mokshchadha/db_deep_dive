 

const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');
const JSONStream = require('JSONStream');
const {TIMESCALEDB, POSTGRES_CACHED } = require('./constants');

 
const pgConfig = {
 ...POSTGRES_CACHED
};

function convertMongoTimestamp(mongoTimestamp) {
  if (mongoTimestamp && mongoTimestamp.$numberLong) {
    const date = new Date(parseInt(mongoTimestamp.$numberLong, 10));
    return date.toISOString();
  }
  return new Date().toISOString();
}

async function migrateOrders(pgClient, doc, id) {
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
    orderNo+id,
    parseInt(quantity),
    parseInt(singleQuantity) ?? 0,
    status,
    supplierId,
  ];

  await pgClient.query(query, values);
}

async function transferActivityLog(pgClient, doc, id) {
  const { orderNo, freightPaymentApplicationDetails } = doc;
  const _id = orderNo + id
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
  const fileContent = await fs.readFile(filePath, 'utf8');
  const orders = JSON.parse(fileContent);

  for(const doc of orders){
    try {
      const id = crypto.randomUUID()
      await migrateOrders(pgClient, doc, id);
      await transferActivityLog(pgClient, doc, id);
    } catch (err) {
      console.error('Error during data migration:', err);
    }
  }

 
  await pgClient.end();
}

transferData().catch(console.error);
