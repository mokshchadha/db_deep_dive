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

async function processLargeCSV(filePath, batchSize = 10000) {
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

async function insertBatch(client, batch) {
  const query = format(
    `INSERT INTO real_chats_partitioned (
      sys_msg_id, message_id, from_no, to_no, sender_name,
      event_direction, received_at, event_type, contextual_message_id,
      template_id, content_type, message_text, media, cta, placeholders
    ) VALUES %L`,
    batch
  );

  await client.query(query);
}

function formatRowObject(row) {
  return [
    row.sys_msg_id,
    row.message_id,
    row.from_no,
    row.to_no,
    row.sender_name,
    row.event_direction,
    handleEmptyTimestamp(row.received_at),
    row.event_type,
    row.contextual_message_id,
    row.template_id,
    row.content_type,
    row.message_text,
    handleJSONB(row.media),
    handleJSONB(row.cta),
    handleJSONB(row.placeholders)
  ];
}

function handleEmptyTimestamp(value) {
  return value === "" ? null : value;
}

function handleJSONB(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  try {
    return JSON.stringify(JSON.parse(value));
  } catch (e) {
    console.warn(`Invalid JSON: ${value}`);
    return null;
  }
}

processLargeCSV("production_chats.csv").catch(console.error);