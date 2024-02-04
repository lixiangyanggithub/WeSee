<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
let userinfo = JSON.parse(localStorage.getItem('userinfo'))
//comonip引入
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip } = storeToRefs(commonstore)
//
import axios from 'axios';
import { showSuccessToast, showFailToast } from 'vant';
import Video from '../components/Video.vue'
import { ref, onMounted } from 'vue'
const videos = ref([])
const username = ref('')
const email = ref('')
const active = ref(0)
const gotouploadVideo = () => {
    router.push({ path: '/uploadvideo', query: { username: username.value } })
}
//获取用户视频
const getuserVideos = () => {
    if (userinfo) {
        let user_id = userinfo.user_id
        axios.get(commonip.value + '/getuservideos', {
            headers: {
                'Authorization': userinfo.token
            },
            params: {
                user_id: user_id
            }
        })
            .then((res) => {
                if (res.data.status === 0) {
                    console.log('获取到用户视频：', res.data.videos);
                    videos.value = res.data.videos.map(video => ({
                        id: video.video_id,
                        videopath: video.video,
                        publishDate: video.release_time,
                        title: video.title,
                        main_image: video.main_image,
                        like: video.like,
                        comment: video.comment,
                    }));
                    showSuccessToast('成功获取该用户所有视频');
                } else if (res.data.status === 1) {
                    showFailToast('该用户没有视频');
                } else if (res.data.status === 8) {
                    console.log('sql语句执行失败, 可能是连接数据库失败, sql语句不规范');
                }
            })
    }
}

//获取用户喜欢的视频
const getuserlikeVideos = () => {
    if (userinfo) {
        let user_id = JSON.parse(localStorage.getItem('userinfo')).user_id
        axios.get(commonip.value + '/getuserlikevideos', {
            headers: {
                'Authorization': userinfo.token
            },
            params: {
                user_id: user_id
            }
        })
            .then((res) => {
                if (res.data.status === 0) {
                    videos.value = res.data.videos.map(video => ({
                        id: video.video_id,
                        videopath: video.video,
                        publishDate: video.release_time,
                        title: video.title,
                        main_image: video.main_image,
                        like: video.like,
                        comment: video.comment,
                    }));
                    console.log('获取用户喜欢的视频videos.value:', videos.value);
                    showSuccessToast('成功获取该用户喜欢的视频');
                } else if (res.data.status === 1) {
                    showFailToast('该用户没有喜欢的视频');
                } else if (res.data.status === 2) {
                    showFailToast('userslike表有video_id,但是videos表没有这些视频');
                }
            })
    }
}

//获取video表所有的视频
const getAllvideos = () => {
    axios.get(commonip.value + '/getallvideos')
        .then((res) => {
            if (res.data.status === 0) {
                console.log('成功获取videos表所有的视频');
                showSuccessToast('成功获取videos表所有的视频');
                videos.value = res.data.videos.map((video) => ({
                    id: video.video_id,
                    videopath: video.video,
                    publishDate: video.release_time,
                    title: video.title,
                    main_image: video.main_image,
                    like: video.like,
                    comment: video.comment,
                }));
            }
        })
}

//页面加载完毕才获取所有的视频
onMounted(() => {
    getAllvideos()
})
//获取用户信息
onMounted(() => {
    if (userinfo) {
        axios.get(commonip.value + '/getuserinfo', {
            headers: {
                'Authorization': userinfo.token
            },
            params: {
                username: userinfo.username
            }
        })
            .then((res) => {
                if (res.data.status === 0) {
                    console.log('成功获取userinformation:', res.data.userinfomation);
                    username.value = res.data.userinfomation.username;
                    email.value = res.data.userinfomation.email;
                } else if (res.data.status === 1) {
                    console.log('获取userinformation失败');
                }
            })
    }
})
//搜索
const value = ref('');
//搜索函数定义
const getsearchedvideos = () => {
    if (userinfo) {
        axios.get(commonip.value + '/searchvideosbyliketitle', {
            headers: {
                'Authorization': userinfo.token
            },
            params: {
                search: value.value
            }
        }).then((res) => {
            if (res.data.status === 0) {
                showSuccessToast('成功搜索到视频')
                console.log('搜索到的视频数组',res.data.searchedvideoslist);
                //将搜索到的视频数组替换给原数组
                videos.value = res.data.searchedvideoslist.map((video) => ({
                    id: video.video_id,
                    videopath: video.video,
                    publishDate: video.release_time,
                    title: video.title,
                    main_image: video.main_image,
                    like: video.like,
                    comment: video.comment,
                }));
            } else if (res.data.status === 1) {
                showFailToast('没有搜索到视频')
            }
        })
    }
}
//按钮调用搜索函数
const onClickButton = () => {
    showSuccessToast(value.value)
    getsearchedvideos()
}
//回车调用搜索函数
const onSearch = (val) => {
    showSuccessToast(val)
    getsearchedvideos()
}
</script>
<template>
    <div>
        <van-nav-bar :title="`用户名：${username} 邮箱：${email}`" left-text="首页" left-arrow @click-left="router.push('/')" />
        <!-- 搜索 -->
        <van-search v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch" shape="round"
            background="#4fc08d">
            <template #action>
                <div @click="onClickButton">搜索</div>
            </template>
        </van-search>

        <router-view></router-view>

        <div id="videoBox">
            <Video v-for="video in videos" :getAllvideos="getAllvideos" :videopath="video.videopath" :title="video.title"
                :main_image="video.main_image" :publishDate="video.publishDate" :id="video.id" :like="video.like"
                :comment="video.comment" @changelikeoffarther="video.like++"></Video>
            <van-empty description="到底了" />
        </div>

        <van-tabbar v-model="active">
            <van-tabbar-item icon="search" @click="getAllvideos">视频</van-tabbar-item>
            <van-tabbar-item icon="video-o" @click="getuserVideos">我的视频</van-tabbar-item>
            <van-tabbar-item icon="like-o" @click="getuserlikeVideos">喜欢的视频</van-tabbar-item>
            <van-tabbar-item icon="photograph" @click="gotouploadVideo">上传视频</van-tabbar-item>
            <van-tabbar-item icon="photograph" @click="router.push('/personal')">个人中心</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<style lang="scss" scoped>
#videoBox {
    display: flex;
    float: right;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;
}

.van-empty {
    margin: auto;
    width: 100vw;
}
</style>