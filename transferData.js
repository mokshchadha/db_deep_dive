 

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
    transitDistance,
    supplierPrice,
    godown,
    deliveredTo, 
    productId,
    zcrmId,
    vehicleNo,
    lrNo,
    driverMobileNo,
    purchaseOrderNo,
  } = doc;

  const fomattedPrice = isNaN(parseInt(supplierPrice)) ? 0 : parseInt(supplierPrice)

  const query = `
    INSERT INTO orders (
       buyer_due_date, buyer_payment_terms, company_gst, created_at, dispatch_date, due_date,
      freight_payment, godown_id, group_state_owner, order_no, quantity, single_quantity, status, 
      supplier_id, transit_distance, supplier_price, godown, delivered_to , product_id,
      zcrm_id, vehicle_no, lr_no, driver_mobile_no, purchase_order_no
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
      $17 , $18, $19, $20, $21, $22, $23, $24
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
    transitDistance,
    fomattedPrice,
    godown,
    deliveredTo, 
    productId,
    zcrmId,
    vehicleNo,
    lrNo,
    driverMobileNo,
    purchaseOrderNo,
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

async function transferNotes(pgClient, doc, id) {
  const { orderNo, notes } = doc;
  const _id = orderNo + id
  const rest = {notes} ?? {}

  const query = `
    INSERT INTO notes (
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
      await transferNotes(pgClient, doc, id)
    } catch (err) {
      console.error('Error during data migration:', err);
    }
  }

 
  await pgClient.end();
}

transferData().catch(console.error);
