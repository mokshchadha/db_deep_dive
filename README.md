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
===============Mysql=====================
join_query=================
join_500_records_mysql: 14.587ms
join_1000_records_mysql: 14.034ms
join_10000_records_mysql: 97.38ms
join_50000_records_mysql: 416.14ms
join_100000_records_mysql: 795.769ms
time_range_query=================
range_500_records_mysql: 24.982ms
range_1000_records_mysql: 26.433ms
range_10000_records_mysql: 93.332ms
range_50000_records_mysql: 426.669ms
range_100000_records_mysql: 755.406ms
moksh@Pippins-MBP:~/pippin/rnd/db_deep_dive[main]$node mariadb/query_comparision.js 
===============MariaDB=====================
join_query=================
join_500_records_mariadb: 15.872ms
join_1000_records_mariadb: 10.409ms
join_10000_records_mariadb: 96.524ms
join_50000_records_mariadb: 361.439ms
join_100000_records_mariadb: 722.588ms
time_range_query=================
range_500_records_mariadb: 25.703ms
range_1000_records_mariadb: 23.786ms
range_10000_records_mariadb: 100.429ms
range_50000_records_mariadb: 390.646ms
range_100000_records_mariadb: 676.292ms
^C
moksh@Pippins-MBP:~/pippin/rnd/db_deep_dive[main]$node pg_query_comparision.js 
===============Postgres=====================
join_query=================
join_500_records_pg: 16.348ms
join_1000_records_pg: 14.49ms
join_10000_records_pg: 122.426ms
join_50000_records_pg: 487.438ms
join_100000_records_pg: 898.734ms
time_range_query=================
range_500_records_pg: 20.782ms
range_1000_records_pg: 20.104ms
range_10000_records_pg: 99.42ms
range_50000_records_pg: 489.039ms
range_100000_records_pg: 855.325ms
moksh@Pippins-MBP:~/pippin/rnd/db_deep_dive[main]$node timescale_query_comparision.js 
===============Timescaledb=====================
join_query=================
join_500_records_timescale: 16.602ms
join_1000_records_timescale: 14.885ms
join_10000_records_timescale: 105.32ms
join_50000_records_timescale: 544.915ms
join_100000_records_timescale: 1.017s
time_range_query=================
range_500_records_timescale: 19.664ms
range_1000_records_timescale: 18.318ms
range_10000_records_timescale: 101.264ms
range_50000_records_timescale: 494.521ms
```

#### Timescale  


#### Mysql  