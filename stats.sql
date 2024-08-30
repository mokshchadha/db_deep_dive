-- show block size of the db
SHOW block_size;

-- show segment size of the db
SHOW segment_size;

-- Query to show compression settings
SELECT name, setting 
FROM pg_settings 
WHERE name LIKE '%compress%';

-- Query to show indexes on all partitions of a partitioned table
WITH RECURSIVE inheritance_tree AS (
    SELECT c.oid, c.relname, c.relispartition
    FROM pg_class c
    WHERE c.relname = 'wabachats_partitioned'
    UNION ALL
    SELECT c.oid, c.relname, c.relispartition
    FROM pg_class c
    JOIN pg_inherits i ON c.oid = i.inhrelid
    JOIN inheritance_tree it ON i.inhparent = it.oid
    WHERE c.relispartition
)
SELECT 
    it.relname AS partition_name,
    i.relname AS index_name,
    pg_get_indexdef(i.oid) AS index_definition
FROM inheritance_tree it
JOIN pg_index ix ON it.oid = ix.indrelid
JOIN pg_class i ON ix.indexrelid = i.oid
JOIN pg_am am ON i.relam = am.oid
WHERE it.relispartition
ORDER BY it.relname, i.relname;

