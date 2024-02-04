<script setup>
//comonip引入
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip } = storeToRefs(commonstore)
//
import axios from 'axios';
import Nav from '../components/Nav.vue'
import { showSuccessToast, showFailToast } from 'vant';
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref } from 'vue'
const username = ref('')
const password = ref('')
const email = ref('')
const Submit = (e) => {
    e.preventDefault()
    axios.post(commonip.value+'/register', { username: username.value, password: password.value, email: email.value })
        .then((res) => {
            console.log(res.data);
            if (res.data.status == 8) {
                alert('用户名1-30位;密码开头非空白,6-12位;邮箱包含@')
            } else if (res.data.status == 0) {
                showSuccessToast('注册成功,请登录');
                router.push('/login')
            } else if (res.data.status == 2) {
                showFailToast('用户已经存在');
            } else if (res.data.status == 8) {
                console.log('sql语句执行失败,可能是连接数据库失败,sql语句不规范');
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
                <van-field v-model="email" type="email" name="邮箱" label="邮箱" placeholder="邮箱"
                    :rules="[{ required: true, message: '请填写邮箱' }]" />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" @click="Submit($event)">
                    注册
                </van-button>
            </div>
        </van-form>
    </div>
</template>
<style lang="scss" scoped></style>