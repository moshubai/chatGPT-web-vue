const mysql = require('mysql')
const config = {
  // username: 'db1',
  // password: 'Abc_12345!',
  // host: 'database1.mysql.polardb.rds.aliyuncs.com',
  // port: 3306,
  // database: 'cg',
  username: 'admin',
  password: 'Abc_12345!',
  host: 'database-2.c1rj3g6devhk.us-east-2.rds.amazonaws.com',
  port: 3306,
  database: 'cg',
}
const db = mysql.createConnection({
  host: config.host,
  port: config.port,
  user: config.username,
  password: config.password,
  database: config.database,

})
db.connect((err) => {
  if (err)
    console.log('错了', err)
    // db.end()

  else console.log('success')
})
export { db }
