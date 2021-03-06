-------------------
--  DEV QUERIES  --
-------------------

--==========================================================================
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

--==========================================================================
--  Get tbl_user info
    SELECT 
        *
    FROM tbl_user AS tUser
    WHERE tUser.id = 'fc35067e-a54d-4009-ba56-82896f022752'
    ;

--==========================================================================
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

--==========================================================================
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
    WHERE tA.user_id = 'b2c54cc8-b7e6-4b84-9186-318a11d1718c'
    GROUP BY tA.user_id
    ;

--==========================================================================
-- void
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

--==========================================================================
-- void

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

--==========================================================================
--  GET Talk History

    SELECT 
        array_agg(json_build_object(
            'msgId', tH.id,
            'body', tH.body,
            'send_id', tH.send_id, 
            'seen', tH.seen,
            'date_time', tH.date_time
        )) AS 'msgObj',
        tH.talk_id AS talkId
    FROM tbl_talk_history tH
    WHERE tH.talk_id = '178450d6-56a4-4e6b-884d-3db1bd4c67ab'
    GROUP BY talkId;
    -->>> RESULT >>>
    {
        "{
        "msgId" : 1, 
        "body" : {
            "text": "Hello Coco, glad you could make it. (^=^)", 
            "type": "chat"
            }, 
        "send_id" : "e732b2b4-2dc4-447b-b145-b7a9a5c1255a", 
        "seen" : true, 
        "date_time" : "2020-09-19T21:15:14.277232-07:00"
        }",
    }     

--==========================================================================
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
  
--==========================================================================
-- void

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
    WHERE tA.user_id = 'b2c54cc8-b7e6-4b84-9186-318a11d1718c'
    GROUP BY tH.talk_id
    ;

--==========================================================================
-- void

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
        WHERE tA.user_id = 'e732b2b4-2dc4-447b-b145-b7a9a5c1255a'
        )
    SELECT
        talk_id,
        array_agg(
            msgObj
            ORDER BY msgObj->>'date_time'
            ) AS msglist
    FROM tbl_msgs 
    GROUP BY talk_id
    ;

--==========================================================================
-- Get All [talk_id] for Users [name]
    SELECT 
        tU.name,
        tA.talk_id AS good_talk_id
    FROM tbl_access tA
    INNER JOIN tbl_talk tT on tA.talk_id = tT.id
    INNER JOIN tbl_user tU on tA.user_id = tU.id
    WHERE tU.name != 'Conor'
    ;

--==========================================================================
-- Delete All [talk_id] from [tbl_access] without relation to [tbl_user]
    DELETE FROM tbl_access
    WHERE talk_id NOT IN
    (SELECT 
        tA.talk_id AS good_talk_id
    FROM tbl_access tA
    INNER JOIN tbl_talk tT on tA.talk_id = tT.id
    INNER JOIN tbl_user tU on tA.user_id = tU.id
    WHERE tU.name != 'Conor')
    ;
--==========================================================================
-- <title>