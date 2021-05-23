<template>
  <el-dialog
    title="增加商品"
    :width="width"
    top="10px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    class="add-products"
  >
    <div class="filter-container">
      <el-form ref="form" :inline="true" :model="searchForm" label-width="80px">
        <el-form-item label="搜索条件">
          <el-select v-model="searchForm.select" @change="chooseContent" clearable>
            <el-option label="编码" value="code"></el-option>
            <el-option label="erp编码" value="erpCode"></el-option>
            <el-option label="商品名" value="name"></el-option>
            <el-option label="通用名" value="commonName"></el-option>
            <el-option label="商品名首字母" value="letterF"></el-option>
          </el-select>
          <el-input
            v-if="searchForm.inputShow"
            v-model="searchForm.value"
            style="width:184px;margin-left:10px"
            :disabled="disInput"
            clearable
            :placeholder="placeholder"
          ></el-input>
          <el-select
            v-else
            v-model="searchForm.selectContent"
            :placeholder="placeholder"
            style="width:184px;margin-left:10px"
            filterable
            clearable
          >
            <el-option
              v-for="(item,index) in searchForm.content"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" " label-width="10px">
          <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
          <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="list"
      border
      fit
      stripe
      style="width: 100%;"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    >
      <el-table-column
        label="商品编码"
        prop="code"
        :show-overflow-tooltip="true"
        align="center"
        min-width="100px"
      ></el-table-column>
      <el-table-column
        label="商品名称"
        :show-overflow-tooltip="true"
        align="center"
        min-width="120px"
        prop="name"
      ></el-table-column>
      <el-table-column
        label="速记码"
        :show-overflow-tooltip="true"
        align="center"
        prop="shorthandCode"
      ></el-table-column>
      <el-table-column label="产地" :show-overflow-tooltip="true" align="center" prop="placeOrigin"></el-table-column>
      <el-table-column
        label="产地速记码"
        :show-overflow-tooltip="true"
        align="center"
        min-width="100"
        prop="placeOriginShorthandCode"
      ></el-table-column>
      <el-table-column label="级别" :show-overflow-tooltip="true" align="center" prop="level"></el-table-column>
      <el-table-column label="重量" :show-overflow-tooltip="true" align="center" prop="weight"></el-table-column>
      <el-table-column label="单位" :show-overflow-tooltip="true" align="center" prop="unit">
        <template slot-scope="{row}">
          <span>{{ row.unit |flUnitName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" :show-overflow-tooltip="true" align="center" prop="specification"></el-table-column>
      <el-table-column label="税率" :show-overflow-tooltip="true" align="center" prop="taxRate"></el-table-column>
      <el-table-column label="状态" :show-overflow-tooltip="true" align="center" prop="status">
        <template slot-scope="{row}">
          <span>{{ row.status ==1?'有效':'无效' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大数量" :show-overflow-tooltip="true" align="center" prop="maxNumber"></el-table-column>
      <el-table-column
        label="外部编码"
        :show-overflow-tooltip="true"
        align="center"
        prop="externalCode"
        min-width="110"
      ></el-table-column>
      <el-table-column label="是否细料" :show-overflow-tooltip="true" align="center" prop="isFines">
        <template slot-scope="{row}">
          <span>{{ row.isFines | flYesOrNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否毒麻" :show-overflow-tooltip="true" align="center" prop="isToxicity">
        <template slot-scope="{row}">
          <span>{{ row.isToxicity | flYesOrNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否小包装"
        :show-overflow-tooltip="true"
        align="center"
        prop="isSmallPackage"
        min-width="110"
      >
        <template slot-scope="{row}">
          <span>{{ row.isSmallPackage | flYesOrNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有煎药费"
        :show-overflow-tooltip="true"
        align="center"
        prop="productId"
        min-width="110"
      >
        <template slot-scope="{row}">
          <span>{{ row.isDecoctingFee | flYesOrNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="报销类型"
        :show-overflow-tooltip="true"
        align="center"
        prop="reimbursementType"
        min-width="80"
      >
        <template slot-scope="{row}">{{row.reimbursementType | flReimbursementType}}</template>
      </el-table-column>
      <el-table-column
        label="医保类型"
        :show-overflow-tooltip="true"
        align="center"
        prop="medicalInsuranceType"
      >
        <template slot-scope="{row}">{{row.medicalInsuranceType | flMedicareType}}</template>
      </el-table-column>
      <el-table-column label="类别" :show-overflow-tooltip="true" align="center" prop="category"></el-table-column>
      <el-table-column
        label="处方药类型"
        :show-overflow-tooltip="true"
        align="center"
        prop="prescriptionDrugType"
        min-width="100"
      >
        <template slot-scope="{row}">{{row.prescriptionDrugType | flPrescriptionType}}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="240px"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-input-number size="mini" :min="0" v-model="row.number"></el-input-number>
          <el-button type="success" size="mini" plain @click="addGood(row)">加入订单</el-button>
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
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" plain :loading="buttonLoading" @click="isVisible = false">确定</el-button>
    </div>
    <el-dialog :visible.sync="picVisible" append-to-body>
      <el-image :src="dialogImageUrl" style="width:100%;">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-dialog>
  </el-dialog>
</template>
<script>
import Pagination from '@/components/Pagination';

import { mapState } from 'vuex';
export default {
    name: 'BaseProductAdd',
    components: { Pagination },
    filters: {
        prescriptionFilter(status) {
            const map = {
                1: '处方药',
                2: '甲类非处方药',
                3: '乙类非处方药',
                4: '其他'
            };
            return map[status];
        }
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            loading: false,
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            list: [],
            total: 0,
            queryParams: {},
            selection: [],
            pagination: {
                size: 5,
                num: 1
            },
            placeholder: '请选择筛选条件',
            disInput: true,
            searchForm: {
                inputShow: true,
                selectContent: '',
                value: '',
                code: '',
                erpCode: '',
                name: '',
                commonName: '',
                letterF: '',
                content: []
            },
            picVisible: false,
            dialogImageUrl: ''
        };
    },
    computed: {
        isVisible: {
            get() {
                return this.dialogVisible;
            },
            set() {
                this.close();
            }
        }
    },

    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
        this.fetch();
    },
    methods: {
        chooseContent(value) {
            this.disInput = value ? false : true;
            this.searchForm.content = [];
            this.searchForm.value = '';
            this.searchForm.selectContent = '';
            switch (value) {
            case 'code':
                this.placeholder = '请输入编码';
                this.searchForm.inputShow = true;
                break;
            case 'erpCode':
                this.placeholder = '请输入ERP编码';
                this.searchForm.inputShow = true;
                break;
            case 'name':
                this.placeholder = '请输入商品名';
                this.searchForm.inputShow = true;
                break;
            case 'commonName':
                this.placeholder = '请输入通用名';
                this.searchForm.inputShow = true;
                break;
            case 'letterF':
                this.placeholder = '请输入商品首字母';
                this.searchForm.inputShow = true;
                break;
            default:
                this.searchForm.inputShow = true;
                this.placeholder = '请选择筛选条件';
                break;
            }
        },
        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 550) {
                return '95%';
            } else if (this.screenWidth < 990) {
                return '90%';
            } else if (this.screenWidth < 1400) {
                return '80%';
            } else {
                return '70%';
            }
        },
        close() {
            this.$emit('close');
        },
        addGood(row) {
            this.$emit('addGood', row);
            this.$notify({
                title: '商品新增成功',
                message: `${row.name}成功新增${row.number}个`,
                type: 'success',
                duration: 2000
            });
        },
        search() {
            this.fetch();
        },
        reset() {
            this.placeholder = '请选择筛选条件';
            this.disInput = true;
            this.searchForm.select = '';
            this.searchForm.value = '';
            this.$refs.table.clearFilter();
            this.search();
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        fetch(params = {}) {
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            if (this.searchForm.select) {
                params[this.searchForm.select] = this.searchForm.value;
            }
            this.loading = true;
            this.$api
                .basic_baseDrugInf_listByPage(params)
                .then(r => {
                    let { result } = r.data;
                    this.total = result.total;
                    result.rows.forEach(item => {
                        item.number = 1;
                    });
                    this.list = result.rows;
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
.add-products >>> .el-dialog__body {
  padding: 20px 20px 0;
}
</style>
