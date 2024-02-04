<script setup>
//comonip引入
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip } = storeToRefs(commonstore)
//
const { createEditor, createToolbar } = window.wangEditor
import axios from 'axios'
import ShowComments from './ShowComments.vue'
import { showSuccessToast } from 'vant';
import { ref, onMounted } from 'vue'
const commentText = ref('')
onMounted(() => {
    const editorConfig = {
        placeholder: '请在此输入......',
        onChange(editor) {
            commentText.value = editor.getHtml()
            console.log('commentText.value:', commentText.value)
        }
    }
    const editor = createEditor({
        selector: '#editor-container',
        html: '<p><br></p>',
        config: editorConfig,
        mode: 'default',
    })
    const toolbarConfig = {}
    createToolbar({
        editor,
        selector: '#toolbar-container',
        config: toolbarConfig,
        mode: 'default',
    })
})
const Submit = () => {
    let commentinfo = JSON.parse(localStorage.getItem('commentinfo'))
    if (commentinfo) {
        axios.post(commonip.value + '/insertcomment', { user_id: commentinfo.user_id, video_id: commentinfo.video_id, commentText: commentText.value })
            .then((res) => {
                if (res.data.status === 0) {
                    showSuccessToast('成功发布一条评论');
                    location.reload()
                } else if (res.data.status === 1) {
                    console.log('comment插入失败');
                } else if (res.data.status === 8) {
                    console.log('sql语句执行失败,可能是连接数据库失败,sql语句不规范');
                }
            })
    }
}
</script>
<template>
    <div>
        <ShowComments></ShowComments>
        <div id="editor-wrapper">
            <div id="toolbar-container"></div>
            <div id="editor-container"></div>
            <van-button type="primary" size="large" @click="Submit">发布评论</van-button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
#editor-wrapper {
    border: 1px solid #ccc;
    z-index: 100;
    width: 50vw;
    display: inline-block;
}

#toolbar-container {
    border-bottom: 1px solid #ccc;
}

#editor-container {
    height: 37vh;
}

.van-button {
    width: 50vw;
}

@media screen and (max-width: 600px) {
    #editor-wrapper {
        border: 1px solid #ccc;
        z-index: 100;
        width: 100vw;
    }

    #editor-container {
        height: 40vh;
    }

    .van-button {
        width: 100vw;
    }
}
</style>