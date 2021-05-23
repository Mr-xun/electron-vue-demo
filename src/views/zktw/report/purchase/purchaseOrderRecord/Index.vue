<template>
	<div class="app-container record-container">
		<div class="filter-container">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="商品">
					<el-select
						:filter-method="filterDrugsOpts"
						v-model="queryParams.itemCode"
						@change="search"
						clearable
						filterable
						placeholder="请选择"
						class="filter-item search-item"
						popper-class="form-select-panel"
						:popper-append-to-body="false"
						default-first-option
					>
						<el-option
							v-for="item in durgOptions"
							:key="item.value"
							:label="item.name"
							:value="item.code"
						>
							<div class="sel-tr">
								<div class="sel-cell cl-code wd100">
									{{ item.code }}
								</div>
								<div class="sel-cell cl-name wd100">
									{{ item.name }}
								</div>
								<div class="sel-cell cl-std wd100">
									{{ item.shorthandCode }}
								</div>
							</div>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="供应商">
					<el-select
						:filter-method="filterSupplierOpts"
						v-model="queryParams.supplierCode"
						@change="search"
						clearable
						filterable
						placeholder="请选择"
						class="filter-item search-item"
						popper-class="form-select-panel"
						:popper-append-to-body="false"
						default-first-option
					>
						<el-option
							v-for="item in supplierOptions"
							:key="item.value"
							:label="item.name"
							:value="item.code"
						>
							<div class="sel-tr">
								<div class="sel-cell cl-code wd100">
									{{ item.code }}
								</div>
								<div class="sel-cell cl-name wd100">
									{{ item.name }}
								</div>
							</div>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="订单日期">
					<el-date-picker
						style="width: 340px"
						@change="search"
						v-model="queryParams.timeRange"
						value-format="yyyy-MM-dd HH:mm:ss"
						type="daterange"
						range-separator="至"
						:default-time="['00:00:00', '23:59:59']"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						class="filter-item search-item"
					></el-date-picker>
				</el-form-item>
				<el-form-item label style="margin-left: 0.75rem">
					<el-button
						class="filter-item"
						type="primary"
						plain
						@click="search"
						>搜索</el-button
					>
					<el-button
						class="filter-item"
						type="warning"
						plain
						@click="reset"
						>重置</el-button
					>
					<el-dropdown trigger="click" class="filter-item">
						<el-button type="info" plain :loading="exportLoading">
							导出
							<i class="el-icon-arrow-down el-icon--right" />
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-tooltip
								class="item"
								effect="light"
								content="当前页码内容数量"
								placement="right"
							>
								<el-dropdown-item
									@click.native="exportExcel('current')"
									>导出当前</el-dropdown-item
								>
							</el-tooltip>
							<el-tooltip
								class="item"
								effect="light"
								content="查询总计内容数量"
								placement="right"
							>
								<el-dropdown-item
									@click.native="exportExcel('all')"
									>导出全部</el-dropdown-item
								>
							</el-tooltip>
						</el-dropdown-menu>
					</el-dropdown>
				</el-form-item>
			</el-form>
		</div>
		<div class="center-container">
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
			>
				<el-table-column
					label="序号"
					type="index"
					width="50"
					align="center"
				></el-table-column>
				<el-table-column
					label="订单日期"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120"
					prop="orderDate"
				></el-table-column>
				<el-table-column
					label="订单编号"
					prop="orderNo"
					:show-overflow-tooltip="true"
					align="center"
					min-width="160px"
				></el-table-column>
				<el-table-column
					label="供应商编码"
					min-width="100px"
					:show-overflow-tooltip="true"
					align="center"
					prop="supplierCode"
				></el-table-column>
				<el-table-column
					label="供应商"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="supplierName"
				></el-table-column>
				<el-table-column
					label="商品编码"
					:show-overflow-tooltip="true"
					align="center"
					min-width="100px"
					prop="itemCode"
				></el-table-column>
				<el-table-column
					label="采购员"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="buyerName"
				></el-table-column>
				<el-table-column
					label="商品名称"
					:show-overflow-tooltip="true"
					align="center"
					min-width="100px"
					prop="itemName"
				></el-table-column>
				<el-table-column
					label="规格"
					:show-overflow-tooltip="true"
					align="center"
					prop="specification"
				></el-table-column>
				<el-table-column
					label="单位"
					:show-overflow-tooltip="true"
					align="center"
					prop="unitName"
				>
				</el-table-column>
				<el-table-column
					label="生产企业"
					:show-overflow-tooltip="true"
					align="center"
                    min-width="120px"
					prop="productionEnterpriseName"
				></el-table-column>
				<el-table-column
					label="产地"
					:show-overflow-tooltip="true"
					align="center"
					prop="placeOrigin"
				></el-table-column>
				<el-table-column
					label="数量"
					:show-overflow-tooltip="true"
					align="center"
					prop="qty"
				>
					<template slot-scope="{ row }">
						{{ row.qty | formatMoney(0) }}
					</template>
				</el-table-column>
				<el-table-column
					label="税率"
					:show-overflow-tooltip="true"
					align="center"
					prop="tax"
				></el-table-column>
				<el-table-column
					label="采购价"
					:show-overflow-tooltip="true"
					align="center"
					prop="purchasePrice"
				>
				</el-table-column>
				<el-table-column
					label="折扣率"
					:show-overflow-tooltip="true"
					align="center"
					prop="discountRate"
				>
					<template slot-scope="{ row }">
						{{ row.discountRate | formatMoney(0) }}
					</template>
				</el-table-column>
				<el-table-column
					label="金额"
					:show-overflow-tooltip="true"
					align="center"
					prop="amount"
					min-width="100px"
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
				>
				</el-table-column>

				<el-table-column
					label="零售金额"
					:show-overflow-tooltip="true"
					align="center"
					prop="retailAmount"
				>
					<template slot-scope="{ row }">
						{{ row.retailAmount | formatMoney }}
					</template>
				</el-table-column>
				<el-table-column
					label="取消数量"
					:show-overflow-tooltip="true"
					align="center"
					prop="cancelQty"
				>
					<template slot-scope="{ row }">
						{{ row.cancelQty | formatMoney(0) }}
					</template>
				</el-table-column>

				<el-table-column
					label="入库数量"
					:show-overflow-tooltip="true"
					align="center"
					prop="inboundQty"
				>
					<template slot-scope="{ row }">
						{{ row.inboundQty | formatMoney(0) }}
					</template>
				</el-table-column>
				<el-table-column
					label="拒收数量"
					:show-overflow-tooltip="true"
					align="center"
					prop="rejectedQty"
				>
					<template slot-scope="{ row }">
						{{ row.rejectedQty | formatMoney(0) }}
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
	</div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { mapGetters } from 'vuex';
import { parseTime } from '@/utils';

export default {
    name: 'PurchaseRecord',
    components: { Pagination },
    data() {
        return {
            exportLoading: false,

            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {
                timeRange: [
                    `${parseTime(new Date(), '{y}-{m}-{d}')} 00:00:00`,
                    `${parseTime(new Date(), '{y}-{m}-{d}')} 23:59:59`
                ]
            },
            pagination: {
                size: 10,
                num: 1
            },
            allDurgOptions: [],
            durgOptions: [],
            allSupplierOptions: [],
            supplierOptions: []
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['drugInfArchives'])
    },
    created() {
        // this.getAllDrug();
        this.getAllSupplier();
    },
    mounted() {
        this.fetch();
        this.durgOptions = this.allDurgOptions = this.drugInfArchives;
    },
    methods: {
        filterDrugsOpts(val) {
            this.queryParams.itemCode = val;
            if (val) {
                this.durgOptions = this.allDurgOptions.filter(item => {
                    if (
                        !!~item.name.indexOf(val) ||
						!!~item.code.indexOf(val) ||
						!!~item.shorthandCode
						    .toUpperCase()
						    .indexOf(val.toUpperCase())
                    ) {
                        return true;
                    }
                });
            } else {
                this.durgOptions = Object.assign(this.allDurgOptions);
            }
        },
        filterSupplierOpts(val) {
            this.queryParams.supplierCode = val;
            if (val) {
                this.supplierOptions = this.allSupplierOptions.filter(item => {
                    if (
                        !!~item.name.indexOf(val) ||
						!!~item.code.indexOf(val)
                    ) {
                        return true;
                    }
                });
            } else {
                this.supplierOptions = Object.assign(this.allSupplierOptions);
            }
        },
        search() {
            this.durgOptions = Object.assign(this.allDurgOptions);
            this.supplierOptions = Object.assign(this.allSupplierOptions);
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.pagination.num = 1;
            this.queryParams = {};
            this.queryParams.timeRange = [
                `${parseTime(new Date(), '{y}-{m}-{d}')} 00:00:00`,
                `${parseTime(new Date(), '{y}-{m}-{d}')} 23:59:59`
            ];
            this.fetch();
        },
        async exportExcel(type = 'current') {
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num
            };
            if (type == 'all') {
                params.pageSize = -1;
            }
            if (this.queryParams.timeRange) {
                params.startTime = this.queryParams.timeRange[0];
                params.endTime = this.queryParams.timeRange[1];
            }
            this.exportLoading = true;
            let exportRes = await this.$api.report_purchaseReport_recordExport(
                params,
                `采购订单记录_${new Date().getTime()}.xlsx`
            );
            if (exportRes === 'requestEnd') {
                this.exportLoading = false;
            }
        },
        //获取药品
        getAllDrug() {
            let params = {
                multiCondition: ''
            };
            this.$api
                .basic_baseDrugInf_all(params)
                .then(r => {
                    this.durgOptions = this.allDurgOptions = r.data.result;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getAllSupplier() {
            this.$api.basic_baseSupplier_all().then(res => {
                let { result } = res.data;
                this.supplierOptions = this.allSupplierOptions = result;
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
            this.loading = true;
            this.$api
                .report_purchaseReport_record(params)
                .then(r => {
                    let { records, total } = r.data.result;
                    this.total = total;
                    this.list = records;
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
.record-container {
	/deep/ .form-select-panel {
		width: auto !important;
		.sel-cell {
			display: inline-block;
			text-align: center;
			vertical-align: middle;
		}
	}
	/deep/ .table-select-panel {
		.el-select-dropdown__item {
			padding: 0px;
		}
		.el-select-dropdown__item.hover {
			background: rgb(236, 245, 255);
		}
		.sel-tr {
			font-size: 0;
			.sel-cell {
				display: inline-block;
				border-bottom: 1px solid #dfe6ec;
				border-right: 1px solid #dfe6ec;
				text-align: center;
				line-height: 34px;
				height: 34px;
				font-size: 14px;
				vertical-align: middle;
			}
		}
	}
}
</style>
