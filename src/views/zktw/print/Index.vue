<template>
    <div class="center-container print-view">
        <component :is="curComponent" ref="printTemp"></component>
    </div>
</template>
<script>
import sendToDoor from './template/SendToDoor';//送货上门打印
import labelPrint from './template/LabelPrint';//标签打印
import deliveryOrder from './template/DeliveryOrder';//送货单打印
import labelPrintDoor from './template/LabelPrintDoor';//上门签打印
import stockMoveOrder from './template/StockMoveOrder';//移库单打印
import prescriptionEnter from './template/PrescriptionEnter';//处方录入打印
import prescriptionAudit from './template/PrescriptionAudit';//处方打印
import prescriptionAudit2 from './template/PrescriptionAudit2';//处方打印
import stockInventoryCheck from './template/StockInventoryCheck';//盘点复核单打印
import stockProfitLossOrder from './template/StockProfitLossOrder';//盘点单打印
import prescriptionLabelPrint from './template/PrescriptionLabelPrint';//处方签打印

export default {
    name: 'PrintPreview',
    components: {
        sendToDoor,
        labelPrint,
        deliveryOrder,
        labelPrintDoor,
        stockMoveOrder,
        prescriptionEnter,
        prescriptionAudit,
        prescriptionAudit2,
        stockInventoryCheck,
        stockProfitLossOrder,
        prescriptionLabelPrint
    },
    computed: {
        curComponent() {
            return this.$route.query.printType;
        }
    }
};
</script>
<style lang="scss" >
.print-view {
    line-height: 1;
    .print-btn {
        padding: 7px 15px;
        font-size: 12px;
        border-radius: 3px;
        color: #fff;
        background-color: #13ce66;
        border-color: #13ce66;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        border: none;
        &:active {
            background: #11b95c;
            border-color: #11b95c;
            color: #fff;
            outline: none;
        }
        &:hover {
            background: #49cc90;
            border-color: #49cc90;
        }
    }
}
</style>