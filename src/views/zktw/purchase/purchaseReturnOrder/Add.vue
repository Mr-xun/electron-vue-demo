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
                <el-form-item label="供应商：" prop="supplierId">
                    <el-select
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.supplierId"
                        @change="changeSupplier"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                    >
                        <el-option
                            v-for="item in supplierOptions"
                            :label="item.name"
                            :key="item.id"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="供应商编码：" prop="supplierCode">
                    <el-input
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.supplierCode"
                        readonly
                    ></el-input>
                </el-form-item>
                <el-form-item label="退货人员：" prop="returnerCode">
                    <el-select
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.returnerCode"
                        @change="changeReturner"
                        clearable
                        filterable
                    >
                        <el-option
                            v-for="item in userOptions"
                            :label="item.fullname"
                            :key="item.userId"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单据日期：" prop="orderDate">
                    <el-date-picker
                        type="date"
                        size="mini"
                        :style="{ width: itemWidth }"
                        placeholder="选择时间"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
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
                <el-form-item label="备注：">
                    <el-input
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.remark"
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
        <div class="purchaseReturn-container">
            <div class="operate-row">
                <div class="opt-btn">
                    <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-plus"
                        plain
                        @click="addOpen"
                        v-has-permission="['purchaseReturnOrder:add']"
                        >新增商品</el-button
                    >
                    <el-button
                        type="success"
                        icon="el-icon-check"
                        size="mini"
                        plain
                        :loading="submitLoading"
                        @click="submitOrder(2)"
                        v-has-permission="['purchaseReturnOrder:add']"
                        >提交退货</el-button
                    >
                </div>
                <div class="pirce-info">
                    <el-button
                        type="warning"
                        size="mini"
                        icon="el-icon-document-add"
                        plain
                        :loading="submitLoading"
                        @click="submitOrder(1)"
                        v-has-permission="['purchaseReturnOrder:add']"
                        >存草稿</el-button
                    >
                    <el-button
                        type="info"
                        size="mini"
                        icon="el-icon-s-order"
                        plain
                        @click="draftOpen"
                        v-has-permission="['purchaseReturnOrder:add']"
                        >草稿箱</el-button
                    >
                    <span>退货总数量：{{ totalReturnQty }}</span>
                    <span
                        >退货总金额(元)：{{
                            totalReturnAmount | formatMoney
                        }}</span
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
                    :summary-method="getSummaries"
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
                        label="税率"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="tax"
                    ></el-table-column>
                    <el-table-column
                        label="批号"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="lotNo"
                        min-width="100px"
                    ></el-table-column>
                    <el-table-column
                        label="库存数量"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="stockQty"
                    ></el-table-column>
                    <el-table-column
                        label="退货数量"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="returnQty"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <el-tooltip
                                key="returnQty"
                                v-model="scope.row.returnQtyTipShow"
                                :manual="true"
                                :content="`不可大于库存数量：${scope.row.stockQty}`"
                                placement="right"
                            >
                                <el-input
                                    style="width: 85%"
                                    :class="
                                        scope.row.returnQtyTipShow
                                            ? 'purchaseReturn-input__error'
                                            : ''
                                    "
                                    size="mini"
                                    min="0"
                                    :max="scope.row.stockQty"
                                    v-number-only
                                    v-model.number="scope.row.returnQty"
                                    @input="changeReturnQty(scope.row)"
                                ></el-input>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="退货单价"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="returnPrice"
                        min-width="110"
                    >
                        <template slot-scope="scope">
                            <el-input
                                style="width: 85%"
                                size="mini"
                                v-model="scope.row.returnPrice"
                                v-number-only
                                @change="changeSumPrice(scope.row)"
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="零售价"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="retailPrice"
                        min-width="110"
                    ></el-table-column>
                    <el-table-column
                        label="退货金额"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="returnAmount"
                        min-width="110"
                    >
                        <template slot-scope="{ row }">
                            {{ row.returnAmount | formatMoney }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="零售金额"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="retailAmount"
                        min-width="110"
                    >
                        <template slot-scope="{ row }">
                            {{ row.retailAmount | formatMoney }}
                        </template>
                    </el-table-column>
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
                        label="批次号"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="batchNo"
                        min-width="140"
                    ></el-table-column>
                    <el-table-column
                        label="入库单号"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="inboundOrderNo"
                        min-width="140"
                    ></el-table-column>
                    <el-table-column
                        label="采购单价"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="purchasePrice"
                        min-width="110"
                    ></el-table-column>
                    <el-table-column
                        label="库存金额"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="stockAmount"
                        min-width="110"
                    >
                        <template slot-scope="{ row }">
                            {{ row.stockAmount | formatMoney }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="成本单价"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="costPrice"
                        min-width="110"
                    ></el-table-column>
                    <el-table-column
                        label="成本金额"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="costAmount"
                        min-width="110"
                    >
                        <template slot-scope="{ row }">
                            {{ row.costAmount | formatMoney }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="备注"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="detailRemark"
                        min-width="110"
                    >
                        <template slot-scope="scope">
                            <el-input
                                style="width: 85%"
                                size="mini"
                                v-model="scope.row.detailRemark"
                            ></el-input>
                        </template>
                    </el-table-column>
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
                <choose-pro
                    ref="add"
                    :dialog-visible="dialog.isVisible"
                    @close="addClose"
                    @addGood="addGoods"
                />
                <drafts
                    ref="drafts"
                    :dialog-visible="draftsDialog.isVisible"
                    @close="draftsClose"
                    @chooseDraft="draftChoose"
                />
            </div>
        </div>
    </div>
</template>
<script>
import ChoosePro from './components/ChoosePro';
import Drafts from './components/Drafts';
import { mapState, mapGetters } from 'vuex';
import numberOnly from '@/directive/number-only';
import focus from '@/directive/focus';
import enterJump from '@/directive/enter-jump';
export default {
    components: { ChoosePro, Drafts },
    directives: {
        numberOnly,
        focus,
        enterJump
    },
    data() {
        return {
            submitLoading: false,
            itemWidth: '160px',
            orderForm: {},
            totalReturnQty: 0,
            totalReturnAmount: 0,
            detailList: [],
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
                returnerCode: [
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
            draftsDialog: {
                isVisible: false,
                title: ''
            },
            supplierOptions: [],
            wareHouseOptions: [],
            enterpriseOptions: [],
            userOptions: []
        };
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.account.user
        }),
        ...mapGetters('basic', ['orgArchives'])
    },
    watch: {
        detailList: {
            handler: function (data) {
                this.totalReturnQty = 0;
                this.totalReturnAmount = 0;
                if (data.length) {
                    data.forEach((item) => {
                        this.totalReturnQty += Number(item.returnQty);
                        this.totalReturnAmount +=
                            item.returnQty * item.returnPrice;
                    });
                }
            },
            deep: true,
            immediate: false
        }
    },
    activated() {
        this.initForm();
    },
    created() {
        this.getAllSupplier();
        this.getAllwareHouse();
        this.getAllUser();
        this.getAllProductionEnterprise();
        this.$bus.$on('edit', (data) => {
            this.orderForm = data;
            this.orderForm.orderDate = new Date();
            this.detailList = data.purchaseReturnOrderDetailList;
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
        changeReturnQty(row) {
            //修改退货数量
            if (row.returnQty > row.stockQty) {
                row.returnQtyTipShow = true;
            } else {
                row.returnQtyTipShow = false;
                this.changeSumPrice(row);
            }
        },
        changeSupplier(val) {
            this.supplierOptions.forEach((v) => {
                if (v.id == val) {
                    this.orderForm.supplierCode = v.code;
                    this.orderForm.supplierName = v.name;
                }
            });
            this.$refs['form'].validateField('supplierCode');
        },
        changeReturner(val) {
            this.userOptions.forEach((v) => {
                if (v.code == val) {
                    this.orderForm.returnerName = v.fullname;
                }
            });
        },
        initForm() {
            this.orderForm = {
                orderDate: new Date(),
                supplierCode: '',
                supplierId: '',
                supplierName: '',
                returnerCode: this.userInfo.code,
                returnerName: this.userInfo.fullname,
                purchaseReturnOrderDetailList: [],
                remark: ''
            };
            this.detailList = [];
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
        },
        objectValueAllEmpty: function (object) {
            var isEmpty = true;
            Object.keys(object).forEach(function (x) {
                if (
                    x != 'orderCode' &&
                    x != 'orderDate' &&
                    x != 'returnerCode' &&
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
            this.dialog.title = '新增';
            this.dialog.isVisible = true;
        },
        addClose() {
            this.dialog.isVisible = false;
        },
        addGoods(data) {
            let flag = false;
            let len = this.detailList.length;
            data.rid = len;
            for (let i = 0; i < len; i++) {
                if (this.detailList[i].id == data.id) {
                    if (
                        this.detailList[i].returnQty + data.returnQty >
                        data.qty
                    ) {
                        this.$message({
                            message:
                                '已选过该批次商品，添加退货数量总和大于库存数量！',
                            type: 'error'
                        });
                    } else {
                        this.$set(
                            this.detailList[i],
                            'returnQty',
                            this.detailList[i].returnQty + data.returnQty
                        );
                        flag = true;
                        this.changeSumPrice(this.detailList[i]);
                        this.$notify({
                            title: '退货商品选择成功',
                            message: `${data.itemName}成功选择${data.returnQty}个`,
                            type: 'success',
                            duration: 2000
                        });
                    }
                    return;
                }
            }
            if (!flag) {
                this.detailList.push(JSON.parse(JSON.stringify(data)));
                this.changeSumPrice(this.detailList[len]);
                this.$notify({
                    title: '退货商品选择成功',
                    message: `${data.itemName}成功选择${data.returnQty}个`,
                    type: 'success',
                    duration: 2000
                });
            }
        },
        draftOpen() {
            this.draftsDialog.isVisible = true;
            this.$refs.drafts.fetch();
        },
        draftsClose() {
            this.draftsDialog.isVisible = false;
        },
        draftChoose(data) {
            this.orderForm = data;
            this.orderForm.orderDate = new Date();
            this.detailList = data.purchaseReturnOrderDetailList;
            this.draftsDialog.isVisible = false;
        },
        getAllSupplier() {
            this.$api.basic_baseSupplier_all().then((res) => {
                let { result } = res.data;
                this.supplierOptions = result;
            });
        },
        getAllwareHouse() {
            let params = {
                isRetail: 2
            };
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
                    this.userOptions = data;
                })
                .catch((err) => {
                    this.userOptions = [];
                });
        },
        getAllProductionEnterprise() {
            this.$api.basic_baseProductionEnterprise_all().then((res) => {
                this.enterpriseOptions = res.data.result;
            });
        },
        submitOrder(status) {
            this.orderForm.purchaseReturnOrderDetailList = [];
            this.orderForm.status = status;
            this.orderForm.orgId = 11;
            this.orderForm.orderDate = this.$moment(
                this.orderForm.orderDate
            ).format('YYYY-MM-DD');
            this.detailList.map((item, index) => {
                this.orderForm.purchaseReturnOrderDetailList.push({
                    orgId: 11,
                    batchNo: item.batchNo,
                    costPrice: item.costPrice || 0,
                    costAmount: item.costAmount,
                    detailRemark: item.detailRemark,
                    expireDate: item.expireDate,
                    itemCode: item.itemCode,
                    itemId: item.itemId,
                    itemName: item.itemName,
                    itemShortCode: item.itemShortCode,
                    lotNo: item.lotNo,
                    inboundOrderNo: item.inboundOrderNo,
                    productionDate: item.productionDate,
                    productionEnterpriseId: item.productionEnterpriseId,
                    productionEnterpriseName: item.productionEnterpriseName,
                    purchasePrice: item.purchasePrice || 0,
                    retailPrice: item.retailPrice,
                    retailAmount: item.retailAmount,
                    returnQty: item.returnQty,
                    returnPrice: item.returnPrice || 0,
                    returnAmount: item.returnAmount,
                    rid: index + 1,
                    specification: item.specification,
                    stockQty: item.stockQty,
                    stockAmount: item.stockAmount,
                    tax: item.tax,
                    unit: item.unit,
                    warehouseId: item.warehouseId,
                    warehouseName: item.warehouseName
                });
            });
            let params = JSON.parse(JSON.stringify(this.orderForm));
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.submitLoading = true;
                    if (this.orderForm.id) {
                        this.$api
                            .order_purchaseReturnOrder_update(params)
                            .then((res) => {
                                this.submitLoading = false;
                                this.$message({
                                    message:
                                        status == 1
                                            ? '订单已保存'
                                            : '订单已提交',
                                    type: 'success'
                                });
                                const h = this.$createElement;
                                this.$msgbox({
                                    title: '提示',
                                    message: h('div', null, [
                                        h(
                                            'h4',
                                            null,
                                            `${
                                                status == 1
                                                    ? '草稿创建完成'
                                                    : '订单操作完成'
                                            }`
                                        ),
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
                                            this.$emit('initList');
                                        } else {
                                            done();
                                            this.initForm();
                                        }
                                    }
                                }).then((action) => {
                                    console.log(action);
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                this.submitLoading = false;
                            });
                    } else {
                        this.$api
                            .order_purchaseReturnOrder_add(params)
                            .then((res) => {
                                let { result, code, msg } = res.data;
                                this.submitLoading = false;
                                if (code == 200) {
                                    this.orderForm.orderNo = result.orderCode;
                                    this.$message({
                                        message:
                                            status == 1
                                                ? '订单已保存'
                                                : '订单已提交',
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
                                        beforeClose: (
                                            action,
                                            instance,
                                            done
                                        ) => {
                                            if (action === 'confirm') {
                                                done();
                                                this.initForm();
                                                this.$emit('initList');
                                            } else {
                                                done();
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
                                console.log(err);
                                this.submitLoading = false;
                            });
                    }
                } else {
                    this.$message({
                        message: '请填写必要信息（供应商、退货人员、单据日期）',
                        type: 'error'
                    });
                    return false;
                }
            });
        },
        getSummaries(param) {
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
                8: ' ',
                9: ' ',
                10: ' ',
                11: ' ',
                12: ' ',
                15: ' ',
                16: ' ',
                17: ' ',
                18: ' ',
                19: ' ',
                21: ' ',
                23: ' ',
                24: ' '
            };
            function toFixedFix(num, fixed) {
                var pos = num.toString().indexOf('.'),
                    decimalPlaces = num.toString().length - pos - 1,
                    _int = num * Math.pow(10, decimalPlaces),
                    divisorOne = Math.pow(10, decimalPlaces - fixed),
                    divisorTwo = Math.pow(10, fixed);
                return Math.round(_int / divisorOne) / divisorTwo;
            }
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
                            return (
                                Number(toFixedFix(prev, 2)) +
                                Number(toFixedFix(curr, 2))
                            );
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[index] = this.$options.filters['formatMoney'](
                        sums[index]
                    );
                    sums[index] += ' ';
                } else {
                    sums[index] = '0.00';
                }
            });
            return sums;
        },
        changeSumPrice(item) {
            this.$set(
                item,
                'returnAmount',
                (item.returnPrice * item.returnQty).toFixed(6)
            );
            this.$set(
                item,
                'retailAmount',
                (item.retailPrice * item.returnQty).toFixed(6)
            );
            this.$set(
                item,
                'costAmount',
                (item.costPrice * item.returnQty).toFixed(6)
            );
        },
        changeEnterproce(val, row) {
            let enterpriseName = '';
            this.enterpriseOptions.forEach((item) => {
                if (item.id == val) {
                    enterpriseName = item.name;
                }
            });
            this.$set(row, 'productionEnterpriseName', enterpriseName);
        },
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
.purchaseReturn-input__error {
    .el-input__inner {
        border-color: #ff4949;
    }
}
.purchaseReturn-container {
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