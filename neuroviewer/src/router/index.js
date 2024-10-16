import { createRouter, createWebHistory } from 'vue-router'
import Protected from '../components/Protected.vue'
import storageHelper from 'storage-helper'
import Main from '../components/Main.vue'
import test1 from '../components/test1.vue'
import test2 from '../components/test2.vue'
import test3 from '../components/test3.vue'
import 'bootstrap/dist/css/bootstrap.css'

const routes = [
  {
    path: '/neuroviewer/',
    name: 'Main',
    component: Main,
    meta: {
      requiresAuth: true
    }  
  },
  {
    path: '/protected',    
    name: 'Protected',
    component: Protected,
  }, 
  {
    path: '/test1',
    name: 'test1',
    component: test1,
    meta: {
      requiresAuth: true
    }  
  },
  {
    path: '/test2',
    name: 'test2',
    component: test2,
    meta: {
      requiresAuth: true
    }  
  },
  {
    path: '/test3',
    name: 'test3',
    component: test3,
    meta: {
      requiresAuth: true
    }  
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/neuroviewer/' ,
    meta: {
      requiresAuth: true
    }  
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!storageHelper.getItem('user-password')) { 
      const loginpath = window.location.pathname.replace('/neuroviewer','');
      next({ name: 'Protected', query: { from: loginpath } });      
    }
    else { next(); }
  } 
  else { next(); }
})

export default router;