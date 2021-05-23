<template>
	<div class="app-container">
		<div class="filter-container">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="名称">
					<el-input
						v-model="queryParams.name"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						placeholder="名称"
						class="filter-item search-item"
					/>
				</el-form-item>
				<el-form-item label="分类">
					<el-select
						v-model="queryParams.classification"
						clearable
						filterable
						autocomplete="on"
						default-first-option
						@change="search"
						class="filter-item search-item"
					>
						<el-option
							v-for="item in classifyOptions"
							:key="item.enumId"
							:label="item.name"
							:value="Number(item.enumId)"
						></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="是否送货上门" placeholder="请选择">
					<el-select
						v-model="queryParams.isSupportDeliveryToDoor"
						clearable
						filterable
						autocomplete="on"
						default-first-option
						@change="search"
						class="filter-item search-item"
					>
						<el-option label="全部" value></el-option>
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="2"></el-option>
					</el-select>
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
							'baseOrg:add',
							'baseOrg:delete',
							'baseOrg:export',
						]"
					>
						<el-button>
							更多操作
							<i class="el-icon-arrow-down el-icon--right" />
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item
								@click.native="add"
								v-has-permission="['baseOrg:add']"
								>新增</el-dropdown-item
							>
							<el-dropdown-item
								@click.native="batchDelete"
								v-has-permission="['baseOrg:delete']"
								>删除</el-dropdown-item
							>
							<el-dropdown-item
								@click.native="exportExcel"
								v-has-permission="['baseOrg:export']"
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
				:max-height="tableHeight"
				fit
				row-key="id"
				style="width: 100%"
				@selection-change="onSelectChange"
				@sort-change="sortChange"
				:header-cell-style="{ background: '#eef1f6', color: '#606266' }"
				stripe
			>
				<el-table-column
					type="selection"
					:reserve-selection="true"
					align="center"
					width="40px"
				/>
				<el-table-column
					label="序号"
					type="index"
					width="50"
					align="center"
				></el-table-column>
				<el-table-column
					label="编码"
					prop="code"
					:show-overflow-tooltip="true"
					align="center"
					min-width="80px"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.code }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="机构名称"
					:show-overflow-tooltip="true"
					align="center"
					min-width="160px"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="速记码"
					align="center"
					:show-overflow-tooltip="true"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.shorthandCode }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="HIS编码"
					:show-overflow-tooltip="true"
					align="center"
					min-width="100px"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.hisCode }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="打印名称"
					min-width="150px"
					:show-overflow-tooltip="true"
					align="center"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.printName }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="分类"
					:show-overflow-tooltip="true"
					align="center"
				>
					<template slot-scope="scope">
						<span>{{
							scope.row.classification | flClassifyName
						}}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="电话"
					align="center"
					min-width="150px"
					:show-overflow-tooltip="true"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.tel }}</span>
					</template>
				</el-table-column>

				<el-table-column
					label="是否打印价格"
					align="center"
					min-width="110"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.isPrintPrice | flYesOrNo }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="医保处方默认值"
					align="center"
					min-width="120"
					:show-overflow-tooltip="true"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.mipdValue | flYesOrNo }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="是否送货上门"
					align="center"
					min-width="120"
				>
					<template slot-scope="scope">
						<span>{{
							scope.row.isSupportDeliveryToDoor | flYesOrNo
						}}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="机构类型"
					align="center"
					:show-overflow-tooltip="true"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.orgType | flOrgType }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="代煎费"
					align="center"
					:show-overflow-tooltip="true"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.fryingFee | flFryingFee }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="二维码解析"
					align="center"
					:show-overflow-tooltip="true"
					min-width="100"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.qrcodeRule | flQrcodeRule }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="备注"
					prop="remark"
					align="center"
					:show-overflow-tooltip="true"
				></el-table-column>
				<el-table-column
					label="操作"
					align="center"
					min-width="150px"
					class-name="small-padding fixed-width"
					fixed="right"
				>
					<template slot-scope="{ row }">
						<i
							class="el-icon-setting table-operation"
							style="color: #2db7f5"
							v-has-permission="['baseOrg:update']"
							@click="edit(row)"
						/>
						<i
							class="el-icon-delete table-operation"
							v-has-permission="['baseOrg:delete']"
							style="color: #f50"
							@click="singleDelete(row)"
						/>
						<el-link
							v-has-no-permission="[
								'baseOrg:update',
								'baseOrg:delete',
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
			<org-edit
				ref="edit"
				:dialog-visible="dialog.isVisible"
				:title="dialog.title"
				@success="success"
				@close="close"
			/>
			<qrcode-rule-tips
				:dialog-visible.sync="qrcodeRuleisVisible"
				:schemeRule="schemeRule"
				:currentRule.sync="currentRule"
			/>
		</div>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination';
import OrgEdit from './Edit';
import QrcodeRuleTips from './components/QrcodeRuleTips';
import { mapState, mapGetters } from 'vuex';
export default {
    name: 'BaseOrg',
    components: { Pagination, OrgEdit, QrcodeRuleTips },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: ''
            },
            addDialog: false,
            editDialog: false,
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            sort: {},
            selection: [],
            pagination: {
                size: 10,
                num: 1
            },
            userList: [],
            qrcodeRuleisVisible: false,
            currentRule: '',
            schemeRule: ''
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapState({
            classifyOptions: state => state.enum.classifies,
            userInfo: state => state.account.user
        })
    },
    filters: {
        flQrcodeRule(val) {
            let map = {
                1001: '方案一',
                1002: '方案二',
                1003: '方案三'
            };
            if (!val) return '--';
            return map[val];
        },
        flFryingFee(val) {
            let map = {
                1: '收',
                2: '不收'
            };
            if (!val) return '--';
            return map[val];
        }
    },
    mounted() {
        this.fetch();
    },
    methods: {
        close() {
            this.dialog.isVisible = false;
        },
        success() {
            this.$store.dispatch('basic/setOrgArchives');
            this.setUserOrgInfo();
            this.search();
        },
        //设置所属机构信息
        setUserOrgInfo() {
            let params = {
                id: this.userInfo.orgId
            };
            this.$api.basic_baseOrg_getOneOrg(params).then(res => {
                this.$store.commit('account/setUserOrg', res.data || {});
            });
        },
        onSelectChange(selection) {
            this.selection = selection;
        },
        search() {
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.queryParams = {};
            this.sort = {};
            this.$refs.table.clearSort();
            this.$refs.table.clearFilter();
            this.search();
        },
        exportExcel() {
            let params = {
                pageSize: this.pagination.size,
                pageNum: this.pagination.num,
                ...this.queryParams
            };
            this.$api.basic_baseOrg_export(
                params,
                `机构档案_${new Date().getTime()}.xlsx`
            );
        },
        add() {
            this.dialog.title = '新增';
            this.dialog.isVisible = true;
        },
        edit(row) {
            this.$refs.edit.setEditForm(row);
            this.dialog.title = '修改';
            this.dialog.isVisible = true;
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
                    this.selection.forEach(u => {
                        deleteIds.push(u.id);
                    });
                    this.delete(deleteIds);
                })
                .catch(() => {
                    this.clearSelections();
                });
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        delete(deleteIds) {
            this.$api.basic_baseOrg_delete(deleteIds).then(() => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.search();
                this.$store.dispatch('basic/setOrgArchives');
            });
        },
        fetch() {
            let params = this.queryParams;
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.loading = true;
            this.$api
                .basic_baseOrg_list(params)
                .then(r => {
                    const data = r.data.result;
                    this.total = data.total;
                    this.list = data.rows;
                    this.loading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                });
        },
        sortChange(val) {
            this.sort.field = val.prop;
            this.sort.order = val.order;
            this.search();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
