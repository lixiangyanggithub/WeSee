<script setup>
import { showSuccessToast, showFailToast } from 'vant';
import { useRouter } from 'vue-router'
const router = useRouter()
import axios from 'axios'
let userinfo = JSON.parse(localStorage.getItem('userinfo'))
//comonip引入
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip } = storeToRefs(commonstore)
//
import { ref, computed, defineEmits, onMounted } from 'vue'
import * as echarts from 'echarts'
const onClickLeft = () => history.back();
const video_count = ref(10)
const like_count = ref(20)
const commented_count = ref(50)
const liked_count = ref(30)
const username = ref('')
const email = ref('')
const avatar = ref('')
const Echarts = () => {
  var Chart = echarts.init(document.getElementById('echarts'));
  //配置图表
  var option = {
    title: {
      text: '我的数据'
    },
    tooltip: {},
    legend: {
      data: ['我的数据']
    },
    xAxis: {
      data: ['发布视频', '被评论', '被点赞', '我点赞的']
    },
    yAxis: {},
    series: [
      {
        name: '我的数据',
        type: 'bar',
        data: [video_count.value, commented_count.value, liked_count.value, like_count.value]
      }
    ]
  };
  Chart.setOption(option);
}
//获取用户数据
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
          console.log('成功获取用户信息userinfomation:', res.data.userinfomation);
          video_count.value = res.data.userinfomation.video_count
          like_count.value = res.data.userinfomation.like_count
          commented_count.value = res.data.userinfomation.commented_count
          liked_count.value = res.data.userinfomation.liked_count
          username.value = res.data.userinfomation.username
          email.value = res.data.userinfomation.email
          avatar.value = commonip.value + '/public/' + res.data.userinfomation.avatar
          Echarts()
        } else if (res.data.status === 1) {
          console.log('获取用户信息失败');
        }
      })
  }
})

//隐藏按钮切换
const isshowbtn = ref(1)
//上传/更改头像
const uploadavatar = () => {
  let main_image = localStorage.getItem('main_image')
  console.log('上传的图片:', main_image);
  if (userinfo) {
    axios.post(commonip.value + '/uploadavatar', { avatar: main_image, username: userinfo.username })
      .then((res) => {
        if (res.data.status === 0) {
          showSuccessToast('成功上传头像')
        } else if (res.data.status === 1) {
          showFailToast('上传头像失败')
        }
      })
  }
}
//跳转到嵌套子组件图片上传
const gotouploadimg = () => {
  router.push('/personal/uploadimg')
  //平时隐藏按钮，子组件显示出来就显示上传头像按钮
  isshowbtn.value = 0
}
//退出
const exit = () => {
  //先回到首页，然后清空本地存储
  router.push('/')
  localStorage.clear()
}
//天气预报
const city = ref('***市')
const weather = ref('')
const wind = ref('')

onMounted(() => {
  if ('geolocation' in navigator) {
    //1.获取经纬度
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;//纬度
        const longitude = position.coords.longitude;//经度
        console.log('纬度:', latitude);
        console.log('经度:', longitude);
        //2.根据经纬度获取城市
        axios.get("http://apia.yikeapi.com/geocode/?appid=54566623&appsecret=Qx9dsA9q&output=json",
          { params: { location: longitude + ',' + latitude } }//前面的是经度+','+后面的纬度
        )
          .then((res) => {
            console.log('成功获取当地城市:', res.data.regeocode.addressComponent.city);
            city.value = res.data.regeocode.addressComponent.city.replace(/市/, '')//把市去掉，不然天气api查不到
            console.log('现在city.value:', city.value);
            //3.根据城市查询天气，这里其实应该用https，但是vite.config.js关闭了https请求
            axios.get("http://v0.yiketianqi.com/api?unescape=1&version=v9&appid=54566623&appsecret=Qx9dsA9q",
              { params: { city: city.value } })
              .then((res) => {
                console.log('成功获取天气预报:', res.data);
                weather.value = res.data.data[0].wea
                wind.value = res.data.data[0].win[0]
              })
          })
      },
      (error) => {
        console.error('Error getting location:', error.message);
      }
    );
  } else {
    console.error('Geolocation is not supported by your browser.');
  }
})

</script>

<template>
  <van-nav-bar title="个人中心" left-text="返回" left-arrow @click-left="onClickLeft" />
  <!-- 天气预报 -->
  <div>
    <span id="span_font_size">
      <lay-icon type="layui-icon-location"></lay-icon>
      {{ city }} 
      <lay-icon type="layui-icon-light"></lay-icon>
      {{ weather }} 
      <lay-icon type="layui-icon-release"></lay-icon>
      {{ wind }}
    </span>
  </div>
  <van-card :desc="username" title="您好！" :thumb="avatar">
    <template #tags>
      <van-tag plain type="primary">邮箱：{{ email }}</van-tag>
    </template>
    <template #footer>
      <van-button size="mini" @click="gotouploadimg">上传头像</van-button>
      <van-button size="mini" @click="exit">退出</van-button>
    </template>
  </van-card>

  <div id="uploadimgbox">
    <!-- 嵌套路由在此显示上传图片组件 -->
    <router-view></router-view>
    <van-button round type="success" @click="uploadavatar" :class="{ hidebtn: isshowbtn }">确定上传头像</van-button>
  </div>


  <div id="echarts"></div>
</template>
<style lang="scss" scoped>
#echarts {
  margin: auto;
  width: 40vw;
  height: 50vh;
}

@media screen and (max-width:600px) {
  #echarts {
    margin: auto;
    width: 100vw;
    height: 60vh;
  }
}

#uploadimgbox {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-content: center;
  flex-wrap: wrap;
  align-items: center;
}

.hidebtn {
  display: none;
}
#span_font_size{
  font-size: large;
}
</style>