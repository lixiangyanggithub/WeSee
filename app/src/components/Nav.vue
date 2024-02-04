<script setup>
</script>
<template>
    <nav>
        <a href="/">首页</a>
        <a href="/videosbox">视频</a>
        <a href="/personal">个人中心</a>
        <a href="/login">登录</a>
        <a href="/register">注册</a>
        <a style="color: orange;" href="/adminregister">管理员?</a>
    </nav>
</template>
<style lang="scss" scoped>
nav {
    display: flex;
    justify-content: space-around;
    background-color: #4CAF50;
    padding: 0.5% 0;
}

nav a {
    text-decoration: none;
    color: #fff;
    font-weight: bold;
    padding: 0.5%;
    transition: background-color 0.3s ease;
    font-size: 2vw;
}

@media screen and (max-width:680px) {
    nav a {
        text-decoration: none;
        color: #fff;
        font-weight: bold;
        padding: 0.5%;
        transition: background-color 0.3s ease;
        font-size: large;
    }
}

nav a:hover {
    background-color: #555;
}
</style>