<template>
    <div class="st-move-list-container">
        <el-form :inline="true" :model="queryParams" class="custom-form">
            <el-form-item label="移出库房" prop="moveOutWarehouseId">
                <el-select
                    size="mini"
                    :style="{ width: itemWidth }"
                    v-model="queryParams.moveOutWarehouseId"
                    @change="search"
                    clearable
                    filterable
                    autocomplete="on"
                    default-first-option
                >
                    <el-option
                        v-for="item in wareHouseOptions"
                        :label="item.name"
                        :key="item.id"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="移入库房" prop="moveInWarehouseId">
                <el-select
                    size="mini"
                    :style="{ width: itemWidth }"
                    v-model="queryParams.moveInWarehouseId"
                    @change="search"
                    clearable
                    filterable
                    autocomplete="on"
                    default-first-option
                >
                    <el-option
                        v-for="item in wareHouseOptions"
                        :label="item.name"
                        :key="item.id"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单据编号">
                <el-input
                    size="mini"
                    :style="{ width: itemWidth }"
                    v-model="queryParams.orderNo"
                    placeholder="单据编号"
                    @keyup.enter.native="search"
                    class="filter-item search-item"
                />
            </el-form-item>
            <el-form-item label="单据日期">
                <el-date-picker
                    size="mini"
                    style="width: 280px"
                    v-model="queryParams.timeRange"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="filter-item search-item"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label style="margin-left: 0.75rem">
                <el-button
                    class="filter-item"
                    size="mini"
                    type="primary"
                    plain
                    @click="search"
                    >搜索</el-button
                >
                <el-button
                    class="filter-item"
                    size="mini"
                    type="warning"
                    plain
                    @click="reset"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <el-table
            ref="table"
            :key="tableKey"
            v-loading="loading"
            :data="list"
            border
            fit
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            stripe
            :max-height="tableHeight"
            style="width: 100%"
            highlight-current-row
            @current-change="handleCurrentChange"
        >
            <el-table-column
                label="序号"
                type="index"
                width="50"
                align="center"
            ></el-table-column>
            <el-table-column
                label="单据日期"
                prop="orderDate"
                :show-overflow-tooltip="true"
                align="center"
                min-width="100px"
            ></el-table-column>
            <el-table-column
                label="单据编号"
                prop="orderNo"
                :show-overflow-tooltip="true"
                align="center"
                min-width="150px"
            ></el-table-column>
            <el-table-column
                label="移出机构"
                prop
                :show-overflow-tooltip="true"
                align="center"
                min-width="130px"
            >
                <template slot-scope="{ row }">
                    <span>{{ row.orgId | flOrgName }}</span>
                </template>
            </el-table-column>

            <el-table-column
                label="移出库房"
                prop="moveOutWarehouseName"
                :show-overflow-tooltip="true"
                align="center"
                min-width="110px"
            ></el-table-column>
            <el-table-column
                label="移入库房"
                prop="moveInWarehouseName"
                :show-overflow-tooltip="true"
                align="center"
                min-width="120px"
            ></el-table-column>
            <el-table-column
                label="收货人"
                prop="consigneeName"
                :show-overflow-tooltip="true"
                min-width="90px"
                align="center"
            ></el-table-column>
            <el-table-column
                label="制单人"
                prop="creatorName"
                :show-overflow-tooltip="true"
                min-width="90px"
                align="center"
            ></el-table-column>
            <el-table-column
                label="操作"
                align="center"
                min-width="100px"
                fixed="right"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="{ row }">
                    <el-button
                        size="mini"
                        icon="el-icon-printer"
                        type="success"
                        @click="toPrint(row)"
                        >打印</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="pagination.num"
            :limit.sync="pagination.size"
            @pagination="fetch"
        />
        <el-divider class="detail-divider">明细</el-divider>
        <order-detail :detail="detailList" :tableHeight="tableHeight" />
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import OrderDetail from './components/OrderDetail';
import { mapGetters } from 'vuex';
import { debounce } from '@/utils';

export default {
    name: 'OrderList',
    components: { Pagination, OrderDetail },
    data() {
        return {
            itemWidth: '160px',
            dialog: {
                isVisible: false,
                title: ''
            },
            tableHeight: 0,
            detailList: [],
            wareHouseOptions: [],
            currentRow: null,
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
    computed: {
        ...mapGetters('basic', ['orgArchives'])
    },
    created() {
        this.setTableHeight();
        this.getAllWareHouse();
    },
    mounted() {
        this.fetch();
        this.__resizeHandler = debounce(() => {
            this.setTableHeight();
        }, 100);
        window.addEventListener('resize', this.__resizeHandler);
    },
    methods: {
        //去打印
        toPrint(row) {
            let hostUrl = window.location.origin + window.location.pathname;
            let routeUrl = this.$router.resolve({
                path: '/print/preview',
                query: {
                    printType: 'stockMoveOrder',
                    orderNo: row.orderNo
                }
            });
            window.open(
                hostUrl + routeUrl.href + '&timestamp=' + new Date().getTime(),
                'printPage',
                'height=700,width=700,top=0,left=800,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no, status=no'
            );
        },
        setTableHeight() {
            this.$nextTick(() => {
                let creenHeight = document.body.clientHeight;
                let fixedHeight = 0;
                let filterHeight = 0;
                let paginationHeight = 80;
                let dividerHeight = 50 * 2;
                let footerHeight = document.getElementsByClassName('footer')[0]
                    .offsetHeight;
                let fixedContainer = document.getElementsByClassName(
                    'fixed-header'
                );
                if (fixedContainer && fixedContainer.length) {
                    fixedHeight = fixedContainer[0].offsetHeight || 80;
                }
                let filterContainer = document.getElementsByClassName(
                    'custom-form'
                );
                if (filterContainer && filterContainer.length) {
                    filterHeight = filterContainer[0].offsetHeight;
                }
                let paginationContainer = document.getElementsByClassName(
                    'pagination-container'
                );
                if (paginationContainer && paginationContainer.length) {
                    paginationHeight =
                        paginationContainer[0].offsetHeight || 80;
                }
                this.tableHeight =
                    creenHeight -
                    fixedHeight -
                    filterHeight -
                    dividerHeight -
                    paginationHeight -
                    footerHeight -
                    120;
            });
        },

        getAllWareHouse() {
            this.$api.basic_baseWarehouse_all().then((res) => {
                let { result } = res.data;
                this.wareHouseOptions = result;
            });
        },
        handleCurrentChange(val) {
            if (val) {
                this.detailList = val.stockMoveOrderDetailList;
            }
        },
        search() {
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.pagination.num = 1;
            this.queryParams = {};
            this.fetch();
        },
        edit(row) {
            this.$bus.$emit('edit', row);
            this.$emit('toEdit');
        },
        fetch() {
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num
            };
            if (this.queryParams.timeRange) {
                params.startTime = this.queryParams.timeRange[0];
                params.endTime = this.queryParams.timeRange[1];
            }
            this.loading = true;
            this.$api
                .stock_stockMoveOrder_list(params)
                .then((r) => {
                    let { rows, total } = r.data.result;
                    this.total = total;
                    this.list = rows;
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.st-move-list-container {
    .table-container {
        padding: 20px 0;
    }
    /deep/ .detail-divider {
        margin: -15px 0 15px;
    }
}
</style>
