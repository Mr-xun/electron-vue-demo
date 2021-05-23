<template>
	<div class="app-container">
		<div class="filter-container">
			<el-form :inline="true" :model="queryParams" label-width="100px">
				<el-form-item label="机构名称" prop="orgId">
					<el-select
						v-model="queryParams.orgId"
						clearable
						filterable
						autocomplete="on"
						default-first-option
						@change="search"
						class="filter-item search-item"
					>
						<el-option
							v-for="item in orgArchives"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="工艺" prop="processingTechnic">
					<el-select
						v-model="queryParams.processingTechnic"
						clearable
						filterable
						autocomplete="on"
						default-first-option
						@change="search"
						class="filter-item search-item"
					>
						<el-option
							v-for="item in carfts"
							:key="item.enumId"
							:label="item.name"
							:value="Number(item.enumId)"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="抓药付数开始">
					<el-input
						v-model="queryParams.minDoseNum"
						placeholder="抓药付数开始"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						class="filter-item search-item"
					/>
				</el-form-item>
				<el-form-item label="抓药付数结束">
					<el-input
						v-model="queryParams.maxDoseNum"
						placeholder="抓药付数结束"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						class="filter-item search-item"
					/>
				</el-form-item>
				<el-form-item label="需要时间">
					<el-input
						v-model="queryParams.needTime"
						placeholder="需要时间"
						clearable
						@clear="search"
						@keyup.enter.native="search"
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
					<el-dropdown trigger="click" class="filter-item">
						<el-button>
							更多操作
							<i class="el-icon-arrow-down el-icon--right" />
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item
								@click.native="add"
								v-has-permission="[
									'baseDrugDeliveryTimeSet:add',
								]"
								>新增</el-dropdown-item
							>
							<el-dropdown-item
								@click.native="batchDelete"
								v-has-permission="[
									'baseDrugDeliveryTimeSet:delete',
								]"
								>删除</el-dropdown-item
							>
							<el-dropdown-item
								@click.native="exportExcel"
								v-has-permission="[
									'baseDrugDeliveryTimeSet:export',
								]"
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
					min-width="160px"
				>
					<template slot-scope="{ row }">{{
						row.orgId | flOrgName
					}}</template>
				</el-table-column>
				<el-table-column
					label="加工工艺"
					prop="processingTechnicName"
					:show-overflow-tooltip="true"
					align="center"
				></el-table-column>
				<el-table-column
					label="抓药付数开始"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="minDoseNum"
				></el-table-column>
				<el-table-column
					label="抓药付数结束"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="maxDoseNum"
				></el-table-column>
				<el-table-column
					label="需要时间"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="needTime"
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
							v-has-permission="[
								'baseDrugDeliveryTimeSet:update',
							]"
							@click="edit(row)"
						/>
						<i
							class="el-icon-delete table-operation"
							v-has-permission="[
								'baseDrugDeliveryTimeSet:delete',
							]"
							style="color: #f50"
							@click="singleDelete(row)"
						/>
						<el-link
							v-has-no-permission="[
								'baseDrugDeliveryTimeSet:update',
								'baseDrugDeliveryTimeSet:delete',
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
			<boil-medicine-pot-edit
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
import BoilMedicinePotEdit from './Edit';
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'BaseDrugDeliveryTimeSet',
    components: { Pagination, BoilMedicinePotEdit },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: ''
            },
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
        ...mapGetters('basic', ['orgArchives']),
        ...mapState('enum', ['carfts'])
    },
    mounted() {
        this.fetch();
    },
    methods: {
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
            this.$api.basic_baseDrugDeliveryTimeSet_export(
                params,
                `发药时间设置档案_${new Date().getTime()}.xlsx`
            );
        },
        fileUpload() {},
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
                    this.selection.forEach(u => {
                        deleteIds.push(u.id);
                    });
                    this.delete(deleteIds);
                })
                .catch(err => {
                    this.clearSelections();
                });
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        delete(deleteIds) {
            this.$api
                .basic_baseDrugDeliveryTimeSet_delete(deleteIds)
                .then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.fetch();
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
                .basic_baseDrugDeliveryTimeSet_list(params)
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
</style>
