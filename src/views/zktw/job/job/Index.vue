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
      <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
      <el-dropdown
        v-has-any-permission="['job:add','job:delete','job:resume','job:pause','job:run','job:export']"
        trigger="click"
        class="filter-item"
      >
        <el-button>
          更多操作
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-has-permission="['job:add']" @click.native="add">新增</el-dropdown-item>
          <el-dropdown-item v-has-permission="['job:delete']" @click.native="batchDelete">删除</el-dropdown-item>
          <el-dropdown-item v-has-permission="['job:resume']" @click.native="resume">恢复</el-dropdown-item>
          <el-dropdown-item v-has-permission="['job:pause']" @click.native="pause">暂停</el-dropdown-item>
          <el-dropdown-item v-has-permission="['job:run']" @click.native="run">运行一次</el-dropdown-item>
          <el-dropdown-item v-has-permission="['job:export']" @click.native="exportExcel">导出</el-dropdown-item>
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
        >
          <template slot-scope="scope">
            <span>{{ scope.row.methodName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="方法参数" prop="params" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.params }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Cron表达式"
          prop="cronExpression"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.cronExpression }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          :show-overflow-tooltip="true"
          :filters="[{ text:'暂停', value: '1' }, { text:'正常', value: '0' }]"
          :filter-method="filterStatus"
          align="center"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">{{ row.status === '1' ? '暂停':'正常' }}</el-tag>
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
          min-width="100px"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="{row}">
            <i
              v-has-permission="['job:update']"
              class="el-icon-setting table-operation"
              style="color: #2db7f5;"
              @click="edit(row)"
            />
            <i
              v-has-permission="['job:delete']"
              class="el-icon-delete table-operation"
              style="color: #f50;"
              @click="singleDelete(row)"
            />
            <el-link v-has-no-permission="['job:update','job:delete']" class="no-perm">无权限</el-link>
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
      <job-edit
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
import JobEdit from './Edit';

export default {
    name: 'JobList',
    components: { Pagination, JobEdit },
    filters: {
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
            this.$refs.edit.setJob(row);
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
                    const jobIds = [];
                    this.selection.forEach(j => {
                        jobIds.push(j.jobId);
                    });
                    this.delete(jobIds);
                })
                .catch(() => {
                    this.clearSelections();
                });
        },
        resume() {
            this.execute('resume');
        },
        pause() {
            this.execute('pause');
        },
        run() {
            this.execute('run');
        },
        execute(method) {
            if (!this.selection.length) {
                this.$message({
                    message: '请先选择需要操作的数据',
                    type: 'warning'
                });
                return;
            }
            const jobIds = [];
            this.selection.forEach(j => {
                jobIds.push(j.jobId);
            });
            this.loading = true;
            this.$get(`job/${method}/${jobIds.join(',')}`)
                .then(() => {
                    this.$message({
                        message: '成功',
                        type: 'success'
                    });
                    this.search();
                })
                .catch(r => {
                    this.$message({
                        message: '失败',
                        type: 'error'
                    });
                    this.loading = false;
                });
        },
        exportExcel() {
            this.$download(
                'job/excel',
                {
                    pageSize: this.pagination.size,
                    pageNum: this.pagination.num,
                    ...this.queryParams
                },
                `job_${new Date().getTime()}.xlsx`
            );
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        singleDelete(row) {
            this.$refs.table.toggleRowSelection(row, true);
            this.batchDelete();
        },
        delete(jobIds) {
            this.loading = true;
            this.$delete(`job/${jobIds}`).then(() => {
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
            params.pageNum = this.pagination.num;
            this.loading = true;
            this.$get('job', {
                ...params
            }).then(r => {
                const data = r.data.data;
                this.total = data.total;
                this.list = data.rows;
                this.loading = false;
            });
        }
    }
};
</script>
