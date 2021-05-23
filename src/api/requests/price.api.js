/* eslint-disable camelcase */
import request from '@/utils/request';
export default {
    /*****************价格维护*******************************/
    price_baseDrugPrice_list(params) {
        //分页查询机构调价单
        return request.jsonPost('/basic/baseDrugPrice/baseDrugPriceList', params);
    },
    price_baseDrugPrice_all(params = {}) {
        //查询所有机构调价单
        return request.jsonPost('/basic/baseDrugPrice/getAllBaseDrugPrices', params);
    },
    price_baseDrugPrice_add(params) {
        //新增机构调价单
        return request.jsonPost('/basic/baseDrugPrice/addBaseDrugPrice', params);
    },
    price_baseDrugPrice_update(params) {
        //修改机构调价单
        return request.jsonPut('/basic/baseDrugPrice/updateBaseDrugPrice', params);
    },
    price_baseDrugPrice_delete(deleteIds) {
        //删除机构调价单
        return request.deleted(`/basic/baseDrugPrice/${deleteIds}`);
    },
    basic_baseDrugPrice_template(params, filename) {
        //机构调价单excel导出模板
        return request.jsonDownload('/basic/baseDrugPrice/template', params, filename);
    },
    basic_baseDrugPrice_import(params) {
        //导入机构调价单
        return request.upload('/basic/baseDrugPrice/import', params);
    }
};
