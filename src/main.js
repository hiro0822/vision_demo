import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";
Vue.config.productionTip = false

Vue.config.devtools = true

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
