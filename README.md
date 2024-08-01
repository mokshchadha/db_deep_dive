# pg_deep_dive
deep diving into postgresql


### how to start/stop a service 

//start
docker-compose up -d <service_name>

// stop 
docker-compose stop <service_name>
docker-compose rm -f <service_name>

#### Postgres  
```===============Timescaledb=====================
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
moksh@Pippins-MacBook-Pro:~/pippin/rnd/db_deep_dive[main]$bun run pg_query_comparision.js 
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
moksh@Pippins-MacBook-Pro:~/pippin/rnd/db_deep_dive[main]$bun run mariadb/query_comparision.js 
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
^C
moksh@Pippins-MacBook-Pro:~/pippin/rnd/db_deep_dive[main]$bun run mysql/query_comparision.js 
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

#### Timescale  


#### Mysql  