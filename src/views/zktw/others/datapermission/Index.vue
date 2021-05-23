<template>
  <div class="app-container">
    <el-alert
      style="margin: -0.4rem 0 1.2rem 0;padding: 1rem;"
      title="数据权限测试，不同用户看到的数据不一样"
      type="info"
      :closable="false"
    />
    <div class="center-container">
      <el-table
        ref="table"
        :key="tableKey"
        v-loading="loading"
        :data="list"
        border
        fit
        style="width: 100%;"
      >
        <el-table-column
          label="字段1"
          prop="field1"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.field1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="字段2"
          prop="field2"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.field2 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="字段3"
          prop="field3"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.field3 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="字段4"
          prop="field4"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.field4 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
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
    name: 'DataPermission',
    components: { Pagination },
    data() {
        return {
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            pagination: {
                size: 10,
                num: 1
            },
            data: [],
            error: [],
            time: '0 ms'
        };
    },
    mounted() {
        this.fetch();
    },
    methods: {
        fetch(params = {}) {
            this.loading = true;
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.$get('system/dataPermissionTest/list', { ...params }).then(r => {
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
.upload {
  display: inline-block;
}
</style>
