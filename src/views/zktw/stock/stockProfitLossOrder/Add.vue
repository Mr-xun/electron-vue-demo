<template>
	<div class="add-inventory">
		<div class="form-container">
			<el-form
				ref="form"
				:model="orderForm"
				:inline="true"
				:rules="rules"
				class="custom-form"
			>
				<el-form-item label="库房" prop="warehouseId">
					<el-select
						size="mini"
						:style="{ width: itemWidth }"
						v-model="orderForm.warehouseId"
						@change="changeWareHouse"
						clearable
						filterable
						autocomplete="on"
						default-first-option
					>
						<el-option
							v-for="item in wareHouseOptions"
							:label="item.name"
							:key="item.id"
							:value="item.id"
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
				<el-form-item label="单据日期：">
					<el-date-picker
						disabled
						type="date"
						size="mini"
						:style="{ width: itemWidth }"
						placeholder="选择时间"
						format="yyyy-MM-dd"
						value-format="yyyy-MM-dd"
						v-model="orderForm.orderDate"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="单据编码：">
					<el-input
						size="mini"
						:style="{ width: itemWidth }"
						v-model="orderForm.orderNo"
						readonly
					></el-input>
				</el-form-item>
				<el-form-item label="数据源：">
					<span class="data-origin">{{ dataOrigin || "--" }}</span>
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
						icon="el-icon-search"
						plain
						@click="getStockList"
						v-has-permission="['stockProfitLossOrder:add']"
						>库存查询</el-button
					>
					<el-button
						type="primary"
						size="mini"
						icon="el-icon-plus"
						plain
						@click="addOpen"
						v-has-permission="['stockProfitLossOrder:add']"
						>新增商品库存</el-button
					>
					<el-button
						type="success"
						icon="el-icon-check"
						size="mini"
						plain
						:loading="submitLoading"
						@click="submitOrder()"
						v-has-permission="['stockProfitLossOrder:add']"
						>提交</el-button
					>
					<el-button
						type="success"
						icon="el-icon-printer"
						size="mini"
						plain
						:loading="submitLoading"
						@click="submitAndPrint()"
						v-has-permission="['stockProfitLossOrder:add']"
						>提交并打印</el-button
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
					v-loading="loading"
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
						min-width="120px"
						sortable
						:show-overflow-tooltip="true"
						label="商品编码"
					></el-table-column>
					<el-table-column
						align="center"
						prop="itemName"
						label="商品名称"
						sortable
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
						prop="location"
						label="货位"
					></el-table-column>
					<el-table-column
						align="center"
						prop="productionEnterpriseName"
						label="生产企业"
						min-width="160px"
					></el-table-column>
					<el-table-column
						align="center"
						prop="qty"
						label="库存数量"
						min-width="100px"
					></el-table-column>
					<el-table-column
						label="库存成本金额"
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
						label="库存销售金额"
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
						align="center"
						prop="lotNo"
						label="批号"
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
						label="成本价"
						:show-overflow-tooltip="true"
						align="center"
						prop="costPrice"
						min-width="110"
					></el-table-column>
					<el-table-column
						label="实际成本金额"
						:show-overflow-tooltip="true"
						align="center"
						prop="actualCostAmount"
						min-width="110"
						v-if="dataOrigin == '新增商品库存'"
					>
						<template slot-scope="{ row }">
							{{ row.actualCostAmount | formatMoney }}
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
						label="实际零售金额"
						:show-overflow-tooltip="true"
						align="center"
						prop="actualRetailAmount"
						min-width="110"
						v-if="dataOrigin == '新增商品库存'"
					>
						<template slot-scope="{ row }">
							{{ row.actualRetailAmount | formatMoney }}
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						prop="actualQty"
						label="实盘数量"
						min-width="120px"
						v-if="dataOrigin == '新增商品库存'"
					>
						<template slot-scope="scope">
							<el-input
								style="width: 85%"
								size="mini"
								v-model.number="scope.row.actualQty"
								@input="changeSumPrice(scope.row)"
							></el-input>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						prop="qtyDifference"
						label="数量差"
						min-width="120px"
						v-if="dataOrigin == '新增商品库存'"
					>
						<template slot-scope="{ row }">
							<span>{{ row.qtyDifference || 0 }}</span>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						prop="retailAmountDifference"
						label="零售金额差"
						min-width="120px"
						v-if="dataOrigin == '新增商品库存'"
					>
						<template slot-scope="{ row }">
							{{ row.retailAmountDifference | formatMoney }}
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						prop="costAmountDifference"
						label="成本金额差"
						min-width="120px"
						v-if="dataOrigin == '新增商品库存'"
					>
						<template slot-scope="{ row }">
							{{ row.costAmountDifference | formatMoney }}
						</template>
					</el-table-column>
					<el-table-column
						label="操作"
						align="center"
						min-width="80px"
						fixed="right"
						class-name="small-padding fixed-width"
						v-if="dataOrigin == '新增商品库存'"
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
				<pagination
					v-show="total > 0"
					:total="total"
					:page.sync="pagination.num"
					:limit.sync="pagination.size"
					@pagination="getWareHouseStockList"
				/>
				<base-product-add
					ref="add"
					:dialog-visible="dialog.isVisible"
					@close="addClose"
					@addGood="addGoods"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import BaseProductAdd from './components/Product';
import Pagination from '@/components/Pagination';
import { mapState, mapGetters } from 'vuex';
import numberOnly from '@/directive/number-only';
import focus from '@/directive/focus';
import enterJump from '@/directive/enter-jump';
export default {
    components: { BaseProductAdd, Pagination },
    directives: {
        numberOnly,
        focus,
        enterJump
    },
    data() {
        return {
            dataOrigin: '',
            itemWidth: '160px',
            orderForm: {},
            totalQty: 0,
            totalAmount: 0,
            detailList: [],
            rules: {
                warehouseId: [
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
            draftsDialog: {
                isVisible: false,
                title: ''
            },
            supplierOptions: [],
            wareHouseOptions: [],
            enterpriseOptions: [],
            userOptions: [],
            submitLoading: false,
            loading: false,
            total: 0,
            pagination: {
                size: 10,
                num: 1
            }
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.account.user
        }),
        ...mapGetters('basic', ['orgArchives'])
    },
    watch: {
        detailList: {
            handler: function(data) {
                this.totalQty = 0;
                this.totalAmount = 0;
                if (data.length) {
                    data.forEach(item => {
                        this.totalQty += Number(item.qty);
                        this.totalAmount += item.qty * item.purchasePrice;
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
        this.getAllwareHouse();
        this.getAllUser();
        this.$bus.$on('edit', data => {
            this.orderForm = data;
            this.orderForm.orderDate = new Date();
            this.detailList = data.stockProfitLossOrderDetailList;
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
        changeWareHouse(val) {
            if (!val) {
                this.dataOrigin = '';
            }
            this.wareHouseOptions.forEach(v => {
                if (v.id == val) {
                    this.orderForm.warehouseName = v.name;
                }
            });
        },

        changeCreator(val) {
            this.userOptions.forEach(v => {
                if (v.code == val) {
                    this.orderForm.creatorName = v.fullname;
                }
            });
        },
        initForm() {
            this.orderForm = {
                orderDate: new Date(),
                creatorId: this.userInfo.userId,
                creatorName: this.userInfo.fullname,
                warehouseId: '',
                warehouseName: '',
                stockProfitLossOrderDetailList: []
            };
            this.detailList = [];
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
        },
        objectValueAllEmpty: function(object) {
            var isEmpty = true;
            Object.keys(object).forEach(function(x) {
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
        getStockList() {
            if (!this.orderForm.warehouseId) {
                this.$message({
                    message: '请选择库房',
                    type: 'warning'
                });
                return;
            }
            if (this.dataOrigin == '新增商品库存') {
                this.$confirm('切换数据源列表将清空, 是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.pagination.num = 1;
                    this.dataOrigin = '库存查询';
                    this.detailList = [];
                    this.getWareHouseStockList();
                });
            } else {
                this.pagination.num = 1;
                this.dataOrigin = '库存查询';
                this.getWareHouseStockList();
            }
        },
        addOpen() {
            if (this.dataOrigin == '库存查询') {
                this.$confirm('切换数据源列表将清空, 是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.dataOrigin = '新增商品库存';
                    this.dialog.title = '新增';
                    this.dialog.isVisible = true;
                    this.total = 0;
                    this.pagination.num = 1;
                    this.detailList = [];
                });
            } else {
                this.dataOrigin = '新增商品库存';
                this.dialog.title = '新增';
                this.dialog.isVisible = true;
            }
        },
        addClose() {
            this.dialog.isVisible = false;
        },
        addGoods(data) {
            let flag = false;
            let len = this.detailList.length;
            data.warehouseId = this.orderForm.warehouseId;
            data.warehouseName = this.orderForm.warehouseName;
            data.detailRemark = '';
            data.itemCode = data.code;
            data.itemId = data.id;
            data.itemName = data.name;
            data.itemLocation = data.location;
            data.itemShortCode = data.shorthandCode;
            data.unit = data.unit;
            data.unitId = data.unitId;
            data.purchasePrice = data.buyingPrice;
            data.tax = data.taxRate;
            data.rid = len;
            data.qty = 0;
            data.actualQty = data.actualQty || 0;
            data.costPrice = data.costPrice || 0;
            data.costAmount = data.costAmount || 0;
            data.retailAmount = data.retailAmount || 0;
            data.retailAmountDifference = data.retailAmountDifference || 0;
            data.costAmountDifference = data.costAmountDifference || 0;
            for (let i = 0; i < len; i++) {
                if (
                    this.detailList[i].id == data.id &&
					this.detailList[i].lotNo == data.lotNo &&
					this.detailList[i].productionEnterpriseId ==
						data.productionEnterpriseId
                ) {
                    if (
                        this.detailList[i].productionDate != data.productionDate
                    ) {
                        this.$message({
                            message:
								'该商品在已录入批号下，生产日期不同，将以第一次添加为准',
                            type: 'warning'
                        });
                    }
                    if (this.detailList[i].expireDate != data.expireDate) {
                        this.$message({
                            message:
								'该商品在已录入批号下，有效期至不同，将以第一次添加为准',
                            type: 'warning'
                        });
                    }
                    if (this.detailList[i].costPrice != data.costPrice) {
                        this.$message({
                            message:
								'该商品在已录入批号下，成本价不同，将以第一次添加为准',
                            type: 'warning'
                        });
                    }
                    this.$set(
                        this.detailList[i],
                        'actualQty',
                        Number(this.detailList[i].actualQty) +
							Number(data.actualQty)
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
        getAllwareHouse() {
            let params = {};
            this.$api.basic_baseWarehouse_all(params).then(res => {
                let { result } = res.data;
                this.wareHouseOptions = result;
            });
        },
        getAllUser() {
            this.$api
                .system_user_all()
                .then(r => {
                    const { data } = r.data;
                    this.userOptions = data;
                })
                .catch(err => {
                    this.userOptions = [];
                });
        },
        getAllProductionEnterprise() {
            this.$api.basic_baseProductionEnterprise_all().then(res => {
                this.enterpriseOptions = res.data.result;
            });
        },
        //去打印
        toPrint(orderNo) {
            let hostUrl = window.location.origin + window.location.pathname;
            let routeUrl = this.$router.resolve({
                path: '/print/preview',
                query: {
                    printType: 'stockProfitLossOrder',
                    orderNo: orderNo
                }
            });
            window.open(
                hostUrl + routeUrl.href + '&timestamp=' + new Date().getTime(),
                'printPage',
                'height=800,width=800,top=0,left=800,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no, status=no'
            );
        },
        submitAndPrint() {
            this.submitOrder('print');
        },
        async submitOrder(type) {
            let haveEnterprise = true;
            this.orderForm.stockProfitLossOrderDetailList = [];
            this.orderForm.status = 1; //1 待确认 2 待审核 3 已审核
            this.orderForm.type = this.dataOrigin == '库存查询' ? 1 : 2; //1库存盘点 2新增商品库存
            this.orderForm.orderDate = this.$moment(
                this.orderForm.orderDate
            ).format('YYYY-MM-DD');
            let allDetailList = [];
            let submitList = [];
            if (this.dataOrigin == '库存查询') {
                let params = {
                    pageSize: -1,
                    pageNum: 1,
                    warehouseId: this.orderForm.warehouseId
                };
                this.submitLoading = true;
                let res = await this.$api.stock_stockProfitLossOrder_warehouseStockList(
                    params
                );
                try {
                    allDetailList = res.data.result.rows;
                } catch (error) {
                    console.log(error);
                    allDetailList = [];
                }
            }
            submitList = this.detailList;
            if (allDetailList.length) {
                submitList = allDetailList;
            }
            submitList.map((item, index) => {
                if (!item.productionEnterpriseId) {
                    haveEnterprise = false;
                }
                this.orderForm.stockProfitLossOrderDetailList.push({
                    actualQty: item.actualQty || 0,
                    costAmountDifference: item.costAmountDifference || 0,
                    expireDate: item.expireDate,
                    itemCode: item.itemCode,
                    itemId: item.itemId,
                    itemName: item.itemName,
                    itemLocation: item.itemLocation,
                    itemShortCode: item.itemShortCode,
                    lotNo: item.lotNo,
                    productionDate: item.productionDate,
                    productionEnterpriseId: item.productionEnterpriseId,
                    productionEnterpriseName: item.productionEnterpriseName,
                    qtyDifference: item.qtyDifference  || 0,
                    retailAmountDifference: item.retailAmountDifference  || 0,
                    retailPrice: item.retailPrice || 0,
                    specification: item.specification,
                    stockCostAmount: item.costAmount,
                    stockCostPrice: item.costPrice || 0,
                    stockQty: item.qty  || 0,
                    tax: item.tax,
                    unit: item.unit,
                    unitId: item.unitId,
                    rid: index + 1,
                    warehouseId: this.orderForm.warehouseId,
                    warehouseName: this.orderForm.warehouseName
                });
            });
            let params = JSON.parse(JSON.stringify(this.orderForm));
            if (!haveEnterprise) {
                this.$message({
                    message: '请选择生产企业',
                    type: 'error'
                });
                this.submitLoading = false;
                return;
            }
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.submitLoading = true;
                    this.$api
                        .stock_stockProfitLossOrder_add(params)
                        .then(res => {
                            let { result, code, msg } = res.data;
                            this.submitLoading = false;
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
                                            '订单操作成功，是否前往确认?'
                                        )
                                    ]),
                                    showCancelButton: true,
                                    confirmButtonText: '前往确认',
                                    cancelButtonText: '停留当前页',
                                    beforeClose: (action, instance, done) => {
                                        if (action === 'confirm') {
                                            done();
                                            if (type == 'print') {
                                                this.toPrint(result.orderCode);
                                            }
                                            this.initForm();
                                            this.$emit('toSure');
                                        } else {
                                            done();
                                            if (type == 'print') {
                                                this.toPrint(result.orderCode);
                                            }
                                            this.initForm();
                                        }
                                    }
                                }).then(action => {
                                    console.log(action);
                                });
                            } else {
                                this.$message({
                                    message: msg,
                                    type: 'warning'
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            this.submitLoading = false;
                        });
                } else {
                    this.$message({
                        message: '请填写必要信息（库房）',
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
                10: ' ',
                11: ' ',
                12: ' ',
                13: ' ',
                14: ' ',
                15: ' ',
                16: ' ',
                17: ' ',
                22: ' '
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
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
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
                    if (index !== 8 && index !== 18 && index !== 19) {
                        sums[index] = sums[index];
                    }
                    sums[index] += ' ';
                } else {
                    if (index === 8 || index == 18 || index == 19) {
                        sums[index] = 0;
                    } else {
                        sums[index] = '0.00';
                    }
                }
            });
            return sums;
        },
        changeSumPrice(item) {
            this.$set(item, 'qtyDifference', item.actualQty - item.qty);
            this.$set(
                item,
                'actualCostAmount',
                item.actualQty * item.costPrice
            ); //成本金额
            this.$set(
                item,
                'actualRetailAmount',
                item.actualQty * item.retailPrice
            ); //销售金额
            this.$set(
                item,
                'costAmountDifference',
                item.qtyDifference * item.costPrice
            ); //成本金额差
            this.$set(
                item,
                'retailAmountDifference',
                item.qtyDifference * item.retailPrice
            ); //销售金额差
        },
        changeEnterproce(val, row) {
            this.orderForm.productionEnterpriseName = '';
            this.enterpriseOptions.forEach(item => {
                if (item.id == val) {
                    this.orderForm.productionEnterpriseName = item.name;
                }
            });
            this.detailList.forEach(h => {
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
            this.enterpriseOptions.forEach(item => {
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
        },
        getWareHouseStockList() {
            let params = {
                pageSize: this.pagination.size,
                pageNum: this.pagination.num,
                warehouseId: this.orderForm.warehouseId
            };
            this.loading = true;
            this.$api
                .stock_stockProfitLossOrder_warehouseStockList(params)
                .then(r => {
                    let { rows, total } = r.data.result;
                    this.total = total;
                    this.detailList = rows;
                    this.loading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
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
.data-origin {
	display: inline-block;
	font-size: 12px;
	font-weight: bold;
	color: #ff4949;
	vertical-align: bottom;
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