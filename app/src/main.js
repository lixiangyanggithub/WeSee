import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import App from './App.vue'
import router from './router/router.js'

// 1. 引入你需要的组件
import { Button, Form, Field, CellGroup, Icon, Divider, Swipe, SwipeItem, NavBar, Card, Tag, Tabbar, TabbarItem, Empty, Uploader, Sidebar, SidebarItem, Search } from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
pinia.use(piniaPersist)
app.use(router)
// 3. 注册你需要的组件
app.use(Button);
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use(Icon)
app.use(Divider);
app.use(Swipe);
app.use(SwipeItem);
app.use(NavBar)
app.use(Card)
app.use(Tag)
app.use(Tabbar);
app.use(TabbarItem);
app.use(Empty)
app.use(Uploader)
app.use(Sidebar);
app.use(SidebarItem);
app.use(Search)
// 使用layui vue
import Layui from '@layui/layui-vue'
//注释掉下面一行，不然three.js的数值就看不见了
import '@layui/layui-vue/lib/index.css'
app.use(Layui)

//3D效果--------------------------------------------
// import * as THREE from 'three';
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );
// camera.position.z = 5;
// function animate() {
// 	requestAnimationFrame( animate );
// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;
// 	renderer.render( scene, camera );
// }
// animate();
//----------------------------------------------------
app.mount('#app')
