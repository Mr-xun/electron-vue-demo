/* eslint-disable camelcase */
import request from '@/utils/request';
export default {
    /*****************报表中心*******************************/
    report_purchaseReport_record(params) {
        //采购订单记录
        return request.jsonPost(
            '/report/purchaseReport/getPurchaseOrderRecord',
            params
        );
    },
    report_purchaseReport_recordExport(params, filename) {
        //采购订单记录-导出exel
        return request.jsonDownload(
            '/report/purchaseReport/purchaseOrderRecordExcel',
            params,
            filename
        );
    },
    report_purchaseReport_pending(params) {
        //采购待入库查询
        return request.jsonPost(
            '/report/purchaseReport/getPurchasePending',
            params
        );
    },
    report_purchaseReport_pendingExport(params, filename) {
        //采购待入库查询-导出exel
        return request.jsonDownload(
            '/report/purchaseReport/purchasePendingExcel',
            params,
            filename
        );
    },
    report_purchaseReport_inboundRecord(params) {
        //采购入库记录
        return request.jsonPost(
            '/report/purchaseReport/getPurchaseInboundRecord',
            params
        );
    },
    report_purchaseReport_inboundRecordExcel(params, filename) {
        //采购入库记录-导出exel
        return request.jsonDownload(
            '/report/purchaseReport/purchaseInboundRecordExcel',
            params,
            filename
        );
    },
    report_purchaseReport_returnRecord(params) {
        //采购退货记录
        return request.jsonPost(
            '/report/purchaseReport/getPurchaseReturnRecord',
            params
        );
    },
    report_purchaseReport_returnRecordExport(params, filename) {
        //采购退货记录-导出exel
        return request.jsonDownload(
            '/report/purchaseReport/purchaseReturnRecordExcel',
            params,
            filename
        );
    },
    report_hospitalReport_hospitalDeptDoctorStatisticsRecord(params) {
        //医院科室医生处方统计
        return request.jsonPost(
            '/report/hospitalReport/getHospitalDeptDoctorStatistics',
            params
        );
    },
    report_hospitalReport_hospitalDeptDoctorStatisticsRecordExport(
        params,
        filename
    ) {
        //医院科室医生处方统计-导出exel
        return request.jsonDownload(
            '/report/hospitalReport/hospitalDeptDoctorStatisticsExcel',
            params,
            filename
        );
    },
    report_hospitalReport_getOrgPrescription(params) {
        //医院处方查询
        return request.jsonPost(
            '/report/hospitalReport/getOrgPrescription',
            params
        );
    },
    report_hospitalReport_orgPrescriptionExcel(params, filename) {
        //医院处方查询-导出exel
        return request.jsonDownload(
            '/report/hospitalReport/orgPrescriptionExcel',
            params,
            filename
        );
    },
    report_hospitalReport_getPhysicianPrescription(params) {
        //医师处方查询
        return request.jsonPost(
            '/report/hospitalReport/getPhysicianPrescription',
            params
        );
    },
    report_hospitalReport_physicianPrescriptionExcel(params, filename) {
        //医师处方查询-导出exel
        return request.jsonDownload(
            '/report/hospitalReport/physicianPrescriptionExcel',
            params,
            filename
        );
    },
    report_hospitalReport_getHospitalDoctorDrugCollect(params) {
        //医院医生药品汇总
        return request.jsonPost(
            '/report/hospitalReport/getHospitalDoctorDrugCollect',
            params
        );
    },
    report_hospitalReport_hospitalDoctorDrugCollectExcel(params, filename) {
        //医院医生药品汇总-导出exel
        return request.jsonDownload(
            '/report/hospitalReport/hospitalDoctorDrugCollectExcel',
            params,
            filename
        );
    },
    report_stockReport_getDrugStockChangeDetail(params) {
        //商品入出库明细查询
        return request.jsonPost(
            '/report/stockReport/getDrugStockChangeDetail',
            params
        );
    },
    report_stockReport_drugStockChangeDetailExcel(params, filename) {
        //商品入出库明细查询-导出exel
        return request.jsonDownload(
            '/report/stockReport/drugStockChangeDetailExcel',
            params,
            filename
        );
    },
    report_stockReport_getDrugStockChangeSummary(params) {
        //商品入出库明细查询
        return request.jsonPost(
            '/report/stockReport/getDrugStockChangeSummary',
            params
        );
    },
    report_stockReport_drugStockChangeSummaryExcel(params, filename) {
        //商品入出库明细查询-导出exel
        return request.jsonDownload(
            '/report/stockReport/drugStockChangeSummaryExcel',
            params,
            filename
        );
    },
    report_stockReport_getDrugStockSummary(params) {
        //商品库存汇总查询
        return request.jsonPost(
            '/report/stockReport/getDrugStockSummary',
            params
        );
    },
    report_stockReport_drugStockSummaryExcel(params, filename) {
        //商品库存汇总查询-导出exel
        return request.jsonDownload(
            '/report/stockReport/drugStockSummaryExcel',
            params,
            filename
        );
    },
    report_stockReport_getDrugLotNoStockSummary(params) {
        //商品批号库存汇总查询
        return request.jsonPost(
            '/report/stockReport/getDrugLotNoStockSummary',
            params
        );
    },
    report_stockReport_drugLotNoStockSummaryExcel(params, filename) {
        //商品批号库存汇总-导出exel
        return request.jsonDownload(
            '/report/stockReport/drugLotNoStockSummaryExcel',
            params,
            filename
        );
    },
    report_stockReport_getDrugBatchNoStock(params) {
        //商品批次库存查询查询
        return request.jsonPost(
            '/report/stockReport/getDrugBatchNoStock',
            params
        );
    },
    report_stockReport_drugBatchNoStockExcel(params, filename) {
        //商品批次库存查询-导出exel
        return request.jsonDownload(
            '/report/stockReport/drugBatchNoStockExcel',
            params,
            filename
        );
    },
    report_stockReport_getSalePendingOut(params) {
        //销售待出库查询
        return request.jsonPost(
            '/report/stockReport/getSalePendingOut',
            params
        );
    },
    report_stockReport_salePendingOutExcel(params, filename) {
        //销售待出库-导出exel
        return request.jsonDownload(
            '/report/stockReport/salePendingOutExcel',
            params,
            filename
        );
    },
    report_stockReport_getStockMoveRecord(params) {
        //清斗装斗记录
        return request.jsonPost(
            '/report/stockReport/getStockMoveRecord',
            params
        );
    },
    report_stockReport_stockMoveRecordExcel(params, filename) {
        //清斗装斗记录-导出exel
        return request.jsonDownload(
            '/report/stockReport/stockMoveRecordExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getCreatorStatistics(params) {
        //计价员统计
        return request.jsonPost(
            '/report/prescriptionReport/getCreatorStatistics',
            params
        );
    },
    report_prescriptionReport_creatorStatisticsExcel(params, filename) {
        //计价员统计-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/creatorStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getDispenserStatistics(params) {
        //调剂员统计
        return request.jsonPost(
            '/report/prescriptionReport/getDispenserStatistics',
            params
        );
    },
    report_prescriptionReport_dispenserStatisticsExcel(params, filename) {
        //调剂员统计-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/dispenserStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getAdjustPeriodTimeStatistics(params) {
        //调剂分时段统计
        return request.jsonPost(
            '/report/prescriptionReport/getAdjustPeriodTimeStatistics',
            params
        );
    },
    report_prescriptionReport_adjustPeriodTimeStatisticsExcel(
        params,
        filename
    ) {
        //调剂分时段统计-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/adjustPeriodTimeStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getCheckerStatistics(params) {
        //复核员统计
        return request.jsonPost(
            '/report/prescriptionReport/getCheckerStatistics',
            params
        );
    },
    report_prescriptionReport_checkerStatisticsExcel(params, filename) {
        //复核员统计-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/checkerStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getPackerWeigherStatistics(params) {
        //包装员称重员统计
        return request.jsonPost(
            '/report/prescriptionReport/getPackerWeigherStatistics',
            params
        );
    },
    report_prescriptionReport_packerWeigherStatisticsExcel(params, filename) {
        //包装员称重员统计-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/packerWeigherStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getDecoctionWorkStatistics(params) {
        //煎药工作量统计
        return request.jsonPost(
            '/report/prescriptionReport/getDecoctionWorkStatistics',
            params
        );
    },
    report_prescriptionReport_decoctionWorkStatisticsExcel(params, filename) {
        //煎药工作量统计-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/decoctionWorkStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getProcessedPeopleStatistics(params) {
        //加工人员统计
        return request.jsonPost(
            '/report/prescriptionReport/getProcessedPeopleStatistics',
            params
        );
    },
    report_prescriptionReport_processedPeopleStatisticsExcel(params, filename) {
        //加工人员统计-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/processedPeopleStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getItemSpeciesStatistics(params) {
        //按品种统计
        return request.jsonPost(
            '/report/prescriptionReport/getItemSpeciesStatistics',
            params
        );
    },
    report_prescriptionReport_itemSpeciesStatisticsExcel(params, filename) {
        //按品种统计-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/itemSpeciesStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getItemSpeciesStatisticsTotalNum(params) {
        //按品种统计总数量
        return request.jsonPost(
            '/report/prescriptionReport/getItemSpeciesStatisticsTotalNum',
            params
        );
    },
    report_prescriptionReport_itemSpeciesStatisticsTotalNumExcel(
        params,
        filename
    ) {
        //按品种统计总数量-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/itemSpeciesStatisticsTotalNumExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getPeriodTimeStatistics(params) {
        //按时间段统计处方
        return request.jsonPost(
            '/report/prescriptionReport/getPeriodTimeStatistics',
            params
        );
    },
    report_prescriptionReport_periodTimeStatisticsExcel(params, filename) {
        //按时间段统计处方-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/periodTimeStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getDrugPrescriptionStatistics(params) {
        //按药品查询处方
        return request.jsonPost(
            '/report/prescriptionReport/getDrugPrescriptionStatistics',
            params
        );
    },
    report_prescriptionReport_drugPrescriptionStatisticsExcel(
        params,
        filename
    ) {
        //按药品查询处方-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/drugPrescriptionStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getDoctorDailyStatistics(params) {
        //医生日报
        return request.jsonPost(
            '/report/prescriptionReport/getDoctorDailyStatistics',
            params
        );
    },
    report_prescriptionReport_doctorDailyStatisticsExcel(params, filename) {
        //医生日报-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/doctorDailyStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getDoctorMonthStatistics(params) {
        //医生月报
        return request.jsonPost(
            '/report/prescriptionReport/getDoctorMonthStatistics',
            params
        );
    },
    report_prescriptionReport_doctorMonthStatisticsExcel(params, filename) {
        //医生月报-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/doctorMonthStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getDoctorSummary(params) {
        //医生汇总报表
        return request.jsonPost(
            '/report/prescriptionReport/getDoctorSummary',
            params
        );
    },
    report_prescriptionReport_doctorSummaryExcel(params, filename) {
        //医生汇总报表-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/doctorSummaryExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getHospitalDailyStatistics(params) {
        //医院日报
        return request.jsonPost(
            '/report/prescriptionReport/getHospitalDailyStatistics',
            params
        );
    },
    report_prescriptionReport_hospitalDailyStatisticsExcel(params, filename) {
        //医院日报-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/hospitalDailyStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getHospitalMonthStatistics(params) {
        //医院月报
        return request.jsonPost(
            '/report/prescriptionReport/getHospitalMonthStatistics',
            params
        );
    },
    report_prescriptionReport_hospitalMonthStatisticsExcel(params, filename) {
        //医院月报-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/hospitalMonthStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getHospitalSummary(params) {
        //医院汇总报表
        return request.jsonPost(
            '/report/prescriptionReport/getHospitalSummary',
            params
        );
    },
    report_prescriptionReport_hospitalSummaryExcel(params, filename) {
        //医院汇总报表-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/hospitalSummaryExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getHospitalKindStatistics(params) {
        //医院品种月统计
        return request.jsonPost(
            '/report/prescriptionReport/getHospitalKindStatistics',
            params
        );
    },
    report_prescriptionReport_hospitalKindStatisticsExcel(params, filename) {
        //医院品种月统计-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/hospitalKindStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getHospitalDoctorDrugStatistics(params) {
        //医院医生药品统计汇总
        return request.jsonPost(
            '/report/prescriptionReport/getHospitalDoctorDrugStatistics',
            params
        );
    },
    report_prescriptionReport_hospitalDoctorDrugStatisticsExcel(
        params,
        filename
    ) {
        //医院医生药品统计汇总-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/hospitalDoctorDrugStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getPrescriptionListStatistics(params) {
        //处方清单查询
        return request.jsonPost(
            '/report/prescriptionReport/getPrescriptionListStatistics',
            params
        );
    },
    report_prescriptionReport_prescriptionListStatisticsExcel(
        params,
        filename
    ) {
        //处方清单查询-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/prescriptionListStatisticsExcel',
            params,
            filename
        );
    },
    report_prescriptionReport_getMoredoseNumStatistics(params) {
        //代煎超出付数查询
        return request.jsonPost(
            '/report/prescriptionReport/getMoredoseNumStatistics',
            params
        );
    },
    report_prescriptionReport_moredoseNumStatisticsExcel(params, filename) {
        //代煎超出付数查询-导出exel
        return request.jsonDownload(
            '/report/prescriptionReport/moredoseNumStatisticsExcel',
            params,
            filename
        );
    },
    report_deliveryReport_getDeliveryDetailStatistics(params) {
        //送货明细查询
        return request.jsonPost(
            '/report/deliveryReport/getDeliveryDetailStatistics',
            params
        );
    },
    report_deliveryReport_deliveryDetailStatisticsExcel(params, filename) {
        //送货明细查询-导出exel
        return request.jsonDownload(
            '/report/deliveryReport/deliveryDetailStatisticsExcel',
            params,
            filename
        );
    },
    report_deliveryReport_getDeliveryManStatistics(params) {
        //送货员统计
        return request.jsonPost(
            '/report/deliveryReport/getDeliveryManStatistics',
            params
        );
    },
    report_deliveryReport_deliveryManStatisticsExcel(params, filename) {
        //送货员统计-导出exel
        return request.jsonDownload(
            '/report/deliveryReport/deliveryManStatisticsExcel',
            params,
            filename
        );
    },
    report_deliveryReport_getDeliveryManTotalNumStatistics(params) {
        //送货员统计总数
        return request.jsonPost(
            '/report/deliveryReport/getDeliveryManTotalNumStatistics',
            params
        );
    },
    report_deliveryReport_deliveryManTotalNumStatisticsExcel(params, filename) {
        //送货员统计总数-导出exel
        return request.jsonDownload(
            '/report/deliveryReport/deliveryManTotalNumStatisticsExcel',
            params,
            filename
        );
    },
    report_deliveryReport_getDeliveryTimeStatistics(params) {
        //送货时间查询
        return request.jsonPost(
            '/report/deliveryReport/getDeliveryTimeStatistics',
            params
        );
    },
    report_deliveryReport_deliveryTimeStatisticsExcel(params, filename) {
        //送货时间查询-导出exel
        return request.jsonDownload(
            '/report/deliveryReport/deliveryTimeStatisticsExcel',
            params,
            filename
        );
    },
    report_decoctMonitor_getDecoctMonitor() {
        //煎药室监控
        return request.get('/report/decoctMonitor/getDecoctMonitor');
    },
    report_dataDriveStoreReport_getTechnologyRatio() {
        //工艺占比
        return request.get('/report/dataDriveStoreReport/getTechnologyRatio');
    },
    report_dataDriveStoreReport_getPrescriptionDistribution() {
        //处方分布
        return request.get(
            '/report/dataDriveStoreReport/getPrescriptionDistribution'
        );
    },
    report_dataDriveStoreReport_getRealTimePrescriptionDetial() {
        //实时处方明细
        return request.get(
            '/report/dataDriveStoreReport/getRealTimePrescriptionDetial'
        );
    },
    report_dataDriveStoreReport_getTimeSharePrescriptionNum() {
        //分时处方量
        return request.get(
            '/report/dataDriveStoreReport/getTimeSharePrescriptionNum'
        );
    },
    report_dataDriveStoreReport_getThirtyDayPrescriptionNum() {
        //30日处方量
        return request.get(
            '/report/dataDriveStoreReport/getThirtyDayPrescriptionNum'
        );
    }













};

