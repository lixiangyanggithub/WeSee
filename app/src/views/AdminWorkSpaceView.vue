<script setup>
import AdminGuide from '../components/AdminGuide.vue'
let admintoken = localStorage.getItem('admintoken')
import { useRouter } from 'vue-router'
const router = useRouter()
import { showSuccessToast, showFailToast, Search } from 'vant';
// comonip引入,同时也引入要编辑视频的数据admineditvideoobj
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip, admineditvideoobj } = storeToRefs(commonstore)
//
import axios from 'axios'
const onClickLeft = () => history.back();
import { ref, onMounted } from 'vue'
//分页
const limit = ref(5)//限制每页10条数据
const currentPage1 = ref(1)
const total11 = ref(100)
const columns8 = ref([{ title: "视频ID", width: "5%", key: "video_id" }, { title: "标题", width: "40%", key: "title" }, { title: "发布时间", width: "11%", key: "release_time" }, { title: "用户ID", width: "5%", key: "user_id" }, { title: "视频地址", width: "22%", key: "video", customSlot: 'video' }, { title: "评论数量", width: "5%", key: "comment" }, { title: "点赞数量", width: "5%", key: "like" }, { title: "操作", width: "7%", key: "operator", customSlot: "operator" }])
const dataSource8 = ref([])

onMounted(() => {
    fetchData();
});
//管理员控制台获取视频列表
const fetchData = () => {
    if (admintoken) {
        axios.get(commonip.value + '/getvideostable', {
            //管理员不登录成功，没有有效的token不允许请求这个接口
            headers: {
                'Authorization': admintoken
            },
            params: {
                page: currentPage1.value,//告诉后端当前页数
                pageSize: limit.value //限制每页几条数据
            }
        })
            .then((res) => {
                if (res.data.status === 0) {
                    showSuccessToast('成功获取videos表');
                    dataSource8.value = res.data.videoslist;
                    total11.value = res.data.count//不重要，只是视频的总条数 
                } else if (res.data.status === 1) {
                    showFailToast('videos表为空');
                }
            })
    }
};

const handlePageChange = (page) => {
    console.log('Page Change Event:', page);
    currentPage1.value = page.current;
    fetchData();
};
//删除
const deletefun = (video_id) => {
    console.log('管理员要删除视频的id:', video_id);
    axios.post(commonip.value + '/admindeletevideo', { video_id: video_id })
        .then((res) => {
            if (res.data.status === 0) {
                showSuccessToast(`成功删除video_id为${video_id}的视频`)
                location.reload()
            } else if (res.data.status === 1) {
                showFailToast(`管理员删除视频${video_id}失败`)
            }
        })
}
//编辑:函数仅仅是跳转，并且将该视频的数据用pinia托管,这样编辑组件就可以渲染出要删除视频的数据
const editfun = (row) => {
    console.log('row:', row);
    admineditvideoobj.value = row
    router.push(`/adminworkspace/adminedit/${row.video_id}`)
}
//搜索
const value = ref('')
//全局搜索函数
const SearchFun = () => {
    if (admintoken) {
        axios.get(commonip.value + '/searchvideosbyliketitle', {
            headers: { 'Authorization': admintoken },
            params: { search: value.value }
        })
            .then((res) => {
                if (res.data.status === 0) {
                    showSuccessToast('成功搜索到')
                    //将搜索到的视频数组赋值替换掉原来的数组
                    dataSource8.value = res.data.searchedvideoslist
                } else if (res.data.status === 1) {
                    showFailToast('没有搜索到')
                }
            })
    }
}
//点击按钮调用搜索方法
const onClickButton = () => {
    showSuccessToast(value.value);
    SearchFun()
}
//回车调用搜索方法
const onSearch = (val) => {
    showSuccessToast(val)
    SearchFun()
};
</script>
<template>
    <AdminGuide></AdminGuide>
    <div id="bigbox">
        <van-nav-bar title="这里是管理员工作空间" left-text="返回" left-arrow @click-left="onClickLeft" />
        <!-- 搜索栏 -->
        <van-search v-model="value" show-action placeholder="请输入标题关键词" @search="onSearch" shape="round"
            background="#4fc08d">
            <template #action>
                <div @click="onClickButton">搜索</div>
            </template>
        </van-search>
        <!-- 表格渲染 -->
        <lay-table :columns="columns8" :data-source="dataSource8" even>
            <template v-slot:video="{ row }">
                <a :href="commonip + '/public/' + row.video" target="_blank">{{ commonip + '/public/' + row.video }}</a>
            </template>
            <template v-slot:operator="{ row }">
                <lay-button size="xs" type="primary" @click="editfun(row)">编辑</lay-button>
                <lay-button size="xs" type="danger" @click="deletefun(row.video_id)">删除</lay-button>
            </template>
        </lay-table>
        <!-- 编辑视频 -->
        <router-view></router-view>
        <!-- 分页 -->
        <lay-page v-model="currentPage1" :limit="limit" :total="total11" @change="handlePageChange"></lay-page>
    </div>
</template>
<style lang="scss" scoped>
a {
    color: green;
}

@media screen and (max-width:680px) {
    #bigbox {
        width: 500vw;
        position: relative;
    }
}
</style>