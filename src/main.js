import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
// import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import {
  BootstrapVue,
  BIcon,
  // BIconChevronBarUp,
  // BIconChevronBarDown,
  BIconExclamationTriangleFill,
  BIconCaretUpFill,
  BIconEyeFill,
  BIconEyeSlashFill,
  BIconChevronLeft,
  BIconChevronRight,
  BIconPlus,
  BIconDash,
} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

Vue.use(BootstrapVue)
// Vue.use(BootstrapVueIcons);
Vue.component('BIcon', BIcon)
// Vue.component('BIconChevronBarUp', BIconChevronBarUp)
// Vue.component('BIconChevronBarDown', BIconChevronBarDown)
Vue.component('BIconExclamationTriangleFill', BIconExclamationTriangleFill)
Vue.component('BIconCaretUpFill', BIconCaretUpFill)
Vue.component('BIconEyeFill', BIconEyeFill)
Vue.component('BIconEyeSlashFill', BIconEyeSlashFill)
Vue.component('BIconChevronLeft', BIconChevronLeft)
Vue.component('BIconChevronRight', BIconChevronRight)
Vue.component('BIconPlus', BIconPlus)
Vue.component('BIconDash', BIconDash)
Vue.config.productionTip = false

sync(store, router)

// IDEA upgrade to vue 3. Wait for migration tool
// IDEA convert to typescript app

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
