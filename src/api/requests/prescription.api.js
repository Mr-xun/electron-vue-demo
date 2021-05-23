/* eslint-disable camelcase */
import request from '@/utils/request';
export default {
    /*****************处方管理******************************/
    prescription_prescriptionOrder_list(params) {
        //处方列表（分页）
        return request.jsonPost('/order/prescriptionOrder/prescriptionOrderList', params);
    },
    prescription_prescriptionOrder_byOrderNo(params) {
        //根据流水号查询处方
        return request.get('/order/prescriptionOrder/selectPrescriptionByOrderNo', params);
    },
    prescription_prescriptionOrder_receiverList(params) {
        //查询处方收货人信息
        return request.jsonPost('/order/prescriptionOrder/prescriptionOrderReceiverList', params);
    },
    prescription_prescriptionOrder_getAllAppCode(params = {}) {
        //获取全部处方二维码
        return request.jsonPost('/order/appPrescriptionCode/getAll', params);
    },
    prescription_prescriptionOrder_getAppCodeList(params) {
        //分页获取处方二维码
        return request.jsonPost('/order/appPrescriptionCode/list', params);
    },
    prescription_prescriptionOrder_deleteAppCode(deleteIds) {
        //删除处方二维码
        return request.deleted(`/order/appPrescriptionCode/${deleteIds}`);
    },
    prescription_prescriptionOrder_getAllAppCode(params) {
        //获取全部处方二维码
        return request.jsonPost('/order/appPrescriptionCode/getAll', params);
    },
    prescription_prescriptionOrder_scanCode(params) {
        //处方扫码
        return request.jsonPost('/order/prescriptionOrder/prescriptionScanCode', params);
    },
    prescription_prescriptionOrder_submit(params) {
        //提交处方
        return request.jsonPost('/order/prescriptionOrder/submitPrescription', params);
    },
    prescription_prescriptionOrder_modify(params) {
        //修改处方
        return request.jsonPost('/order/prescriptionOrder/modifyPrescription', params);
    },
    prescription_prescriptionOrder_backOut(params) {
        //撤销处方
        return request.post('/order/prescriptionOrder/backOutPrescription', params);
    },
    prescription_prescriptionOrder_copy(params) {
        //复制处方
        return request.post('/order/prescriptionOrder/copyPrescription', params);
    },
    prescription_prescriptionOrder_confirmCharge(params) {
        //确认收费
        return request.post('/order/prescriptionOrder/confirmCharge', params);
    },
    prescription_prescriptionOrder_cancelApplyFor(params) {
        //取消申请
        return request.jsonPost('/order/prescriptionOrder/cancelApplyFor', params);
    },
    prescription_prescriptionOrder_resendApplyFor(params) {
        //重发申请
        return request.jsonPost('/order/prescriptionOrder/resendApplyFor', params);
    },
    prescription_prescriptionOrder_auditList(params) {
        //处方审核列表（分页）
        return request.jsonPost('/order/prescriptionOrder/prescriptionAuditList', params);
    },
    prescription_prescriptionOrder_auditPrint(params) {
        //处方审核打印
        return request.post('/order/prescriptionOrder/auditPrint', params);
    },
    prescription_prescriptionOrder_auditRejected(params) {
        //处方审核-驳回
        return request.post('/order/prescriptionOrder/auditRejected', params);
    },
    prescription_prescriptionOrder_labelPrintList(params) {
        //标签打印列表（分页）
        return request.jsonPost('/order/prescriptionOrder/labelPrintList', params);
    },
    prescription_prescriptionOrder_labelPrint(params) {
        //标签打印-标签
        return request.post('/order/prescriptionOrder/labelPrint', params);
    },
    prescription_prescriptionOrder_labelPrintDoor(params) {
        //标签打印-上门签
        return request.post('/order/prescriptionOrder/labelPrintDoor', params);
    },
    prescription_prescriptionOrder_prescriptionLabelPrintList(params) {
        //处方签打印列表（分页）
        return request.jsonPost('/order/prescriptionOrder/prescriptionLabelPrintList', params);
    },
    prescription_prescriptionOrder_prescriptionLabelPrint(params) {
        //处方签打印
        return request.post('/order/prescriptionOrder/prescriptionLabelPrint', params);
    },
    prescription_prescriptionOrder_reprintPrescriptionList(params) {
        //处方补打列表（分页）
        return request.jsonPost('/order/prescriptionOrder/reprintPrescriptionList', params);
    },
    prescription_prescriptionOrder_reprintOnDoorLabel(params) {
        //处方补打-上门签
        return request.post('/order/prescriptionOrder/reprintOnDoorLabel', params);
    },
    prescription_prescriptionOrder_reprintPrescriptionLabel(params) {
        //处方补打-处方签
        return request.post('/order/prescriptionOrder/reprintPrescriptionLabel', params);
    },
    prescription_prescriptionOrder_reprintPrescription(params) {
        //处方补打-处方
        return request.post('/order/prescriptionOrder/reprintPrescription', params);
    },
    prescription_prescriptionOrder_reprintlabel(params) {
        //处方补打-标签
        return request.post('/order/prescriptionOrder/reprintlabel', params);
    },
    prescription_prescriptionOrder_selfDecoctAdjust(params) {
        //自煎调剂
        return request.jsonPost('/order/prescriptionOrder/selfDecoctAdjust', params);
    },
    prescription_prescriptionOrder_replaceDecoctAdjust(params) {
        //代煎调剂
        return request.jsonPost('/order/prescriptionOrder/replaceDecoctAdjust', params);
    },
    prescription_prescriptionOrder_completeAdjust(params) {
        //完成调剂
        return request.post('/order/prescriptionOrder/completeAdjust', params);
    },
    prescription_prescriptionOrder_prescriptionAgainAudit(params) {
        //处方复核
        return request.jsonPost('/order/prescriptionOrder/prescriptionAgainAudit', params);
    },
    prescription_prescriptionOrder_weighPack(params) {
        //称重包装
        return request.jsonPost('/order/prescriptionOrder/weighPack', params);
    },
    prescription_decoctingStatus_checkDecoctingPotExist(params) {
        //查询煎药锅是否使用中 	未使用返回true,使用中返回false
        return request.get('/order/decoctingStatus/checkDecoctingPotExist', params);
    },
    prescription_decoctingStatus_decoctDrugRegistration(params) {
        //煎药登记
        return request.post('/order/decoctingStatus/decoctDrugRegistration', params);
    },
    prescription_decoctingStatus_decoctDrugStart(params) {
        //煎药开始
        return request.jsonPost('/order/decoctingStatus/decoctDrugStart', params);
    },
    prescription_decoctingStatus_decoctDrugComplete(params) {
        //煎药完成
        return request.jsonPost('/order/decoctingStatus/decoctDrugComplete', params);
    },
    prescription_decoctingStatus_decoctDrugList(params) {
        //煎药列表（分页）
        return request.jsonPost('/order/decoctingStatus/decoctDrugList', params);
    },
    prescription_decoctingStatus_relieveDecoctDrug(params) {
        //解除煎药状态
        return request.post('/order/decoctingStatus/relieveDecoctDrug', params);
    },
    prescription_prescriptionOrder_processingRegistration(params) {
        //加工登记
        return request.jsonPost('/order/prescriptionOrder/processingRegistration', params);
    },
    prescription_prescriptionOrder_processingStart(params) {
        //加工开始
        return request.jsonPost('/order/prescriptionOrder/processingStart', params);
    },
    prescription_prescriptionOrder_processingComplete(params) {
        //加工完成
        return request.jsonPost('/order/prescriptionOrder/processingComplete', params);
    },
    prescription_prescriptionOrder_receiveDrugList(params) {
        //收货管理-列表（分页）
        return request.jsonPost('/order/prescriptionOrder/receiveDrugList', params);
    },
    prescription_prescriptionOrder_cancelApplyFor(params) {
        //取消申请
        return request.jsonPost('/order/prescriptionOrder/cancelApplyFor', params);
    },
    prescription_prescriptionOrder_resendApplyFor(params) {
        //重发申请
        return request.jsonPost('/order/prescriptionOrder/resendApplyFor', params);
    },
    prescription_prescriptionOrder_destructionApplyFor(params) {
        //销毁申请
        return request.jsonPost('/order/prescriptionOrder/destructionApplyFor', params);
    },
    prescription_prescriptionOrder_cancleConfirmList(params) {
        //取消确认列表（分页）
        return request.jsonPost('/order/prescriptionOrder/cancleConfirmList', params);
    },
    prescription_prescriptionOrder_cancleConfirm(params) {
        //取消确认
        return request.post('/order/prescriptionOrder/cancleConfirm', params);
    },
    prescription_prescriptionOrder_destructionConfirmList(params) {
        //销毁确认列表（分页）
        return request.jsonPost('/order/prescriptionOrder/destructionConfirmList', params);
    },
    prescription_prescriptionOrder_destructionConfirm(params) {
        //销毁确认
        return request.post('/order/prescriptionOrder/destructionConfirm', params);
    },
    prescription_prescriptionOrder_resendConfirmList(params) {
        //重发确认列表（分页）
        return request.jsonPost('/order/prescriptionOrder/resendConfirmList', params);
    },
    prescription_prescriptionOrder_resendConfirm(params) {
        //重发确认
        return request.post('/order/prescriptionOrder/resendConfirm', params);
    },
    prescription_prescriptionOrder_receiveDrug(params) {
        //收货管理-收货
        return request.post('/order/prescriptionOrder/receiveDrug', params);
    },
    prescription_prescriptionOrder_fastSend(params) {
        //收货管理-快速发药
        return request.post('/order/prescriptionOrder/fastSend', params);
    },
    prescription_prescriptionOrder_scanReceiveDrug(params) {
        //收货管理-扫码收货
        return request.jsonPost('/order/prescriptionOrder/scanReceiveDrug', params);
    },
    prescription_prescriptionOrder_batchReceiveDrug(params) {
        //收货管理-批量收货
        return request.jsonPost('/order/prescriptionOrder/batchReceiveDrug', params);
    },
    prescription_prescriptionOrder_sendDrugList(params) {
        //发药管理-列表（分页）
        return request.jsonPost('/order/prescriptionOrder/sendDrugList', params);
    },
    prescription_prescriptionOrder_sendDrug(params) {
        //发药管理-发药
        return request.post('/order/prescriptionOrder/sendDrug', params);
    },

    prescription_prescriptionOrder_scanSendDrug(params) {
        //发药管理-扫码发药
        return request.jsonPost('/order/prescriptionOrder/scanSendDrug', params);
    },
    prescription_prescriptionOrder_batchSendDrug(params) {
        //发药管理-批量发药
        return request.jsonPost('/order/prescriptionOrder/batchSendDrug', params);
    },
    prescription_prescriptionOrder_managerList(params) {
        //处方管理列表（分页）
        return request.jsonPost('/order/prescriptionOrder/prescriptionManagerList', params);
    },
    prescription_prescriptionOrder_deliveryOrder(params) {
        //处方单-出单
        return request.jsonPost('/order/prescriptionOrder/prescriptionDeliveryOrder', params);
    },
    prescription_prescriptionOrder_management(params) {
        //处方单-管理
        return request.jsonPost('/order/prescriptionOrder/prescriptionManagement', params);
    },
    prescription_prescriptionOrder_againAllocation(params) {
        //重分配
        return request.jsonPost('/order/prescriptionOrder/prescriptionAgainAllocation', params);
    },
    prescription_prescriptionOrder_againAllocation(params) {
        //重分配
        return request.jsonPost('/order/prescriptionOrder/prescriptionAgainAllocation', params);
    }

};
