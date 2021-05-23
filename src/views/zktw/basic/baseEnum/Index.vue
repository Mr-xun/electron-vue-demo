<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams">
                <el-form-item label="枚举类型">
                    <el-select v-model="queryParams.enumType" placeholder="枚举类型" filterable autocomplete='on' default-first-option @change="search" class="filter-item search-item">
                        <el-option v-for="item in enumList" :key="item.enumType" :label="item.enumTypeName" :value="item.enumType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label style="margin-left:0.75rem;">
                    <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
                    <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
                    <el-dropdown v-has-any-permission="['baseEnum:add','baseEnum:delete','baseEnum:reset','baseEnum:export']" trigger="click" class="filter-item">
                        <el-button>
                            更多操作
                            <i class="el-icon-arrow-down el-icon--right" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-has-permission="['baseEnum:add']" @click.native="add">新增</el-dropdown-item>
                            <el-dropdown-item v-has-permission="['baseEnum:delete']" @click.native="batchDelete">删除</el-dropdown-item>
                            <el-dropdown-item @click.native="exportExcel" v-has-permission="['baseEnum:export']">导出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
            </el-form>
        </div>
        <div class="center-container">
            <el-table ref="table" :key="tableKey" v-loading="loading" :data="list" :header-cell-style="{background:'#eef1f6',color:'#606266'}" stripe :max-height="tableHeight" border fit style="width: 100%;" @selection-change="onSelectChange">
                <el-table-column type="selection" align="center" width="40px" />
                <el-table-column label="编码" prop="productId" :show-overflow-tooltip="true" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.code }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="名称" class-name="status-col" min-width="120px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="简称" :show-overflow-tooltip="true" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.abbreviation }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="枚举类型" :show-overflow-tooltip="true" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.enumTypeName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="速记码" :show-overflow-tooltip="true" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.shorthandCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="150px" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="{row}">
                        <i v-has-permission="['baseEnum:update']" class="el-icon-setting table-operation" style="color: #2db7f5;" @click="edit(row)" />
                        <i v-has-permission="['baseEnum:delete']" class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
                        <el-link v-has-no-permission="['baseEnum:view','baseEnum:update','baseEnum:delete']" class="no-perm">无权限</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="fetch" />
            <base-enum-edit ref="edit" :dialog-visible="dialog.isVisible" :title="dialog.title" @success="editSuccess" @close="editClose" />
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import BaseEnumEdit from './Edit';
import { mapGetters, mapMutations } from 'vuex';
import { enumList } from '@/config';
export default {
    name: 'BaseEnum',
    components: { Pagination, BaseEnumEdit },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: ''
            },
            tableKey: 0,
            loading: false,
            enumList: enumList,
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
        ...mapMutations('enum', [
            'setMedicareType',
            'setReimbursementType',
            'setPrescriptionType',
            'setCrafts',
            'setUnits',
            'setUrgent',
            'setClassifies',
            'setOrgType',
            'setDrugNotes',
            'setIncompatibility',
            'setRefuseSendReason'
        ]),
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
            this.$api.basic_baseEnum_export(
                params,
                `枚举档案_${new Date().getTime()}.xlsx`
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
        saveEnumData() {
            this.$api.basic_enum_condition().then((res) => {
                let result = res.data.result;
                let emunMap = {
                    1: this.setMedicareType,
                    2: this.setReimbursementType,
                    3: this.setPrescriptionType,
                    4: this.setCrafts,
                    5: this.setUnits,
                    6: this.setUrgent,
                    7: this.setClassifies,
                    8: this.setOrgType,
                    9: this.setDrugNotes,
                    10: this.setIncompatibility,
                    11: this.setRefuseSendReason
                };
                result.map((item) => {
                    emunMap[item.enumType](item.baseEnumBoList);
                });
            });
        },
        delete(deleteIds) {
            this.$api
                .basic_enum_delete(deleteIds)
                .then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.fetch();
                    this.saveEnumData();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        edit(row) {
            this.$refs.edit.setBaseEnum(row);
            this.dialog.title = '修改';
            this.dialog.isVisible = true;
        },
        fetch() {
            let params = this.queryParams;
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.loading = true;
            this.$api
                .basic_enum_list(params)
                .then((res) => {
                    this.loading = false;
                    let { result } = res.data;
                    this.total = result.total || 0;
                    this.list = result.rows;
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
