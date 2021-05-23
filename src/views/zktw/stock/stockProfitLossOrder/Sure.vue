<template>
	<div class="cancle-container">
		<el-form :inline="true" :model="queryParams" class="custom-form">
			<el-form-item label="库房" prop="warehouseId">
				<el-select
					size="mini"
					style="width: 160px"
					v-model="queryParams.warehouseId"
					clearable
					filterable
					autocomplete="on"
					default-first-option
					class="filter-item search-item"
				>
					<el-option
						v-for="item in wareHouseOptions"
						:label="item.name"
						:key="item.id"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="单据编号">
				<el-input
					size="mini"
					style="width: 160px"
					v-model="queryParams.orderNo"
					placeholder="单据编号"
					@keyup.enter.native="search"
					class="filter-item search-item"
				/>
			</el-form-item>
			<el-form-item label="单据日期">
				<el-date-picker
					size="mini"
					style="width: 280px"
					v-model="queryParams.timeRange"
					value-format="yyyy-MM-dd HH:mm:ss"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					class="filter-item search-item"
				></el-date-picker>
			</el-form-item>
			<el-form-item label style="margin-left: 0.75rem">
				<el-button
					class="filter-item"
					size="mini"
					type="primary"
					plain
					@click="search"
					>搜索</el-button
				>
				<el-button
					class="filter-item"
					size="mini"
					type="warning"
					plain
					@click="reset"
					>重置</el-button
				>
			</el-form-item>
		</el-form>
		<el-divider></el-divider>
		<p class="cancle-tip">单击订单行，查看盘点单据明细</p>
		<el-table
			ref="table"
			:key="tableKey"
			v-loading="loading"
			:data="list"
			border
			fit
			:header-cell-style="{ background: '#eef1f6', color: '#606266' }"
			stripe
			:max-height="tableHeight"
			style="width: 100%"
			highlight-current-row
			@current-change="handleCurrentChange"
		>
			<el-table-column
				label="序号"
				type="index"
				width="50"
				align="center"
			></el-table-column>
			<el-table-column
				label="库房"
				prop="warehouseName"
				:show-overflow-tooltip="true"
				align="center"
				min-width="160px"
			></el-table-column>
			<el-table-column
				label="单号"
				:show-overflow-tooltip="true"
				align="center"
				min-width="150px"
				prop="orderNo"
			></el-table-column>
			<el-table-column
				label="单据日期"
				:show-overflow-tooltip="true"
				align="center"
				min-width="160px"
				prop="orderDate"
			></el-table-column>
			<el-table-column
				label="制单人"
				:show-overflow-tooltip="true"
				align="center"
				prop="creatorName"
			></el-table-column>
		</el-table>
		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="pagination.num"
			:limit.sync="pagination.size"
			@pagination="fetch"
		/>
		<el-divider class="divider-line">
			<el-button
				type="success"
				size="mini"
				plain
				:loading="sureBtnLoading"
				@click="submit"
				v-has-permission="['stockProfitLossOrder:add']"
				>提交</el-button
			>
			<el-input
				v-model="searchDetailIpt"
				:disabled="!stockProfitLossOrderDetailList.length"
				style="width: 150px"
				size="mini"
				placeholder="编码/名称/速记码"
			></el-input>
		</el-divider>
		<take-stock-sure
			:detail="stockProfitLossOrderDetailList"
			:loading="takeStockLoading"
			:tableHeight="tableHeight"
			:searchDetailIpt="searchDetailIpt"
		/>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination';
import TakeStockSure from './components/TakeStockSure';
import { debounce } from '@/utils';
export default {
    name: 'CancleOrder',
    components: { Pagination, TakeStockSure },
    data() {
        return {
            searchDetailIpt: '', //查询明细行 定位
            sureBtnLoading: false,
            wareHouseOptions: [],
            takeStockLoading: false,
            stockProfitLossOrderDetailList: [],
            orderNo: null,
            currentRow: null,
            tableHeight: 0,
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            selection: [],
            pagination: {
                size: 10,
                num: 1
            },
            mastForm: {} //主表
        };
    },

    created() {
        this.setTableHeight();
        this.getAllwareHouse();
    },
    activated() {
        this.fetch();
    },
    mounted() {
        this.__resizeHandler = debounce(() => {
            this.setTableHeight();
        }, 100);
        window.addEventListener('resize', this.__resizeHandler);
    },
    methods: {
        setTableHeight() {
            this.$nextTick(() => {
                let creenHeight = document.body.clientHeight;
                let fixedHeight = document.getElementsByClassName(
                    'fixed-header'
                )[0].offsetHeight;
                let filterHeight = 0;
                let paginationHeight = 80;
                let dividerHeight = 50 * 2;
                let footerHeight = document.getElementsByClassName('footer')[0]
                    .offsetHeight;
                let filterContainer = document.getElementsByClassName(
                    'custom-form'
                );
                if (filterContainer && filterContainer.length) {
                    filterHeight = filterContainer[0].offsetHeight;
                }
                let paginationContainer = document.getElementsByClassName(
                    'pagination-container'
                );
                if (paginationContainer && paginationContainer.length) {
                    paginationHeight =
						paginationContainer[0].offsetHeight || 80;
                }
                this.tableHeight =
					creenHeight -
					fixedHeight -
					filterHeight -
					dividerHeight -
					paginationHeight -
					footerHeight -
					120;
            });
        },
        getAllwareHouse() {
            let params = {};
            this.$api.basic_baseWarehouse_all(params).then(res => {
                let { result } = res.data;
                this.wareHouseOptions = result;
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
        handleCurrentChange(val) {
            if (val) {
                this.searchDetailIpt = '';
                let params = {
                    orderNo: val.orderNo,
                    pageNum: 1,
                    pageSize: -1
                };
                this.takeStockLoading = true;
                this.$api
                    .stock_stockProfitLossOrder_detail(params)
                    .then(res => {
                        let { code, result } = res.data;
                        if (code == 200 && result) {
                            let { rows } = result;
                            if (rows.length) {
                                this.stockProfitLossOrderDetailList =
									rows[0].stockProfitLossOrderDetailList;
                            } else {
                                this.stockProfitLossOrderDetailList = [];
                            }
                        } else {
                            this.stockProfitLossOrderDetailList = [];
                        }
                        if (val.type == 1) {
                            this.stockProfitLossOrderDetailList.forEach(
                                item => {
                                    this.$set(item, 'actualQty', item.stockQty); //实盘数量
                                    this.$set(item, 'qtyDifference', 0); //数量差
                                    this.$set(
                                        item,
                                        'retailAmountDifference',
                                        0
                                    ); //零食金额差
                                    this.$set(item, 'costAmountDifference', 0); //成本金额差
                                    this.$set(
                                        item,
                                        'actualCostAmount',
                                        this.formatDecimal(
                                            item.actualQty * item.stockCostPrice
                                        )
                                    ); //实际成本金额
                                    this.$set(
                                        item,
                                        'actualRetailAmount',
                                        this.formatDecimal(
                                            item.actualQty * item.retailPrice
                                        )
                                    ); //实际销售金额
                                }
                            );
                        }
                        this.takeStockLoading = false;
                    })
                    .catch(err => {
                        console.log(err);
                        this.takeStockLoading = false;
                        this.stockProfitLossOrderDetailList = [];
                    });

                this.mastForm = {
                    creatorId: val.creatorId,
                    creatorName: val.creatorName,
                    id: val.id,
                    orderDate: val.orderDate,
                    orderNo: val.orderNo,
                    reviewer: val.reviewer,
                    reviewerId: val.reviewerId,
                    status: 2, //1 待确认 2 待审核 3 已审核
                    warehouseId: val.warehouseId,
                    warehouseName: val.warehouseName
                };
            }
        },
        submit() {
            let params = {
                ...this.mastForm,
                stockProfitLossOrderDetailList: this
                    .stockProfitLossOrderDetailList
            };
            if (this.stockProfitLossOrderDetailList.length) {
                this.sureBtnLoading = true;
                this.$api
                    .stock_stockProfitLossOrder_update(params)
                    .then(res => {
                        this.sureBtnLoading = false;
                        this.$message({
                            message: '盘点确认成功',
                            type: 'success'
                        });
                        this.search();
                    })
                    .catch(err => {
                        this.sureBtnLoading = false;
                        console.log(err);
                    });
            } else {
                this.$message({
                    message: '明细列表不可为空',
                    type: 'warning'
                });
            }
        },
        search() {
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.pagination.num = 1;
            this.queryParams = {};
            this.fetch();
        },

        fetch() {
            this.stockProfitLossOrderDetailList = [];
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num,
                status: 1
            };
            if (this.queryParams.timeRange) {
                params.startTime = this.queryParams.timeRange[0];
                params.endTime = this.queryParams.timeRange[1];
            }
            this.loading = true;
            this.$api
                .stock_stockProfitLossOrder_list(params)
                .then(r => {
                    let { rows, total } = r.data.result;
                    this.total = total;
                    this.list = rows;
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
<style lang="scss" scoped>
.cancle-container {
	.table-container {
		padding: 20px 0;
	}
	.divider-line {
		margin: 5px 0 20px !important;
	}
	.cancle-tip {
		color: rgb(255, 0, 0);
		text-align: center;
		margin-bottom: 5px;
	}
}
</style>
