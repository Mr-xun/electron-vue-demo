<template>
    <div class="app-container">
        <div class="adjust-form-container">
            <div class="form-wrapper flex-all-center">
                <el-form
                    ref="form"
                    :inline="true"
                    :model="adjustForm"
                    label-width="70px"
                >
                    <el-form-item label="发货处方：" class="adjust-form-item">
                        <el-input
                            ref="orderNo"
                            :style="{ width: itemWidth }"
                            v-model.trim="adjustForm.orderNo"
                            placeholder="发货处方"
                            @keyup.enter.native="getPrescription()"
                        />
                    </el-form-item>
                    <el-form-item label="送货员：" class="adjust-form-item">
                        <el-select
                            ref="deliverymanCode"
                            v-model="adjustForm.deliverymanCode"
                            filterable
                            clearable
                            :disabled="this.$route.params.type == 'toAdd'"
                            :style="{ width: itemWidth }"
                            @change="changeDeliverMan"
                        >
                            <el-option
                                v-for="item in userOptions"
                                :label="item.name"
                                :value="item.userCode"
                                :key="item.userCode"
                            ></el-option>
                        </el-select>
                        <el-button
                            class="refuse-btn"
                            type="danger"
                            icon="el-icon-circle-close"
                            size="medium"
                            :disabled="this.$route.query.type == 'toAdd'"
                            @click="refuse"
                            v-has-permission="['refusedToSend:refused']"
                            >拒送</el-button
                        >
                    </el-form-item>
                    <br />
                    <el-form-item
                        label="拒送理由："
                        class="adjust-form-item"
                        v-if="isShowRefuse"
                    >
                        <el-tag
                            class="refuse-tag"
                            v-for="item in refuseSendReason"
                            :key="item.name"
                            effect="dark"
                            @click="chooseRefuseReason(item)"
                            >{{ item.name }}</el-tag
                        >
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="center-container choosed-data-wrapper">
            <el-divider>
                <el-button
                    class="submit-btn"
                    type="success"
                    icon="el-icon-check"
                    size="small"
                    @click="submitAndPrint"
                    v-has-permission="['deliveryOrder:add']"
                    >提交并打印</el-button
                >
            </el-divider>
            <el-table
                ref="table"
                :data="choosedData"
                border
                fit
                style="width: 100%"
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
            >
                <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="机构名称"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="flOrgName"
                >
                    <template slot-scope="{ row }">{{
                        row.orgId | flOrgName
                    }}</template>
                </el-table-column>

                <el-table-column
                    label="处方号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="prescriptionNumber"
                ></el-table-column>
                <el-table-column
                    label="流水号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="orderNo"
                ></el-table-column>
                <el-table-column
                    label="患者姓名"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="patientName"
                ></el-table-column>
                <el-table-column
                    label="送货地址"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="deliveryAddress"
                ></el-table-column>
                <el-table-column
                    label="付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="doseNum"
                ></el-table-column>
            </el-table>
            <p>医院合计数：{{ this.routingInfo.hospitalNum }}</p>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
    name: 'DeliveryOrder',
    data() {
        return {
            userOptions: [],
            isShowRefuse: false, //是否展示拒送
            itemWidth: '200px',
            adjustForm: {
                deliverymanCode: '',
                orderNo: ''
            },
            dispenserAName: '',
            dispenserBName: '',
            operateOrderStatus: true,
            operateOrderInfo: '', //当前操作处方
            choosedData: [],
            passPrescript: {}, //验证通过处方
            routingInfo: {}, //路线信息
            plusData: {}, //追加数据
            prescriptionOrderNoList: [] //追加的处方流水号list（追加时传)
        };
    },
    computed: {
        ...mapState('enum', ['refuseSendReason'])
    },
    activated() {
        this.resetForm();
        this.getAllowPersoner();
        if (this.$route.params.type == 'toAdd') {
            //追加
            this.getOneOrder();
        } else if (this.$route.params.type === 'outOrder') {
            //处方管理 出单
            this.outOrderPrescription();
        }
    },
    methods: {
        //出单循环取处方信息
        async outOrderPrescription() {
            let { orders } = this.$route.params;
            let orderArr = orders.split(',');
            for (let i = 0; i < orderArr.length; i++) {
                let params = {
                    orderNo: orderArr[i]
                };
                let result = await this.$api.prescription_prescriptionOrder_byOrderNo(
                    params
                );
                this.passPrescript = result.data.data;
                let checkParams = {
                    orderNo: orderArr[i],
                    orderNoList: this.choosedData.map((item) => item.orderNo)
                };
                let routeResult = await this.$api.delivery_deliveryOrder_checkRoutintg(
                    checkParams
                );
                let routeInfo = routeResult.data.result;
                this.routingInfo.routingId = routeInfo.routingId;
                this.routingInfo.routingName = routeInfo.routingName;
                this.routingInfo.hospitalNum = routeInfo.hospitalNum;
                this.passPrescript.deliveryAddress = routeInfo.deliveryAddress;
                this.choosedData.push(this.passPrescript);
            }
        },
        //获取单个订单
        getOneOrder() {
            let params = {
                deliveryOrderId: this.$route.params.deliveryOrderId
            };
            this.$api
                .delivery_deliveryman_getOneDeliveryOrder(params)
                .then((r) => {
                    let { result } = r.data;
                    this.plusData = result;
                    this.routingInfo.routingId = result.routingId;
                    this.routingInfo.routingName = result.routingName;
                    this.routingInfo.hospitalNum = result.hospitalNum;
                    this.adjustForm.deliverymanCode = result.deliveryman;
                    this.choosedData = result.deliveryOrderDetailList;
                    this.choosedData.forEach((item) => {
                        item.orderNo = item.prescriptionOrderNo;
                    });
                });
        },
        getAllowPersoner() {
            let params = {
                pageNum: 1,
                pageSize: 100
            };
            this.$api
                .delivery_deliveryman_getAllowPersonList(params)
                .then((r) => {
                    let { rows } = r.data.result;
                    this.userOptions = rows || [];
                    if (this.userOptions.length) {
                        this.adjustForm.deliverymanCode = this.userOptions[0].userCode;
                    } else {
                        this.adjustForm.deliverymanCode = '';
                        if (this.$route.params.type != 'toAdd') {
                            this.$message({
                                message: '暂无送货员可选'
                            });
                        }
                    }
                });
        },
        //拒送
        refuse() {
            if (!this.adjustForm.deliverymanCode) {
                this.$message({
                    message: '请选择送货员',
                    type: 'error'
                });
                return;
            }
            this.isShowRefuse = true;
        },
        //选择拒送理由
        chooseRefuseReason(item) {
            if (!this.adjustForm.deliverymanCode) {
                this.$message({
                    message: '请选择送货员',
                    type: 'error'
                });
                return;
            }
            let params = {
                deliverymanCode: this.adjustForm.deliverymanCode,
                refusedToSendContent: item.name
            };
            this.$api
                .delivery_deliveryOrder_refusedToSend(params)
                .then((res) => {
                    this.$message({
                        message: '拒送成功',
                        type: 'success'
                    });
                    this.adjustForm.deliverymanCode = '';
                    this.isShowRefuse = false;
                    this.getAllowPersoner();
                });
        },
        //选择送货人员
        changeDeliverMan(val) {
            if (!this.adjustForm.orderNo) {
                this.$message({
                    message: '请录入发货处方',
                    type: 'warning'
                });
                this.adjustForm.orderNo = '';
                return;
            }
            this.checkRoute();
        },
        //获取处方信息
        getPrescription() {
            if (!this.adjustForm.orderNo) {
                this.$message({
                    message: '请录入发货处方',
                    type: 'warning'
                });
                this.adjustForm.orderNo = '';
                return;
            }
            let isExistOrder = this.choosedData.some(
                (item) => item.orderNo == this.adjustForm.orderNo
            );
            if (isExistOrder) {
                this.$message({
                    message: '该处方已存在',
                    type: 'warning'
                });
                this.adjustForm.orderNo = '';
                return;
            }
            let params = {
                orderNo: this.adjustForm.orderNo
            };
            this.$api
                .prescription_prescriptionOrder_byOrderNo(params)
                .then((r) => {
                    this.passPrescript = r.data.data;
                    if (
                        this.passPrescript.orderStatus == 17 ||
                        this.passPrescript.orderStatus == 182 ||
                        this.passPrescript.orderStatus == 192
                    ) {
                        if (!this.adjustForm.deliverymanCode) {
                            this.iptJump(
                                'orderNo',
                                '发货处方',
                                'deliverymanCode',
                                this.adjustForm.orderNo
                            );
                        } else {
                            this.checkRoute();
                        }
                    } else {
                        this.$message({
                            message: `此时的扫码处方状态应为包装称重完成或加工完成或煎药完成，当前处方状态为【${this.$options.filters[
                                'flOrderStatusName'
                            ](this.passPrescript.orderStatus)}】`,
                            type: 'warning'
                        });
                        this.adjustForm.orderNo = '';
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.adjustForm.orderNo = '';
                });
        },
        //验证处方路线
        checkRoute() {
            let params = {
                orderNo: this.adjustForm.orderNo,
                orderNoList: this.choosedData.map((item) => item.orderNo)
            };
            this.$api.delivery_deliveryOrder_checkRoutintg(params).then((r) => {
                let { result } = r.data;
                this.routingInfo.routingId = result.routingId;
                this.routingInfo.routingName = result.routingName;
                this.routingInfo.hospitalNum = result.hospitalNum;
                this.passPrescript.deliveryAddress = result.deliveryAddress;
                this.choosedData.push(this.passPrescript);
                let operateType = this.$route.params.type;
                if (operateType == 'toAdd') {
                    this.prescriptionOrderNoList.push(
                        this.passPrescript.orderNo
                    );
                }
                this.adjustForm.orderNo = '';
                this.$refs['orderNo'].focus();
            });
        },
        //去打印
        toPrint(orderNo) {
            let hostUrl = window.location.origin + window.location.pathname;
            let routeUrl = this.$router.resolve({
                path: '/print/preview',
                query: {
                    printType: 'deliveryOrder',
                    deliveryOrderNo: orderNo
                }
            });
            window.open(
                hostUrl + routeUrl.href + '&timestamp=' + new Date().getTime(),
                'printPage',
                'height=800,width=800,top=0,left=800,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no, status=no'
            );
        },
        //提交
        submitAndPrint(row) {
            if (!this.choosedData.length) {
                this.$message({
                    message: '请添加送货处方',
                    type: 'warning'
                });
                return;
            }
            let params = {
                deliverymanCode: this.adjustForm.deliverymanCode,
                isPlus: 2, //是否追加1是2否
                orderNoList: this.choosedData.map((item) => item.orderNo),
                routingId: this.routingInfo.routingId,
                routingName: this.routingInfo.routingName
            };
            let operateType = this.$route.params.type;

            if (operateType == 'toAdd') {
                params.isPlus = 1;
                params.deliverymanCode = this.plusData.deliverymanCode;
                params.deliveryOrderNo = this.plusData.orderNo;
                params.prescriptionOrderNoList = this.prescriptionOrderNoList;
                this.$api
                    .delivery_deliveryOrder_plusDeliveryOrder(params)
                    .then((res) => {
                        this.$message({
                            message: '追加完成',
                            type: 'success'
                        });
                        this.toPrint(this.plusData.orderNo);
                        this.resetForm();
                        this.$router.push({
                            name: '送货列表'
                        });
                    });
            } else {
                this.$api
                    .delivery_deliveryOrder_addDeliveryOrder(params)
                    .then((res) => {
                        let { result } = res.data;
                        this.$message({
                            message: '送货提交完成',
                            type: 'success'
                        });
                        this.toPrint(result);
                        this.resetForm();
                        this.getAllowPersoner();
                    });
            }
        },
        //重置表单
        resetForm() {
            this.adjustForm.deliverymanCode = '';
            this.adjustForm.orderNo = '';
            this.routingInfo = {};
            this.passPrescript = {};
            this.choosedData = [];
            this.prescriptionOrderNoList = [];
            this.isShowRefuse = false;
            this.$refs['orderNo'].focus();
        },
        /**
         * @param {String} curRefKey 当前refKey
         * @param {String} nextRefkey 当前refKey
         * @param {String} curRefname 当前ref名字
         * @param {String} val 输入框值
         * @param {Boolean} verify 是否验证已输入
         * @description input enter跳转
         */
        iptJump(
            curRefKey,
            curRefname,
            nextRefkey,
            val,
            verify = true,
            autoCom = false
        ) {
            if (verify && !val) {
                this.$message({
                    message: `请输入${curRefname}`,
                    type: 'warning'
                });
            } else {
                this.$nextTick(() => {
                    setTimeout(() => {
                        if (autoCom) {
                            this.$refs[curRefKey].suggestions = [];
                        } else {
                            this.$refs[curRefKey].blur();
                        }
                        this.$refs[nextRefkey].focus();
                    }, 100);
                });
            }
        },
        objectValueAllEmpty() {
            if (this.adjustForm.orderNo) {
                return false;
            }
            if (this.choosedData.length) {
                return false;
            }
            return true;
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.objectValueAllEmpty()) {
            next();
        } else {
            this.$confirm('检查到您当前页有内容，确定离开吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    next();
                })
                .catch(() => {
                    next(false);
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.adjust-form-container {
    padding: 10px 10px 10px;
    margin-bottom: 5px;
    background: #fff;
    border-radius: 5px;
    .success-tip {
        color: #67c23a;
    }
    .fail-tip {
        color: #f56c6c;
    }
    .adjust-form-item {
        margin-right: 0;
        /deep/ .el-form-item__label {
            padding: 0;
        }
        .refuse-tag {
            margin-right: 5px;
            cursor: pointer;
        }
    }
}
.choosed-data-wrapper {
    padding: 10px 10px 20px 10px;
}
</style>
