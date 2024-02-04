<script setup>
import { ref } from 'vue'
//comonip引入
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip } = storeToRefs(commonstore)
//
import axios from 'axios';
// 获取当前页面的 URL
const currentURL = window.location.href;
// 使用正则表达式匹配视频 ID
const matchResult = currentURL.match(/\/commentvideo\/(\d+)/);
// 提取视频 ID
const video_id = matchResult ? matchResult[1] : null;
console.log('根据当前页面的URL获取video_id:', video_id);
const comments = ref([])
if (video_id) {
    axios.get(commonip.value+'/getcommentsbyvideoid', { params: { video_id: video_id } })
        .then((res) => {
            if (res.data.status === 0) {
                console.log('成功根据此视频video_id获取到其所有的评论comments:', res.data.comments)
                comments.value = res.data.comments
            } else if (res.data.status === 1) {
                console.log('该视频没有评论');
            }
        })
}
</script>
<template>
    <div id="comments">
        <h2 style="color: #0099ff;text-align: center;">评论列表</h2>
        <ul>
            <li v-for="comment in comments" :key="comment.comment_id">
                <van-divider :style="{ color: 'orange', borderColor: '#1989fa', padding: '0 16px' }">
                    视频 ID: {{ comment.video_id }} &nbsp; 用户ID : {{ comment.user_id }}
                </van-divider>
                <span v-html="comment.commentText"></span>
            </li>
        </ul>
    </div>
</template>
<style lang="scss" scoped>
#comments {
    width: 45vw;
    height: 55vh;
    background-color: #E3EDCD;
    float: left;
    margin-right: 1%;
    margin-left: 1%;
    /* 滚动条 */
    overflow-y: auto;
}

@media screen and (max-width:600px) {
    #comments {
        width: 100vw;
        height: 40vh;
        background-color: #E3EDCD;
        float: left;
        margin-right: 1%;
        margin-left: 1%;
        overflow-y: auto;
    }
}
</style>