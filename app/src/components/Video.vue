<script setup>
//comonip引入
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip } = storeToRefs(commonstore)
//
import axios from 'axios';
let userinfo = JSON.parse(localStorage.getItem('userinfo'))
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref, defineEmits } from 'vue'
const emits = defineEmits()
import { showSuccessToast, showFailToast } from 'vant';
import { defineProps } from 'vue'
const props = defineProps(['videopath', 'title', 'id', 'publishDate', 'main_image', 'like', 'comment', 'getAllvideos'])

//删除视频
const deletevideo = () => {
    if (userinfo) {
        axios.post(commonip.value + '/deletevideo', {
            video_id: props.id,
            user_id: userinfo.user_id
        })
            .then((res) => {
                if (res.data.status === 0) {
                    showSuccessToast(`成功删除此视频, video_id: ${props.id}`);
                    location.reload();
                } else if (res.data.status === 1) {
                    showFailToast('删除失败，视频不存在');
                } else if (res.data.status === 8) {
                    console.log('sql语句执行失败, 可能是连接数据库失败, sql语句不规范');
                } else if (res.data.status === 3) {
                    showFailToast('没有权利删除此视频, 此视频不属于你');
                }
            })
    }
}

const islike = ref(0)
//喜欢视频点赞
const like = () => {
    islike.value = true
    if (userinfo) {
        axios.post(commonip.value + '/likevideo', {
            video_id: props.id,
            user_id: userinfo.user_id
        })
            .then((res) => {
                if (res.data.status === 0) {
                    emits('changelikeoffarther');
                    console.log(`成功点赞此视频, video_id: ${props.id}`);
                } else if (res.data.status === 8) {
                    console.log('sql语句执行失败, 可能是连接数据库失败, sql语句不规范');
                }
            })
    }
}
//评论
const comment = async () => {
    let video_id = props.id
    if (userinfo) {
        localStorage.setItem('commentinfo', JSON.stringify({
            user_id: userinfo.user_id,
            video_id: video_id,
        }))
        // 等待导航完成,再刷新页面,不然就先刷新，但是video_id并没有改变,所以用异步函数等待
        await router.push(`/videosbox/commentvideo/${props.id}`)
        location.reload();
    }
}

</script>
<template>
    <div class="videoBox">
        <div>
            <video :src="commonip + '/public/' + props.videopath" controls="controls" width="100%" height="300"
                :poster="commonip + '/public/' + props.main_image"></video>
        </div>
        <div>
            <van-icon :class="{ like: islike }" name="like-o" @click="like" :badge="props.like" /> &nbsp;
            <van-icon name="chat-o" @click="comment" :badge="props.comment" /> &nbsp;
            <van-icon name="delete" @click="deletevideo" /> &nbsp;
            <span><span>VideoID:</span> {{ props.id }}</span> &nbsp;
            <span class="title"><span>标题:</span> {{ props.title }}</span> &nbsp;
            <span><span>发布日期:</span> {{ props.publishDate }}</span> &nbsp;
        </div>
    </div>
</template>
<style lang="scss" scoped>
.van-icon {
    font-size: 30px;
}

.like {
    color: red;
}

.videoBox {
    margin: 0.1%;
    width: 32.9%;
    border: 2px green solid;

    >div {
        margin: 0.1%;
    }
}

.title {
    overflow: hidden;
    /* 隐藏溢出部分 */
    word-wrap: break-word;
    /* 允许自动换行 */
}

@media screen and (max-width: 600px) {
    .videoBox {
        margin: 0.1%;
        border: 2px green solid;
        width: 100%;

        >div {
            margin: 0.1%;
        }

        video {
            height: 100%;
        }
    }
}
</style>

