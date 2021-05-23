import focus from './focus';
//获取焦点
const install = function(Vue) {
    Vue.directive('focus', focus);
};
if (window.Vue) {
    window['focus'] = focus;
    Vue.use(install);
}
focus.install = install;
export default focus;
