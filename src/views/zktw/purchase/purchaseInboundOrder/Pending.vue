<template>
	<div class="check-container">
		<el-form :inline="true" :model="queryParams" class="custom-form">
			<el-form-item label="供货商编码">
				<el-input
					size="mini"
					style="width: 160px"
					v-model="queryParams.supplierCode"
					@keyup.enter.native="search"
					placeholder="供货商编码"
					class="filter-item search-item"
				/>
			</el-form-item>
			<el-form-item label="供货商">
				<el-input
					size="mini"
					style="width: 160px"
					v-model="queryParams.supplierName"
					placeholder="供货商"
					@keyup.enter.native="search"
					class="filter-item search-item"
				/>
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
			row-key="purchaseOrderCode"
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
						v-loading="props.row.detailLoading"
						:data="props.row.detailList"
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
							label="商品编码"
							prop="itemCode"
							:show-overflow-tooltip="true"
							align="center"
							min-width="100px"
						></el-table-column>
						<el-table-column
							label="商品名称"
							prop="itemName"
							:show-overflow-tooltip="true"
							align="center"
							min-width="120px"
						></el-table-column>
						<el-table-column
							align="center"
							prop="itemShortCode"
							label="速记码"
							:show-overflow-tooltip="true"
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
							label="税率"
							:show-overflow-tooltip="true"
							align="center"
							prop="tax"
						></el-table-column>
						<el-table-column
							label="订单数量"
							:show-overflow-tooltip="true"
							align="center"
							prop="orderQty"
						></el-table-column>
						<el-table-column
							label="待入库数量"
							:show-overflow-tooltip="true"
							align="center"
							min-width="110px"
							prop="qty"
						></el-table-column>
						<el-table-column
							label="单价"
							:show-overflow-tooltip="true"
							align="center"
							prop="price"
						></el-table-column>
						<el-table-column
							label="金额"
							:show-overflow-tooltip="true"
							align="center"
							prop="amount"
							min-width="90px"
						>
							<template slot-scope="{ row }">
								{{ row.amount | formatMoney }}
							</template>
						</el-table-column>
						<el-table-column
							label="零售价"
							:show-overflow-tooltip="true"
							align="center"
							prop="retailPrice"
						></el-table-column>
						<el-table-column
							label="零售金额"
							:show-overflow-tooltip="true"
							align="center"
							prop="retailAmount"
							min-width="90px"
						>
							<template slot-scope="{ row }">
								{{ row.retailAmount | formatMoney }}
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
					<template
						v-if="entexpands.indexOf(scope.row.purchaseOrderCode)"
					>
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
				label="供货单位"
				prop="supplierName"
				:show-overflow-tooltip="true"
				align="center"
				min-width="160px"
			></el-table-column>
			<el-table-column
				label="单号"
				:show-overflow-tooltip="true"
				align="center"
				min-width="150px"
				prop="purchaseOrderCode"
			></el-table-column>
			<el-table-column
				label="单据日期"
				:show-overflow-tooltip="true"
				align="center"
				min-width="160px"
				prop="purchaseOrderDate"
			></el-table-column>
			<el-table-column
				label="采购人员"
				:show-overflow-tooltip="true"
				min-width="100px"
				align="center"
				prop="buyerName"
			></el-table-column>
			<el-table-column
				label="金额"
				:show-overflow-tooltip="true"
				align="center"
				prop="amount"
				min-width="90px"
			>
				<template slot-scope="{ row }">
					{{ row.amount | formatMoney }}
				</template>
			</el-table-column>
			<el-table-column
				label="零售金额"
				:show-overflow-tooltip="true"
				align="center"
				prop="retailAmount"
				min-width="90px"
			>
				<template slot-scope="{ row }">
					{{ row.retailAmount | formatMoney }}
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				min-width="100px"
				fixed="right"
				class-name="small-padding fixed-width"
			>
				<template slot-scope="{ row }">
					<el-button
						type="text"
						@click="purAcceptance(row)"
						v-has-permission="['purchaseInboundOrder:add']"
						>采购验收</el-button
					>
					<el-link
						v-has-no-permission="['purchaseInboundOrder:add']"
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
    activated() {
        this.fetch();
    },
    methods: {
        purAcceptance(row) {
            this.$bus.$emit('acceptance', row);
            this.$store.commit('setting/closeSidebar');
            this.$emit('toAcceptance');
        },
        orderShow(event, row, index) {
            Array.prototype.remove = function (val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            if (this.entexpands.indexOf(row.purchaseOrderCode) < 0) {
                this.entexpands = [];
                row.expand = true;
                this.entexpands.push(row.purchaseOrderCode);
                this.getDetailList(row);
            } else {
                this.entexpands.remove(row.purchaseOrderCode);
            }
        },
        packUp(event, row, index) {
            this.entexpands = [];
            row.expand = false;
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
        getDetailList(row) {
            let params = {
                purchaseOrderCode: row.purchaseOrderCode
            };
            this.$set(row, 'detailLoading', true);
            this.$api
                .order_purchasePending_detailList(params)
                .then((res) => {
                    this.$set(row, 'detailList', res.data.result);
                    this.$set(row, 'detailLoading', false);
                })
                .catch((err) => {
                    console.log(err);
                    this.$set(row, 'detailLoading', false);
                    this.$set(row, 'detailList', []);
                });
        },
        fetch() {
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num
            };
            if (this.queryParams.timeRange) {
                params.startTime = this.queryParams.timeRange[0];
                params.endTime = this.queryParams.timeRange[1];
            }
            this.entexpands = [];
            this.loading = true;
            this.$api
                .order_purchasePending_mainInfoList(params)
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
