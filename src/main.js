import Vue from "vue";
import EelementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import App from "./App.vue";
import router from "./router";
//权限拦截
import './permission'
//使用EelementUI
Vue.use(EelementUI)
Vue.config.productionTip = process.env.NODE_ENV==='production';
console.log(process.env.VUE_APP_SERVICE_URL)//开发环境 development，生产环境production

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
