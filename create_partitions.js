const { Pool } = require('pg');
const { format, toDate } = require('date-fns');

const pool = new Pool({
  host: 'localhost',
  database: 'postgres',
  user: 'postgres',
  password: ''
});

async function createPartitionedTable() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS realchats_partitioned (
    previous_date            timestamp without time zone,
    todays_date             timestamp without time zone,
    person_name               varchar(255),
    received_at              timestamp without time zone,
    status_description        varchar(255),
    waba_link                  varchar(255),
    whatsapp_number            varchar(25),
    status_previous_date      varchar(255),
    group_name                 varchar(255)
      ) PARTITION BY RANGE (received_at);
    `);

    const dateRangeResult = await client.query(`
      SELECT 
        DATE_TRUNC('day', MIN(received_at::timestamp)) AS min_date,
        DATE_TRUNC('day', MAX(received_at::timestamp)) AS max_date
      FROM wabachats;
    `);
    const { min_date, max_date } = dateRangeResult.rows[0];

    const nextYearEnd = new Date(new Date().getFullYear() + 1, 11, 31);
    const endDate = max_date < nextYearEnd ? nextYearEnd : max_date;

    console.log(`Creating partitions from ${min_date} to ${endDate}`);
    let currentDate = new Date(min_date);
    while (currentDate <= endDate) {
      const partitionName = `wabachats_partitioned_p${format(currentDate, 'yyyyMMdd')}`;
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      const fromDate = format(currentDate, 'yyyy-MM-dd')
      const toDate = format(nextDate, 'yyyy-MM-dd')
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${partitionName}
        PARTITION OF wabachats_partitioned
        FOR VALUES FROM ('${fromDate}') TO ('${toDate}');
      `);

      await client.query(`
        CREATE Index wa_idx_${partitionName}
        on ${partitionName} (whatsapp_number);
      `)

      await client.query(`
        CREATE INDEX pn_idx_${partitionName}
        ON ${partitionName} USING GIN (to_tsvector('simple', person_name));
    `);

      console.log(`Created partition index: ${partitionName}`);
      currentDate = nextDate;
    }

  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

createPartitionedTable();