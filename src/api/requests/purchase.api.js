/* eslint-disable camelcase */
import request from '@/utils/request';
export default {
    /*****************采购管理*******************************/
    order_purchaseOrder_list(params) {
        //分页查询采购订单
        return request.jsonPost('/order/purchaseOrder/purchaseOrderList', params);
    },
    order_purchaseOrder_all(params = {}) {
        //查询所有采购订单
        return request.jsonPost('/order/purchaseOrder/getAllPurchaseOrders', params);
    },
    order_purchaseOrder_add(params) {
        //新增采购订单
        return request.jsonPost('/order/purchaseOrder/addPurchaseOrder', params);
    },
    order_purchaseOrder_cancle(params) {
        //取消采购订单
        return request.jsonPost('/order/purchaseOrder/canclePurchaseOrder', params);
    },
    order_purchaseOrder_update(params) {
        //修改采购订单
        return request.jsonPut('/order/purchaseOrder/updatePurchaseOrder', params);
    },
    order_purchaseOrder_delete(deleteIds) {
        //删除采购订单
        return request.deleted(`/order/purchaseOrder/${deleteIds}`);
    },
    order_purchaseOrder_export(params, filename) {
        //导出采购订单
        return request.jsonDownload('/order/purchaseOrder/excel', params, filename);
    },
    order_purchasePending_list(params) {
        //分页查询采购待入库
        return request.jsonPost('/order/purchasePending/purchasePendingList', params);
    },
    order_purchasePending_mainInfoList(params) {
        //分页查询主要信息list
        return request.jsonPost('/order/purchasePending/getMainInfoList', params);
    },
    order_purchasePending_detailList(params) {
        //查询明细信息list
        return request.get('/order/purchasePending/getDetailList', params);
    },
    order_purchasePending_list(params) {
        //分页查询采购待入库
        return request.jsonPost('/order/purchasePending/purchasePendingList', params);
    },
    order_purchaseInboundOrder_list(params) {
        //分页查询采购入库
        return request.jsonPost('/order/purchaseInboundOrder/purchaseInboundOrderList', params);
    },
    order_purchaseInboundOrder_all(params = {}) {
        //查询所有采购入库
        return request.jsonPost('/order/purchaseInboundOrder/getAllPurchaseInboundOrders', params);
    },
    order_purchaseInboundOrder_add(params) {
        //新增采购入库
        return request.jsonPost('/order/purchaseInboundOrder/addPurchaseInboundOrder', params);
    },
    order_purchaseInboundOrder_update(params) {
        //修改采购入库
        return request.jsonPut('/order/purchaseInboundOrder/updatePurchaseInboundOrder', params);
    },
    order_purchaseInboundOrder_delete(deleteIds) {
        //删除采购入库
        return request.deleted(`/order/purchaseInboundOrder/${deleteIds}`);
    },
    order_purchaseInboundOrder_export(params, filename) {
        //导出采购入库
        return request.jsonDownload('/order/purchaseInboundOrder/excel', params, filename);
    },
    order_stockBatch_list(params) {
        //分页查询库存批次商品
        return request.jsonPost('/order/stockBatch/stockBatchList', params);
    },
    order_purchaseReturnOrder_list(params) {
        //分页查询采购退货
        return request.jsonPost('/order/purchaseReturnOrder/purchaseReturnOrderList', params);
    },
    order_purchaseReturnOrder_all(params = {}) {
        //查询所有采购退货
        return request.jsonPost('/order/purchaseReturnOrder/getAllPurchaseReturnOrders', params);
    },
    order_purchaseReturnOrder_add(params) {
        //新增采购退货
        return request.jsonPost('/order/purchaseReturnOrder/addPurchaseReturnOrder', params);
    },
    order_purchaseReturnOrder_update(params) {
        //修改采购退货
        return request.jsonPut('/order/purchaseReturnOrder/updatePurchaseReturnOrder', params);
    },
    order_purchaseReturnOrder_delete(deleteIds) {
        //删除采购退货
        return request.deleted(`/order/purchaseReturnOrder/${deleteIds}`);
    },
    order_purchaseReturnOrder_export(params, filename) {
        //导出采购退货
        return request.jsonDownload('/order/purchaseReturnOrder/excel', params, filename);
    }
};
