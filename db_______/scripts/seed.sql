--  DATABASE    OWNER       ENCODING
--  db_chat     ohnodamn    utf8
--88888888 88888888 88888888 88888888 88888888 88888888 88888888 88888888 

DROP TABLE IF EXISTS tbl_user           CASCADE;      -- 0
DROP TABLE IF EXISTS tbl_profile        CASCADE;      -- 0
DROP TABLE IF EXISTS tbl_prof_history   CASCADE;      -- 0
DROP TABLE IF EXISTS tbl_talk           CASCADE;      -- 0
DROP TABLE IF EXISTS tbl_talk_history   CASCADE;      -- 0
DROP TABLE IF EXISTS tbl_collab         CASCADE;      -- 0

--  tool
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--  user
CREATE TYPE entity_type AS ENUM ('void', 'personal', 'biz_sml', 'biz_med', 'biz_lrg');
CREATE TYPE role_type   AS ENUM ('admin', 'dev', 'user');
CREATE TYPE field_type  AS ENUM ('thought, puzzle, entity, img_url');
CREATE TYPE share_type  AS ENUM ('text', 'image', 'audio', 'link', 'collab');

CREATE TABLE IF NOT EXISTS tbl_user(
    id          UUID        NOT NULL DEFAULT uuid_generate_v4(),
    name        VARCHAR(16) NOT NULL,
    email       VARCHAR(64) NOT NULL,
    password    VARCHAR(64) NOT NULL,
    business    VARCHAR(32) NOT NULL DEFAULT 'void',
    role        role_type   NOT NULL DEFAULT 'user',
    date_join   date        NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_profile(
    user_id         UUID            REFERENCES tbl_user(id) ON DELETE CASCADE,
    entity          entity_type     NOT NULL DEFAULT 'void',
    website         VARCHAR(128)    NOT NULL DEFAULT 'void',
    thought         VARCHAR         NOT NULL DEFAULT 'void',
    puzzle          TEXT            NOT NULL DEFAULT 'void',
    img_url         TEXT            NOT NULL DEFAULT 'NO_URL',
    location VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS tbl_prof_history(
    id          SERIAL,
    user_id     UUID        REFERENCES tbl_user(id) ON DELETE CASCADE,
    field       field_type  NOT NULL, 
    date_edited DATE        NOT NULL DEFAULT CURRENT_DATE,
    edit_note   TEXT        NOT NULL DEFAULT 'NO_ENTRY',        --(-_-)--
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_talk(
    id          UUID        DEFAULT uuid_generate_v4(),
    give_id     UUID        REFERENCES tbl_user(id) ON DELETE CASCADE,
    take_id     UUID        REFERENCES tbl_user(id) ON DELETE CASCADE,
    date_init  DATE        NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_talk_history(
    id          SERIAL,
    talk_id     REFERENCES  tbl_talk(id),
    type        share_type  NOT NULL, 
    body        JSONB       NOT NULL,
    seen       BOOLEAN      NOT NULL DEFAULT true,
    date        DATE        NOT NULL DEFAULT CURRENT_DATE,
    edit_note   TEXT        NOT NULL DEFAULT 'NO_ENTRY',        --(-_-)--
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_collab(
    id          SERIAL,
    seed_id     UUID        REFERENCES tbl_user(id) ON DELETE CASCADE,
    more_id     JSONB       REFERENCES tbl_user(id) ON DELETE CASCADE,
    seen        BOOLEAN     NOT NULL DEFAULT true,
    date_edited DATE        NOT NULL DEFAULT CURRENT_DATE,
    edit_note   TEXT        NOT NULL DEFAULT 'NO_ENTRY',
    PRIMARY KEY (id)
);



--  .sql Script from CMD
--===============================
--  psql -U user_name -d db_name -a -f <file_path>
--  psql -U ohnodamn -d db_talk -f C:\Programming\Gates_Kennedy\GK_hello\GK_hello_Server\db_______\scripts\seed.sql
--  ~Heroku~
--  Not Connected to Heroku psql:
--      cat <file_name> | heroku pg:psql
--      cat C:\Programming\Gates_Kennedy\GK_hello\GK_hello_Server\db_______\scripts\seed.sql | heroku pg:psql
