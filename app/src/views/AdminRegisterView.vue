<!-- 本文件是管理员人脸注册的 -->
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
    formData.append('file', blob, 'adminphoto.png');
    axios.post(commonip.value + '/uploadfile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then((res) => {
            if (res.data.status === 0) {
                console.log('成功上传人脸:', res.data);
                showSuccessToast('成功注册管理员')
                setTimeout(() => {
                    router.push('/admin')
                }, 2000)
            } else {
                console.log('失败上传人脸:', res.data);
                showFailToast('上传人脸失败，请重试')
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
//验证密钥成功后才允许这个人注册管理员
const adminpassword = ref('')
const isPasswordCorrect = ref(false);//密钥验证通过才允许点击拍照按钮绑定的函数
const Submit = (e) => {
    e.preventDefault()
    axios.post(commonip.value + '/isadmin', { adminpassword: adminpassword.value })
        .then((res) => {
            if (res.data.status === 0) {
                console.log('管理员密钥正确');
                showSuccessToast('管理员密钥正确')
                isPasswordCorrect.value = true;
            } else if (res.data.status === 1) {
                console.log('管理员密钥不正确');
                showFailToast('管理员密钥不正确')
                isPasswordCorrect.value = false;
            }
        })
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
        <van-nav-bar title="你好，管理员？请拍照注册吧" left-text="返回" left-arrow @click-left="onClickLeft" />
        <van-form>
            <van-cell-group inset>
                <van-field v-model="adminpassword" type="text" name="密钥" label="密钥" placeholder="请填写管理员密钥"
                    :rules="[{ required: true, message: '请填写管理员密钥' }]" />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round size="large" type="primary" @click="Submit($event)">
                    提交密钥（请先输入管理员密钥）
                </van-button>
            </div>
        </van-form>
        <!-- 密钥验证通过才允许点击拍照按钮绑定的函数 -->
        <van-button round size="large" type="success"
            @click="() => { isPasswordCorrect ? takePhoto() : null }">拍照注册</van-button>
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