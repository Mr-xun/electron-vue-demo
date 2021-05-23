<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        icon="el-icon-download"
        type="primary"
        plain
        @click="templateDownload"
      >模板下载</el-button>
      <el-upload
        class="upload"
        :action="uploadAction"
        :headers="headers"
        list-type="picture"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :on-progress="uploadProgress"
      >
        <el-button
          class="filter-item"
          icon="el-icon-upload2"
          type="success"
          plain
        >导入</el-button>
      </el-upload>
      <el-button
        class="filter-item"
        icon="el-icon-download"
        type="info"
        plain
        @click="exportExcel"
      >导出</el-button>
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
          label="导入时间"
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
      <result
        :dialog-visible="dialogVisible"
        :data="data"
        :error="error"
        :time="time"
        @close="closeDialog"
      />
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import Result from './Result';
import { getToken } from '@/utils/auth';
import { getFileType } from '@/utils';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import baseURL from '@/utils/baseURL';

export default {
    name: 'ExImport',
    components: { Pagination, Result },
    data() {
        return {
            uploadAction: `${baseURL}system/eximport/import`,
            dialogVisible: false,
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            pagination: {
                size: 10,
                num: 1
            },
            fileList: [],
            headers: {
                Authorization: `bearer ${getToken()}`
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
        closeDialog() {
            this.dialogVisible = false;
        },
        templateDownload() {
            this.$download(
                'system/eximport/template',
                {},
                'excel_import_template.xlsx'
            );
        },
        exportExcel() {
            this.$download(
                'system/eximport/excel',
                {
                    pageSize: this.pagination.size,
                    pageNum: this.pagination.num
                },
                `export_${new Date().getTime()}.xlsx`
            );
        },
        beforeUpload(file) {
            const type = getFileType(file.name);
            if (type !== 'xlsx') {
                this.$message({
                    message: '只支持Xlsx类型文件',
                    type: 'error'
                });
                return false;
            } else {
                return true;
            }
        },
        uploadError() {
            this.$message({
                message: '上传失败',
                type: 'error'
            });
            NProgress.done();
        },
        uploadSuccess(response) {
            const data = response.data;
            this.data = data.data;
            this.error = data.error;
            this.time = data.time;
            NProgress.done();
            this.fetch();
            this.dialogVisible = true;
        },
        uploadProgress() {
            NProgress.start();
        },
        fetch(params = {}) {
            this.loading = true;
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.$get('system/eximport', { ...params }).then(r => {
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
