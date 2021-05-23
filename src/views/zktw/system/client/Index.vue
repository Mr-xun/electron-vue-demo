<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryParams.clientId"
        :placeholder="$t('table.client.clientId')"
        class="filter-item search-item"
      />
      <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
      <el-dropdown
        v-has-any-permission="['client:add','client:delete']"
        trigger="click"
        class="filter-item"
      >
        <el-button>
          更多操作
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-has-permission="['client:add']" @click.native="add">新增</el-dropdown-item>
          <el-dropdown-item v-has-permission="['client:delete']" @click.native="batchDelete">删除</el-dropdown-item>
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
        :highlight-current-row="true"
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" align="center" width="40px" />
        <el-table-column
          :label="$t('table.client.clientId')"
          prop="clientId"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.clientId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.client.clientSecret')"
          prop="clientSecret"
          :show-overflow-tooltip="true"
          align="center"
          min-width="100px"
        >
          <template>
            <span>******</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.client.scope')"
          prop="scope"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.scope }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.client.authorizedGrantTypes')"
          prop="authorizedGrantTypes"
          :show-overflow-tooltip="true"
          align="center"
          min-width="170px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.authorizedGrantTypes }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.client.accessTokenValidity')"
          prop="accessTokenValidity"
          :show-overflow-tooltip="true"
          align="center"
          min-width="160px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.accessTokenValidity }} s</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.client.refreshTokenValidity')"
          prop="refreshTokenValidity"
          :show-overflow-tooltip="true"
          align="center"
          min-width="160px"
        >
          <template slot-scope="scope">
            <span>{{ (scope.row.refreshTokenValidity) ? (scope.row.refreshTokenValidity + 's') : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.client.webServerRedirectUri')"
          prop="webServerRedirectUri"
          :show-overflow-tooltip="true"
          align="center"
          min-width="180px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.webServerRedirectUri }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.client.autoapprove')"
          prop="autoapprove"
          :show-overflow-tooltip="true"
          align="center"
          min-width="140px"
        >
          <template slot-scope="{row}">
            <el-tag
              v-if="row.autoapprove !== null"
              :type="row.autoapprove | approveFilter"
            >{{ transApprove(row.autoapprove) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="150px"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="{row}">
            <i
              v-has-permission="['client:decrypt']"
              class="el-icon-unlock table-operation"
              style="color: #87d068;"
              @click="unlock(row)"
            />
            <i
              v-has-permission="['client:update']"
              class="el-icon-setting table-operation"
              style="color: #2db7f5;"
              @click="edit(row)"
            />
            <i
              v-has-permission="['client:delete']"
              class="el-icon-delete table-operation"
              style="color: #f50;"
              @click="singleDelete(row)"
            />
            <el-link
              v-has-no-permission="['client:decrypt','client:update','client:delete']"
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
      <client-edit
        ref="edit"
        :dialog-visible="dialog.isVisible"
        :title="dialog.title"
        :type="dialog.type"
        @close="editClose"
        @success="editSuccess"
      />
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import ClientEdit from './Edit';

export default {
    name: 'ClientManage',
    components: { Pagination, ClientEdit },
    filters: {
        approveFilter(status) {
            const map = {
                1: 'success',
                0: 'danger'
            };
            return map[status];
        }
    },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: '',
                type: ''
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
            }
        };
    },
    mounted() {
        this.fetch();
    },
    methods: {
        transApprove(v) {
            switch (v) {
            case 0:
                return 'false';
            case 1:
                return 'true';
            default:
                return '';
            }
        },
        editSuccess() {
            this.search();
        },
        editClose() {
            this.dialog.isVisible = false;
        },
        onSelectChange(selection) {
            this.selection = selection;
        },
        add() {
            this.dialog.title = '新增';
            this.dialog.isVisible = true;
            this.dialog.type = 'add';
        },
        edit(row) {
            this.$refs.edit.setClient(row);
            this.dialog.title = '修改';
            this.dialog.isVisible = true;
            this.dialog.type = 'edit';
        },
        unlock(row) {
            this.$get(`auth/client/secret/${row.clientId}`).then(r => {
                this.$message({
                    showClose: true,
                    message: this.$t('tips.clientOriginSecret') + r.data.data,
                    duration: 0,
                    type: 'success'
                });
            });
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
        delete(clientIds) {
            this.loading = true;
            this.$delete('auth/client', { clientIds }).then(() => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.search();
            });
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        search() {
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.pagination.num = 1;
            this.queryParams = {};
            this.search();
        },
        fetch() {
            let params = this.queryParams;

            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.loading = true;
            this.$get('auth/client', {
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
<style lang="scss" scoped>
</style>
