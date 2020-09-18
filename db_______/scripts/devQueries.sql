-------------------
--  DEV QUERIES  --
-------------------

--684ebc91-f2e4-4e5f-8f0b-4ea2b050adce
-- fc35067e-a54d-4009-ba56-82896f022752

--  Get all user info
SELECT 
    *
FROM tbl_user AS tUser
INNER JOIN tbl_profile tProf 
    on tProf.user_id = tUser.id 
INNER JOIN tbl_access tAcce 
    on tAcce.user_id = tUser.id 
-- INNER JOIN tbl_talk_history tTaHi 
--     on tTaHi.send_id = tUser.id
WHERE tUser.id = 'fc35067e-a54d-4009-ba56-82896f022752'
ORDER BY tUser.id
;

--  Get tbl_user info
SELECT 
    *
FROM tbl_user AS tUser
WHERE tUser.id = 'fc35067e-a54d-4009-ba56-82896f022752'
;

--  Get Talk Member Access list
WITH tbl_members AS (
    SELECT
        json_build_object(
            'name', tU.name,
            'id', tU.id
        ) AS member,
        tA.talk_id AS talk_id
    FROM tbl_user tU
    INNER JOIN tbl_access tA
        on tA.user_id = tU.id
)
SELECT 
    tT.id,
    tt.type,
    tt.seen,
    array_agg( tM.member ) AS members
FROM tbl_members tM
INNER JOIN tbl_talk tT 
    on tT.id = tM.talk_id
INNER JOIN tbl_access tA
    on tA.talk_id = tM.talk_id
INNER JOIN tbl_user tU
    on tU.id = tA.user_id
WHERE 
    tA.user_id = '684ebc91-f2e4-4e5f-8f0b-4ea2b050adce'
GROUP BY 
    tT.id,
    tT.type,
    tT.seen
;

--  aggregate chat history into json arrays
    SELECT 
        json_agg(json_build_object(
            'id', tH.id,
            'body', tH.body,
            'send_id', tH.send_id, 
            'talk_id', tH.talk_id, 
            'seen', tH.seen, 
            'date_time', tH.date_time
        )) AS msgObj
    FROM tbl_talk_history tH
    INNER JOIN tbl_access tA
        on tA.talk_id = tH.talk_id
    WHERE tA.user_id = 'a066f848-513e-434e-809d-1ee9d4afddd2'
    GROUP BY tA.user_id
    ;
   
    SELECT 
        json_build_object(
            'id', tH.id,
            'body', tH.body,
            'send_id', tH.send_id, 
            'seen', tH.seen 
            'date_time', tH.date_time
        ) AS msgObj
    FROM tbl_talk_history tH
    INNER JOIN tbl_access tA
        on tA.talk_id = tH.talk_id
    WHERE tA.user_id = 'a066f848-513e-434e-809d-1ee9d4afddd2'
    -- GROUP BY tA.user_id
    ;

    WITH tbl_msgs AS (
        SELECT 
            json_build_object(
                'id', tH.id,
                'body', tH.body,
                'send_id', tH.send_id, 
                'seen', tH.seen,
                'date_time', tH.date_time
            ) AS msgObj,
            tH.talk_id AS talk_id
        FROM tbl_talk_history tH
        INNER JOIN tbl_access tA
            on tA.talk_id = tH.talk_id
        WHERE tA.user_id = '684ebc91-f2e4-4e5f-8f0b-4ea2b050adce'
        )
    SELECT
        talk_id,
        array_agg(msgObj) AS msgObj
    FROM tbl_msgs 
    GROUP BY talk_id
    ;
   

--  Add text content
INSERT INTO tbl_talk_history
    ( talk_id, send_id, body)
VALUES
    ( 'c8ad925b-cea8-4a2c-909d-423e7909808c', 'fc35067e-a54d-4009-ba56-82896f022752', '{"text": "oh, sup?", "type": "chat"}'),
    ( 'c8ad925b-cea8-4a2c-909d-423e7909808c', 'a066f848-513e-434e-809d-1ee9d4afddd2', '{"text": "nm, sup? -from BadBoy", "type": "chat"}'),
    ( 'c8ad925b-cea8-4a2c-909d-423e7909808c', 'fc35067e-a54d-4009-ba56-82896f022752', '{"text": "nothin. chillin", "type": "chat"}'),
    ( 'c8ad925b-cea8-4a2c-909d-423e7909808c', 'a066f848-513e-434e-809d-1ee9d4afddd2', '{"text": "me too bro -yr fren BadBoy", "type": "chat"}')
    ;

--  Make an Admin
UPDATE tbl_user
SET role = 'admin'
WHERE name = 'BadBoy'
;