<template>
	<div class="app-container">
		<div class="filter-container">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="仓库">
					<el-select
						v-model="queryParams.warehouseId"
						@change="search"
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
				<el-form-item label="商品名称">
					<el-input
						v-model="queryParams.itemName"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						placeholder="商品名称"
						class="filter-item search-item"
					/>
				</el-form-item>
				<el-form-item label="商品速记码">
					<el-input
						v-model="queryParams.itemShorthandCode"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						placeholder="商品速记码"
						class="filter-item search-item"
					/>
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
					<el-dropdown
						trigger="click"
						class="filter-item"
						v-has-any-permission="[
							'stockLimitSet:add',
							'stockLimitSet:delete',
							'stockLimitSet:export',
						]"
					>
						<el-button>
							更多操作
							<i class="el-icon-arrow-down el-icon--right" />
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item
								@click.native="add"
								v-has-permission="['stockLimitSet:add']"
								>新增</el-dropdown-item
							>
							<el-dropdown-item
								@click.native="batchDelete"
								v-has-permission="['stockLimitSet:delete']"
								>删除</el-dropdown-item
							>
							<el-dropdown-item
								@click.native="exportExcel"
								v-has-permission="['stockLimitSet:export']"
								>导出</el-dropdown-item
							>
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
				@selection-change="onSelectChange"
			>
				<el-table-column type="selection" align="center" width="40px" />
				<el-table-column
					label="序号"
					type="index"
					width="50"
					align="center"
				></el-table-column>
				<el-table-column
					label="机构名称"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="orgName"
				>
					<template slot-scope="{ row }">
						<span>{{ row.orgId | flOrgName }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="仓库名称"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="warehouseName"
				></el-table-column>
				<el-table-column
					label="商品编码"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="itemCode"
				></el-table-column>
				<el-table-column
					label="商品名称"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="itemName"
				></el-table-column>
				<el-table-column
					label="速记码"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="itemShorthandCode"
				></el-table-column>
				<el-table-column
					label="规格"
					:show-overflow-tooltip="true"
					align="center"
					prop="itemSpecification"
				></el-table-column>
				<el-table-column
					label="单位"
					:show-overflow-tooltip="true"
					align="center"
					prop="itemUnit"
				>
					<template slot-scope="{ row }">{{
						row.itemUnit | flUnitName
					}}</template>
				</el-table-column>
				<el-table-column
					label="级别"
					:show-overflow-tooltip="true"
					align="center"
					prop="itemLevel"
				></el-table-column>
				<el-table-column
					label="产地"
					:show-overflow-tooltip="true"
					align="center"
					min-width="80px"
					prop="itemPlaceOrigin"
				></el-table-column>
				<el-table-column
					label="税率"
					:show-overflow-tooltip="true"
					align="center"
					prop="itemTaxRate"
				></el-table-column>
				<el-table-column
					label="库存上限"
					:show-overflow-tooltip="true"
					align="center"
					prop="stockUpLimit"
				></el-table-column>
				<el-table-column
					label="库存下限"
					:show-overflow-tooltip="true"
					align="center"
					prop="stockDownLimit"
				></el-table-column>
				<el-table-column
					label="当前库存"
					:show-overflow-tooltip="true"
					align="center"
					prop="stockQty"
				></el-table-column>
				<el-table-column
					label="操作"
					align="center"
					min-width="150px"
					fixed="right"
					class-name="small-padding fixed-width"
				>
					<template slot-scope="{ row }">
						<i
							class="el-icon-setting table-operation"
							style="color: #2db7f5"
							v-has-permission="['stockLimitSet:update']"
							@click="edit(row)"
						/>
						<i
							class="el-icon-delete table-operation"
							v-has-permission="['stockLimitSet:delete']"
							style="color: #f50"
							@click="singleDelete(row)"
						/>
						<el-link
							v-has-no-permission="[
								'stockLimitSet:update',
								'stockLimitSet:delete',
							]"
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
			<dadjap-edit
				ref="edit"
				:dialog-visible="dialog.isVisible"
				:title="dialog.title"
				@success="editSuccess"
				@close="editClose"
			/>
		</div>
	</div>
</template>
<script>
import Pagination from '@/components/Pagination';
import DadjapEdit from './Edit';
import { mapGetters } from 'vuex';
export default {
    name:'StockLimitSet',
    components: { Pagination, DadjapEdit },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: ''
            },
            wareHouseOptions: [],
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            selection: [],
            pagination: {
                size: 10,
                num: 1
            }
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['orgArchives'])
    },
    mounted() {
        this.getAllWareHouse();
        this.fetch();
    },
    methods: {
        getAllWareHouse() {
            let params = {
                // isRetail: 2
            };
            this.$api.basic_baseWarehouse_all(params).then((res) => {
                let { result } = res.data;
                this.wareHouseOptions = result;
            });
        },
        editClose() {
            this.dialog.isVisible = false;
        },
        editSuccess() {
            this.fetch();
        },
        onSelectChange(selection) {
            this.selection = selection;
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
        add() {
            this.dialog.title = '新增';
            this.dialog.isVisible = true;
        },
        exportExcel() {
            let params = {
                pageSize: this.pagination.size,
                pageNum: this.pagination.num,
                ...this.queryParams
            };
            this.$api.stock_stockLimitSet_export(
                params,
                `库存上下限_${new Date().getTime()}.xlsx`
            );
        },
        singleDelete(row) {
            this.clearSelections();
            this.$refs.table.toggleRowSelection(row, true);
            this.batchDelete();
        },
        batchDelete() {
            if (!this.selection.length) {
                this.$message({
                    message: '请先选择需要操作的数据',
                    type: 'warning'
                });
                return;
            }
            this.$confirm('选中数据将被永久删除, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    const deleteIds = [];
                    this.selection.forEach((u) => {
                        deleteIds.push(u.id);
                    });
                    this.delete(deleteIds);
                })
                .catch((err) => {
                    this.clearSelections();
                });
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        delete(deleteIds) {
            this.$api
                .stock_stockLimitSet_delete(deleteIds)
                .then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.fetch();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        edit(row) {
            this.$refs.edit.setEditForm(row);
            this.dialog.title = '修改';
            this.dialog.isVisible = true;
        },
        fetch() {
            let params = this.queryParams;
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.loading = true;
            this.$api
                .stock_stockLimitSet_list(params)
                .then((r) => {
                    let { rows, total } = r.data.data;
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
</style>
