const pool = require('../../db_______/db');
// --  GET Talk History
exports.getTalkHistory = async (talkId) => {
  console.log('Talk > Utils > getTalkHistory() > Enter FXN');

  const queryText = `
    SELECT 
    array_agg(json_build_object(
        'msgId', tH.id,
        'body', tH.body,
        'send_id', tH.send_id, 
        'seen', tH.seen,
        'date_time', tH.date_time
        )) AS msgObj,
        tH.talk_id AS talkId
        FROM tbl_talk_history tH
        WHERE tH.talk_id = '${talkId}'
        GROUP BY talkId;
        `;
  try {
    const { rows } = await pool.query(queryText);
    const talkHistory = rows;
    console.log('Talk > Utils > getTalkHistory() ');
    // console.log('Talk > Utils > getTalkHistory: ', talkHistory[0]);
    return talkHistory[0];
  } catch (err) {
    console.error(
      '(>_<) Talk > Utils > getTalkHistory() > catch: ' + err.message
    );
  }
};
// -->>> RESULT >>>
//  {
//     "{
//      "msgId" : 1,
//      "body" : {
//          "text": "Hello Coco, glad you could make it. (^=^)",
//          "type": "chat"
//          },
//      "send_id" : "e732b2b4-2dc4-447b-b145-b7a9a5c1255a",
//      "seen" : true,
//      "date_time" : "2020-09-19T21:15:14.277232-07:00"
//     }",
//  }
