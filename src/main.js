import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/index.less';
import './style/public.less';

import { utils } from './utils/utils'

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

Vue.prototype.$utils = utils;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
