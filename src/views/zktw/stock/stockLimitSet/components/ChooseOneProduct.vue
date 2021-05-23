<template>
  <div class="chooseOrg-component">
    <el-table
      ref="table"
      v-loading="loading"
      :data="filterData"
      border
      :max-height="400"
      @row-click="choosedRow"
      fit
      style="width: 100%;"
      :row-class-name="tableRowClassName"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}" stripe
    >
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column
        label="商品名称"
        :show-overflow-tooltip="true"
        align="center"
        min-width="100px"
        prop="name"
      ></el-table-column>
      <el-table-column label="商品编码" :show-overflow-tooltip="true" align="center" prop="code"></el-table-column>
      <el-table-column label="规格" :show-overflow-tooltip="true" align="center" prop="specification"></el-table-column>
      <el-table-column label="产地" :show-overflow-tooltip="true" align="center" prop="placeOrigin"></el-table-column>
      <el-table-column label="级别" :show-overflow-tooltip="true" align="center" prop="level"></el-table-column>
      <el-table-column label="单位" :show-overflow-tooltip="true" align="center" prop="unit">
        <template slot-scope="{row}">{{row.unit }}</template>
      </el-table-column>
      <el-table-column
        label="速记码"
        :show-overflow-tooltip="true"
        align="center"
        prop="shorthandCode"
      ></el-table-column>
    </el-table>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import { mapGetters } from 'vuex';

export default {
    name: 'ChooseOrg',
    components: { Pagination },
    props: {
        columns: {
            type: Array,
            default() {
                return ['机构名称'];
            }
        },
        unique: {
            type: String,
            default: 'name'
        },
        chooseId: {
            //默认选中商品id
            type: Number,
            default: null
        },
        initOpen: {
            //第一次打开
            // type: String,
            // default: ''
        },
        filter: {
            //过滤的值
            required: false,
            default: null
        }
    },
    data() {
        return {
            isInit: true, //是否为初始化值
            addDialog: false,
            editDialog: false,
            loading: false,
            filterData: [],
            list: [
                {
                    name: 'test1',
                    prCode: 't',
                    qkCode: 'test1'
                },
                {
                    name: 'test2',
                    prCode: 't',
                    qkCode: 'test2'
                },
                {
                    name: 'test3',
                    prCode: 't',
                    qkCode: 'test3'
                }
            ],
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
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['drugInfArchives'])
    },
    watch: {
        initOpen(val) {
            if (val) {
                this.filterData = this.drugInfArchives;
            }
            this.isInit = true;
        },
        filter: {
            handler(val) {
                if (!val && val != 0) {
                    this.filterData = this.drugInfArchives;
                } else {
                    var reg = RegExp(`${val}`);
                    this.filterData = this.drugInfArchives.filter(
                        item => reg.test(item.name) || reg.test(item.shorthandCode)
                    );
                }
                this.isInit = false;
            }
        }
    },
    mounted() {
        this.filterData = this.drugInfArchives;
    },
    methods: {
        choosedRow(row, column, event) {
            this.$emit('sure', row);
        },
        tableRowClassName({ row, rowIndex }) {
            if (this.isInit && row.id === this.chooseId) {
                return 'choose-row';
            }
            return '';
        },
        onSelectChange(selection) {
            this.selection = selection;
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        }
    }
};
</script>
<style lang="scss" scoped>
.chooseOrg-component {
  .filter-box {
    display: flex;
    margin-bottom: 3px;
  }
  >>> .warning-row {
    background: oldlace;
  }

  >>> .choose-row {
    background: #f0f9eb;
  }
  >>> .el-button--mini {
    padding: 7px 15px;
    margin-left: 5px !important;
  }

  >>> .el-table td {
    padding: 7px 0;
  }
}
</style>
