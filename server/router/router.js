const express = require('express')
const routerfuns = require('../routerfun/routerfun.js')
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { reg_login_schema } = require('../precheckinput/precheckinput.js')
const router = express.Router()
//注册
router.post('/register', expressJoi(reg_login_schema), routerfuns.registerfun)
// router.post('/register',  routerfuns.registerfun)
//登录
router.post('/login', routerfuns.loginfun)
//上传文件
router.post('/uploadfile', routerfuns.uploadFilefun);
//获取用户信息
router.get('/getuserinfo', routerfuns.getuserinfofun)
//上传视频
router.post('/uploadvideo',routerfuns.uploadvideofun)
//获取用户视频
router.get('/getuservideos',routerfuns.getuservideofun)
//获取videos表所有视频
router.get('/getallvideos',routerfuns.getallvideosfun)
//删除视频
router.post('/deletevideo',routerfuns.deletevideofun)
//like喜欢该视频，则该视频的like+1
router.post('/likevideo',routerfuns.likevideofun)
//获取用户喜欢的视频
router.get('/getuserlikevideos',routerfuns.getuserlikevideosfun)
//插入评论到comments集合
router.post('/insertcomment',routerfuns.insertcommentfun)
//从mongodb获取视频的评论根据视频的video_id
router.get('/getcommentsbyvideoid',routerfuns.getcommentsbyvideoidfun)
//上传头像
router.post('/uploadavatar',routerfuns.uploadavatarfun)
//人脸对比
router.post('/facecompare',routerfuns.facecomparefun)
//要注册管理员，先验证他的密钥是否正确
router.post('/isadmin',routerfuns.isadminfun)
//获取vodeos表
router.get('/getvideostable',routerfuns.getvideostablefun)
//管理员删除视频
router.post('/admindeletevideo',routerfuns.admindeletevideofun)
//管理员编辑视频
router.post('/admineditvideo',routerfuns.admineditvideofun)
//搜索视频根据视频标题模糊查询
router.get('/searchvideosbyliketitle',routerfuns.searchvideosbyliketitlefun)

module.exports = router