// transferData.js

const { MongoClient } = require('mongodb');
const { Client } = require('pg');

// MongoDB connection details
const mongoUri = 'mongodb://localhost:27017';
const mongoDbName = 'your_mongo_db_name';
const mongoCollectionName = 'your_mongo_collection_name';

// PostgreSQL connection details
const pgConfig = {
  user: 'your_pg_user',
  host: 'localhost',
  database: 'your_pg_database',
  password: 'your_pg_password',
  port: 5432,
};

async function migrateOrders(mongoDb, pgClient) {
  // Fetch data from MongoDB
  const mongoCollection = mongoDb.collection(mongoCollectionName);
  const mongoData = await mongoCollection.find().toArray();

  // Insert data into PostgreSQL
  for (const doc of mongoData) {
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
      INSERT INTO your_table_name (
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

async function transferData() {
  // Connect to MongoDB
  const mongoClient = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await mongoClient.connect();
  const mongoDb = mongoClient.db(mongoDbName);

  // Connect to PostgreSQL
  const pgClient = new Client(pgConfig);
  await pgClient.connect();

  try {
    // Migrate data
    await migrateOrders(mongoDb, pgClient);
    console.log('Data transfer complete.');
  } catch (err) {
    console.error('Error during data migration:', err);
  } finally {
    // Close connections
    await pgClient.end();
    await mongoClient.close();
  }
}

transferData().catch(console.error);
