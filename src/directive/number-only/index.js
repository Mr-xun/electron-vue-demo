import number from './number';
//只需输入number
const install = (Vue) => {
    Vue.directive('number-only', number);
};

if (window.Vue) {
    window['number-only'] = number;
    Vue.use(install);
}

number.install = install;
export default number;
