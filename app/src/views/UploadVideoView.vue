<script setup>
//comonip引入
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip } = storeToRefs(commonstore)
//
const onClickLeft = () => history.back();
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter()
import { showSuccessToast, showFailToast } from 'vant';
import UploadFile from '../components/UploadFile.vue'
import UploadImg from '../components/UploadImg.vue'
import Nav from '../components/Nav.vue'
import { ref } from 'vue'
const title = ref('')
const Sbumit = (e) => {
    e.preventDefault()
    if (localStorage.getItem('userinfo')) {
        let userinfo = JSON.parse(localStorage.getItem('userinfo'))
        let video = localStorage.getItem('filepath')
        let main_image = localStorage.getItem('main_image')
        let user_id = userinfo.user_id
        //获取时间并且加工成数据库可以插入的时间
        let release_time = new Date();//Fri Dec 15 2023 23:32:26 GMT+0800 (China Standard Time)
        let year = release_time.getFullYear();
        let month = release_time.getMonth() + 1;
        let day = release_time.getDate();
        let hour = release_time.getHours();
        let minute = release_time.getMinutes();
        let second = release_time.getSeconds();
        release_time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        console.log(release_time);//2023-12-15 23:32:55
        axios.post(commonip.value + '/uploadvideo', {
            user_id: user_id,
            title: title.value,
            video: video,
            release_time: release_time,
            main_image: main_image
        })
            .then((res) => {
                if (res.data.status === 0) {
                    showSuccessToast('视频上传成功');
                    setTimeout(() => {
                        router.push('/videosbox');
                    }, 2000);
                } else if (res.data.status === 8) {
                    console.log('sql语句执行失败, 可能是连接数据库失败, sql语句不规范');
                }
            })
    }
}
</script>
<template>
    <Nav></Nav>
    <div>
        <van-nav-bar title="上传视频" left-text="返回" left-arrow @click-left="onClickLeft" />
        <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
            第一步：选择视频
        </van-divider>
        <div class="divcenter">
            <UploadFile></UploadFile>
        </div>
        <van-divider :style="{ color: '#1989fa', borderColor: 'orange', padding: '0 16px' }">
            第二步: 选择主图
        </van-divider>
        <div class="divcenter">
            <UploadImg></UploadImg>
        </div>
        <van-divider :style="{ color: '#1989fa', borderColor: 'green', padding: '0 16px' }">
            第三步: 输入视频标题
        </van-divider>
        <van-cell-group inset>
            <van-field v-model="title" rows="5" autosize label="视频标题：" type="textarea" maxlength="50" placeholder="请输入标题"
                show-word-limit />
        </van-cell-group>
        <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
            第四布: 点击提交按钮
        </van-divider>
        <van-button type="primary" @click="Sbumit($event)" size="large">提交</van-button>
    </div>
</template>
<style lang="scss" scoped>
.divcenter {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.van-cell {
    background-color: rgb(200, 245, 230);
}
</style>