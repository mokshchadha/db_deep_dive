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
join_query=================
join_500_records_pg: 17.628ms
join_1000_records_pg: 12.936ms
join_10000_records_pg: 98.187ms
join_50000_records_pg: 424.756ms
time_range_query=================
range_500_records_pg: 15.738ms
range_1000_records_pg: 17.073ms
range_10000_records_pg: 85.629ms
range_50000_records_pg: 362.974ms
```

#### Timescale  


#### Mysql  