<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.beanName"
        placeholder="Bean名称"
        class="filter-item search-item"
      />
      <el-input
        v-model="queryParams.methodName"
        placeholder="方法名称"
        class="filter-item search-item"
      />
      <el-button class="filter-item" type="primary" @click="search">搜索</el-button>
      <el-button class="filter-item" type="success" @click="reset">重置</el-button>
      <el-dropdown
        v-has-any-permission="['job:log:delete','job:log:export']"
        trigger="click"
        class="filter-item"
      >
        <el-button>
          更多操作
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-has-permission="['job:log:delete']" @click.native="batchDelete">删除</el-dropdown-item>
          <el-dropdown-item v-has-permission="['job:log:export']" @click.native="exportExcel">导出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="center-container">
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
        <el-table-column
          label="Bean名称"
          prop="beanName"
          :show-overflow-tooltip="true"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.beanName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="方法名称"
          prop="methodName"
          :show-overflow-tooltip="true"
          align="center"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.methodName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="方法参数"
          prop="params"
          :show-overflow-tooltip="true"
          align="center"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.params }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="错误信息"
          prop="error"
          :show-overflow-tooltip="true"
          align="center"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.error }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          :show-overflow-tooltip="true"
          :filters="[{ text: '失败', value: '1' }, { text:'成功', value: '0' }]"
          :filter-method="filterStatus"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">{{ row.status === '1' ? '失败': '成功'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="耗时"
          prop="times"
          :show-overflow-tooltip="true"
          align="center"
          min-width="110px"
          sortable="custom"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.times | timeFilter">{{ transTime(row.times) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="执行时间"
          prop="createTime"
          :show-overflow-tooltip="true"
          align="center"
          min-width="150px"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="110px"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="{row}">
            <i
              v-has-permission="['job:log:delete']"
              class="el-icon-delete table-operation"
              style="color: #f50;"
              @click="singleDelete(row)"
            />
            <el-link v-has-no-permission="['job:log:delete']" class="no-perm">无权限</el-link>
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
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination';
export default {
    name: 'JobLog',
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
        },
        statusFilter(status) {
            const map = {
                0: 'success',
                1: 'danger'
            };
            return map[status];
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
        filterStatus(value, row) {
            return row.status === value;
        },
        onSelectChange(selection) {
            this.selection = selection;
        },
        exportExcel() {
            this.$download(
                'job/log/excel',
                {
                    pageSize: this.pagination.size,
                    pageNum: this.pagination.num,
                    ...this.queryParams
                },
                `jobLog_${new Date().getTime()}.xlsx`
            );
        },
        fetch() {
            let params = this.queryParams;
            if(this.sort){
                params = Object.assign(params,this.sort);
            }
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.loading = true;
            this.$get('job/log', {
                ...params
            }).then(r => {
                const data = r.data.data;
                this.total = data.total;
                this.list = data.rows;
                this.loading = false;
            });
        },
        singleDelete(row) {
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
                    const logIds = [];
                    this.selection.forEach(l => {
                        logIds.push(l.logId);
                    });
                    this.delete(logIds);
                })
                .catch(() => {
                    this.clearSelections();
                });
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        delete(logIds) {
            this.loading = true;
            this.$delete(`job/log/${logIds}`).then(() => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.search();
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