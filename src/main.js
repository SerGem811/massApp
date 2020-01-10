import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import VueDataTables from 'vue-data-tables'

// import Notifications from 'vue-notification'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
// import 'element-theme-default'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/assets/global.css'


Vue.use(ElementUI, {locale});
Vue.use(VueDataTables);

// Vue.use(Notifications);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
