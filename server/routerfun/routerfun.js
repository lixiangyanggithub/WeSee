const db = require('../db/db.js')
//上传文件模块
const formidable = require("formidable");
const fs = require('fs');
//密码加密模块
const bcrypt = require('bcryptjs')
//jwt接口权限拦截模块
const jwt = require('jsonwebtoken')
//密钥配置文件
const config = require('../config.js')
//将数据库拿来的时间转为好看的格式
const moment = require('moment');
const commonsqlerr = (err, res) => {
    if (err) {
        console.log(err);
        return res.send({
            status: 8,
            msg: 'sql语句执行失败,可能是连接数据库失败,sql语句不规范'
        })
    }
}
//注册
function registerfun(req, res) {
    console.log('req.body:', req.body)
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email
    let selectsql = 'select username from users where username=?'
    db.query(selectsql, [username], function (err, result) {
        commonsqlerr(err, res)
        if (result[0] && result[0].username == username) {
            res.send({
                msg: '用户名已存在',
                status: 2
            })
        } else {
            //对密码进行加密
            password = bcrypt.hashSync(password, 10)
            let insertsql = 'insert into users (username,password,email)value(?,?,?)'
            db.query(insertsql, [username, password, email], function (err, result) {
                commonsqlerr(err, res)
                if (result.affectedRows == 1) {
                    res.send({
                        msg: '后端成功插入数据库',
                        status: 0
                    })
                }
            })
        }
    })
}
//登录
function loginfun(req, res) {
    console.log('req.body:', req.body)
    let username = req.body.username
    let password = req.body.password
    let selectsql = 'select password,username,user_id from users where username=?'
    db.query(selectsql, [username], function (err, result) {
        commonsqlerr(err, res)
        if (result != '') {
            if (bcrypt.compareSync(password, result[0].password)) {
                //如果密码正确就设置一个token
                const tokenStr = jwt.sign({ username: username }, config.jwtSecretKey, { expiresIn: '12000s' })
                res.send({
                    msg: '密码正确',
                    status: 0,
                    user_id: result[0].user_id,
                    username: username,
                    token: 'Bearer ' + tokenStr
                })
            } else {
                res.send({
                    msg: '密码不正确',
                    status: 1
                })
            }
        } else {
            res.send({
                msg: '没有这个用户',
                status: 2
            })
        }
    })
}
//上传文件
function uploadFilefun(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (error, fields, files) {
        console.log("Files:", files);
        if (files && files.file) {
            var oldPath = files.file[0].filepath;
            var filename = files.file[0].originalFilename;
            console.log('文件名：', filename);//文件名
            var newPath = 'public/' + filename;
            fs.copyFile(oldPath, newPath, function (err) {
                if (err) {
                    res.send({
                        status: 2,
                        msg: '复制文件出错'
                    });
                }
                fs.unlink(oldPath, function (err) {
                    if (err) {
                        res.send({
                            status: 3,
                            msg: '删除文件出错'
                        });
                    }
                    console.log('文件已保存！');
                    res.send({
                        status: 0,
                        msg: '文件已经保存',
                        filename: filename,
                    });
                });
            });
        } else {
            res.send({
                status: 1,
                msg: '没有上传文件'
            });
        }
    });
}
//获取用户信息
function getuserinfofun(req, res) {
    let username = req.query.username
    let video_count; let like_count; let liked_count; let commented_count;
    let selectsql = 'select username,email,user_id,avatar from users where username=?'
    db.query(selectsql, [username], function (err, result) {
        commonsqlerr(err, res)
        if (result[0]) {
            let selectvideo_countsql = 'select count(*) as video_count from videos where user_id=?'
            db.query(selectvideo_countsql, [result[0].user_id], function (err, video_countresult) {
                commonsqlerr(err, video_countresult)
                console.log('发布视频数量video_count:', video_countresult[0].video_count);
                video_count = video_countresult[0].video_count
                let selectlike_countsql = 'select count(*) as like_count from userslike where user_id=?'
                db.query(selectlike_countsql, [result[0].user_id], function (err, like_countresult) {
                    commonsqlerr(err, like_countresult)
                    console.log('点赞的总数量like_count:', like_countresult[0].like_count);
                    like_count = like_countresult[0].like_count
                    let selectliked_countsql = 'select sum(`like`) as liked_count from videos where user_id=?'
                    db.query(selectliked_countsql, [result[0].user_id], function (err, liked_countresult) {
                        commonsqlerr(err, liked_countresult)
                        console.log('被点赞的总数量liked_count:', liked_countresult[0].liked_count);
                        liked_count = liked_countresult[0].liked_count
                        let selectcommented_countsql = 'select sum(comment) as commented_count from videos where user_id=?'
                        db.query(selectcommented_countsql, [result[0].user_id], function (err, commented_countresult) {
                            commonsqlerr(err, commented_countresult)
                            console.log('被评论的总数量commented_count:', commented_countresult[0].commented_count);
                            commented_count = commented_countresult[0].commented_count
                            res.send({
                                msg: '成功获取用户信息',
                                status: 0,
                                userinfomation: {
                                    username: result[0].username,
                                    email: result[0].email,
                                    avatar: result[0].avatar,
                                    video_count: video_count,
                                    like_count: like_count,
                                    liked_count: liked_count,
                                    commented_count: commented_count,
                                }
                            })
                        })
                    })
                })
            })
        } else {
            res.send({
                msg: '获取用户信息失败',
                status: 1
            })
        }
    })
}
//上传视频
function uploadvideofun(req, res) {
    console.log(req.body);
    let user_id = req.body.user_id
    let video = req.body.video
    let title = req.body.title
    let release_time = req.body.release_time
    console.log('后端获取到的req.body.release_time:', req.body.release_time);
    let main_image = req.body.main_image
    let insertsql = 'insert into videos (title,user_id,video,release_time,main_image)values(?,?,?,?,?)'
    db.query(insertsql, [title, user_id, video, release_time, main_image], function (err, result) {
        commonsqlerr(err, res)
        if (result.affectedRows == 1) {
            res.send({
                msg: '成功插入视频',
                status: 0
            })
        }
    })
}
//获取用户视频
function getuservideofun(req, res) {
    console.log(req.query);
    let selectsql = 'select * from videos where user_id=?'
    db.query(selectsql, [req.query.user_id], function (err, result) {
        commonsqlerr(err, res)
        console.log(result);
        if (result != '') {
            res.send({
                msg: '成功该用户获取视频',
                status: 0,
                videos: result.map((item) => {
                    return {
                        video_id: item.video_id,
                        title: item.title,
                        video: item.video,
                        type_id: item.type_id,
                        main_image: item.main_image,
                        like: item.like,
                        comment: item.comment,
                        release_time: moment(item.release_time).format('YYYY-MM-DD HH:mm:ss')
                    }
                })
            })
        } else {
            res.send({
                msg: '该用户没有视频',
                status: 1
            })
        }
    })
}
//获取videos表所有视频
function getallvideosfun(req, res) {
    let selectsql = 'select * from videos'
    db.query(selectsql, function (err, result) {
        commonsqlerr(err, res)
        res.send({
            msg: '成功获取videos表所有视频',
            status: 0,
            videos: result.map((item) => {
                return {
                    video_id: item.video_id,
                    title: item.title,
                    video: item.video,
                    type_id: item.type_id,
                    main_image: item.main_image,
                    like: item.like,
                    comment: item.comment,
                    release_time: moment(item.release_time).format('YYYY-MM-DD HH:mm:ss')
                }
            })
        })
    })
}
//删除视频
function deletevideofun(req, res) {
    console.log(`user_id为${req.body.user_id}的用户要删除视频video_id${req.body.video_id}`);
    //先判断这个视频是否属于该用户，否则没有权利删除
    let selectbyuseridsql = 'select*from videos where user_id=? and video_id=?'
    db.query(selectbyuseridsql, [req.body.user_id, req.body.video_id], function (err, result) {
        commonsqlerr(err, res)
        if (result.length == 0) {
            res.send({
                status: 3,
                msg: '没有权利删除此视频,此视频不属于你'
            })
        } else {
            let deletesql = 'delete from videos where video_id=?'
            db.query(deletesql, [req.body.video_id], function (err, result) {
                commonsqlerr(err, res)
                if (result.affectedRows == 1) {
                    res.send({
                        msg: '成功删除此视频',
                        status: 0
                    })
                } else {
                    res.send({
                        msg: '失败删除此视频',
                        status: 1
                    })
                }
            })
        }
    })
}
//喜欢该视频，该视频的like+1
function likevideofun(req, res) {
    console.log('要点赞视频的video_id:', req.body.video_id, '给该视频点赞的用户user_id:', req.body.user_id);
    //1.将该用户点赞记录插入users_like表
    let insertsql = 'insert into userslike (user_id,video_id)values(?,?)'
    db.query(insertsql, [req.body.user_id, req.body.video_id], function (err, result) {
        commonsqlerr(err, res)
        if (result.affectedRows == 1) {
            console.log('userslike表成功插入一个记录');
        }
    })
    //2.给每一个视频的like字段+1
    let updatesql = 'update videos set `like`=`like`+1 where video_id=?'
    db.query(updatesql, [req.body.video_id], function (err, result) {
        commonsqlerr(err, res)
        if (result.affectedRows == 1) {
            res.send({
                msg: '成功点赞此视频',
                status: 0
            })
        }
    })
}
//获取用户喜欢的视频
function getuserlikevideosfun(req, res) {
    console.log('该用户的用户user_id:', req.query.user_id);
    let selectsqlofuserslike = 'select video_id from userslike where user_id=?'
    db.query(selectsqlofuserslike, [req.query.user_id], function (err, result) {
        commonsqlerr(err, res)
        console.log('该用户喜欢的视频的video_id:', result);
        if (result.length === 0) {
            res.send({
                msg: '该用户没有喜欢的视频',
                status: 1,
            })
        } else {
            // 从查询结果中提取视频ID数组
            const videoIds = result.map(row => row.video_id);
            console.log('从查询结果中提取视频ID数组:', videoIds);
            // 根据视频ID查询videos表
            let selectsqlofvideos = 'SELECT * FROM videos WHERE video_id IN (?)';
            db.query(selectsqlofvideos, [videoIds], function (err, result) {
                commonsqlerr(err, res)
                console.log('查询到的视频数组result:', result);
                if (result.length > 0) {
                    res.send({
                        msg: '成功获取用户喜欢的视频',
                        status: 0,
                        videos: result.map((item) => {
                            return {
                                video_id: item.video_id,
                                title: item.title,
                                video: item.video,
                                type_id: item.type_id,
                                main_image: item.main_image,
                                like: item.like,
                                comment: item.comment,
                                release_time: moment(item.release_time).format('YYYY-MM-DD HH:mm:ss')
                            }
                        })
                    })
                } else {
                    res.send({
                        status: 2,
                        msg: 'userslike表有video_id,但是videos表没有这些视频'
                    })
                }
            });
        }
    })
}
//插入评论
function insertcommentfun(req, res) {
    console.log('需要插入comments的数据req.body:', req.body);
    let insertcommentssql = 'insert into comments (user_id,video_id,commentText)values(?,?,?)'
    db.query(insertcommentssql, [req.body.user_id, req.body.video_id, req.body.commentText], function (err, result) {
        commonsqlerr(err, res)
        if (result.affectedRows === 1) {
            //成功插入comments的同时，将videos表comment字段加1
            let updatesql = 'update videos set comment=comment+1 where video_id=?'
            db.query(updatesql, [req.body.video_id], function (err, result) {
                commonsqlerr(err, res)
                if (result.affectedRows == 1) {
                    console.log('videos表的comment字段也已经加1');
                    res.send({
                        msg: '成功插入一条评论到comments,videos表的comment字段也已经加1',
                        status: 0
                    })
                }
            })
        } else {
            res.send({
                msg: 'comment插入失败',
                status: 1
            })
        }
    })
}
//根据视频id获取comments的视频评论
function getcommentsbyvideoidfun(req, res) {
    console.log('评论视频的video_id:', req.query.video_id);
    let selectsqlbyvideo_id = 'select * from comments where video_id=?'
    db.query(selectsqlbyvideo_id, [req.query.video_id], function (err, result) {
        commonsqlerr(err, res)
        console.log(result);
        if (result.length != 0) {
            res.send({ status: 0, comments: result });
        } else (
            res.send({ status: 1, msg: '该视频没有评论' })
        )
    })
}
//上传、更改头像
function uploadavatarfun(req, res) {
    console.log('上传头像信息：', req.body);
    let updatesql = 'update users set avatar=? where username=?'
    db.query(updatesql, [req.body.avatar, req.body.username], function (err, result) {
        commonsqlerr(err, res)
        if (result.affectedRows === 1) {
            res.send({
                status: 0,
                msg: '成功上传/更改头像'
            })
        } else {
            res.send({
                status: 1,
                msg: '成功上传/更改头像失败'
            })
        }
    })
}
// 人脸对比
// 引入服务端http/https请求模块
const request = require("request");
const crypto = require("crypto");
const path = require("path");
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
async function facecomparefun(req, res) {
    //1.注册是拍照上传图片，有一个管理员密钥才允许注册，数据库记录此图片文件名savedface插入adminfaces表,2.登录时再拍照，
    //和数据库的表的所有的adminfaces图片对比，只要有一个成功则认为他是管理员，然后成功登录
    try {
        // 图片转base64
        async function parse(file) {
            let filePath = path.resolve(file);
            let data = await readFileAsync(filePath);
            data = Buffer.from(data).toString("base64");
            return data;
        }
        const apiKey = "0aeebf1f4eb038d5b01e1858477bc0da";
        const apiSecret = "MzY3ZTA4Y2I0OTcxMGExM2Q5YzIwMTQy";
        const appId = "07af6702";
        const date = new Date().toGMTString(); 
        const signature_origin = `host: api.xf-yun.com\ndate: ${date}\nPOST /v1/private/s67c9c78c HTTP/1.1`;
        const hmac = crypto.createHmac("sha256", apiSecret);
        hmac.update(signature_origin);
        const signature_sha = hmac.digest("base64"); 
        const signature = signature_sha.toString("base64")
        const authorization_base64 = `api_key="${apiKey}",algorithm="hmac-sha256",headers="host date request-line",signature="${signature}"`;
        const authorization = Buffer.from(authorization_base64).toString("base64");
        const body = {
            header: {
                app_id: appId,
                status: 3,
            },
            parameter: {
                s67c9c78c: {
                    service_kind: "face_compare",
                    face_compare_result: {
                        encoding: "utf8",
                        compress: "raw",
                        format: "json",
                    },
                },
            },
            payload: {
                input1: {
                    encoding: "png",
                    status: 3,
                    image: await parse(path.join(__dirname, `../public/${req.body.face}`)),
                },
                input2: {
                    encoding: "png",
                    status: 3,
                    image: await parse(path.join(__dirname, '../public/adminphoto.png')),
                },
            },
        };
        const response = await new Promise((resolve, reject) => {
            request(
                {
                    url: `https://api.xf-yun.com/v1/private/s67c9c78c?authorization=${authorization}&host=api.xf-yun.com&date=${date}`,
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(body),
                },
                (err, res, body) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(body);
                    }
                }
            );
        });
        const parsedResponse = JSON.parse(response);
        if (parsedResponse.payload && parsedResponse.payload.face_compare_result) {
            const text = parsedResponse.payload.face_compare_result.text;
            if (text) {
                const result = JSON.parse(Buffer.from(text, "base64").toString());
                console.log(result);
                if (result.score > 0.67) {
                    console.log("是同一个人");
                    //如果管理员登录验证成功就设置一个token,没有token不允许请求管理员控制台获取视频信息的接口
                    const admintokenStr = jwt.sign({ admintoken: 'admintoken' }, config.jwtSecretKey, { expiresIn: '12000s' })
                    res.send({
                        status: 0,
                        msg: '是同一个人，管理员身份验证成功',
                        admintoken: 'Bearer ' + admintokenStr
                    });
                } else {
                    console.log("好像不是同一个人");
                    res.send({
                        status: 2,
                        msg: '不是同一个人，管理员身份验证失败'
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
        res.send({
            status: 1,
            msg: '在人脸比对过程中发生错误。请检查控制台获取详细信息。',
        });
    }
}
//要注册管理员，先验证他的密钥是否正确
function isadminfun(req, res) {
    console.log('发过来的密钥：', req.body.adminpassword);
    if (req.body.adminpassword === '管理员密钥') {
        res.send({
            status: 0,
            msg: '管理员注册密钥正确'
        })
    } else {
        res.send({
            status: 1,
            msg: '管理员注册密钥不正确'
        })
    }
}
//获取videos表，并且分页
function getvideostablefun(req, res) {
    const page = parseInt(req.query.page) || 1;//第几页
    const pageSize = parseInt(req.query.pageSize) || 10; //每页几条数据
    const offset = (page - 1) * pageSize;//推出此数组的起始下标
    let selectvideostablesql = 'SELECT * FROM videos LIMIT ? OFFSET ?';//limit每页几条，offset获取数组的起始下标
    db.query(selectvideostablesql, [pageSize, offset], function (err, result) {
        commonsqlerr(err, res);
        console.log('视频videos表:', result);
        if (result != []) {
            //同时我还想获取总视频数量
            let selectcount = 'select count(*) as count from videos'
            db.query(selectcount, function (err, getcountresult) {
                commonsqlerr(err, res);
                console.log('视频总条数', getcountresult[0].count);
                res.send({
                    status: 0,
                    msg: '成功获取videos表',
                    videoslist: result.map((video) => {
                        return {
                            video_id: video.video_id,
                            user_id: video.user_id,
                            title: video.title,
                            comment: video.comment,
                            like: video.like,
                            video: video.video,
                            release_time: moment(video.release_time).format('YYYY-MM-DD HH:mm:ss')
                        }
                    }),
                    count: getcountresult[0].count//顺便把视频总数量发送过去，不重要
                })
            })
        } else if (result == []) {
            res.send({
                status: 1,
                msg: 'videos表为空',
            })
        }
    })
}
//管理员删除视频
function admindeletevideofun(req, res) {
    console.log('管理员要删除视频的video_id', req.body.video_id);
    let admindeletevideosql = 'delete from videos where video_id=?'
    db.query(admindeletevideosql, [req.body.video_id], function (err, result) {
        commonsqlerr(err, res);
        if (result.affectedRows === 1) {
            res.send({
                msg: '管理员成功删除视频',
                status: 0
            })
        } else {
            res.send({
                msg: '管理员删除视频失败',
                status: 1
            })
        }
    })
}
//管理员编辑视频
function admineditvideofun(req, res) {
    console.log('要编辑的视频信息', req.body.newvideo);
    let updatevideosql = 'update videos set user_id=?,title=?,comment=?,`like`=?,video=?,release_time=? where video_id=?'
    db.query(updatevideosql, [req.body.newvideo.user_id, req.body.newvideo.title, req.body.newvideo.comment, req.body.newvideo.like, req.body.newvideo.video, req.body.newvideo.release_time, req.body.newvideo.video_id], function (err, result) {
        commonsqlerr(err, res);
        console.log('管理员编辑视频result:', result);
        if (result.affectedRows === 1) {
            res.send({
                msg: '管理员修改视频成功',
                status: 0
            })
        } else {
            res.send({
                msg: '管理员修改视频失败',
                status: 1
            })
        }
    })
}
//根据标题关键字搜索视频
function searchvideosbyliketitlefun(req, res) {
    console.log('标题关键字:', req.query.search);
    let selectvideosbysearchtitle = 'select*from videos where title like ?'
    db.query(selectvideosbysearchtitle, [`%${req.query.search}%`], function (err, result) {
        commonsqlerr(err, res);
        console.log('搜索结果result:', result);
        if (result.length != 0) {
            res.send({
                status: 0,
                msg: '成功获取搜索videos表',
                searchedvideoslist: result.map((video) => {
                    return {
                        video_id: video.video_id,
                        user_id: video.user_id,
                        title: video.title,
                        comment: video.comment,
                        like: video.like,
                        main_image: video.main_image,
                        video: video.video,
                        release_time: moment(video.release_time).format('YYYY-MM-DD HH:mm:ss')
                    }
                })
            })
        } else if (result.length === 0) {
            res.send({
                status: 1,
                msg: '没有搜索到这样的视频',
            })
        }
    })
}

module.exports = {
    registerfun,
    uploadFilefun,
    loginfun,
    getuserinfofun,
    uploadvideofun,
    getuservideofun,
    getallvideosfun,
    deletevideofun,
    likevideofun,
    getuserlikevideosfun,
    insertcommentfun,
    getcommentsbyvideoidfun,
    uploadavatarfun,
    facecomparefun,
    isadminfun,
    getvideostablefun,
    admindeletevideofun,
    admineditvideofun,
    searchvideosbyliketitlefun

}