-------------------
--  DEV QUERIES  --
-------------------

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
