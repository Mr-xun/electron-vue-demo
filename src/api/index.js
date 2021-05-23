/* eslint-disable camelcase */
let api = {};
const importAll = (r) => {
    r.keys().forEach((key) => Object.assign(api,r(key).default) );
};
importAll(require.context('./requests', true, /\.api\.js/));
export default {
    ...api
};
