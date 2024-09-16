## Tasks

### 1 Use GIN index with tsvector and see the performance ✅
 - performance found and updated in the readme sheet for 10million docs

### 2 Figure how is Gin Index different from features in elastic search ✅
 - Elastic search allows us to have semantic and fuzzy search which is missing in GIN FTS of postgres but we can achieve the same with pg_vector (semantic search) - store the embeddings here and pg_trgm (for fuzzy search) https://anyblockers.com/posts/postgres-as-a-search-engine
  

### 3 lz4 v 1.10 has multithreading so that we have to use for compression , is there any other file system level compression that we can use?

### 4 In analytics database we have to use a seperate disk partition and use open zfs on it (open zfs and postgres 16 have some overlapping features need to figure out how to tune them) ❌

### 5 all the MV schedular will be iterative, so the master tables will be clubbed into a meta table into a MV  -- query speed need to be 50ms via partition -- size of partion will be same and this will be a intermediate MV of higher level -- out MV will be on top on this -- and all the refresh will be withing a second or realtime - summary of each partion will be saved in a row  in a column in MV

### 6 Partition script - (Wabaservice) - create a script that creates partitions for the next 3-4 years of the data and then create indexes on each individual partition in advance ✅
    Partitioning column should be received_at and split should be day wise - query pattern should be in a for loop so whenever we fetch data we should be hitting the index on one by one day wise partition 

### 7 Using PL/pgsql create a flow of functions required for order request flow (creation, updation, selection of supplier etc.)

### 8 Bloc pattern needs to be used in supplier app ✅
    ask the app team to create a technical documentation and then get it reviewed before procedure.

### 9 upgrade flutter to  latest and remove ^ from every package ✅
    this is done

### 10 wabaservice db - create a scheduler to re-indexed whole database 
    - change buffer cache to 512MB , working_memory to 64MB

### 11 DB migration - create a script to migrate large volume of csv data faster ✅

### 12 add the idle script in the superset index.html and our source.one admin console  ✅
this is done and moved to prod

### 13 use python in custom db and see if numpy and http request is working

### 14.1 GEOM compress module - helps implement raid , encrption on disk etc ✅
https://docs.freebsd.org/en/books/handbook/geom/

### 14.2 what are jails and containers in free bsd 
https://docs.freebsd.org/en/books/handbook/jails/

### 14.3 what is PF in freebsd 
https://docs.freebsd.org/en/books/handbook/firewalls/

### 14.5 nvme nr_request - what is disk queue , read write queue on disk level how can we increase the size for nvme

### 14.4 linux compatibility layer free bsd (need this to run dart in freebsd)  ✅ 
https://docs.freebsd.org/en/books/handbook/linuxemu/

### 14.5 check ktls freebsd

## for every request there will be only 1 file/folder that runs (it can return rich content to the server can be html, htmx, graph etc) - database is shared
## every file/folder is a application in its own can have its different languague but the databse is shared postgresql

## Analytics tasks
0. coordinate with Nasir to provide the AI converted script 
1. ask for the bd queries in the dashboard 
2. maria db needs to be updated
3. need to have pagination in the sql
4. need to have stats of every query taking how long it is taking at db level (query_history)
5. any query should not take more than 1 second

