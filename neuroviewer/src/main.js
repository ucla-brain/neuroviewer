/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


import { createApp } from 'vue';
import BootstrapVue3 from 'bootstrap-vue-3'
import router from './router'
import App from './App.vue';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})


const app = createApp(App)
console.log('App is building...')
app.use(router)
app.use(BootstrapVue3)
app.use(vuetify)
console.log('App is being built using bootstrap-vue-3')
app.mount('#app')
console.log('App successfully mounted')

