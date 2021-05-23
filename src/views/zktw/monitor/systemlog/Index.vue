<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.username" placeholder="操作人" class="filter-item search-item" />
      <el-input v-model="queryParams.operation" placeholder="操作描述" class="filter-item search-item" />
      <el-date-picker
        v-model="queryParams.timeRange"
        :range-separator="null"
        start-placeholder="操作时间"
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
      <el-dropdown v-has-any-permission="['log:delete','log:export']" trigger="click" class="filter-item">
        <el-button>
          更多操作<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-has-permission="['log:delete']" @click.native="batchDelete">删除</el-dropdown-item>
          <el-dropdown-item v-has-permission="['log:export']" @click.native="exportExcel">导出</el-dropdown-item>
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
      <el-table-column label="操作人" prop="username" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作描述" prop="operation" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.operation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作方法" prop="method" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方法参数" prop="params" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.params }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" prop="ip" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作地点" prop="location" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="createTime" :show-overflow-tooltip="true" align="center" min-width="150px" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗时" prop="time" :show-overflow-tooltip="true" align="center" min-width="110px" sortable="custom">
        <template slot-scope="{row}">
          <el-tag :type="row.time | timeFilter">
            {{ transTime(row.time) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="110px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <i v-has-permission="['log:delete']" class="el-icon-delete table-operation" style="color: #f50;" @click="singleDelete(row)" />
          <el-link v-has-no-permission="['log:delete']" class="no-perm">
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
    name: 'SystemLog',
    components: { Pagination },
    filters: {
        timeFilter(time) {
            if (time < 500) {
                return 'success';
            } else if (time < 1000) {
                return '';
            } else if (time < 1500) {
                return 'warning';
            } else {
                return 'danger';
            }
        }
    },
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
            this.$download('system/log/excel', {
                pageSize: this.pagination.size,
                pageNum: this.pagination.num,
                ...this.queryParams
            }, `log_${new Date().getTime()}.xlsx`);
        },
        fetch(params = {}) {
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            if (this.queryParams.timeRange) {
                params.createTimeFrom = this.queryParams.timeRange[0];
                params.createTimeTo = this.queryParams.timeRange[1];
            }
            this.loading = true;
            this.$get('system/log', {
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
            this.$delete(`system/log/${logIds}`).then(() => {
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
        transTime(time) {
            return `${time} ms`;
        },
        sortChange(val, a) {
            this.sort.field = val.prop;
            this.sort.order = val.order;
            this.search();
        }
    }
};
</script>
