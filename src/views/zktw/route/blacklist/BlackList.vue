<template>
  <div class="app-container">
    <el-alert
      style="margin: -1rem 0 1.2rem 0;padding: 1rem;"
      title="定义网关请求黑名单"
      type="info"
      :closable="false"
    />
    <div class="filter-container">
      <el-input v-model="queryParams.ip" placeholder="请求IP" class="filter-item search-item" />
      <el-input
        v-model="queryParams.requestUri"
        placeholder="请求URI"
        class="filter-item search-item"
      />
      <el-input
        v-model="queryParams.requestMethod"
        placeholder="请求方法"
        class="filter-item search-item"
      />
      <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
      <el-dropdown trigger="click" class="filter-item">
        <el-button>
          更多操作
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="add">新增</el-dropdown-item>
          <el-dropdown-item @click.native="batchDelete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      style="width: 100%;"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column label="请求IP" prop="ip" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip ? scope.row.ip : '所有IP' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求URI" prop="requestUri" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.requestUri }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="请求方法"
        prop="requestMethod"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.requestMethod | requestMethodFilter">{{ row.requestMethod }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="限制时间起" prop="limitFrom" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.limitFrom ? scope.row.limitFrom : '所有时间' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="限制时间止" prop="limitTo" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.limitTo ? scope.row.limitTo : '所有时间' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求地址" prop="location" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        :filters="[{ text: '有效', value: '1' }, { text: '禁用', value: '0' }]"
        :filter-method="filterStatus"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">{{ row.status === '1' ? '有效' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        :show-overflow-tooltip="true"
        align="center"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="60px"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">
          <i class="el-icon-setting table-operation" style="color: #2db7f5;" @click="edit(row)" />
          <i
            class="el-icon-delete table-operation"
            style="color: #f50;"
            @click="singleDelete(row)"
          />
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
    <BlackListEdit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
  </div>
</template>
<script>
import r from '@/utils/route-request';
import axios from 'axios';
import Pagination from '@/components/Pagination';
import BlackListEdit from './Edit';

export default {
    name: 'BlackList',
    components: { Pagination, BlackListEdit },
    filters: {
        requestMethodFilter(v) {
            if (v === 'GET') {
                return 'success';
            } else if (v === 'POST') {
                return '';
            } else if (v === 'DELETE') {
                return 'danger';
            } else if (v === 'PUT') {
                return 'warning';
            } else {
                return 'info';
            }
        },
        statusFilter(status) {
            const map = {
                0: 'danger',
                1: 'success'
            };
            return map[status];
        }
    },
    data() {
        return {
            tableKey: 0,
            loading: false,
            dialog: {
                isVisible: false,
                title: ''
            },
            list: [],
            total: 0,
            queryParams: {},
            sort: {},
            selection: [],
            pagination: {
                size: 10,
                num: 1
            }
        };
    },
    mounted() {
        this.fetch();
    },
    methods: {
        filterStatus(value, row) {
            return row.status === value;
        },
        editClose() {
            this.dialog.isVisible = false;
        },
        editSuccess() {
            this.search();
        },
        add() {
            this.dialog.title = '新增';
            this.dialog.isVisible = true;
        },
        edit(row) {
            if (row.limitFrom && row.limitTo) {
                row.timeLimit = '1';
            }
            this.$refs.edit.setblackList(row);
            this.dialog.title = '修改';
            this.dialog.isVisible = true;
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
                    const blackListIds = [];
                    this.selection.forEach(r => {
                        blackListIds.push(r.id);
                    });
                    this.delete(blackListIds);
                })
                .catch(() => {
                    this.clearSelections();
                });
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        singleDelete(row) {
            this.$refs.table.toggleRowSelection(row, true);
            this.batchDelete();
        },
        delete(blackListIds) {
            this.loading = true;
            r.delete('route/auth/blackList', { ids: blackListIds })
                .then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.search();
                })
                .catch(r => {
                    this.loading = false;
                });
        },
        search() {
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.pagination.num = 1;
            this.queryParams = {};
            this.sort = {};
            this.$refs.table.clearSort();
            this.$refs.table.clearFilter();
            this.search();
        },
        onSelectChange(selection) {
            this.selection = selection;
        },
        sortChange(val) {
            this.sort.field = val.prop;
            this.sort.order = val.order;
            this.search();
        },
        fetch() {
            let params = this.queryParams;
            if (this.sort) {
                params = Object.assign(params, this.sort);
            }
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num - 1;
            this.loading = true;
            axios
                .all([
                    r.get('route/auth/blackList/data', { ...params }),
                    r.get('route/auth/blackList/count', { ...params })
                ])
                .then(v => {
                    this.total = v[1].data;
                    this.list = v[0].data;
                    this.loading = false;
                })
                .catch(r => {
                    this.loading = false;
                });
        }
    }
};
</script>
