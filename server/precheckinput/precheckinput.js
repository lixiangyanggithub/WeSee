//表单中携带的每个数据项，定义验证规则：
const joi = require('@hapi/joi')
/**
* string() 值必须是字符串
* alphanum() 值只能是包含 a-zA-Z0-9 的字符串
* min(length) 最小长度
* max(length) 最大长度
* required() 值是必填项，不能为 undefined
* pattern(正则表达式) 值必须符合正则表达式的规则
*/
// 用户名的验证规则
const username = joi.string().min(1).max(30).required()  //用户名必须是1-30位的字符串
// 密码的验证规则
const password = joi
.string()
.pattern(/^[\S]{6,12}$/) //开头非空白，总共6-12位的字符串
.required()
// 定义电子邮件地址的验证规则
const email = joi.string().email().required()
// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
// 表示需要对 req.body 中的数据进行验证
body: {
username,
password,
email
},
}
