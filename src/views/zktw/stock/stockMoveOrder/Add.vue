<template>
    <div class="add-order">
        <div class="form-container">
            <el-form
                ref="form"
                :model="orderForm"
                :inline="true"
                :rules="rules"
                class="custom-form"
            >
                <el-form-item label="移出库房" prop="moveOutWarehouseId">
                    <el-select
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.moveOutWarehouseId"
                        @change="changeMoveOutWareHouse"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                    >
                        <el-option
                            v-for="item in moveOutWareHouseOptions"
                            :label="item.name"
                            :key="item.id"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="移入库房" prop="moveInWarehouseId">
                    <el-select
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.moveInWarehouseId"
                        @change="changeMoveInWareHouse"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                    >
                        <el-option
                            v-for="item in moveInWareHouseOptions"
                            :label="item.name"
                            :key="item.id"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收货人" prop="consigneeId">
                    <el-select
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.consigneeId"
                        @change="changeConsignee"
                        clearable
                        filterable
                    >
                        <el-option
                            v-for="item in userOptions"
                            :label="item.fullname"
                            :key="item.userId"
                            :value="item.userId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="制单人" prop="creatorId">
                    <el-select
                        size="mini"
                        disabled
                        :style="{ width: itemWidth }"
                        v-model="orderForm.creatorId"
                        @change="changeCreator"
                        clearable
                        filterable
                    >
                        <el-option
                            v-for="item in userOptions"
                            :label="item.fullname"
                            :key="item.userId"
                            :value="item.userId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单据日期：" prop="orderDate">
                    <el-date-picker
                        disabled
                        type="date"
                        size="mini"
                        style="width: 180px"
                        placeholder="选择时间"
                        format="yyyy-MM-dd hh:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="orderForm.orderDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="单据编号：">
                    <el-input
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.orderNo"
                        readonly
                    ></el-input>
                </el-form-item>
                <el-form-item label style="margin-left: 0.75rem">
                    <el-button
                        class="filter-item"
                        type="primary"
                        size="mini"
                        plain
                        @click="initForm"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <el-divider></el-divider>
        <div class="st-move-add-container">
            <div class="operate-row">
                <div class="opt-btn">
                    <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-plus"
                        plain
                        v-has-permission="['stockMoveOrder:add']"
                        @click="addOpen"
                        >新增商品</el-button
                    >
                    <el-button
                        :loading="buttonLoading"
                        type="success"
                        icon="el-icon-check"
                        size="mini"
                        plain
                        v-has-permission="['stockMoveOrder:add']"
                        @click="submitOrder(2)"
                        >提交订单</el-button
                    >
                </div>
            </div>
            <div class="goods-table" id="form">
                <el-table
                    :data="detailList"
                    :header-cell-style="{
                        background: '#eef1f6',
                        color: '#606266',
                    }"
                    stripe
                    border
                    show-summary
                    :summary-method="dealSummaries"
                    style="width: 100%"
                >
                    <el-table-column
                        label="序号"
                        type="index"
                        width="50"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="商品编码"
                        prop="itemCode"
                        :show-overflow-tooltip="true"
                        min-width="100"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="商品名称"
                        :show-overflow-tooltip="true"
                        align="center"
                        min-width="120px"
                        prop="itemName"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="itemShortCode"
                        label="速记码"
                        :show-overflow-tooltip="true"
                    ></el-table-column>
                    <el-table-column
                        label="规格"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="specification"
                    ></el-table-column>
                    <el-table-column
                        label="生产企业"
                        :show-overflow-tooltip="true"
                        align="center"
                        min-width="120px"
                        prop="productionEnterpriseName"
                    ></el-table-column>
                    <el-table-column
                        label="单位"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="unit"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.unit }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="移出库存数量"
                        :show-overflow-tooltip="true"
                        min-width="110"
                        align="center"
                        prop="moveOutStockQty"
                    ></el-table-column>
                    <el-table-column
                        label="移出数量"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="qty"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <el-tooltip
                                key="qty"
                                v-model="scope.row.qtyTipShow"
                                :manual="true"
                                :content="`不可大于移出库存数量：${scope.row.moveOutStockQty}`"
                                placement="right"
                            >
                                <el-input
                                    style="width: 85%"
                                    :class="
                                        scope.row.qtyTipShow
                                            ? 'st-move-add-input__error'
                                            : ''
                                    "
                                    size="mini"
                                    min="0"
                                    :max="scope.row.moveOutStockQty"
                                    v-number-only
                                    v-model.number="scope.row.qty"
                                    @input="changeMoveQty(scope.row)"
                                ></el-input>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="批号"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="lotNo"
                        min-width="100px"
                    ></el-table-column>
                    <el-table-column
                        label="生产日期"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="productionDate"
                        min-width="110"
                    ></el-table-column>
                    <el-table-column
                        label="有效期至"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="expireDate"
                        min-width="110"
                    ></el-table-column>
                    <el-table-column
                        label="移入库存数量"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="moveInStockQty"
                        min-width="140"
                    ></el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="80px"
                        fixed="right"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="{ row, $index }">
                            <i
                                class="el-icon-delete table-operation"
                                style="color: #f50"
                                @click="removeChoosed(row, $index)"
                            />
                        </template>
                    </el-table-column>
                </el-table>
                <choose-move-pro
                    ref="addGoods"
                    :dialog-visible="dialog.isVisible"
                    :moveInWarehouseId="orderForm.moveInWarehouseId"
                    :moveOutWarehouseId="orderForm.moveOutWarehouseId"
                    @close="addClose"
                    @addGood="addGoods"
                />
            </div>
        </div>
    </div>
</template>
<script>
import ChooseMovePro from './components/ChooseMovePro';
import { mapState, mapGetters } from 'vuex';
import numberOnly from '@/directive/number-only';
import focus from '@/directive/focus';
import enterJump from '@/directive/enter-jump';
export default {
    components: { ChooseMovePro },
    directives: {
        numberOnly,
        focus,
        enterJump
    },
    data() {
        return {
            itemWidth: '160px',
            buttonLoading: false,
            orderForm: {},
            detailList: [],
            rules: {
                moveInWareHouseCode: [
                    { required: true, message: ' ', trigger: 'blur' }
                ],
                moveInWarehouseId: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                moveOutWarehouseId: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                consigneeId: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                creatorId: [
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
            dialog: {
                isVisible: false,
                title: ''
            },
            wareHouseAllOptions: [],
            moveInWareHouseOptions: [], //可选移入库
            moveOutWareHouseOptions: [], //可选移出库
            userOptions: []
        };
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.account.user
        }),
        ...mapGetters('basic', ['orgArchives'])
    },
    mounted() {
        this.initForm();
    },
    created() {
        this.getAllWareHouse();
        this.getAllUser();
        this.$bus.$on('edit', (data) => {
            this.orderForm = data;
            this.orderForm.orderDate = new Date();
            this.detailList = data.stockMoveOrderDetailList;
            this.moveOutWareHouseOptions = this.moveInWareHouseOptions = this.wareHouseAllOptions;
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
        changeMoveQty(row) {
            //修改移货数量
            if (row.qty > row.moveOutStockQty) {
                row.qtyTipShow = true;
            } else {
                row.qtyTipShow = false;
            }
        },
        changeMoveOutWareHouse(val) {
            this.wareHouseAllOptions.forEach((v) => {
                if (v.id == val) {
                    this.orderForm.moveOutWarehouseName = v.name;
                }
            });
            this.moveInWareHouseOptions = this.wareHouseAllOptions.filter(
                (v) => v.id != val
            );
        },
        changeMoveInWareHouse(val) {
            this.wareHouseAllOptions.forEach((v) => {
                if (v.id == val) {
                    this.orderForm.moveInWarehouseName = v.name;
                }
            });
            this.moveOutWareHouseOptions = this.wareHouseAllOptions.filter(
                (v) => v.id != val
            );
        },
        changeConsignee(val) {
            this.userOptions.forEach((v) => {
                if (v.userId == val) {
                    this.orderForm.consigneeName = v.fullname;
                }
            });
        },
        changeCreator(val) {
            this.userOptions.forEach((v) => {
                if (v.userId == val) {
                    this.orderForm.creatorName = v.fullname;
                }
            });
        },
        initForm() {
            this.orderForm = {
                orderDate: new Date(),
                moveInWarehouseId: null,
                moveInWarehouseName: null,
                moveOutWarehouseId: null,
                moveOutWarehouseName: null,
                creatorId: this.userInfo.userId,
                creatorName: this.userInfo.fullname,
                stockMoveOrderDetailList: []
            };
            this.detailList = [];
            this.moveOutWareHouseOptions = this.moveInWareHouseOptions = this.wareHouseAllOptions;
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
        },
        objectValueAllEmpty: function (object) {
            var isEmpty = true;
            Object.keys(object).forEach(function (x) {
                if (
                    x != 'orderCode' &&
                    x != 'orderDate' &&
                    x != 'creater' &&
                    x != 'returnerName'
                ) {
                    if (object[x] != null && object[x] != '') {
                        isEmpty = false;
                    }
                }
            });
            if (isEmpty) {
                return true;
            }
            return false;
        },
        addOpen() {
            if (!this.orderForm.moveInWarehouseId) {
                this.$message({
                    message: '请选择移入库房',
                    type: 'warning'
                });
            } else if (!this.orderForm.moveOutWarehouseId) {
                this.$message({
                    message: '请选择移出库房',
                    type: 'warning'
                });
            } else {
                this.dialog.title = '新增';
                this.dialog.isVisible = true;
                this.$refs.addGoods.fetch();
            }
        },
        addClose() {
            this.dialog.isVisible = false;
        },
        addGoods(data) {
            let flag = false;
            let len = this.detailList.length;
            data.rid = len;
            for (let i = 0; i < len; i++) {
                if (
                    this.detailList[i].itemId == data.itemId &&
                    this.detailList[i].lotNo == data.lotNo
                ) {
                    if (
                        this.detailList[i].qty + data.qty >
                        data.moveOutStockQty
                    ) {
                        this.$message({
                            message:
                                '已选过该批号商品，移出数量总和不可大于移出库存数量！',
                            type: 'error'
                        });
                    } else {
                        this.$set(
                            this.detailList[i],
                            'qty',
                            this.detailList[i].qty + data.qty
                        );
                        flag = true;
                        this.$notify({
                            title: '移库商品选择成功',
                            message: `${data.itemName}成功选择${data.qty}个`,
                            type: 'success',
                            duration: 2000
                        });
                    }
                    return;
                }
            }
            if (!flag) {
                this.detailList.push(JSON.parse(JSON.stringify(data)));
                this.$notify({
                    title: '移库商品选择成功',
                    message: `${data.itemName}成功选择${data.qty}个`,
                    type: 'success',
                    duration: 2000
                });
            }
        },
        getAllWareHouse() {
            this.$api.basic_baseWarehouse_all().then((res) => {
                let { result } = res.data;
                this.moveInWareHouseOptions = this.moveOutWareHouseOptions = this.wareHouseAllOptions = result;
            });
        },
        getAllUser() {
            this.$api
                .system_user_all()
                .then((r) => {
                    const { data } = r.data;
                    this.userOptions = data;
                })
                .catch((err) => {
                    this.userOptions = [];
                });
        },
        //去打印
        toPrint(orderNo) {
            let hostUrl = window.location.origin + window.location.pathname;
            let routeUrl = this.$router.resolve({
                path: '/print/preview',
                query: {
                    printType: 'stockMoveOrder',
                    orderNo: orderNo
                }
            });
            window.open(
                hostUrl + routeUrl.href + '&timestamp=' + new Date().getTime(),
                'printPage',
                'height=800,width=800,top=0,left=800,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no, status=no'
            );
        },
        //提交订单
        submitOrder(status) {
            this.orderForm.stockMoveOrderDetailList = [];
            this.orderForm.status = status;
            this.orderForm.orderDate = this.$moment(
                this.orderForm.orderDate
            ).format('YYYY-MM-DD');
            this.detailList.map((item, index) => {
                this.orderForm.stockMoveOrderDetailList.push({
                    expireDate: item.expireDate,
                    itemCode: item.itemCode,
                    itemId: item.itemId,
                    itemName: item.itemName,
                    itemShortCode: item.itemShortCode,
                    lotNo: item.lotNo,
                    moveInStockQty: item.moveInStockQty,
                    moveInWarehouseId: this.orderForm.moveInWarehouseId,
                    moveOutStockQty: item.moveOutStockQty,
                    moveOutWarehouseId: this.orderForm.moveOutWarehouseId,
                    productionDate: item.productionDate,
                    productionEnterpriseId: item.productionEnterpriseId,
                    productionEnterpriseName: item.productionEnterpriseName,
                    qty: item.qty,
                    rid: index + 1,
                    specification: item.specification,
                    unit: item.unit,
                    unitId: item.unitId
                });
            });
            let params = JSON.parse(JSON.stringify(this.orderForm));
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    this.$api
                        .stock_stockMoveOrder_add(params)
                        .then((res) => {
                            let { result, code, msg } = res.data;
                            this.buttonLoading = false;
                            if (code == 200) {
                                this.orderForm.orderNo = result.orderCode;
                                this.$message({
                                    message: '订单已提交',
                                    type: 'success'
                                });
                                const h = this.$createElement;
                                this.$msgbox({
                                    title: '提示',
                                    message: h('div', null, [
                                        h('h4', null, '订单创建完成'),
                                        h('h4', null, [
                                            h(
                                                'span',
                                                null,
                                                `订单编码：${result.orderCode}`
                                            )
                                        ]),
                                        h(
                                            'p',
                                            { 'font-size': '16px' },
                                            '订单操作成功，是否前往查看?'
                                        )
                                    ]),
                                    showCancelButton: true,
                                    confirmButtonText: '前往查看',
                                    cancelButtonText: '停留当前页',
                                    beforeClose: (action, instance, done) => {
                                        if (action === 'confirm') {
                                            done();
                                            this.initForm();
                                            this.toPrint(result.orderCode);
                                            this.$emit('initList');
                                        } else {
                                            done();
                                            this.toPrint(result.orderCode);
                                            this.initForm();
                                        }
                                    }
                                }).then((action) => {
                                    console.log(action);
                                });
                            } else {
                                this.$message({
                                    message: msg,
                                    type: 'warning'
                                });
                            }
                        })
                        .catch((err) => {
                            this.buttonLoading = false;
                            console.log(err);
                        });
                } else {
                    this.$message({
                        message: '请填写必要信息（移出库房、移入库房、收货人）',
                        type: 'error'
                    });
                    return false;
                }
            });
        },
        //处理表单合计
        dealSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            const map = {
                0: '总计',
                1: ' ',
                2: ' ',
                3: ' ',
                4: ' ',
                5: ' ',
                6: ' ',
                7: ' ',
                9: ' ',
                10: ' ',
                11: ' ',
                12: ' ',
                13: ' '
            };
            columns.forEach((column, index) => {
                if (map[index]) {
                    sums[index] = map[index];
                    return sums;
                }
                const values = data.map((item) =>
                    Number(item[column.property])
                );
                if (!values.every((value) => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    if (index !== 7) {
                        sums[index] = sums[index].toFixed(2);
                    }
                    sums[index] += ' ';
                } else {
                    if (index === 7) {
                        sums[index] = 0;
                    } else {
                        sums[index] = '0.00';
                    }
                }
            });
            return sums;
        },
        //移除已选择商品
        removeChoosed(row, index) {
            this.$confirm('该数据将被移除, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.detailList.splice(index, 1);
            });
        }
    }
};
</script>
<style lang="scss" >
.st-move-add-input__error {
    .el-input__inner {
        border-color: #ff4949;
    }
}
.st-move-add-container {
    padding-bottom: 50px;
    .operate-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        justify-content: space-between;
        .pirce-info {
            span {
                margin-left: 15px;
            }
        }
    }
}
</style>