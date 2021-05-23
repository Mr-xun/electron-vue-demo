/* eslint-disable camelcase */
import request from '@/utils/request';
export default {
    /*****************送货管理*******************************/
    delivery_deliveryman_list(params) {
        //人员排班（分页）
        return request.jsonPost(
            '/order/deliverymanStauts/deliverymanArrangeList',
            params
        );
    },
    delivery_deliveryman_submit(params) {
        //人员排班-提交
        return request.jsonPost(
            '/order/deliverymanStauts/arrangeSubmit',
            params
        );
    },
    delivery_deliveryman_signIn(params) {
        //签到签退
        return request.jsonPost(
            '/order/deliverymanStauts/deliverymanSignIn',
            params
        );
    },
    delivery_deliveryman_initLogisticsPersonnel(params) {
        //初始化物流人员
        return request.get(
            '/order/deliverymanStauts/initLogisticsPersonnel',
            params
        );
    },
    delivery_deliveryman_getDeliveryman(params) {
        //查询单个物流人员
        return request.jsonPost(
            '/order/deliverymanStauts/getDeliveryman',
            params
        );
    },
    delivery_deliveryman_getAllowPersonList(params) {
        //可送货物流人员列表（分页）
        return request.jsonPost(
            '/order/deliverymanStauts/getDeliverymanList',
            params
        );
    },
    delivery_deliveryman_getOneDeliveryOrder(params) {
        //查询单个送货单
        return request.get('/order/deliveryOrder/getOneDeliveryOrder', params);
    },
    delivery_deliveryOrder_list(params) {
        //分页查询送货单
        return request.jsonPost(
            '/order/deliveryOrder/deliveryOrderList',
            params
        );
    },
    delivery_deliveryOrder_checkRoutintg(params) {
        //验证处方线路(返回线路id和名称)
        return request.jsonPost('/order/deliveryOrder/checkRoutintg', params);
    },
    delivery_deliveryOrder_addDeliveryOrder(params) {
        //提交并打印
        return request.jsonPost(
            '/order/deliveryOrder/addDeliveryOrder',
            params
        );
    },
    delivery_deliveryOrder_plusDeliveryOrder(params) {
        //追加
        return request.jsonPost(
            '/order/deliveryOrder/plusDeliveryOrder',
            params
        );
    },
    delivery_deliveryOrder_deliveryOrderPrint(params) {
        //送货单打印
        return request.post(
            '/order/deliveryOrder/deliveryOrderPrint',
            params
        );
    },
    delivery_deliveryOrder_refusedToSend(params) {
        //拒送
        return request.jsonPost('/order/deliveryOrder/refusedToSend', params);
    },
    delivery_deliveryOrder_replaceDeliveryMan(params) {
        //更换送货人
        return request.jsonPost(
            '/order/deliveryOrder/replaceDeliveryMan',
            params
        );
    },
    delivery_deliveryOrder_sendToDoorList(params) {
        //送货上门打印（分页）
        return request.jsonPost('/order/deliveryOrder/sendToDoorList', params);
    },
    delivery_deliveryOrder_sendToDoorSignReceivedList(params) {
        //送货上门签收（分页）
        return request.get(
            '/order/deliveryOrder/sendToDoorSignReceivedList',
            params
        );
    },
    delivery_deliveryOrder_deliveryToDoorPrintCount(params) {
        //送货上门打印加次数
        return request.jsonPost(
            '/order/deliveryOrder/deliveryToDoorPrintCount',
            params
        );
    },
    delivery_deliveryOrder_confirmDelivery(params) {
        //确认送达
        return request.post('/order/deliveryOrder/confirmDelivery', params);
    }
};
