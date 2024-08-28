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

CREATE TABLE realchats (
    id serial PRIMARY KEY,
    sys_msg_id varchar(50),
    message_id varchar(50),
    from_no varchar(20),
    to_no varchar(20),
    sender_name varchar(200),
    event_direction varchar(20),
    received_at timestamp,
    event_type varchar(50),
    contextual_message_id varchar(50),
    template_id varchar(255),
    content_type varchar(50),
    message_text text,
    media jsonb,
    cta jsonb,
    placeholders jsonb
)