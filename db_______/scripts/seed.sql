--  DATABASE    OWNER       ENCODING
--  db_chat     ohnodamn    utf8
--88888888 88888888 88888888 88888888 88888888 88888888 88888888 88888888 

DROP TABLE IF EXISTS tbl_user           CASCADE;      -- 4
DROP TABLE IF EXISTS tbl_talk           CASCADE;      -- 2
DROP TABLE IF EXISTS tbl_profile        CASCADE;      -- 0
DROP TABLE IF EXISTS tbl_prof_history   CASCADE;      -- 0
DROP TABLE IF EXISTS tbl_talk_history   CASCADE;      -- 0
DROP TABLE IF EXISTS tbl_access         CASCADE;      -- 0

DROP TYPE IF EXISTS entity_type;
DROP TYPE IF EXISTS role_type;
DROP TYPE IF EXISTS field_type;
DROP TYPE IF EXISTS talk_type;
DROP TYPE IF EXISTS share_type;

--  tool
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--  user
CREATE TYPE entity_type AS ENUM ('void', 'personal', 'biz_sml', 'biz_med', 'biz_lrg');
CREATE TYPE role_type   AS ENUM ('admin', 'dev', 'user');
CREATE TYPE field_type  AS ENUM ('thought', 'puzzle', 'entity', 'img_url');
CREATE TYPE talk_type   AS ENUM ('chat', 'note');
CREATE TYPE share_type  AS ENUM ('text', 'image', 'audio', 'link', 'note');

CREATE TABLE IF NOT EXISTS tbl_user(
    id          UUID        NOT NULL DEFAULT uuid_generate_v4(),
    name        VARCHAR(16) NOT NULL,                           
    email       VARCHAR(64) NOT NULL,
    password    VARCHAR(64) NOT NULL,
    role        role_type   NOT NULL DEFAULT 'user',
    date_join   date        NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_profile(
    user_id         UUID            REFERENCES tbl_user(id) NOT NULL,
    entity          entity_type     NOT NULL DEFAULT 'void',
    website         VARCHAR(128),
    thought         VARCHAR,
    puzzle          TEXT,
    img_url         TEXT,
    location        VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS tbl_prof_history(
    id          SERIAL,
    user_id     UUID        REFERENCES tbl_user(id) NOT NULL,
    field       field_type  NOT NULL, 
    body        TEXT        NOT NULL DEFAULT 'void',
    date_edit   DATE        NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_talk(
    id          UUID        DEFAULT uuid_generate_v4(),
    type        talk_type   NOT NULL,                           --  INDEX
    seen        BOOLEAN     NOT NULL DEFAULT true,
    date_init   DATE        NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_talk_history(
    id          SERIAL,
    talk_id     UUID        REFERENCES tbl_talk(id) NOT NULL,  --  INDEX
    send_id     UUID        REFERENCES tbl_user(id) NOT NULL,  --  INDEX
    body        JSONB       NOT NULL,                          --  INDEX
    seen        BOOLEAN     NOT NULL DEFAULT true,
    date_edit   DATE        NOT NULL DEFAULT CURRENT_DATE,      
    edit_note   TEXT        NOT NULL DEFAULT 'NO_ENTRY',        --(-_-)--
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_access(
    user_id     UUID        REFERENCES tbl_user(id) NOT NULL,   --  INDEX
    talk_id     UUID        REFERENCES tbl_talk(id) NOT NULL,
    PRIMARY KEY (user_id, talk_id)
);

--~~~~~~~~~~~~~~~~~
--      INDEX
CREATE INDEX idx_talktype    ON tbl_talk                     (type);
CREATE INDEX idx_talkid      ON tbl_talk_history             (talk_id);
CREATE INDEX idx_sendid      ON tbl_talk_history             (send_id);
CREATE INDEX idxgin_project  ON tbl_talk_history USING gin   ((body -> 'type') jsonb_path_ops);
CREATE INDEX idx_genre       ON tbl_access                   (user_id);

--~~~~~~~~~~~~~~~~~~~~~~
--      UPDATE

--~~~~~~~~~~~~~~~~~
--      VIEW


--  .sql Script from CMD
--===============================
--  psql -U user_name -d db_name -a -f <file_path>
--  psql -U ohnodamn -d db_talk -f C:\Programming\Gates_Kennedy\GK_hello\GK_hello_Server\db_______\scripts\seed.sql
--  ~Heroku~
--  Not Connected to Heroku psql:
--      cat <file_name> | heroku pg:psql
--      cat C:\Programming\Gates_Kennedy\GK_hello\GK_hello_Server\db_______\scripts\seed.sql | heroku pg:psql
