const fs = require("fs");
const { Pool } = require("pg");
const { parse } = require("csv-parse");
const format = require("pg-format");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "",
  port: 5432,
});

async function processLargeCSV(filePath, batchSize = 100000) {
  const client = await pool.connect();
  let batch = [];
  let lineCount = 0;

  try {
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
    });

    const stream = fs.createReadStream(filePath).pipe(parser);

    for await (const row of stream) {
      batch.push(formatRowObject(row));
      lineCount++;

      if (batch.length >= batchSize) {
        await insertBatch(client, batch);
        batch = [];
        console.log(`Processed ${lineCount} lines`);
      }
    }

    if (batch.length > 0) {
      await insertBatch(client, batch);
    }

    console.log(
      `CSV processing completed. Total lines processed: ${lineCount}`
    );
  } catch (err) {
    console.error("Error processing CSV:", err);
  } finally {
    client.release();
  }
}

processLargeCSV("wabachat.csv").catch(console.error);

///=====================================

async function insertBatch(client, batch) {
  const query = format(
    "INSERT INTO wabachats (previous_date, todays_date, person_name, received_at, status_description, waba_link, whatsapp_number, status_previous_date, group_name) VALUES %L",
    batch
  );

  await client.query(query);
}

function formatRowObject(row) {
  return [
    handleEmptyTimestamp(row.Previous_date),
    handleEmptyTimestamp(row.Date),
    row.personName,
    handleEmptyTimestamp(row.received_at),
    row.status_description,
    row.wabalink,
    row.whatsappNumber,
    row.status_Previous_date,
    row.groupName,
  ];
}

function handleEmptyTimestamp(value) {
  return value === "" ? null : value;
}
