import { ref } from 'vue'
import { defineStore } from 'pinia'

export const commonStore = defineStore('common', () => {
  //发布云服务只需将此127换为公网ip
  const commonip = ref('http://127.0.0.1:3000')
  //要编辑视频的数据，嵌套子组件要用到,托管一下，因为并不是父子组件关系，无法传值
  const admineditvideoobj=ref({})
  return { commonip,admineditvideoobj }
})
