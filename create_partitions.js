const { Client } = require('pg');

const createPartitionedTable = async () => {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "",
    port: 5432,
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    // Create the main table
    await client.query(`
      CREATE TABLE IF NOT EXISTS real_chats_partitioned (
        id serial,
        sys_msg_id varchar(100),
        message_id varchar(100),
        from_no varchar(20),
        to_no varchar(20),
        sender_name varchar(200),
        event_direction varchar(20),
        received_at timestamp,
        event_type varchar(255),
        contextual_message_id varchar(255),
        template_id varchar(255),
        content_type varchar(255),
        message_text text,
        media jsonb,
        cta jsonb,
        placeholders jsonb,
        tsv_document tsvector,
        PRIMARY KEY (id, received_at)
      ) PARTITION BY RANGE (received_at);
    `);
    console.log('Main table created');

    // Create the trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION real_chats_partitioned_trigger_function()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.tsv_document = 
          setweight(to_tsvector('english', coalesce(NEW.template_id, '')), 'A') ||
          setweight(to_tsvector('english', coalesce(NEW.from_no, '')), 'B') ||
          setweight(to_tsvector('english', coalesce(NEW.to_no, '')), 'B') ||
          setweight(to_tsvector('english', coalesce(NEW.message_text, '')), 'C');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('Trigger function created');

    // Create the trigger
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'real_chats_partitioned_tsvector_update') THEN
          CREATE TRIGGER real_chats_partitioned_tsvector_update
          BEFORE INSERT OR UPDATE ON real_chats_partitioned
          FOR EACH ROW EXECUTE FUNCTION real_chats_partitioned_trigger_function();
        END IF;
      END $$;
    `);
    console.log('Trigger created if it did not exist');

    // Generate and create partitions
    const endDate = new Date(); // Current date
    const startDate = new Date('2019-01-01'); // Start from 2019 to cover your existing data

    let currentDate = new Date(startDate);
    let partitionsCreated = 0;

    while (currentDate <= endDate) {
      const partitionStartDate = currentDate.toISOString().split('T')[0];
      currentDate.setDate(currentDate.getDate() + 1); // Move to next day
      const partitionEndDate = currentDate.toISOString().split('T')[0];
      
      const partitionName = `real_chats_partitioned_${partitionStartDate.replace(/-/g, '_')}`;
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${partitionName} PARTITION OF real_chats_partitioned
        FOR VALUES FROM ('${partitionStartDate}') TO ('${partitionEndDate}');
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS ${partitionName}_from_no_idx ON ${partitionName} (from_no);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS ${partitionName}_tsv_document_idx ON ${partitionName} USING gin (tsv_document);
      `);

      partitionsCreated++;
      if (partitionsCreated % 30 === 0) {
        console.log(`${partitionsCreated} partitions created...`);
      }
    }

    console.log(`All partitions created successfully. Total partitions: ${partitionsCreated}`);

    // Create a catch-all partition for any future dates
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const futureStartDate = nextDay.toISOString().split('T')[0];

    await client.query(`
      CREATE TABLE IF NOT EXISTS real_chats_partitioned_future PARTITION OF real_chats_partitioned
      FOR VALUES FROM ('${futureStartDate}') TO (MAXVALUE);
    `);
    console.log('Catch-all partition for future dates created');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('Disconnected from the database');
  }
};

createPartitionedTable();