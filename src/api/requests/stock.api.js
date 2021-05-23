/* eslint-disable camelcase */
import request from '@/utils/request';
export default {
    /*****************库存管理*******************************/
    stock_stockMoveOrder_list(params) {
        //分页查询移库单
        return request.jsonPost('/order/stockMoveOrder/stockMoveOrderList', params);
    },
    stock_stockMoveOrder_all(params = {}) {
        //查询所有移库单
        return request.jsonPost('/order/stockMoveOrder/getAllStockMoveOrders', params);
    },
    stock_stockMoveOrder_warehouseGoodsList(params) {
        //库房商品库存list(新增调用)
        return request.jsonPost('/order/stockMoveOrder/warehouseGoodsStockList', params);
    },
    stock_stockMoveOrder_add(params) {
        //新增移库单
        return request.jsonPost('/order/stockMoveOrder/addStockMoveOrder', params);
    },
    stock_stockMoveOrder_update(params) {
        //修改移库单
        return request.jsonPut('/order/stockMoveOrder/updateStockMoveOrder', params);
    },
    stock_stockMoveOrder_delete(deleteIds) {
        //删除移库单
        return request.deleted(`/order/stockMoveOrder/${deleteIds}`);
    },
    stock_stockMoveOrder_export(params, filename) {
        //导出移库单
        return request.jsonDownload('/order/stockMoveOrder/excel', params, filename);
    },
    stock_stockProfitLossOrder_list(params) {
        //分页查询盘点单
        return request.jsonPost('/order/stockProfitLossOrder/stockProfitLossOrderList', params);
    },
    stock_stockProfitLossOrder_all(params = {}) {
        //查询所有盘点单
        return request.jsonPost('/order/stockProfitLossOrder/getAllStockProfitLossOrders', params);
    },
    stock_stockProfitLossOrder_detail(params) {
        //分页查询盘点单明细
        return request.jsonPost('/order/stockProfitLossOrder/stockProfitLossOrderDetail', params);
    },
    stock_stockProfitLossOrder_warehouseStockList(params) {
        //查询仓库库存
        return request.jsonPost('/order/stockProfitLossOrder/getWarehouseStockList', params);
    },
    stock_stockProfitLossOrder_add(params) {
        //新增盘点单
        return request.jsonPost('/order/stockProfitLossOrder/addStockProfitLossOrder', params);
    },
    stock_stockProfitLossOrder_update(params) {
        //修改盘点单
        return request.jsonPut('/order/stockProfitLossOrder/updateStockProfitLossOrder', params);
    },
    stock_stockProfitLossOrder_delete(deleteIds) {
        //删除盘点单
        return request.deleted(`/order/stockProfitLossOrder/${deleteIds}`);
    },
    stock_stockProfitLossOrder_export(params, filename) {
        //导出盘点单
        return request.jsonDownload('/order/stockProfitLossOrder/excel', params, filename);
    },
    stock_stockLimitSet_list(params) {
        //分页查询库存上下限设置
        return request.jsonPost('/order/stockLimitSet/stockLimitSetList', params);
    },
    stock_stockLimitSet_all(params = {}) {
        //查询所有库存上下限设置
        return request.jsonPost('/order/stockLimitSet/getAllStockLimitSets', params);
    },
    stock_stockLimitSet_add(params) {
        //新增库存上下限设置
        return request.jsonPost('/order/stockLimitSet/addStockLimitSet', params);
    },
    stock_stockLimitSet_update(params) {
        //修改库存上下限设置
        return request.jsonPut('/order/stockLimitSet/updateStockLimitSet', params);
    },
    stock_stockLimitSet_delete(deleteIds) {
        //删除库存上下限设置
        return request.deleted(`/order/stockLimitSet/${deleteIds}`);
    },
    stock_stockLimitSet_export(params, filename) {
        //导出库存上下限设置
        return request.jsonDownload('/order/stockLimitSet/excel', params, filename);
    }
};
