<template>
	<div class="list-container">
		<el-form :inline="true" :model="queryParams" class="custom-form">
			<el-form-item label="库房" prop="warehouseId">
				<el-select
					size="mini"
					style="width: 160px"
					@change="search"
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
					value-format="yyyy-MM-dd"
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
		<el-divider>列表</el-divider>
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
				min-width="120px"
			></el-table-column>
			<el-table-column
				label="单号"
				:show-overflow-tooltip="true"
				align="center"
				min-width="150px"
				prop="orderNo"
			></el-table-column>
			<el-table-column
				label="订单日期"
				:show-overflow-tooltip="true"
				align="center"
				min-width="100px"
				prop="orderDate"
			></el-table-column>
			<el-table-column
				label="制单人"
				:show-overflow-tooltip="true"
				align="center"
				prop="creatorName"
			></el-table-column>
			<el-table-column
				label="实盘数量"
				:show-overflow-tooltip="true"
				align="center"
				prop="totalActualQty"
			></el-table-column>
			<el-table-column
				label="数量差合计"
				:show-overflow-tooltip="true"
				min-width="100"
				align="center"
				prop="totalQtyDifference"
			></el-table-column>
			<el-table-column
				label="零售金额差"
				:show-overflow-tooltip="true"
				min-width="100"
				align="center"
				prop="totalRetailAmountDifference"
			>
				<template slot-scope="{ row }">
					{{ row.totalRetailAmountDifference | formatMoney }}
				</template>
			</el-table-column>
			<el-table-column
				label="成本金额差"
				:show-overflow-tooltip="true"
				min-width="100"
				align="center"
				prop="totalCostAmountDifference"
			>
				<template slot-scope="{ row }">
					{{ row.totalCostAmountDifference | formatMoney }}
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="pagination.num"
			:limit.sync="pagination.size"
			@pagination="fetch"
		/>
		<el-divider>明细</el-divider>
		<order-detail :detail="detailList" :loading="detailLoading" :tableHeight="tableHeight" />
	</div>
</template>

<script>
import Pagination from '@/components/Pagination';
import OrderDetail from './components/OrderDetail';
import { debounce } from '@/utils';
export default {
    name: 'OrderList',
    components: { Pagination, OrderDetail },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: ''
            },
            tableHeight: 0,
            tableKey: 0,
            loading: false,
            wareHouseOptions: [],
            list: [],
            detailLoading:false,
            detailList: [], //明细
            total: 0,
            queryParams: {},
            selection: [],
            pagination: {
                size: 10,
                num: 1
            }
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
    beforeDestroy() {
        window.removeEventListener('resize', this.__resizeHandler);
    },
    methods: {
        getAllwareHouse() {
            let params = {};
            this.$api.basic_baseWarehouse_all(params).then((res) => {
                let { result } = res.data;
                this.wareHouseOptions = result;
            });
        },
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
        handleCurrentChange(val) {
            if (val) {
                let params = {
                    orderNo: val.orderNo,
                    pageNum: 1,
                    pageSize: -1
                };
                this.detailLoading = true;
                this.$api
                    .stock_stockProfitLossOrder_detail(params)
                    .then(res => {
                        let { code, result } = res.data;
                        if (code == 200 && result) {
                            let { rows } = result;
                            if (rows.length) {
                                this.detailList =
									rows[0].stockProfitLossOrderDetailList;
                            } else {
                                this.detailList = [];
                            }
                        } else {
                            this.detailList = [];
                        }
                        this.detailLoading = false;
                    })
                    .catch(err => {
                        console.log(err);
                        this.detailLoading = false;
                        this.detailList = [];
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
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num,
                status:3
            };
            if (this.queryParams.timeRange) {
                params.startTime = this.queryParams.timeRange[0];
                params.endTime = this.queryParams.timeRange[1];
            }
            this.detailList = [];
            this.loading = true;
            this.$api
                .stock_stockProfitLossOrder_list(params)
                .then((r) => {
                    let { rows, total } = r.data.result;
                    this.total = total;
                    this.list = rows;
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.list-container {
	.table-container {
		padding: 20px 0;
	}
}
</style>
