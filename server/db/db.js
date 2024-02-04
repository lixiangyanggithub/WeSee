const mysql = require('mysql')
const db = mysql.createPool({
    host: 'localhost',
    password: '$lxy232729',
    database: 'wesee',
    user: 'root',
    port: 3306,
    charset: 'utf8mb4' // 设置字符集为utf8mb4,不然表情符号无法插入
})
module.exports = db