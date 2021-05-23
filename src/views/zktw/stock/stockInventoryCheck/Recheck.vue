<template>
    <div class="acceptaance-container">
        <div class="form-container">
            <el-form ref="form" :model="orderForm" :inline="true" :rules="rules" class="custom-form">
                <el-form-item label="仓库：" prop="warehouseId">
                    <el-select size="mini" disabled :style="{ width: itemWidth }" v-model="orderForm.warehouseId" @change="changeWarehouse" clearable filterable autocomplete="on" default-first-option>
                        <el-option v-for="item in wareHouseOptions" :label="item.name" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="制单人员：" prop="creatorName">
                    <el-input disabled size="mini" :style="{ width: itemWidth }" v-model="userInfo.fullname" readonly></el-input>
                </el-form-item>
                <el-form-item label="单据日期：" prop="orderDate">
                    <el-date-picker type="date" size="mini" disabled :style="{ width: itemWidth }" placeholder="选择时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="orderForm.orderDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="审核人员：" prop="reviewerId">
                    <el-select size="mini" :style="{ width: itemWidth }" v-model="orderForm.reviewerId" @change="changeReviewer" clearable filterable>
                        <el-option v-for="item in userOptions" :label="item.fullname" :key="item.userId" :value="item.userId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单据编号">
                    <el-input disabled size="mini" :style="{ width: itemWidth }" v-model="orderForm.orderNo"></el-input>
                </el-form-item>
                <el-form-item label="数据显示">
                    <el-radio-group v-model="dataShowType" size="mini" @change="changeDataShow">
                        <el-radio :label="1">差异</el-radio>
                        <el-radio :label="2">全部</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <el-divider>
            <el-button type="success" size="mini" plain :loading="submitLoading" @click="submitOrder" v-has-permission="['stockInventoryCheck:check']">复核提交</el-button>
        </el-divider>
        <div class="pending-wrapper">
            <div class="goods-table" id="form">
                <ux-grid border show-overflow ref="plxTable" keep-source :data="showPendingList" :highlightCurrentRow="false" :edit-config="{ trigger: 'click', mode: 'cell' }" v-loading="pendingLoading" :header-cell-style="{
                        background: '#eef1f6',
                        color: '#606266',
                    }" :row-class-name="tableRowClassName" stripe :max-height="tableHeight-80" style="width: 100%">
                    <ux-table-column type="index" width="80" align="center" title="序号"></ux-table-column>
                    <ux-table-column field="itemCode" title="商品编码" align="center" min-width="120"></ux-table-column>
                    <ux-table-column field="itemName" title="商品名称" align="center" min-width="120"></ux-table-column>
                    <ux-table-column field="specification" title="规格" min-width="80" align="center"></ux-table-column>
                    <ux-table-column field="unit" title="单位" align="center" min-width="60"></ux-table-column>
                    <ux-table-column align="center" field="productionEnterpriseName" title="生产企业" min-width="160px"></ux-table-column>
                    <ux-table-column align="center" field="stockQty" title="库存数量" min-width="100px"></ux-table-column>
                    <ux-table-column align="center" field="actualQty" title="实盘数量" min-width="120px">
                        <template slot-scope="scope">
                            <el-input style="width: 85%" size="mini" v-model="scope.row.actualQty" v-number-only @input="changeSumPrice(scope.row)"></el-input>
                        </template>
                    </ux-table-column>

                    <ux-table-column align="center" field="qtyDifference" title="数量差" min-width="120px"></ux-table-column>
                    <ux-table-column align="center" field="lotNo" title="批号" min-width="100px"></ux-table-column>
                    <ux-table-column title="生产日期" :show-overflow-tooltip="true" align="center" field="productionDate" min-width="110"></ux-table-column>
                    <ux-table-column title="有效期至" :show-overflow-tooltip="true" align="center" field="expireDate" min-width="110"></ux-table-column>
                    <ux-table-column title="成本价" :show-overflow-tooltip="true" align="center" field="stockCostPrice" min-width="110"></ux-table-column>
                    <ux-table-column title="实际成本金额" :show-overflow-tooltip="true" align="center" field="actualCostAmount" min-width="110">
                        <template slot-scope="{ row }">
                            {{ row.actualCostAmount | formatMoney }}
                        </template>
                    </ux-table-column>
                    <ux-table-column title="零售价" :show-overflow-tooltip="true" align="center" field="retailPrice" min-width="110"></ux-table-column>
                    <ux-table-column title="实际零售金额" :show-overflow-tooltip="true" align="center" field="actualRetailAmount" min-width="110">
                        <template slot-scope="{ row }">
                            {{ row.actualRetailAmount | formatMoney }}
                        </template>
                    </ux-table-column>

                    <ux-table-column align="center" field="retailAmountDifference" title="零售金额差" min-width="120px">
                        <template slot-scope="{ row }">
                            {{ row.retailAmountDifference | formatMoney }}
                        </template>
                    </ux-table-column>
                    <ux-table-column align="center" field="costAmountDifference" title="成本金额差" min-width="120px">
                        <template slot-scope="{ row }">
                            {{ row.costAmountDifference | formatMoney }}
                        </template>
                    </ux-table-column>
                    <ux-table-column title="操作" align="center" min-width="80px" fixed="right" class-name="small-padding fixed-width">
                        <template slot-scope="{ row, $index }">
                            <i class="el-icon-delete table-operation" style="color: #f50" @click="singleDelete(row, $index)" />
                        </template>
                    </ux-table-column>
                </ux-grid>
            </div>
        </div>
    </div>
</template>
<script>
import IncreaseBatch from './components/IncreaseBatch';
import { mapState, mapGetters } from 'vuex';
import numberOnly from '@/directive/number-only';
import focus from '@/directive/focus';
import enterJump from '@/directive/enter-jump';
export default {
    components: { IncreaseBatch },
    directives: {
        numberOnly,
        focus,
        enterJump
    },
    data() {
        return {
            dataShowType: 1, //数据显示  1 差异 2 全部
            itemWidth: '160px',
            orderForm: {},
            submitLoading: false,
            pendingLoading: false,
            showPendingList: [], //列表展示待处理数据
            pendingList: [], //待处理
            arrivalAllQty: 0, //到货数量总计
            qualifiedAllQty: 0, //合格数量总计
            actualPurchasePriceTotal: 0, //采购总金额
            retailPriceTotal: 0, //零售总金额
            processedList: [], //已处理
            rules: {
                supplierCode: [
                    { required: true, message: ' ', trigger: 'blur' }
                ],
                supplierId: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                warehouseId: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                reviewerId: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                orderDate: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ]
            },
            wareHouseOptions: [],
            userOptions: []
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapState({
            userInfo: (state) => state.account.user
        }),
        ...mapGetters('basic', ['orgArchives'])
    },
    watch: {
        processedList: {
            handler: function (data) {
                this.arrivalAllQty = 0;
                this.qualifiedAllQty = 0;
                this.retailPriceTotal = 0;
                this.actualPurchasePriceTotal = 0;
                if (data.length) {
                    data.forEach((item) => {
                        this.arrivalAllQty += Number(item.arrivalQty);
                        this.qualifiedAllQty += Number(item.qualifiedQty);
                        this.retailPriceTotal +=
                            item.qualifiedQty * item.retailPrice;
                        this.actualPurchasePriceTotal +=
                            item.qualifiedQty * item.actualPurchasePrice;
                    });
                }
            },
            deep: true,
            immediate: false
        }
    },
    activated() {
        this.orderForm.customerService = this.userInfo.userId;
        this.orderForm.customerServiceName = this.userInfo.fullname;
    },
    created() {
        this.getAllwareHouse();
        this.getAllUser();
        this.$bus.$on('recheck', (data) => {
            this.initCheckData(data);
        });
    },
    beforeRouteLeave(to, from, next) {
        if (this.objectValueAllEmpty(this.orderForm)) {
            next();
        } else {
            this.$confirm('检查到您当前页有内容更改，确定离开吗？', '提示', {
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
    },
    methods: {
        //更改数据显示
        changeDataShow() {
            if (this.dataShowType == 1) {
                this.showPendingList = this.pendingList.filter(
                    (item) => item.qtyDifference
                );
            } else {
                this.showPendingList = this.pendingList;
            }
        },
        //判断是否录入数据
        objectValueAllEmpty(object = this.orderForm) {
            var isEmpty = true;
            Object.keys(object).forEach(function (x) {
                if (x != 'orderCode' && x != 'orderDate') {
                    if (object[x] != null && object[x] != '') {
                        isEmpty = false;
                    }
                }
            });
            if (this.pendingList.length) {
                return false;
            }
            if (isEmpty) {
                return true;
            }
            return false;
        },
        initCheckData(data) {
            //初始化复核数据
            this.orderForm = data;
            this.$set(this.orderForm, 'reviewerId', this.userInfo.userId);
            this.$set(this.orderForm, 'reviewer', this.userInfo.fullname);
            this.dataShowType = 1;
            this.pendingList = data.stockProfitLossOrderDetailList;
            this.changeDataShow();
        },
        changeReviewer(val) {
            this.orderForm.reviewer = '';
            this.userOptions.forEach((v) => {
                if (v.code == val) {
                    this.orderForm.reviewer = v.fullname;
                }
            });
        },
        changeWarehouse(val) {
            this.orderForm.warehouseName = '';
            this.wareHouseOptions.forEach((v) => {
                if (v.id == val) {
                    this.orderForm.warehouseName = v.name;
                }
            });
            this.pendingList.forEach((h) => {
                h.warehouseId = this.orderForm.warehouseId;
                h.warehouseName = this.orderForm.warehouseName;
            });
        },
        tableRowClassName({ row, rowIndex }) {
            //把每一行的索引放进row
            row.ridIndex = rowIndex;
        },
        getAllwareHouse() {
            let params = {};
            this.$api.basic_baseWarehouse_all(params).then((res) => {
                let { result } = res.data;
                this.wareHouseOptions = result;
            });
        },
        getAllUser() {
            this.$api
                .system_user_all()
                .then((r) => {
                    const { data } = r.data;
                    this.userOptions = data.filter(
                        (item) => item.isLogisticsPersonnel != 1
                    );
                })
                .catch((err) => {
                    this.userOptions = [];
                });
        },
        resetForm() {
            //重置内容
            this.orderForm = {};
            this.$set(this.orderForm, 'reviewerId', '');
            this.$set(this.orderForm, 'reviewer', '');
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
            this.pendingList = [];
        },
        submitOrder() {
            let params = {
                creatorId: this.orderForm.creatorId,
                creatorName: this.orderForm.creatorName,
                id: this.orderForm.id,
                orderDate: this.orderForm.orderDate,
                orderNo: this.orderForm.orderNo,
                reviewer: this.orderForm.reviewer,
                reviewerId: this.orderForm.reviewerId,
                warehouseId: this.orderForm.warehouseId,
                warehouseName: this.orderForm.warehouseName,
                type: this.orderForm.type,
                status: 3, //1 待确认 2 待审核 3 已审核
                stockProfitLossOrderDetailList: this.pendingList
            };
            if (!this.pendingList.length) {
                this.$message({
                    message: '复核列表不可为空',
                    type: 'warning'
                });
                return;
            }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.submitLoading = true;
                    this.$api
                        .stock_stockProfitLossOrder_update(params)
                        .then((res) => {
                            this.$message({
                                message: '盘点复核成功',
                                type: 'success'
                            });
                            this.resetForm();
                            this.submitLoading = false;
                        })
                        .catch((err) => {
                            console.log(err);
                            this.submitLoading = false;
                        });
                } else {
                    this.$message({
                        message: '请填写必要信息',
                        type: 'warning'
                    });
                }
            });
        },
        //格式化小数值
        formatDecimal(value) {
            let x = String(value).indexOf('.') + 1; //得到小数点的位置
            let pointCount = x == 0 ? 0 : String(value).length - x; //小数点的位数
            if (pointCount > 2) {
                value = Number(value).toFixed(2);
            }
            return value;
        },
        changeSumPrice(item) {
            this.$set(item, 'qtyDifference', item.actualQty - item.stockQty);
            this.$set(
                item,
                'actualCostAmount',
                this.formatDecimal(item.actualQty * item.stockCostPrice)
            ); //成本金额
            this.$set(
                item,
                'actualRetailAmount',

                this.formatDecimal(item.actualQty * item.retailPrice)
            ); //销售金额
            this.$set(
                item,
                'costAmountDifference',

                this.formatDecimal(item.qtyDifference * item.stockCostPrice)
            ); //成本金额差
            this.$set(
                item,
                'retailAmountDifference',

                this.formatDecimal(item.qtyDifference * item.retailPrice)
            ); //销售金额差
        },
        singleDelete(row, index) {
            this.$confirm('选中数据将被移除, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.pendingList.splice(index, 1);
            });
        }
    }
};
</script>
<style lang="scss" >
.custom-form {
    display: flex;
    flex-wrap: wrap;
}

.custom-form /deep/ .el-form-item__error {
    padding-top: 0px;
}

.custom-form /deep/.el-form--inline .el-form-item {
    width: 280px;
}

.acceptance-input__error {
    .el-input__inner {
        border-color: #ff4949;
    }
}
.cancelOrder-tool-tip {
    font-size: 11px;
}
.pending-wrapper {
    padding: 10px 0 20px;
    .operate-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        justify-content: space-between;
    }
    .operate-tips {
        color: #ff6c78;
    }
    .pirce-info {
        span {
            margin-left: 15px;
        }
    }
}
.processed-wrapper {
    padding-bottom: 20px;
    .pirce-info {
        margin-bottom: 10px;
        text-align: right;
        span {
            margin-left: 15px;
        }
    }
}
</style>