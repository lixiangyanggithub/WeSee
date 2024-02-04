<script setup>
//comonip引入
import { commonStore } from '../stores/common.js'
import { storeToRefs } from 'pinia'
const commonstore = commonStore()
const { commonip } = storeToRefs(commonstore)
//
import Nav from '../components/Nav.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref } from 'vue'
const images = ref([
    commonip.value + '/public/cat.jpeg',
    commonip.value + '/public/leaf.jpeg'
])
//3D three.js--------------------------------------------------------------------
import * as THREE from 'three';
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//导入lil.gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
//场景
const scene = new THREE.Scene();
//相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);
//创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const parentmaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
//创建网格
const parentcube = new THREE.Mesh(geometry, parentmaterial)
const cube = new THREE.Mesh(geometry, material);

//设置父元素为线框模式
parentmaterial.wireframe = true

//设置立方体坐标
parentcube.position.set(-3, 0, 0)
cube.position.set(3, 0, 0)

//立方体放大2倍
// cube.scale.set(2, 2, 2)//子元素放大2倍
// parentcube.scale.set(2,2,2)//父元素也放大2倍，导致子元素又被放大2倍

//绕指定的轴旋转
// cube.rotation.x = Math.PI / 4  //绕X轴旋转45度
// parentcube.rotation.x = Math.PI / 4 //父元素绕x旋转45度，子元素在旋转45度基础上面再旋转45度

//父元素添加子元素
parentcube.add(cube)//局部

//讲网格添加到场景中(全局)
scene.add(parentcube);
// scene.add(cube);

//设置相机位置
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2
camera.lookAt(0, 0, 0)

//添加坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//添加轨道控制器
// const controls = new OrbitControls( camera, document.body );//整个页面都可以控制轨道
const controls = new OrbitControls(camera, renderer.domElement);

//设置带阻尼的惯性
controls.enableDamping = true;

//设置阻尼系数
controls.dampingFactor = 0.05

//设置自动旋转
// controls.autoRotate=true

function animate() {
    controls.update()
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();

//监听窗口自适应
window.addEventListener('resize', () => {
    //重置渲染器宽高比
    renderer.setSize(window.innerWidth, window.innerHeight);
    //重置相机宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    //更新相机投影矩阵
    camera.updateProjectionMatrix();
});

//定义一个事件对象
let eventObj = {
    Fullscreen: function () {
        document.body.requestFullscreen()//全屏
    },
    Existscreen: function () {
        document.exitFullscreen()//退出全屏
    }
}
//创建GUI
const gui = new GUI();

//添加按钮
gui.add(eventObj, 'Fullscreen').name('全屏');
gui.add(eventObj, 'Existscreen').name('退出全屏');

//控制立方体位置
// gui.add(cube.position, 'x', -10, 10).name('X轴');//范围-10~10
// gui.add(cube.position, "x").min(-5).max(5).step(1).name('立方体x轴')
// gui.add(cube.position, "y").min(-5).max(5).step(1).name('立方体y轴')
// gui.add(cube.position, "z").min(-5).max(5).step(1).name('立方体z轴')

//文件夹
const folser = gui.addFolder('立方体位置')
folser.add(cube.position, 'x').min(-5).max(5).step(1).name('立方体x轴').onChange((val) => {
    console.log('x:', val);
})
folser.add(cube.position, "y").min(-5).max(5).step(1).name('立方体y轴').onFinishChange((val) => {
    console.log('y:', val);
})
folser.add(cube.position, "z").min(-5).max(5).step(1).name('立方体z轴')

//打开或者关闭父元素线框模式
gui.add(parentmaterial, 'wireframe').name('父元素线框模式')

//设置立方体颜色
let cubeColor = {
    color: '#00ff00'
}
gui.addColor(cubeColor, 'color').name('立方体颜色').onChange((val) => {
    cube.material.color.set(val)
})

//------------------------------------------------------------------
</script>
<template>
    <Nav></Nav>
    <van-swipe :autoplay="3000" lazy-render>
        <van-swipe-item v-for="image in images" :key="image">
            <img :src="image" />
        </van-swipe-item>
    </van-swipe>
    <h1><span>We</span>See</h1>
    <h2>视频本该如此简洁</h2>
    <p>Copyright © 2023-2024.(V1.0) WeSee</p>
</template>
<style lang="scss" scoped>
h1 {
    span {
        color: red;
    }

    font-size: 6vh;
    text-align: center;
}

h2 {
    color: #0099ff;
    text-align: center;
}

p {
    margin-top: 2%;
    color: #999;
    text-align: center;
}

.van-swipe-item {
    img {
        width: 100vw;
        height: 65vh;
    }
}
</style>