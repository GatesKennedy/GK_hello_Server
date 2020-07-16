const { Pool } = require('pg');

//~~~~~~~~~~~~~~~~~~~~~~~
const envStr = JSON.stringify(process.env.NODE_ENV);
const { DATABASE_URL, DB_USER, DB_NAME, DB_PASS } = process.env;
const cxnStr =
  process.env.NODE_ENV == 'production'
    ? DATABASE_URL
    : `postgresql://${DB_USER}:${DB_PASS}@${DATABASE_URL}/${DB_NAME}`;

const pool = new Pool({
  connectionString: cxnStr,
});

//~~~~~~~~~~~~~~~~~~~~~~~
console.log('~~~~~~~ db.js ~~~~~~~');
if (pool) console.log(`(^=^)  GOOD: PostgresDB Connected...`);
else console.log(`(-_-) BAD: PostgresDB Disconnected...`);
envStr
  ? console.log('(^=^)  NODE_ENV = ' + envStr)
  : console.log('(-_-)  NODE_ENV: ' + envStr);
cxnStr
  ? console.log('(^=^)  cxnStr = ' + cxnStr)
  : console.log('(-_-)  cxnStr = ' + cxnStr);

module.exports = pool;
