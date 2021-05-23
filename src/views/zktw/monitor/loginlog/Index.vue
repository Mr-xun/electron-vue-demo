<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.username" placeholder="用户名" class="filter-item search-item" />
      <el-date-picker
        v-model="queryParams.timeRange"
        :range-separator="null"
        start-placeholder="登录时间"
        value-format="yyyy-MM-dd"
        class="filter-item search-item date-range-item"
        type="daterange"
      />
      <el-button class="filter-item" type="primary" plain @click="search">
        搜索
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        重置
      </el-button>
      <el-dropdown v-has-any-permission="['loginlog:delete','loginlog:export']" trigger="click" class="filter-item">
        <el-button>
          更多操作<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-has-permission="['loginlog:delete']" @click.native="batchDelete">删除</el-dropdown-item>
          <el-dropdown-item v-has-permission="['loginlog:export']" @click.native="exportExcel">导出</el-dropdown-item>
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
      <el-table-column label="用户名" prop="username" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录系统" prop="system" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.system }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览器" prop="browser" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.browser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" prop="ip" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录地点" prop="location" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" prop="loginTime" :show-overflow-tooltip="true" align="center" min-width="150px" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="90px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <i v-has-permission="['loginlog:delete']" class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
          <el-link v-has-no-permission="['loginlog:delete']" class="no-perm">
            无权限
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="fetch" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination';

export default {
    name: 'LoginLog',
    components: { Pagination },
    data() {
        return {
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
            }
        };
    },
    mounted() {
        this.fetch();
    },
    methods: {
        onSelectChange(selection) {
            this.selection = selection;
        },
        exportExcel() {
            this.$download('system/loginLog/excel', {
                pageSize: this.pagination.size,
                pageNum: this.pagination.num,
                ...this.queryParams
            }, `loginLog_${new Date().getTime()}.xlsx`);
        },
        fetch(params = {}) {
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            if (this.queryParams.timeRange) {
                params.loginTimeFrom = this.queryParams.timeRange[0];
                params.loginTimeTo = this.queryParams.timeRange[1];
            }
            this.loading = true;
            this.$get('system/loginLog', {
                ...params
            }).then((r) => {
                const data = r.data.data;
                this.total = data.total;
                this.list = data.rows;
                this.loading = false;
            });
        },
        singleDelete(row) {
            this.$refs.table.clearSelection();
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
            }).then(() => {
                const logIds = [];
                this.selection.forEach((l) => {
                    logIds.push(l.id);
                });
                this.delete(logIds);
            }).catch(() => {
                this.clearSelections();
            });
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        delete(logIds) {
            this.loading = true;
            this.$delete(`system/loginLog/${logIds}`).then(() => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.search();
            });
        },
        search() {
            this.fetch({
                ...this.queryParams,
                ...this.sort
            });
        },
        reset() {
            this.queryParams = {};
            this.sort = {};
            this.$refs.table.clearSort();
            this.$refs.table.clearFilter();
            this.search();
        },
        sortChange(val, a) {
            this.sort.field = val.prop;
            this.sort.order = val.order;
            this.search();
        }
    }
};
</script>
