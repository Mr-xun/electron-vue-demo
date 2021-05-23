<template>
	<div class="app-container base-orgDug-comparison">
		<div class="filter-container">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="机构名称">
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
				<el-form-item label="商品名称">
					<el-input
						v-model="queryParams.drugInfName"
						placeholder="商品名称"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						class="filter-item search-item"
					/>
				</el-form-item>
				<el-form-item label="商品编码">
					<el-input
						v-model="queryParams.drugCode"
						placeholder="商品编码"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						class="filter-item search-item"
					/>
				</el-form-item>
				<el-form-item label="对照编码">
					<el-input
						v-model="queryParams.code"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						placeholder="对照编码"
						class="filter-item search-item"
					/>
				</el-form-item>
				<el-form-item label="速记码">
					<el-input
						v-model="queryParams.shorthandCode"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						placeholder="速记码"
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
							'baseOrgDugComparison:add',
							'baseOrgDugComparison:delete',
							'baseOrgDugComparison:export',
						]"
					>
						<el-button>
							更多操作
							<i class="el-icon-arrow-down el-icon--right" />
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item
								@click.native="add"
								v-has-permission="['baseOrgDugComparison:add']"
								>新增</el-dropdown-item
							>
							<el-dropdown-item
								@click.native="batchDelete"
								v-has-permission="[
									'baseOrgDugComparison:delete',
								]"
								>删除</el-dropdown-item
							>
							<el-dropdown-item
								@click.native="exportExcel"
								v-has-permission="[
									'baseOrgDugComparison:export',
								]"
								>导出</el-dropdown-item
							>
							<el-dropdown-item @click.native="importExcel"
								>导入</el-dropdown-item
							>
							<el-dropdown-item @click.native="exportTemplate"
								>模板下载</el-dropdown-item
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
					prop="orgId"
					:show-overflow-tooltip="true"
					align="center"
					min-width="160px"
				>
					<template slot-scope="{ row }">{{
						row.orgId | flOrgName
					}}</template>
				</el-table-column>
				<el-table-column
					label="对照编码"
					:show-overflow-tooltip="true"
					align="center"
					min-width="100px"
					prop="code"
				></el-table-column>
				<el-table-column
					label="商品名称"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="name"
				></el-table-column>

				<el-table-column
					label="商品编码"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="drugCode"
				></el-table-column>
				<el-table-column
					label="速记码"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="shorthandCode"
				></el-table-column>
				<el-table-column
					label="备注"
					:show-overflow-tooltip="true"
					align="center"
					prop="remark"
					min-width="120px"
				></el-table-column>
				<el-table-column
					label="操作"
					align="center"
					min-width="100px"
					fixed="right"
					class-name="small-padding fixed-width"
				>
					<template slot-scope="{ row }">
						<i
							class="el-icon-setting table-operation"
							style="color: #2db7f5"
							v-has-permission="['baseOrgDugComparison:update']"
							@click="edit(row)"
						/>
						<i
							class="el-icon-delete table-operation"
							v-has-permission="['baseOrgDugComparison:delete']"
							style="color: #f50"
							@click="singleDelete(row)"
						/>
						<el-link
							v-has-no-permission="[
								'baseOrgDugComparison:update',
								'baseOrgDugComparison:delete',
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
			<org-dug-comparison
				ref="edit"
				:dialog-visible="dialog.isVisible"
				:title="dialog.title"
				@success="editSuccess"
				@close="editClose"
			/>
			<el-dialog
				title="导入"
				:visible.sync="excelUploadDialog"
				width="30%"
				@closed="closeUpload"
				class="upload-dialog"
			>
				<el-upload
					ref="upload"
					class="upload-demo"
					drag
					action
					accept=".xlsx"
					:limit="limit"
					:before-upload="beforeUpload"
					:on-change="handleChange"
					:on-remove="handleRemove"
					:on-exceed="handleExceed"
					:on-success="handleSuccess"
					:on-error="handleError"
					:file-list="fileList"
					:http-request="uploadFile"
					:auto-upload="false"
				>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">
						将文件拖到此处，或<em>点击上传</em>
					</div>
					<div class="el-upload__tip" slot="tip">
						上传文件只能是 xls、xlsx格式
					</div>
				</el-upload>
				<span slot="footer" class="dialog-footer">
					<el-button @click="closeUpload">取 消</el-button>
					<el-button type="primary" @click="sureImport"
						>确 定</el-button
					>
				</span>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import Pagination from '@/components/Pagination';
import OrgDugComparison from './Edit';
import { mapGetters } from 'vuex';
export default {
    name: 'BaseOrgDugComparison',
    components: { Pagination, OrgDugComparison },
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
            },
            excelUploadDialog: false,
            limit: 1, // 上传excel时，同时允许上传的最大数
            fileList: [] // excel文件列表
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['orgArchives'])
    },
    mounted() {
        this.fetch();
    },
    methods: {
        // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
        beforeUpload(file) {
            var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
            const extension = testmsg === 'xls';
            const extension2 = testmsg === 'xlsx';
            // const isLt2M = file.size / 1024 / 1024 < 10
            if (!extension && !extension2) {
                this.$message({
                    message: '上传文件只能是 xls、xlsx格式!',
                    type: 'warning'
                });
            }
            // if(!isLt2M) {
            //     this.$message({
            //         message: '上传文件大小不能超过 10MB!',
            //         type: 'warning'
            //     });
            // }
            // return extension || extension2 && isLt2M
            return extension || extension2;
        },
        // 文件状态改变
        handleChange(file, fileList) {
            if (file) {
                this.fileList = fileList.slice(-3);
            }
        },

        // 删除文件
        handleRemove(file, fileList) {
            this.fileList = [];
        },
        // 文件超出个数限制
        handleExceed(files, fileList) {
            this.$message.warning('只能选择1个文件 个');
        },

        // 文件上传成功
        handleSuccess(res, file, fileList) {
            this.$message.success('文件上传成功');
        },
        // 文件上传失败
        handleError(err, file, fileList) {
            this.$message.error('文件上传失败');
        },
        closeUpload() {
            this.excelUploadDialog = false;
            this.handleRemove();
        },
        //确认上传
        sureImport() {
            this.$refs.upload.submit();
        },
        // 覆盖默认的上传行为，自定义上传的实现
        uploadFile(file) {
            if (this.fileList.length === 0) {
                this.$message.warning('请上传文件');
            } else {
                const data = new FormData();
                const fileUps = file.file;
                data.append('file', fileUps);
                this.$api
                    .basic_baseOrgDugComparison_import(data)
                    .then(res => {
                        let { error } = res.data;
                        if (error && error.length) {
                            this.$message.error('有数据导入失败');
                        }
                        this.$message.success('导入成功');
                        this.excelUploadDialog = false;
                        this.fetch();
                    })
                    .catch(err => {
                        console.log(err);
                        this.$message.error('系统异常，导入失败');
                        this.handleRemove();
                    });
            }
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
        singleDelete(row) {
            this.clearSelections();
            this.$refs.table.toggleRowSelection(row, true);
            this.batchDelete();
        },
        //导入
        importExcel() {
            this.excelUploadDialog = true;
        },
        //导出
        exportExcel() {
            let params = {
                pageSize: this.pagination.size,
                pageNum: this.pagination.num,
                ...this.queryParams
            };
            this.$api.basic_baseOrgDugComparison_export(
                params,
                `机构对照档案_${new Date().getTime()}.xlsx`
            );
        },
        exportTemplate() {
            this.$api.basic_baseOrgDugComparison_template(
                {},
                `机构对照导入模板_${new Date().getTime()}.xlsx`
            );
        },
        fileUpload() {},
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
            this.$api
                .basic_baseOrgDugComparison_delete(deleteIds)
                .then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.fetch();
                })
                .catch(err => {
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
                .basic_baseOrgDugComparison_list(params)
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
.base-orgDug-comparison /deep/ .upload-dialog {
	.el-dialog {
		min-width: 500px;
	}
	.upload-demo {
		text-align: center;
	}
}
</style>
