<script setup>
import { showSuccessToast, showFailToast } from 'vant';
// comonip引入,同时也引入要编辑视频的数据admineditvideoobj
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip, admineditvideoobj } = storeToRefs(commonstore)
//
const onClickLeft = () => history.back();
import axios from 'axios'

//提交编辑
const SubmitEdit = (e) => {
    e.preventDefault()
    axios.post(commonip.value + '/admineditvideo', { newvideo: admineditvideoobj.value })
        .then((res) => {
            if (res.data.status === 0) {
                showSuccessToast('编辑视频成功')
            } else if (res.data.status === 1) {
                showFailToast('编辑视频失败')
            }
        })
}
</script>

<template>
    <van-nav-bar title="管理员编辑视频" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-form>
        <van-cell-group inset>
            <van-field v-model="admineditvideoobj.video_id" name="视频ID" label="视频ID" />
            <van-field v-model="admineditvideoobj.title" name="标题" label="标题" />
            <van-field v-model="admineditvideoobj.release_time" name="发布时间" label="发布时间" />
            <van-field v-model="admineditvideoobj.user_id" name="用户ID" label="用户ID" />
            <van-field v-model="admineditvideoobj.video" name="视频地址" label="视频地址" />
            <van-field v-model="admineditvideoobj.comment" name="评论数量" label="评论数量" />
            <van-field v-model="admineditvideoobj.like" name="点赞数量" label="点赞数量" />
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" @click="SubmitEdit($event)">
                确定修改
            </van-button>
        </div>
    </van-form>
</template>

<style lang="scss" scoped></style>
