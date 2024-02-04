<!-- 本文件是管理员验证身份的(1.请求拍照上传图片2.请求图片对比接口验证)相当于管理员登录 -->
<script setup>
import AdminGuide from '../components/AdminGuide.vue'

import { useRouter } from 'vue-router'
const router = useRouter()
import { showSuccessToast, showFailToast } from 'vant';
//comonip引入
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip } = storeToRefs(commonstore)
//
import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue'

//拍照上传图片
const videoElement = ref(null);
const canvasElement = ref(null);
const photoSrc = ref(`${commonip.value}/public/Yourimagehere.png`);
const takePhoto = () => {
    const video = videoElement.value;
    const canvas = canvasElement.value;
    if (video) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const data = canvas.toDataURL('image/png');
        photoSrc.value = data;
        uploadImage(data);
    }
};
const uploadImage = (imageData) => {
    const formData = new FormData();
    const blob = dataURItoBlob(imageData);
    formData.append('file', blob, 'photo.png');
    axios.post(commonip.value + '/uploadfile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then((res) => {
            console.log('上传人脸反馈:', res.data);
            if (res.data.status === 0) {
                showSuccessToast('成功上传人脸')
                //接下来，人脸比对
                axios.post(commonip.value + '/facecompare', { face: 'photo.png' })
                    .then((res) => {
                        console.log(res.data);
                        if (res.data.status === 0) {
                            showSuccessToast('管理员身份验证通过')
                            console.log('admintoken:', res.data.admintoken);
                            localStorage.setItem('admintoken', res.data.admintoken)
                            setTimeout(() => {
                                router.push('/adminworkspace')
                            }, 3000);
                        } else if (res.data.status === 2) {
                            showFailToast('管理员身份验证失败')
                        }
                    })
            } else {
                showFailToast('上传人脸失败，请继续')
            }
        })
};
// 添加一个变量用于保存摄像头流
let videoStream;
onMounted(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            videoStream = stream;  // 保存摄像头流
            videoElement.value.srcObject = stream;
            videoElement.value.play();
        })
});

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}
// 在组件销毁前关闭摄像头
onUnmounted(() => {
    if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop());
    }
});


const onClickLeft = () => history.back();
</script>
<template>
    <AdminGuide></AdminGuide>
    <div id="divbox">
        <van-nav-bar title="你好，管理员？管理员登录，先拍照验证身份吧" left-text="返回" left-arrow @click-left="onClickLeft" />
        <van-button type="primary" round size="large" @click="takePhoto">拍照登录</van-button>
        <div style="float: left; width: 50%"><video ref="videoElement"></video></div>
        <canvas ref="canvasElement" style="display: none;"></canvas><br />
        <img :src="photoSrc" alt="photo" style="float: left;">
    </div>
</template>
<style lang="scss" scoped>
#divbox {
    img {
        height: 60vh;
        width: 40vw;
        border-radius: 5%;
    }
}
</style>