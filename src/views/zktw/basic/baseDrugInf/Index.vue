<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams" label-width="85px">
                <el-form-item label="编码">
                    <el-input
                        v-model="queryParams.code"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                        placeholder="编码"
                        class="filter-item search-item"
                    />
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input
                        v-model="queryParams.name"
                        clearable
                        @clear="search"
                        placeholder="商品名称"
                        class="filter-item search-item"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label="速记码">
                    <el-input
                        v-model="queryParams.shorthandCode"
                        placeholder="速记码"
                        class="filter-item search-item"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label="产地" v-show="moreQuery">
                    <el-input
                        v-model="queryParams.placeOrigin"
                        placeholder="产地"
                        class="filter-item search-item"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label="规格" v-show="moreQuery">
                    <el-input
                        v-model="queryParams.specification"
                        placeholder="规格"
                        class="filter-item search-item"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label="产地速记码" v-show="moreQuery">
                    <el-input
                        v-model="queryParams.placeOriginShorthandCode"
                        placeholder="产地速记码"
                        class="filter-item search-item"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item
                    label="状态"
                    placeholder="请选择"
                    v-show="moreQuery"
                >
                    <el-select
                        v-model="queryParams.status"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                        @change="search"
                        class="filter-item search-item"
                    >
                        <el-option label="全部" value></el-option>
                        <el-option label="有效" :value="1"></el-option>
                        <el-option label="无效" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="是否细料"
                    placeholder="请选择"
                    v-show="moreQuery"
                >
                    <el-select
                        v-model="queryParams.isFines"
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
                <el-form-item
                    label="医保报销"
                    placeholder="请选择"
                    v-show="moreQuery"
                >
                    <el-select
                        v-model="queryParams.medicalInsuranceType"
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
                <el-form-item label="单位" v-show="moreQuery">
                    <el-select
                        v-model="queryParams.unit"
                        filterable
                        clearable
                        autocomplete="on"
                        default-first-option
                        @change="search"
                        class="filter-item search-item"
                    >
                        <el-option
                            v-for="item in unitOptions"
                            :key="item.enumId"
                            :label="item.name"
                            :value="item.name"
                        ></el-option>
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
                            'baseDrugInf:add',
                            'baseDrugInf:delete',
                            'baseDrugInf:export',
                        ]"
                    >
                        <el-button :loading="exportLoading">
                            更多操作
                            <i class="el-icon-arrow-down el-icon--right" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                @click.native="add"
                                v-has-permission="['baseDrugInf:add']"
                                >新增</el-dropdown-item
                            >
                            <el-dropdown-item
                                @click.native="batchDelete"
                                v-has-permission="['baseDrugInf:delete']"
                                >删除</el-dropdown-item
                            >
                            <el-dropdown-item
                                @click.native="fileUpload"
                                v-has-permission="['baseDrugInf:upload']"
                                >上传</el-dropdown-item
                            >

                            <el-tooltip
                                class="item"
                                effect="light"
                                content="当前页码内容数量"
                                placement="right"
                            >
                                <el-dropdown-item
                                    @click.native="exportExcel"
                                    v-has-permission="['baseDrugInf:export']"
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
                                    v-has-permission="['baseDrugInf:export']"
                                    >导出全部</el-dropdown-item
                                >
                            </el-tooltip>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
            </el-form>
            <el-divider class="more-filter">
                <i
                    :class="
                        moreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                    "
                    @click="togglehMoreQuery"
                ></i>
            </el-divider>
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
                    label="商品编码"
                    prop="code"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                ></el-table-column>
                <el-table-column
                    label="商品名称"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="name"
                ></el-table-column>
                <el-table-column
                    label="速记码"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="shorthandCode"
                ></el-table-column>
                <el-table-column
                    label="货位"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="location"
                ></el-table-column>
                <el-table-column
                    label="产地"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="placeOrigin"
                ></el-table-column>
                <el-table-column
                    label="产地速记码"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100"
                    prop="placeOriginShorthandCode"
                ></el-table-column>
                <el-table-column
                    label="级别"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="level"
                ></el-table-column>
                <el-table-column
                    label="重量"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="weight"
                ></el-table-column>
                <el-table-column
                    label="单位"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="unit"
                ></el-table-column>
                <el-table-column
                    label="规格"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="specification"
                ></el-table-column>
                <el-table-column
                    label="税率"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="taxRate"
                ></el-table-column>
                <el-table-column
                    label="状态"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="status"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.status == 1 ? "有效" : "无效" }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="最大剂量"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="maxNumber"
                ></el-table-column>
                <el-table-column
                    label="外部编码"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="externalCode"
                    min-width="110"
                ></el-table-column>
                <el-table-column
                    label="是否细料"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="isFines"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.isFines | flYesOrNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="是否毒麻"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="isToxicity"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.isToxicity | flYesOrNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="是否小包装"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="isSmallPackage"
                    min-width="110"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.isSmallPackage | flYesOrNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="是否有煎药费"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="productId"
                    min-width="110"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.isDecoctingFee | flYesOrNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="报销类型"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="reimbursementType"
                    min-width="80"
                >
                    <template slot-scope="{ row }">{{
                        row.reimbursementType | flReimbursementType
                    }}</template>
                </el-table-column>
                <el-table-column
                    label="医保类型"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="medicalInsuranceType"
                >
                    <template slot-scope="{ row }">{{
                        row.medicalInsuranceType | flMedicareType
                    }}</template>
                </el-table-column>
                <el-table-column
                    label="类别"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="category"
                ></el-table-column>
                <el-table-column
                    label="处方药类型"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="prescriptionDrugType"
                    min-width="100"
                >
                    <template slot-scope="{ row }">{{
                        row.prescriptionDrugType | flPrescriptionType
                    }}</template>
                </el-table-column>
                <el-table-column
                    label="有效期"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="effectivityDuration"
                    min-width="80"
                >
                    <template slot-scope="{ row }">{{
                        row.effectivityDuration
                            ? row.effectivityDuration + "个月"
                            : ""
                    }}</template>
                </el-table-column>
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
                            v-has-permission="['baseDrugInf:update']"
                            @click="edit(row)"
                        />
                        <i
                            class="el-icon-delete table-operation"
                            v-has-permission="['baseDrugInf:delete']"
                            style="color: #f50"
                            @click="singleDelete(row)"
                        />
                        <el-link
                            v-has-no-permission="[
                                'baseDrugInf:update',
                                'baseDrugInf:delete',
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
            <product-edit
                ref="edit"
                :dialog-visible="dialog.isVisible"
                :title="dialog.title"
                @success="success"
                @close="close"
            />
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import ExpandCollapse from '@/components/ExpandCollapse';
import ProductEdit from './Edit';
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'BaseDrugInf',
    components: { Pagination, ProductEdit, ExpandCollapse },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: ''
            },
            tableKey: 0,
            exportLoading: false,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            selection: [],
            pagination: {
                size: 10,
                num: 1
            },
            moreQuery: false
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapState({
            unitOptions: (state) => state.enum.units
        })
    },
    mounted() {
        this.fetch();
    },
    methods: {
        //更多筛选条件
        togglehMoreQuery() {
            this.moreQuery = !this.moreQuery;
        },
        close() {
            this.dialog.isVisible = false;
        },
        success() {
            this.$store.dispatch('basic/setDrugInfArchives');
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
        async exportExcel(type = 'current') {
            let params = {
                pageSize: this.pagination.size,
                pageNum: this.pagination.num,
                ...this.queryParams
            };
            if (type == 'all') {
                params.pageSize = -1;
            }
            this.exportLoading = true;
            let exportRes = await this.$api.basic_baseDrugInf_export(
                params,
                `商品档案_${new Date().getTime()}.xlsx`
            );
            if (exportRes === 'requestEnd') {
                this.exportLoading = false;
            }
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
                .basic_baseDrugInf_delete(deleteIds)
                .then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.fetch();
                    this.$store.dispatch('basic/setDrugInfArchives');
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
                .basic_baseDrugInf_list(params)
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
.more-filter {
    margin: 10px 0;
    /deep/ .el-divider__text {
        padding: 0 10px;
    }
    i {
        font-size: 22px;
        cursor: pointer;
    }
}
</style>
