/* eslint-disable camelcase */
import request from '@/utils/request';
export default {
    /*****************系统*******************************/
    system_user_all(params = {}) {
    //查询所有用户
        return request.post('/system/user/getAllUsers', params);
    },
    system_user_add(params) {
    //新增用户
        return request.jsonPost('/system/user/addUser', params);
    },
    system_user_update(params) {
    //修改用户
        return request.jsonPut('/system/user/updateUser', params);
    },
    system_user_checkCode(params) {
    //查询用户编码是否存在
        return request.get('/system/user/checkCodeExist', params);
    }
};
