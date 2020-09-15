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
var logStr = `  ~~~~~~~~~~~ db.js ~~~~~~~~~~~`;
if (pool) logStr += `\n  (^=^)  PostgresDB Connected...`;
else logStr += `\n  (-_-)  BAD: PostgresDB Disconnected...`;
envStr
  ? (logStr += `\n  (^=^)  NODE_ENV = ` + envStr)
  : (logStr += `\n  (-_-)  NODE_ENV = ` + envStr);
// cxnStr
//   ? (logStr += `\n  (^=^)  cxnStr = ` + cxnStr)
//   : (logStr += `\n  (-_-)  cxnStr = ` + cxnStr);
logStr += `\n  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;
console.log(logStr);
module.exports = pool;
