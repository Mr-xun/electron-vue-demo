import jump from './jump';
const install = (Vue) => {
    Vue.directive('enter-jump', jump);
};
if (window.Vue) {
    window['enter-jump'] = install;
    Vue.use(install);
}
jump.install = install;
export default jump;
