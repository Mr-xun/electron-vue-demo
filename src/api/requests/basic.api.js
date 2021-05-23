/* eslint-disable camelcase */
import request from '@/utils/request';
export default {
    /*****************档案*******************************/
    basic_enum_list(params) {
        //分页查询枚举字典
        return request.jsonPost('/basic/baseEnum/baseEnumList', params);
    },
    basic_enum_all(params = {}) {
        //查询所有枚举字典
        return request.jsonPost('/basic/baseEnum/getAllBaseEnums', params);
    },
    basic_enum_add(params) {
        //新增枚举字典
        return request.jsonPost('/basic/baseEnum/addBaseEnum', params);
    },
    basic_enum_checkCode(params) {
        //枚举字典查询编码是否存在
        return request.get('/basic/baseEnum/checkCodeExist', params);
    },
    basic_enum_update(params) {
        //修改枚举字典
        return request.jsonPut('/basic/baseEnum/updateBaseEnum', params);
    },
    basic_enum_delete(deleteIds) {
        //删除枚举字典
        return request.deleted(`/basic/baseEnum/${deleteIds}`);
    },
    basic_baseEnum_export(params, filename) {
        //导出枚举字典
        return request.jsonDownload('/basic/baseEnum/excel', params, filename);
    },
    basic_enum_condition() {
        //根据查询条件获取枚举字典list
        return request.get('/basic/baseEnum/getListByCondition');
    },
    basic_baseOrg_getOneOrg(params) {
        //根据参数查询机构对象（feign）
        return request.jsonPost('/basic/baseOrg/getOneBaseOrg', params);
    },
    basic_baseOrg_list(params) {
        //分页查询机构
        return request.jsonPost('/basic/baseOrg/baseOrgList', params);
    },
    basic_baseOrg_all(params = {}) {
        //查询所有机构
        return request.jsonPost('/basic/baseOrg/getAllBaseOrgs', params);
    },
    basic_baseOrg_checkCode(params) {
        //查询机构编码是否存在
        return request.get('/basic/baseOrg/checkCodeExist', params);
    },
    basic_baseOrg_add(params) {
        //新增机构
        return request.jsonPost('/basic/baseOrg/addBaseOrg', params);
    },
    basic_baseOrg_update(params) {
        //修改机构
        return request.jsonPut('/basic/baseOrg/updateBaseOrg', params);
    },
    basic_baseOrg_delete(deleteIds) {
        //删除机构
        return request.deleted(`/basic/baseOrg/${deleteIds}`);
    },
    basic_baseOrg_export(params, filename) {
        //导出机构
        return request.jsonDownload('/basic/baseOrg/excel', params, filename);
    },
    basic_baseWarehouse_list(params) {
        //分页查询仓库
        return request.jsonPost('/basic/baseWarehouse/baseWarehouseList', params);
    },
    basic_baseWarehouse_all(params = {}) {
        //查询所有仓库
        return request.jsonPost('/basic/baseWarehouse/getAllBaseWarehouses', params);
    },
    basic_baseWarehouse_checkCode(params) {
        //查询仓库编码是否存在
        return request.get('/basic/baseWarehouse/checkCodeExist', params);
    },
    basic_baseWarehouse_add(params) {
        //新增仓库
        return request.jsonPost('/basic/baseWarehouse/addBaseWarehouse', params);
    },
    basic_baseWarehouse_update(params) {
        //修改仓库
        return request.jsonPut('/basic/baseWarehouse/updateBaseWarehouse', params);
    },
    basic_baseWarehouse_delete(deleteIds) {
        //删除仓库
        return request.deleted(`/basic/baseWarehouse/${deleteIds}`);
    },
    basic_baseWarehouse_export(params, filename) {
        //导出仓库
        return request.jsonDownload('/basic/baseWarehouse/excel', params, filename);
    },
    basic_baseDrugInf_list(params) {
        //分页查询商品
        return request.jsonPost('/basic/baseDrugInf/baseDrugInfList', params);
    },
    basic_baseDrugInf_listByPage(params) {
        //分页查询商品(无权限)
        return request.jsonPost('/basic/baseDrugInf/getAllBaseDrugInfsByPage', params);
    },
    basic_baseDrugInf_all(params = {}) {
        //查询所有商品
        return request.jsonPost('/basic/baseDrugInf/getAllBaseDrugInfs', params);
    },
    basic_baseDrugInf_checkCode(params) {
        //查询商品编码是否存在
        return request.get('/basic/baseDrugInf/checkCodeExist', params);
    },
    basic_baseDrugInf_getOneDrugInfo(code) {
        //根据商品编码查询商品(feign)
        return request.get(`/basic/baseDrugInf/getDrugByCode/${code}`);
    },
    basic_baseDrugInf_add(params) {
        //新增商品
        return request.jsonPost('/basic/baseDrugInf/addBaseDrugInf', params);
    },
    basic_baseDrugInf_update(params) {
        //修改商品
        return request.jsonPut('/basic/baseDrugInf/updateBaseDrugInf', params);
    },
    basic_baseDrugInf_delete(deleteIds) {
        //删除商品
        return request.deleted(`/basic/baseDrugInf/${deleteIds}`);
    },
    basic_baseDrugInf_export(params, filename) {
        //导出商品
        return request.jsonDownload('/basic/baseDrugInf/excel', params, filename);
    },
    basic_basePhysician_list(params) {
        //分页查询医生
        return request.jsonPost('/basic/basePhysician/basePhysicianList', params);
    },
    basic_basePhysician_all(params = {}) {
        //查询所有医生
        return request.jsonPost('/basic/basePhysician/getAllBasePhysicians', params);
    },
    basic_basePhysician_checkCode(params) {
        //查询医生编码是否存在
        return request.get('/basic/basePhysician/checkCodeExist', params);
    },
    basic_basePhysician_add(params) {
        //新增医生
        return request.jsonPost('/basic/basePhysician/addBasePhysician', params);
    },
    basic_basePhysician_update(params) {
        //修改医生
        return request.jsonPut('/basic/basePhysician/updateBasePhysician', params);
    },
    basic_basePhysician_delete(deleteIds) {
        //删除医生
        return request.deleted(`/basic/basePhysician/${deleteIds}`);
    },
    basic_basePhysician_export(params, filename) {
        //导出医生
        return request.jsonDownload('/basic/basePhysician/excel', params, filename);
    },
    basic_baseDepartment_list(params) {
        //分页查询科室
        return request.jsonPost('/basic/baseDepartment/baseDepartmentList', params);
    },
    basic_baseDepartment_all(params = {}) {
        //查询所有科室
        return request.jsonPost('/basic/baseDepartment/getAllBaseDepartments', params);
    },
    basic_baseDepartment_checkCode(params) {
        //查询科室编码是否存在
        return request.get('/basic/baseDepartment/checkCodeExist', params);
    },
    basic_baseDepartment_add(params) {
        //新增科室
        return request.jsonPost('/basic/baseDepartment/addBaseDepartment', params);
    },
    basic_baseDepartment_update(params) {
        //修改科室
        return request.jsonPut('/basic/baseDepartment/updateBaseDepartment', params);
    },
    basic_baseDepartment_delete(deleteIds) {
        //删除科室
        return request.deleted(`/basic/baseDepartment/${deleteIds}`);
    },
    basic_baseDepartment_export(params, filename) {
        //导出科室
        return request.jsonDownload('/basic/baseDepartment/excel', params, filename);
    },
    basic_basePatieninf_list(params) {
        //分页查询患者
        return request.jsonPost('/basic/basePatieninf/basePatieninfList', params);
    },
    basic_basePatieninf_all(params = {}) {
        //查询所有患者
        return request.jsonPost('/basic/basePatieninf/getAllBasePatieninfs', params);
    },
    basic_basePatieninf_checkCode(params) {
        //查询患者编码是否存在
        return request.get('/basic/basePatieninf/checkCodeExist', params);
    },
    basic_basePatieninf_add(params) {
        //新增患者
        return request.jsonPost('/basic/basePatieninf/addBasePatieninf', params);
    },
    basic_basePatieninf_update(params) {
        //修改患者
        return request.jsonPut('/basic/basePatieninf/updateBasePatieninf', params);
    },
    basic_basePatieninf_delete(deleteIds) {
        //删除患者
        return request.deleted(`/basic/basePatieninf/${deleteIds}`);
    },
    basic_basePatieninf_export(params, filename) {
        //导出患者
        return request.jsonDownload('/basic/basePatieninf/excel', params, filename);
    },
    basic_basePrescriptionRemark_list(params) {
        //分页查询处方备注
        return request.jsonPost('/basic/basePrescriptionRemark/basePrescriptionRemarkList', params);
    },
    basic_basePrescriptionRemark_all(params = {}) {
        //查询所有处方备注
        return request.jsonPost('/basic/basePrescriptionRemark/getAllBasePrescriptionRemarks', params);
    },
    basic_basePrescriptionRemark_checkCode(params) {
        //查询处方备注编码是否存在
        return request.get('/basic/basePrescriptionRemark/checkCodeExist', params);
    },
    basic_basePrescriptionRemark_add(params) {
        //新增处方备注
        return request.jsonPost('/basic/basePrescriptionRemark/addBasePrescriptionRemark', params);
    },
    basic_basePrescriptionRemark_update(params) {
        //修改处方备注
        return request.jsonPut('/basic/basePrescriptionRemark/updateBasePrescriptionRemark', params);
    },
    basic_basePrescriptionRemark_delete(deleteIds) {
        //删除处方备注
        return request.deleted(`/basic/basePrescriptionRemark/${deleteIds}`);
    },
    basic_basePrescriptionRemark_export(params, filename) {
        //导出处方备注
        return request.jsonDownload('/basic/basePrescriptionRemark/excel', params, filename);
    },
    basic_baseOrgDugComparison_list(params) {
        //分页查询医院对照
        return request.jsonPost('/basic/baseOrgDugComparison/baseOrgDugComparisonList', params);
    },
    basic_baseOrgDugComparison_all(params = {}) {
        //查询所有医院对照
        return request.jsonPost('/basic/baseOrgDugComparison/getAllBaseOrgDugComparisons', params);
    },
    basic_baseOrgDugComparison_checkCode(params) {
        //查询医院对照编码是否存在
        return request.jsonPost('/basic/baseOrgDugComparison/checkCodeExist', params);
    },
    basic_baseOrgDugComparison_add(params) {
        //新增医院对照
        return request.jsonPost('/basic/baseOrgDugComparison/addBaseOrgDugComparison', params);
    },
    basic_baseOrgDugComparison_update(params) {
        //修改医院对照
        return request.jsonPut('/basic/baseOrgDugComparison/updateBaseOrgDugComparison', params);
    },
    basic_baseOrgDugComparison_delete(deleteIds) {
        //删除医院对照
        return request.deleted(`/basic/baseOrgDugComparison/${deleteIds}`);
    },
    basic_baseOrgDugComparison_export(params, filename) {
        //导出医院对照
        return request.jsonDownload('/basic/baseOrgDugComparison/excel', params, filename);
    },
    basic_baseOrgDugComparison_template(params, filename) {
        //医院对照excel导出模板
        return request.jsonDownload('/basic/baseOrgDugComparison/template', params, filename);
    },
    basic_baseOrgDugComparison_import(params) {
        //导入医院对照
        return request.upload('/basic/baseOrgDugComparison/import', params);
    },
    basic_baseIncompatibility_list(params) {
        //分页查询配伍禁忌
        return request.jsonPost('/basic/baseIncompatibility/baseIncompatibilityList', params);
    },
    basic_baseIncompatibility_all(params = {}) {
        //查询所有配伍禁忌
        return request.jsonPost('/basic/baseIncompatibility/getAllBaseIncompatibilitys', params);
    },
    basic_baseIncompatibility_byDrug1Id(params = {}) {
        //通过商品1id查询商品2list
        return request.get('/basic/baseIncompatibility/getBaseIncompatibilityByDrug1Id', params);
    },
    basic_baseIncompatibility_add(params) {
        //新增配伍禁忌
        return request.jsonPost('/basic/baseIncompatibility/addBaseIncompatibility', params);
    },
    basic_baseIncompatibility_update(params) {
        //修改配伍禁忌
        return request.jsonPut('/basic/baseIncompatibility/updateBaseIncompatibility', params);
    },
    basic_baseIncompatibility_delete(deleteIds) {
        //删除配伍禁忌
        return request.deleted(`/basic/baseIncompatibility/${deleteIds}`);
    },
    basic_baseIncompatibility_export(params, filename) {
        //导出配伍禁忌
        return request.jsonDownload('/basic/baseIncompatibility/excel', params, filename);
    },
    basic_baseProductionEnterprise_list(params) {
        //分页查询生产企业
        return request.jsonPost('/basic/baseProductionEnterprise/baseProductionEnterpriseList', params);
    },
    basic_baseProductionEnterprise_all(params = {}) {
        //查询所有生产企业
        return request.jsonPost('/basic/baseProductionEnterprise/getAllBaseProductionEnterprises', params);
    },
    basic_baseProductionEnterprise_checkCode(params) {
        //查询生产企业编码是否存在
        return request.get('/basic/baseProductionEnterprise/checkCodeExist', params);
    },
    basic_baseProductionEnterprise_add(params) {
        //新增生产企业
        return request.jsonPost('/basic/baseProductionEnterprise/addBaseProductionEnterprise', params);
    },
    basic_baseProductionEnterprise_update(params) {
        //修改生产企业
        return request.jsonPut('/basic/baseProductionEnterprise/updateBaseProductionEnterprise', params);
    },
    basic_baseProductionEnterprise_delete(deleteIds) {
        //删除生产企业
        return request.deleted(`/basic/baseProductionEnterprise/${deleteIds}`);
    },
    basic_baseProductionEnterprise_export(params, filename) {
        //导出生产企业
        return request.jsonDownload('/basic/baseProductionEnterprise/excel', params, filename);
    },
    basic_baseRouting_list(params) {
        //分页查询线路
        return request.jsonPost('/basic/baseRouting/baseRoutingList', params);
    },
    basic_baseRouting_all(params = {}) {
        //查询所有线路
        return request.jsonPost('/basic/baseRouting/getAllBaseRoutings', params);
    },
    basic_baseRouting_checkCode(params) {
        //查询线路编码是否存在
        return request.get('/basic/baseRouting/checkCodeExist', params);
    },
    basic_baseRouting_add(params) {
        //新增线路
        return request.jsonPost('/basic/baseRouting/addBaseRouting', params);
    },
    basic_baseRouting_update(params) {
        //修改线路
        return request.jsonPut('/basic/baseRouting/updateBaseRouting', params);
    },
    basic_baseRouting_delete(deleteIds) {
        //删除线路
        return request.deleted(`/basic/baseRouting/${deleteIds}`);
    },
    basic_baseRouting_export(params, filename) {
        //导出线路
        return request.jsonDownload('/basic/baseRouting/excel', params, filename);
    },
    basic_baseDosage_list(params) {
        //分页查询用法用量
        return request.jsonPost('/basic/baseDosage/baseDosageList', params);
    },
    basic_baseDosage_all(params = {}) {
        //查询所有用法用量
        return request.jsonPost('/basic/baseDosage/getAllBaseDosages', params);
    },
    basic_baseDosage_checkCode(params) {
        //查询用法用量编码是否存在
        return request.get('/basic/baseDosage/checkCodeExist', params);
    },
    basic_baseDosage_add(params) {
        //新增用法用量
        return request.jsonPost('/basic/baseDosage/addBaseDosage', params);
    },
    basic_baseDosage_update(params) {
        //修改用法用量
        return request.jsonPut('/basic/baseDosage/updateBaseDosage', params);
    },
    basic_baseDosage_delete(deleteIds) {
        //删除用法用量
        return request.deleted(`/basic/baseDosage/${deleteIds}`);
    },
    basic_baseDosage_export(params, filename) {
        //导出用法用量
        return request.jsonDownload('/basic/baseDosage/excel', params, filename);
    },
    basic_baseSupplier_list(params) {
        //分页查询供应商
        return request.jsonPost('/basic/baseSupplier/baseSupplierList', params);
    },
    basic_baseSupplier_all(params = {}) {
        //查询所有供应商
        return request.jsonPost('/basic/baseSupplier/getAllBaseSuppliers', params);
    },
    basic_baseSupplier_checkCode(params) {
        //查询供应商编码是否存在
        return request.get('/basic/baseSupplier/checkCodeExist', params);
    },
    basic_baseSupplier_add(params) {
        //新增供应商
        return request.jsonPost('/basic/baseSupplier/addBaseSupplier', params);
    },
    basic_baseSupplier_update(params) {
        //修改供应商
        return request.jsonPut('/basic/baseSupplier/updateBaseSupplier', params);
    },
    basic_baseSupplier_delete(deleteIds) {
        //删除供应商
        return request.deleted(`/basic/baseSupplier/${deleteIds}`);
    },
    basic_baseSupplier_export(params, filename) {
        //导出供应商
        return request.jsonDownload('/basic/baseSupplier/excel', params, filename);
    },
    basic_baseDecoctingPot_list(params) {
        //分页查询煎药锅
        return request.jsonPost('/basic/baseDecoctingPot/baseDecoctingPotList', params);
    },
    basic_baseDecoctingPot_all(params = {}) {
        //查询所有煎药锅
        return request.jsonPost('/basic/baseDecoctingPot/getAllBaseDecoctingPots', params);
    },
    basic_baseDecoctingPot_checkCode(params) {
        //查询煎药锅编码是否存在
        return request.get('/basic/baseDecoctingPot/checkCodeExist', params);
    },
    basic_baseDecoctingPot_add(params) {
        //新增煎药锅
        return request.jsonPost('/basic/baseDecoctingPot/addBaseDecoctingPot', params);
    },
    basic_baseDecoctingPot_update(params) {
        //修改煎药锅
        return request.jsonPut('/basic/baseDecoctingPot/updateBaseDecoctingPot', params);
    },
    basic_baseDecoctingPot_delete(deleteIds) {
        //删除煎药锅
        return request.deleted(`/basic/baseDecoctingPot/${deleteIds}`);
    },
    basic_baseDecoctingPot_export(params, filename) {
        //导出煎药锅
        return request.jsonDownload('/basic/baseDecoctingPot/excel', params, filename);
    },
    basic_baseDrugDeliveryTimeSet_list(params) {
        //分页查询发药时间设置
        return request.jsonPost('/basic/baseDrugDeliveryTimeSet/baseDrugDeliveryTimeSetList', params);
    },
    basic_baseDrugDeliveryTimeSet_all(params = {}) {
        //查询所有发药时间设置
        return request.jsonPost('/basic/baseDrugDeliveryTimeSet/getAllBaseDrugDeliveryTimeSets', params);
    },
    basic_baseDrugDeliveryTimeSet_add(params) {
        //新增发药时间设置
        return request.jsonPost('/basic/baseDrugDeliveryTimeSet/addBaseDrugDeliveryTimeSet', params);
    },
    basic_baseDrugDeliveryTimeSet_update(params) {
        //修改发药时间设置
        return request.jsonPut('/basic/baseDrugDeliveryTimeSet/updateBaseDrugDeliveryTimeSet', params);
    },
    basic_baseDrugDeliveryTimeSet_delete(deleteIds) {
        //删除发药时间设置
        return request.deleted(`/basic/baseDrugDeliveryTimeSet/${deleteIds}`);
    },
    basic_baseDrugDeliveryTimeSet_export(params, filename) {
        //导出发药时间设置
        return request.jsonDownload('/basic/baseDrugDeliveryTimeSet/excel', params, filename);
    },
    basic_baseDiseaseSpecies_list(params) {
        //分页查询临床诊断
        return request.jsonPost('/basic/baseDiseaseSpecies/baseDiseaseSpeciesList', params);
    },
    basic_baseDiseaseSpecies_all(params = {}) {
        //查询所有临床诊断
        return request.jsonPost('/basic/baseDiseaseSpecies/getAllBaseDiseaseSpeciess', params);
    },
    basic_baseDiseaseSpecies_checkCode(params) {
        //查询临床诊断编码是否存在
        return request.get('/basic/baseDiseaseSpecies/checkCodeExist', params);
    },
    basic_baseDiseaseSpecies_add(params) {
        //新增临床诊断
        return request.jsonPost('/basic/baseDiseaseSpecies/addBaseDiseaseSpecies', params);
    },
    basic_baseDiseaseSpecies_update(params) {
        //修改临床诊断
        return request.jsonPut('/basic/baseDiseaseSpecies/updateBaseDiseaseSpecies', params);
    },
    basic_baseDiseaseSpecies_delete(deleteIds) {
        //删除临床诊断
        return request.deleted(`/basic/baseDiseaseSpecies/${deleteIds}`);
    },
    basic_baseDiseaseSpecies_export(params, filename) {
        //导出临床诊断
        return request.jsonDownload('/basic/baseDiseaseSpecies/excel', params, filename);
    }
};
