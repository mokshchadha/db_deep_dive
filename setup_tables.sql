CREATE TABLE wabachats (
    previous_date            timestamp without time zone,
    todays_date             timestamp without time zone,
    person_name               varchar(255),
    received_at              timestamp without time zone,
    status_description        varchar(255),
    waba_link                  varchar(255),
    whatsapp_number            varchar(25),
    status_previous_date      varchar(255),
    group_name                 varchar(255)
);

-- waba chats from the wabaserver prod

CREATE TABLE real_chats (
    id serial PRIMARY KEY,
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
    tsv_document tsvector
);

CREATE INDEX gin_idx_1 ON real_chats USING GIN (tsv_document);


CREATE FUNCTION chats_tsvector_trigger() RETURNS trigger AS $$
begin
  new.tsv_document := 
    setweight(to_tsvector('english', coalesce(new.template_id, '')), 'A')
    || setweight(to_tsvector('english', coalesce(new.from_no, '')), 'B')
    || setweight(to_tsvector('english', coalesce(new.to_no, '')), 'B')
    || setweight(to_tsvector('english', coalesce(new.message_text, '')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

-- setting up the trigger 

CREATE TRIGGER tsvectorupdate
BEFORE INSERT OR UPDATE ON real_chats
FOR EACH ROW
EXECUTE PROCEDURE chats_tsvector_trigger();

-- hybrid search

create table documents (
  id bigint primary key generated always as identity,
  content text,
  fts tsvector generated always as (to_tsvector('english', content)) stored,
  embedding vector(1536)
);

-- Create an index for the full-text search
create index on documents using gin(fts);

-- Create an index for the semantic vector search
create index on documents using hnsw (embedding vector_ip_ops);


-- create a function called hybrid search
create or replace function hybrid_search(
  query_text text,
  query_embedding vector(512),
  match_count int,
  full_text_weight float = 1,
  semantic_weight float = 1,
  rrf_k int = 50
)
returns setof documents
language sql
as $$
with full_text as (
  select
    id,
    -- Note: ts_rank_cd is not indexable but will only rank matches of the where clause
    -- which shouldn't be too big
    row_number() over(order by ts_rank_cd(fts, websearch_to_tsquery(query_text)) desc) as rank_ix
  from
    documents
  where
    fts @@ websearch_to_tsquery(query_text)
  order by rank_ix
  limit least(match_count, 30) * 2
),
semantic as (
  select
    id,
    row_number() over (order by embedding <#> query_embedding) as rank_ix
  from
    documents
  order by rank_ix
  limit least(match_count, 30) * 2
)
select
  documents.*
from
  full_text
  full outer join semantic
    on full_text.id = semantic.id
  join documents
    on coalesce(full_text.id, semantic.id) = documents.id
order by
  coalesce(1.0 / (rrf_k + full_text.rank_ix), 0.0) * full_text_weight +
  coalesce(1.0 / (rrf_k + semantic.rank_ix), 0.0) * semantic_weight
  desc
limit
  least(match_count, 30)
$$;
