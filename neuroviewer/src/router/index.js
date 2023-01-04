import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import test1 from '../components/test1.vue'
import test2 from '../components/test2.vue'
import test3 from '../components/test3.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/test1',
    name: 'test1',
    component: test1
  },
  {
    path: '/test2',
    name: 'test2',
    component: test2
  },
  {
    path: '/test3',
    name: 'test3',
    component: test3
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/' 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

export default router;