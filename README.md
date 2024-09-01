# pg_deep_dive
deep diving into postgresql


### how to start/stop a service 

//start
docker-compose up -d <service_name>

// stop 
docker-compose stop <service_name>
docker-compose rm -f <service_name>

#### Postgres  

```
===============Postgres=====================
join_query=================
[14.59ms] join_500_records_pg
[8.02ms] join_1000_records_pg
[76.77ms] join_10000_records_pg
[315.69ms] join_50000_records_pg
[580.70ms] join_100000_records_pg
time_range_query=================
[17.51ms] range_500_records_pg
[18.84ms] range_1000_records_pg
[73.01ms] range_10000_records_pg
[296.73ms] range_50000_records_pg
[510.27ms] range_100000_records_pg

```

#### Timescale  
```
===============Timescaledb=====================
join_query=================
[11.92ms] join_500_records_timescale
[8.71ms] join_1000_records_timescale
[64.90ms] join_10000_records_timescale
[320.88ms] join_50000_records_timescale
[603.23ms] join_100000_records_timescale
time_range_query=================
[14.77ms] range_500_records_timescale
[16.23ms] range_1000_records_timescale
[68.49ms] range_10000_records_timescale
[311.57ms] range_50000_records_timescale
[521.38ms] range_100000_records_timescale
```

#### Mysql  
```
===============Mysql=====================
join_query=================
[10.72ms] join_500_records_mysql
[8.41ms] join_1000_records_mysql
[60.61ms] join_10000_records_mysql
[310.66ms] join_50000_records_mysql
[612.43ms] join_100000_records_mysql
time_range_query=================
[21.11ms] range_500_records_mysql
[24.15ms] range_1000_records_mysql
[80.22ms] range_10000_records_mysql
[345.08ms] range_50000_records_mysql
[609.83ms] range_100000_records_mysql
```

#### MariaDB
```
===============MariaDB=====================
join_query=================
[7.22ms] join_500_records_mariadb
[8.25ms] join_1000_records_mariadb
[59.17ms] join_10000_records_mariadb
[290.45ms] join_50000_records_mariadb
[586.23ms] join_100000_records_mariadb
time_range_query=================
[22.89ms] range_500_records_mariadb
[22.64ms] range_1000_records_mariadb
[74.22ms] range_10000_records_mariadb
[337.58ms] range_50000_records_mariadb
[577.07ms] range_100000_records_mariadb

```

### Compare the performance of simple table vs Partition table 
#### 10 million records
```
Running queries on Simple table
Base query  select * from real_chats w where w.received_at > '2024-01-16' and from_no = '9873089003'

limit_100 : 11.19ms
limit_200 : 0.535ms
limit_1000 : 0.273ms
limit_5000 : 0.527ms
limit_10000 : 0.46ms
Running queries on partitoned table
Base query  select * from real_chats_partitioned w where w.received_at > '2024-01-16' and from_no = '9873089003'

limit_100 : 284.187ms
limit_200 : 8.362ms
limit_1000 : 5.298ms
limit_5000 : 40.057ms
limit_10000 : 11.328ms

Running queries on Simple table
Base query  select * from real_chats  w where w.received_at > '2024-01-16' and tsv_document @@ to_tsquery('simple', 'buyer')

limit_100 : 8.22ms
limit_200 : 0.54ms
limit_1000 : 0.333ms
limit_5000 : 0.153ms
limit_10000 : 0.257ms
Running queries on partitoned table
Base query  select * from real_chats_partitioned  w where w.received_at > '2024-01-16' and tsv_document @@ to_tsquery('simple', 'buyer')

limit_100 : 18.315ms
limit_200 : 18.175ms
limit_1000 : 19.628ms
limit_5000 : 53.264ms
limit_10000 : 81.324ms
```


### PG TRGM
https://www.postgresql.org/docs/current/pgtrgm.html