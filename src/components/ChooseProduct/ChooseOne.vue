<template>
    <div class="chooseOneProdcut-component">
        <el-table
            ref="table"
            v-loading="loading"
            :data="filterData"
            border
            :max-height="250"
            @row-click="choosedRow"
            fit
            style="width: 100%;"
            :row-class-name="tableRowClassName"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            stripe
        >
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column
                label="商品名称"
                :show-overflow-tooltip="true"
                align="center"
                min-width="140px"
                prop="name"
            ></el-table-column>
            <el-table-column
                label="商品编码"
                min-width="100px"
                :show-overflow-tooltip="true"
                align="center"
                prop="code"
            ></el-table-column>
            <el-table-column
                label="规格"
                min-width="100px"
                :show-overflow-tooltip="true"
                align="center"
                prop="specification"
            ></el-table-column>
            <el-table-column
                label="单位"
                :show-overflow-tooltip="true"
                align="center"
                prop="unit"
            >
                <template slot-scope="{row}">
                    <span>{{row.unit |flUnitName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="产地"
                :show-overflow-tooltip="true"
                align="center"
                prop="placeOrigin"
            ></el-table-column>
            <el-table-column label="级别" :show-overflow-tooltip="true" align="center" prop="level"></el-table-column>
            <el-table-column
                label="速记码"
                :show-overflow-tooltip="true"
                align="center"
                prop="shorthandCode"
            ></el-table-column>
        </el-table>
        <pagination
            class="small-pagin"
            v-show="total>0"
            :total="total"
            :small="true"
            :page.sync="pagination.num"
            :limit.sync="pagination.size"
            @pagination="fetch"
        />
    </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import { mapGetters } from 'vuex';
export default {
    name: 'ChooseOneProdcut',
    components: { Pagination },
    props: {
        columns: {
            type: Array,
            default() {
                return ['机构名称'];
            }
        },
        choosedId: {
            //默认选中商品id
            type: Number,
            default: null
        },
        filterVal: {
            //过滤的值
            required: false,
            default: null
        }
    },
    data() {
        return {
            loading: false,
            filterData: [],
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
        ...mapGetters('basic', ['drugInfArchives'])
    },
    watch: {
        filterVal: {
            handler(val) {
                this.fetch();
            },
            immediate: true
        }
    },
    methods: {
        choosedRow(row, column, event) {
            this.$emit('sure', row);
        },
        tableRowClassName({ row, rowIndex }) {
            if (row.id === this.choosedId) {
                return 'choose-row';
            }
            return '';
        },
        fetch() {
            let params = {
                multiCondition: this.filterVal
            };
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.loading = true;
            this.$api
                .basic_baseDrugInf_listByPage(params)
                .then((r) => {
                    let { rows, total } = r.data.result;
                    this.total = total;
                    this.filterData = rows;
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.loading = false;
                });
        },
        reset() {
            this.queryParams = {};
            this.sort = {};
            this.$refs.table.clearFilter();
            this.search();
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        }
    }
};
</script>
<style lang="scss" scoped>
.chooseOneProdcut-component {
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
    .small-pagin {
        padding: 10px 0 0;
    }
}
</style>
