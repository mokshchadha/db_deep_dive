const {POSTGRES} = require("./constants")
const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');

const pgConfig = {
 ...POSTGRES
};

async function migrateOrders(pgClient, orders ) {
 
  for (const doc of orders) {
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
        id, buyer_due_date, buyer_payment_terms, company_gst, created_at, dispatch_date, due_date,
        freight_payment, godown_id, group_state_owner, order_no, quantity, single_quantity, status, supplier_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      )
    `;

    const values = [
      _id, buyerDueDate, buyerPaymentTerms, companyGST, createdAt, dispatchDate, dueDate,
      freightPayment, godownId, groupStateOwner, orderNo, quantity, singleQuantity, status, supplierId,
    ];

    await pgClient.query(query, values);
  }
}

async function transferActivityLog(pgClient, orders) {
  for (const doc of orders) {
    const { orderId, activityLog } = doc;

    const query = `
      INSERT INTO activity_log (
        order_id, data
      ) VALUES (
        $1, $2
      )
    `;

    const values = [
      orderId, activityLog
    ];

    await pgClient.query(query, values);
  }
}

async function transferData() {
  const pgClient = new Client(pgConfig);
  await pgClient.connect();

  const filePath = path.join(__dirname, 'orders.json');
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
