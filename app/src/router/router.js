import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
//懒加载
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const UploadFile = () => import('../components/UploadFile.vue')
const UploadImg = () => import('../components/UploadImg.vue')
const UploadVideoView = () => import('../views/UploadVideoView.vue')
const RichTextEditor = () => import('../components/RichTextEditor.vue')
const VideosBoxView = () => import('../views/VideosBoxView.vue')
const PersonalView = () => import('../views/PersonalView.vue')
const AdminView = () => import('../views/AdminView.vue')
const AdminEditView = () => import('../views/AdminEditView.vue')
const AdminRegisterView = () => import('../views/AdminRegisterView.vue')
const AdminWorkSpaceView = () => import('../views/AdminWorkSpaceView.vue')
const router = createRouter({
    // history: createWebHashHistory(),
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },
        { path: '/login', component: LoginView },
        { path: '/register', component: RegisterView },
        { path: '/adminregister', component: AdminRegisterView },
        { path: '/uploadfile', component: UploadFile },
        { path: '/uploadimg', component: UploadImg },
        { path: '/uploadvideo', component: UploadVideoView },
        {
            path: '/personal', component: PersonalView,
            children: [
                {
                    path: 'uploadimg',
                    component: UploadImg
                }
            ]
        },
        { path: '/admin', component: AdminView },
        {
            path: '/adminworkspace', component: AdminWorkSpaceView,
            children: [
                {
                    path: 'adminedit/:video_id',//子路由adminedit前面不要加/
                    component: AdminEditView
                }
            ]
        },
        //嵌套路由
        {
            path: '/videosbox', component: VideosBoxView,
            children: [
                {
                    path: 'commentvideo/:video_id',
                    component: RichTextEditor
                }
            ]
        },
        { path: '/richtexteditor', component: RichTextEditor },
    ]
})
export default router