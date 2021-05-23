/* eslint-disable linebreak-style */
import Vue from 'vue';
import api from '@/api';
import App from './App';
import i18n from './lang'; // internationalization
import UmyUi from 'umy-ui';
import moment from 'moment';
import store from './store';
import router from './router';
import Print from 'vue-print-nb';
import Element from 'element-ui';
import animated from 'animate.css';
import * as filters from './filters'; // global filters
import bus from '@/utils/eventBus.js';
import request from '@/utils/request';
import elDragDialog from '@/directive/el-drag-dialog';
import {
    hasPermission,
    hasNoPermission,
    hasAnyPermission
} from './utils/permissionDirect';

import './icons'; // icon
import './utils/error-log'; // error log
import '@/styles/index.scss'; // global css
import 'normalize.css/normalize.css'; // a modern alternative to CSS resets
import './styles/element-variables.scss';
import 'umy-ui/lib/theme-chalk/index.css'; // 引入样式
import 'element-ui/lib/theme-chalk/index.css';

// import VConsole from 'vconsole';
// new VConsole();
Vue.use(Print);
Vue.use(UmyUi);
Vue.use(animated);
Vue.use(Element, {
    i18n: (key, value) => i18n.t(key, value)
});
moment.locale('zh-cn');
let pinyin = require('js-pinyin');
pinyin.setOptions({ checkPolyphone: false, charCase: 1 }); //拼音 小写
const Plugins = [
    hasPermission,
    hasNoPermission,
    hasAnyPermission,
    elDragDialog
];
Plugins.map(plugin => {
    Vue.use(plugin);
});
Vue.prototype.$bus = bus;
Vue.prototype.$api = api;
Vue.prototype.$moment = moment;
Vue.prototype.$pinyin = pinyin;
Vue.prototype.$get = request.get;
Vue.prototype.$put = request.put;
Vue.prototype.$post = request.post;
Vue.prototype.$login = request.login;
Vue.prototype.$upload = request.upload;
Vue.prototype.$delete = request.deleted;
Vue.prototype.$jsonPut = request.jsonPut;
Vue.prototype.$jsonPost = request.jsonPost;
Vue.prototype.$download = request.download;
Vue.prototype.$jsonDownload = request.jsonDownload;
// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});
console.log(pinyin.getCamelChars('管理员'));
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');
