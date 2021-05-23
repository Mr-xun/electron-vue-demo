<template>
	<div class="app-container">
		<div class="filter-container">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="生产企业名称">
					<el-input
						v-model="queryParams.name"
						placeholder="生产企业名称"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						class="filter-item search-item"
					/>
				</el-form-item>
				<el-form-item label style="margin-left:0.75rem;">
					<el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
					<el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
					<el-dropdown trigger="click" class="filter-item">
						<el-button>
							更多操作
							<i class="el-icon-arrow-down el-icon--right" />
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="add" v-has-permission="['baseProductionEnterprise:add']">新增</el-dropdown-item>
							<el-dropdown-item
								@click.native="batchDelete"
								v-has-permission="['baseProductionEnterprise:delete']"
							>删除</el-dropdown-item>
							<el-dropdown-item
								@click.native="exportExcel"
								v-has-permission="['baseProductionEnterprise:export']"
							>导出</el-dropdown-item>
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
				:header-cell-style="{background:'#eef1f6',color:'#606266'}"
				stripe
				:max-height="tableHeight"
				style="width: 100%;"
				@selection-change="onSelectChange"
			>
				<el-table-column type="selection" align="center" width="40px" />
				<el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
				<el-table-column
					label="编码"
					prop="code"
					:show-overflow-tooltip="true"
					align="center"
					min-width="110px"
				></el-table-column>
				<el-table-column
					label="生产企业名称"
					prop="name"
					:show-overflow-tooltip="true"
					align="center"
					min-width="110px"
				></el-table-column>
				<el-table-column
					label="法人代表"
					:show-overflow-tooltip="true"
					align="center"
					prop="legalRepresentative"
				></el-table-column>
				<el-table-column
					label="联系人"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="contactPer"
				></el-table-column>
				<el-table-column
					label="联系方式"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="contactTel"
				></el-table-column>

				<el-table-column
					label="地址"
					:show-overflow-tooltip="true"
					align="center"
					min-width="180px"
					prop="address"
				></el-table-column>
				<el-table-column
					label="营业执照号"
					:show-overflow-tooltip="true"
					align="center"
					min-width="160px"
					prop="businessLicenseNumber"
				></el-table-column>
				<el-table-column
					label="营业执照有效期"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="busLicenseValidityPeriod"
				></el-table-column>
				<el-table-column
					label="备注"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="remark"
				></el-table-column>
				<el-table-column
					label="操作"
					align="center"
					min-width="150px"
					fixed="right"
					class-name="small-padding fixed-width"
				>
					<template slot-scope="{row}">
						<i
							class="el-icon-setting table-operation"
							style="color: #2db7f5;"
							v-has-permission="['baseProductionEnterprise:update']"
							@click="edit(row)"
						/>
						<i
							class="el-icon-delete table-operation"
							v-has-permission="['baseProductionEnterprise:delete']"
							style="color: #f50;"
							@click="singleDelete(row)"
						/>
						<el-link
							v-has-no-permission="['baseProductionEnterprise:update','baseProductionEnterprise:delete']"
							class="no-perm"
						>无权限</el-link>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-show="total>0"
				:total="total"
				:page.sync="pagination.num"
				:limit.sync="pagination.size"
				@pagination="fetch"
			/>
			<production-enterprise-edit
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
import ProductionEnterpriseEdit from './Edit';
import { mapGetters } from 'vuex';
export default {
    name: 'BaseProductionEnterprise',
    components: { Pagination, ProductionEnterpriseEdit },
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
        ...mapGetters(['tableHeight'])
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
            this.$api.basic_basePatieninf_export(
                params,
                `生产企业档案_${new Date().getTime()}.xlsx`
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
                .basic_baseProductionEnterprise_delete(deleteIds)
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
                .basic_baseProductionEnterprise_list(params)
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
</style>
