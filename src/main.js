import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import VueMask from 'v-mask'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vco from 'v-click-outside'
import router from './router/index'
import VueLocalStorage from 'vue-localstorage'
import VueApexCharts from 'vue-apexcharts'
import setupAxios from '@/utils/interceptors'

import '../src/design/app.scss'

import store from '@/state/store'

import App from './App.vue'

Vue.use(VueRouter)
Vue.use(vco)
Vue.use(VueLocalStorage)

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(Vuelidate)
Vue.use(VueMask)
Vue.component('apexchart', VueApexCharts)

axios.defaults.baseURL = process.env.VUE_APP_AXIOS_URL

Vue.use(VueAxios, axios)
setupAxios()

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
