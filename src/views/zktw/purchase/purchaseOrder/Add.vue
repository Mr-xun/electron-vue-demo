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
                <el-form-item label="采购人员：" prop="buyerCode">
                    <el-select
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.buyerCode"
                        @change="changeCreator"
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
                <el-form-item label="生产企业：" prop="productionEnterpriseId">
                    <el-select
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.productionEnterpriseId"
                        @change="changeEnterproce"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                    >
                        <el-option
                            v-for="item in enterpriseOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单日期：" prop="orderDate">
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
        <div class="addGoods-container">
            <div class="operate-row">
                <div class="opt-btn">
                    <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-plus"
                        plain
                        @click="addOpen"
                        v-has-permission="['purchaseOrder:add']"
                        >新增商品</el-button
                    >
                    <el-button
                        type="success"
                        icon="el-icon-check"
                        size="mini"
                        plain
                        :loading="submitLoading"
                        @click="submitOrder(2)"
                        v-has-permission="['purchaseOrder:add']"
                        >提交订单</el-button
                    >
                </div>
                <div class="pirce-info">
                    <el-button
                        type="warning"
                        size="mini"
                        icon="el-icon-document-add"
                        plain
                        v-has-permission="['purchaseOrder:add']"
                        :loading="submitLoading"
                        @click="submitOrder(1)"
                        >存草稿</el-button
                    >
                    <el-button
                        type="info"
                        size="mini"
                        icon="el-icon-s-order"
                        plain
                        @click="draftOpen"
                        v-has-permission="['purchaseOrder:add']"
                        >草稿箱</el-button
                    >
                    <span>采购总数量：{{ totalQty }}</span>
                    <span
                        >采购总金额(元)：{{
                            purchaseAllAmount.toFixed(2)
                        }}</span
                    >
                    <span
                        >零售总金额(元)：{{ retailAllAmount.toFixed(2) }}</span
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
                        type="index"
                        width="50"
                        align="center"
                        label="序号"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="itemCode"
                        min-width="100px"
                        :show-overflow-tooltip="true"
                        label="商品编码"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="itemName"
                        label="商品名称"
                        :show-overflow-tooltip="true"
                        min-width="120px"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="itemShortCode"
                        label="速记码"
                        :show-overflow-tooltip="true"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="specification"
                        label="规格"
                        :show-overflow-tooltip="true"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="name"
                        label="单位"
                        :show-overflow-tooltip="true"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.unit }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="placeOrigin"
                        min-width="80px"
                        :show-overflow-tooltip="true"
                        label="产地"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="price"
                        label="生产企业"
                        min-width="160px"
                    >
                        <template slot-scope="scope">
                            <el-select
                                style="width: 95%"
                                :class="
                                    !scope.row.productionEnterpriseId
                                        ? 'addorder-input__error'
                                        : ''
                                "
                                size="mini"
                                clearable
                                filterable
                                autocomplete="on"
                                default-first-option
                                v-model="scope.row.productionEnterpriseId"
                                @change="
                                    changeTableEnterproce($event, scope.row)
                                "
                            >
                                <el-option
                                    v-for="item in enterpriseOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="qty"
                        label="数量"
                        min-width="100px"
                    >
                        <template slot-scope="scope">
                            <el-input
                                style="width: 85%"
                                size="mini"
                                v-number-only
                                v-model.number="scope.row.qty"
                                @change="changeSumPrice(scope.row)"
                            ></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                        align="center"
                        prop="purchasePrice"
                        label="单价"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <el-input
                                style="width: 85%"
                                size="mini"
                                v-model="scope.row.purchasePrice"
                                v-number-only
                                @change="changeSumPrice(scope.row)"
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="amount"
                        label="金额"
                        min-width="120px"
                    >
                        <template slot-scope="{ row }">
                            {{ row.amount | formatMoney }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="retailPrice"
                        label="零售价"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <el-input
                                style="width: 85%"
                                size="mini"
                                v-model="scope.row.retailPrice"
                                v-number-only
                                @change="changeSumPrice(scope.row)"
                            ></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="retailAmount"
                        label="零售金额"
                        min-width="120px"
                    >
                        <template slot-scope="{ row }">
                            {{ row.retailAmount | formatMoney }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="detailRemark"
                        label="备注"
                        min-width="120px"
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
                                @click="singleDelete(row, $index)"
                            />
                        </template>
                    </el-table-column>
                </el-table>
                <base-product-add
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
import BaseProductAdd from './components/Product';
import Drafts from './components/Drafts';
import { mapState, mapGetters } from 'vuex';
import numberOnly from '@/directive/number-only';
import focus from '@/directive/focus';
import enterJump from '@/directive/enter-jump';
export default {
    components: { BaseProductAdd, Drafts },
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
            totalQty: 0,
            purchaseAllAmount: 0,
            retailAllAmount: 0,
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
                buyerCode: [
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
                this.totalQty = 0;
                this.purchaseAllAmount = 0;
                this.retailAllAmount = 0;
                if (data.length) {
                    data.forEach((item) => {
                        this.totalQty += Number(item.qty);
                        this.purchaseAllAmount += item.qty * item.purchasePrice;
                        this.retailAllAmount += item.qty * item.retailPrice;
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
            this.detailList = data.purchaseOrderDetailList;
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
        changeSupplier(val) {
            this.supplierOptions.forEach((v) => {
                if (v.id == val) {
                    this.orderForm.supplierCode = v.code;
                    this.orderForm.supplierName = v.name;
                }
            });
            this.$refs['form'].validateField('supplierCode');
        },
        changeCreator(val) {
            this.userOptions.forEach((v) => {
                if (v.code == val) {
                    this.orderForm.buyerName = v.fullname;
                }
            });
        },
        initForm() {
            this.orderForm = {
                orderDate: new Date(),
                buyerCode: this.userInfo.code,
                buyerName: this.userInfo.fullname,
                purchaseOrderDetailList: [],
                remark: '',
                supplierCode: '',
                supplierId: '',
                supplierName: '',
                productionEnterpriseId: '',
                productionEnterpriseName: ''
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
                    x != 'buyerCode' &&
                    x != 'buyerName'
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
            data.detailRemark = '';
            data.itemCode = data.code;
            data.itemId = data.id;
            data.itemName = data.name;
            data.itemShortCode = data.shorthandCode;
            data.purchasePrice = data.buyingPrice;
            data.tax = data.taxRate;
            data.rid = len + 1;
            if (this.orderForm.productionEnterpriseId) {
                data.productionEnterpriseId = this.orderForm.productionEnterpriseId;
                data.productionEnterpriseName = this.orderForm.productionEnterpriseName;
            }
            for (let i = 0; i < len; i++) {
                if (this.detailList[i].id == data.id) {
                    this.$set(
                        this.detailList[i],
                        'qty',
                        this.detailList[i].qty + data.qty
                    );
                    flag = true;
                    this.changeSumPrice(this.detailList[i]);
                    return;
                }
            }
            if (!flag) {
                this.detailList.push(JSON.parse(JSON.stringify(data)));
                this.changeSumPrice(this.detailList[len]);
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
            this.detailList = data.purchaseOrderDetailList;
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
        //提交订单
        submitOrder(status) {
            let haveEnterprise = true;
            this.orderForm.purchaseOrderDetailList = [];
            this.orderForm.status = status;
            this.orderForm.orderDate = this.$moment(
                this.orderForm.orderDate
            ).format('YYYY-MM-DD');
            this.detailList.map((item, index) => {
                if (!item.productionEnterpriseId) {
                    haveEnterprise = false;
                }
                this.orderForm.purchaseOrderDetailList.push({
                    amount: item.amount,
                    detailRemark: item.detailRemark,
                    discountRate: item.discountRate,
                    itemCode: item.itemCode,
                    itemId: item.itemId,
                    itemName: item.itemName,
                    itemShortCode: item.itemShortCode,
                    placeOrigin: item.placeOrigin,
                    productionEnterpriseId: item.productionEnterpriseId,
                    productionEnterpriseName: item.productionEnterpriseName,
                    purchasePrice: item.purchasePrice,
                    qty: item.qty,
                    retailPrice: item.retailPrice,
                    rid: item.rid,
                    specification: item.specification,
                    tax: item.tax,
                    unitId: item.unitId,
                    unit: item.unit
                });
            });
            let params = JSON.parse(JSON.stringify(this.orderForm));
            if (!haveEnterprise) {
                this.$message({
                    message: '请选择生产企业',
                    type: 'error'
                });
                return;
            }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.submitLoading = true;
                    if (this.orderForm.id) {
                        this.$api
                            .order_purchaseOrder_update(params)
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
                            .order_purchaseOrder_add(params)
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
                        message: '请填写必要信息（供应商、采购人员、订单日期）',
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
                9: ' ',
                11: ' ',
                13: ' ',
                14: ' '
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
                    if (index !== 8) {
                        sums[index] = this.$options.filters['formatMoney'](
                            sums[index]
                        );
                    }
                    sums[index] += ' ';
                } else {
                    if (index === 8) {
                        sums[index] = 0;
                    } else {
                        sums[index] = '0.00';
                    }
                }
            });
            return sums;
        },
        changeSumPrice(item) {
            this.$set(item, 'amount', item.qty * item.purchasePrice);
            this.$set(item, 'retailAmount', item.qty * item.retailPrice);
        },
        changeEnterproce(val, row) {
            this.orderForm.productionEnterpriseName = '';
            this.enterpriseOptions.forEach((item) => {
                if (item.id == val) {
                    this.orderForm.productionEnterpriseName = item.name;
                }
            });
            this.detailList.forEach((h) => {
                this.$set(
                    h,
                    'productionEnterpriseId',
                    this.orderForm.productionEnterpriseId
                );
                this.$set(
                    h,
                    'productionEnterpriseName',
                    this.orderForm.productionEnterpriseName
                );
            });
        },
        changeTableEnterproce(val, row) {
            let enterpriseName = '';
            this.enterpriseOptions.forEach((item) => {
                if (item.id == val) {
                    enterpriseName = item.name;
                }
            });
            this.$set(row, 'productionEnterpriseName', enterpriseName);
        },
        singleDelete(row, index) {
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
.addorder-input__error {
    .el-input__inner {
        border-color: #ff4949;
    }
}
.addGoods-container {
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