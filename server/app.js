const express = require('express')
let app = express()
app.use('/public', express.static('./public'))
//解析token
const expressJWT = require('express-jwt')
//密钥配置文件
const config = require('./config.js')
//对登录注册以外的接口进行拦截
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/login/, /^\/register/,/^\/public\//,/^\/uploadfile/,/^\/uploadvideo/,/^\/getallvideos/,/^\/deletevideo/,/^\/likevideo/,/^\/insertcomment/,/^\/getcommentsbyvideoid/,/^\/uploadavatar/,/^\/facecompare/,/^\/isadmin/,/^\/admindeletevideo/,/^\/admineditvideo/] }))
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))//在vue下不生效
const cors = require('cors')
app.use(cors())
const router = require('./router/router.js')
app.use(router)
//在 app.js 的全局错误级别中间件中，捕获验证失败的错误，并把验证失败的结果响应给客户端：
app.use(function (err, req, res, next) {
    if (err.name === 'ValidationError') {
        console.log('用户名1-30位;密码开头非空白,6-12位;邮箱包含@');
        res.send({ status: 8, msg: '用户名1-30位;密码开头非空白,6-12位;邮箱包含@' })
    } else if (err.name === 'UnauthorizedError') {
        console.log('没有权限访问');
        res.send('你没有权限访问')
    }
})
app.listen(3000, function () {
    console.log('后端服务已启动,端口号:3000');
})