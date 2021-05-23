<template>
	<div class="check-container">
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
					type="primary"
					size="mini"
					plain
					@click="search"
					>搜索</el-button
				>
				<el-button
					class="filter-item"
					type="warning"
					size="mini"
					plain
					@click="reset"
					>重置</el-button
				>
			</el-form-item>
		</el-form>
		<el-divider></el-divider>

		<el-table
			ref="table"
			:key="tableKey"
			row-key="orderNo"
			:expand-row-keys="entexpands"
			v-loading="loading"
			:data="list"
			border
			fit
			:header-cell-style="{ background: '#eef1f6', color: '#606266' }"
			stripe
			:max-height="tableHeight"
			style="width: 100%"
		>
			<el-table-column type="expand" width="1">
				<template slot-scope="props">
					<el-table
						:data="props.row.stockProfitLossOrderDetailList"
						v-loading="props.row.detailLoading"
						key="expand"
						border
						fit
						:header-cell-style="{
							background: '#eef1f6',
							color: '#606266',
						}"
						stripe
						max-height="250px"
						style="width: 80%; margin: 10px auto"
					>
						<el-table-column
							label="序号"
							type="index"
							width="50"
							align="center"
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
							prop="productionEnterpriseName"
							label="生产企业"
							min-width="160px"
						></el-table-column>
						<el-table-column
							align="center"
							prop="stockQty"
							label="库存数量"
							min-width="100px"
						></el-table-column>
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
							prop="stockCostPrice"
							min-width="110"
						></el-table-column>
						<el-table-column
							label="实际成本金额"
							:show-overflow-tooltip="true"
							align="center"
							prop="actualCostAmount"
							min-width="110"
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
						>
							<template slot-scope="{ row }">
								<span>{{ row.actualRetailAmount || 0 }}</span>
							</template>

							<template slot-scope="{ row }">
								{{ row.actualRetailAmount | formatMoney }}
							</template>
						</el-table-column>
						<el-table-column
							align="center"
							prop="actualQty"
							label="实盘数量"
							min-width="120px"
						></el-table-column>
						<el-table-column
							align="center"
							prop="qtyDifference"
							label="数量差"
							min-width="120px"
						></el-table-column>
						<el-table-column
							align="center"
							prop="retailAmountDifference"
							label="零售金额差"
							min-width="120px"
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
						>
							<template slot-scope="{ row }">
								{{ row.costAmountDifference | formatMoney }}
							</template>
						</el-table-column>
					</el-table>
				</template>
			</el-table-column>
			<el-table-column
				label="序号"
				type="index"
				width="50"
				align="center"
			></el-table-column>
			<el-table-column label="展开" align="center" min-width="60">
				<template slot-scope="scope">
					<template v-if="entexpands.indexOf(scope.row.orderNo)">
						<i
							class="el-icon-plus handle-icon"
							@click="orderShow($event, scope.row, scope.$index)"
						></i>
					</template>
					<template v-else>
						<i
							class="el-icon-minus handle-icon"
							@click="packUp($event, scope.row, scope.$index)"
						></i>
					</template>
				</template>
			</el-table-column>

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
				prop="retailAmountDifference"
			>
				<template slot-scope="{ row }">
					{{ row.retailAmountDifference | formatMoney }}
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
			<el-table-column
				label="操作"
				align="center"
				min-width="80px"
				fixed="right"
				class-name="small-padding fixed-width"
			>
				<template slot-scope="{ row }">
					<el-button
						type="text"
						@click="purAcceptance(row)"
						v-has-permission="['stockInventoryCheck:check']"
						>复核</el-button
					>
					<el-link
						v-has-no-permission="['stockInventoryCheck:check']"
						class="no-perm"
						>无权限</el-link
					>
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
	</div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { mapGetters } from 'vuex';

export default {
    name: 'Product',
    components: { Pagination },
    data() {
        return {
            entexpands: [],
            tableKey: '0',
            wareHouseOptions: [],
            loading: false,
            detailLoading: false,
            detailList: [],
            list: [],
            total: 0,
            queryParams: {},
            pagination: {
                size: 10,
                num: 1
            }
        };
    },
    computed: {
        ...mapGetters(['tableHeight'])
    },
    created() {
        this.getAllwareHouse();
    },
    activated() {
        this.fetch();
    },
    methods: {
        getAllwareHouse() {
            let params = {};
            this.$api.basic_baseWarehouse_all(params).then(res => {
                let { result } = res.data;
                this.wareHouseOptions = result;
            });
        },
        async purAcceptance(row) {
            let result = await this.getDetailList(row);
            if (result) {
                this.$bus.$emit('recheck', row);
                this.$emit('toRecheck');
            }
        },
        orderShow(event, row, index) {
            Array.prototype.remove = function(val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            if (this.entexpands.indexOf(row.orderNo) < 0) {
                this.entexpands = [];
                row.expand = true;
                this.entexpands.push(row.orderNo);
                this.getDetailList(row);
            } else {
                this.entexpands.remove(row.orderNo);
            }
        },
        packUp(event, row, index) {
            this.entexpands = [];
            row.expand = false;
        },
        getDetailList(row) {
            return new Promise(resove => {
                let params = {
                    orderNo: row.orderNo,
                    pageNum: 1,
                    pageSize: -1
                };
                this.$set(row, 'detailLoading', true);
                this.$api
                    .stock_stockProfitLossOrder_detail(params)
                    .then(res => {
                        let { code, result } = res.data;
                        if (code == 200 && result) {
                            let { rows } = result;
                            if (rows.length) {
                                this.$set(
                                    row,
                                    'stockProfitLossOrderDetailList',
                                    rows[0].stockProfitLossOrderDetailList
                                );
                            } else {
                                this.$set(
                                    row,
                                    'stockProfitLossOrderDetailList',
                                    []
                                );
                            }
                        } else {
                            this.$set(
                                row,
                                'stockProfitLossOrderDetailList',
                                []
                            );
                        }
                        this.$set(row, 'detailLoading', false);
                        resove(true);
                    })
                    .catch(err => {
                        console.log(err);
                        this.$set(row, 'detailLoading', false);
                        this.$set(row, 'stockProfitLossOrderDetailList', []);
                        resove(true);
                    });
            });
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
                status: 2
            };
            if (this.queryParams.timeRange) {
                params.startTime = this.queryParams.timeRange[0];
                params.endTime = this.queryParams.timeRange[1];
            }
            this.entexpands = [];
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
.check-container {
	>>> .el-table__expand-icon {
		color: transparent;
	}
	.table-container {
		padding: 20px 0;
	}
	.handle-icon {
		cursor: pointer;
	}
}
</style>
