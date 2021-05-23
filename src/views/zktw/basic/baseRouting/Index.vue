<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="线路名称">
          <el-input
            v-model="queryParams.lineName"
            placeholder="线路名称"
            clearable
                        @clear='search'
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
              <el-dropdown-item @click.native="add" v-has-permission="['baseRouting:add']">新增</el-dropdown-item>
              <el-dropdown-item
                @click.native="batchDelete"
                v-has-permission="['baseRouting:delete']"
              >删除</el-dropdown-item>
              <el-dropdown-item
                @click.native="exportExcel"
                v-has-permission="['baseRouting:export']"
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
        :header-cell-style="{background:'#eef1f6',color:'#606266'}" stripe
        :max-height="tableHeight"
        style="width: 100%;"
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" align="center" width="40px" />
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="线路名称" :show-overflow-tooltip="true" align="center" prop="lineName"></el-table-column>
        <el-table-column
          label="积分"
          :show-overflow-tooltip="true"
          align="center"
          min-width="120px"
          prop="integral"
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
              v-has-permission="['baseRouting:view']"
              class="el-icon-view table-operation"
              style="color: #87d068;"
              @click="view(row)"
            />
            <i
              class="el-icon-setting table-operation"
              style="color: #2db7f5;"
              v-has-permission="['baseRouting:update']"
              @click="edit(row)"
            />
            <i
              class="el-icon-delete table-operation"
              v-has-permission="['baseRouting:delete']"
              style="color: #f50;"
              @click="singleDelete(row)"
            />
            <el-link
              v-has-no-permission="['baseRouting:update','baseRouting:delete']"
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
      <routing-edit
        ref="edit"
        :dialog-visible="dialog.isVisible"
        :title="dialog.title"
        @success="editSuccess"
        @close="editClose"
      />
      <routing-view ref="details" :dialog-visible="viewVisible" @close="viewClose" />
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import RoutingEdit from './Edit';
import RoutingView from './View';

import { mapGetters } from 'vuex';
export default {
    name: 'BaseRouting',
    components: { Pagination, RoutingEdit, RoutingView },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: ''
            },
            viewVisible: false,
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
        view(row) {
            console.log(row);
            this.$refs.details.setInfo(row);
            this.viewVisible = true;
        },
        viewClose() {
            this.viewVisible = false;
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
            this.$api.basic_baseRouting_export(
                params,
                `线路档案_${new Date().getTime()}.xlsx`
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
            this.$api.basic_baseRouting_delete(deleteIds).then(() => {
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
                .basic_baseRouting_list(params)
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
