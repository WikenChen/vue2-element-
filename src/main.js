import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/index.less';
import './style/public.less';

import { utils } from './utils/utils';

import Fragment from 'vue-fragment'; //编码但不渲染的标签,因vue2组件都是需要一个根标签，导致页面也会出现。
Vue.use(Fragment.Plugin);

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

Vue.prototype.$utils = utils;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
