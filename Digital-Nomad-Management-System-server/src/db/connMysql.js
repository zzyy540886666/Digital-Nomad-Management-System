const mysql = require('mysql2')

const project_name = 'DN'
const tmp = { host: 'HOST', port: 'PORT', user: 'USER', pswd: 'PSWD', database: 'DB' }
const default_db = { host: '127.0.0.1', port: '3306', user: 'root', pswd: 'root', database: 'digital_nomad' }
const { host, port, user, pswd, database } = get_db_info()

const db = mysql.createPool({
  host: host,
  port: port,
  user: user,
  password: pswd,
  database: database,
  waitForConnections: true,
  connectionLimit: 10,
  idleTimeout: 60000,
  acquireTimeout: 60000
})

console.log('\n正在连接数据库。。。请稍等。。。')
db.conn_successful = false

db.getConnection((err, connection) => {
  if (err) {
    console.log(`数据库连接失败！！！！`)
    console.log(` -> host: ${host}`)
    console.log(` -> port: ${port}`)
    console.log(` -> user: ${user}`)
    console.log(` -> password: ${pswd}`)
    console.log(` -> database: ${database}`)
    process.exit(1)
  } else {
    console.log('数据库连接成功！  数据库进程id为: ' + connection.threadId)
    db.conn_successful = true
    connection.release()
  }
})

function get_db_info() {
  let res = {}
  Object.keys(tmp).forEach((i) => {
    let v = process.env[`${project_name}_${tmp[i]}`]
    if (v) {
      res[i] = v
    } else {
      console.log(`读取不到系统环境变量: ${project_name}_${tmp[i]} -> 使用默认值: ${default_db[i]}`)
      res[i] = default_db[i]
    }
  })
  return res
}

module.exports = db.promise()
