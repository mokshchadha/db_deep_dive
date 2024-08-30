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