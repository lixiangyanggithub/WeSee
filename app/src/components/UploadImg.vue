<script setup>
//comonip引入
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip } = storeToRefs(commonstore)
//
import axios from 'axios'
import { showSuccessToast, showFailToast } from 'vant';
import { ref } from 'vue';
//上传图片
const fileList = ref([]);
const afterRead = (file) => {
  const formData = new FormData();
  formData.append('file', file.file);
  axios.post(commonip.value + '/uploadfile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((res) => {
      console.log('图片的文件名filename:', res.data.filename)
      if (res.data.status === 0) {
        showSuccessToast('图片上传成功')
        localStorage.setItem('main_image', res.data.filename);
      } else if (res.data.status === 1) {
        showFailToast('没有上传图片')
      } else {
        showFailToast('后端服务出错')
      }
    })
}
</script>
<template>
  <div>
    <van-uploader v-model="fileList" multiple :after-read="afterRead" :max-count="1"/>
  </div>
</template>
<style lang="scss" scoped>

</style>