/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


import { createApp } from 'vue'; //for vue 3
import BootstrapVue3 from 'bootstrap-vue-3'
import router from './router'
// Import Vue App, routes, store
import App from './App.vue';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';


const app = createApp(App)
console.log('test1')
app.use(router)
app.use(BootstrapVue3)
console.log('test2')
app.mount('#app')
console.log('app mounted')

