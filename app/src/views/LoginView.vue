<script setup>
//comonip引入
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip } = storeToRefs(commonstore)
//
import axios from 'axios'
import Nav from '../components/Nav.vue'
import { showSuccessToast, showFailToast } from 'vant';
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref } from 'vue';
const username = ref('');
const password = ref('');
const Submit = (e) => {
  e.preventDefault()
  axios.post(commonip.value + '/login', { username: username.value, password: password.value, })
    .then((res) => {
      console.log(res.data);
      if (res.data.status == 0) {
        let userinfo = { user_id: res.data.user_id, username: res.data.username, token: res.data.token }
        localStorage.setItem('userinfo', JSON.stringify(userinfo))
        router.push({ path: '/videosbox', query: { user_id: res.data.user_id, username: res.data.username } })
      } else if (res.data.status == 1) {
        showSuccessToast('密码不正确');
      } else if (res.data.status == 2) {
        showFailToast('没有这个用户');
      } else if (res.data.status == 8) {
        console.log('sql语句执行失败');
      }
    })
}
</script>
<template>
  <Nav></Nav>
  <div>
    <van-form>
      <van-cell-group inset>
        <van-field v-model="username" name="用户名" label="用户名" placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]" />
        <van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]" />
      </van-cell-group>
      <div style="margin: 16px;" id="btnbox">
        <van-button round block type="primary" @click="Submit($event)">
          登录
        </van-button>
        <a href="/register">没有账号？去注册</a>
      </div>
    </van-form>
  </div>
</template>
<style lang="scss" scoped>
#btnbox {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>