<template>
    <div class="list-container">
        <el-form :inline="true" :model="queryParams" class="custom-form">
            <el-form-item label="供货商编码">
                <el-input
                    size="mini"
                    style="width: 160px"
                    v-model="queryParams.supplierCode"
                    @keyup.enter.native="search"
                    placeholder="供货商编码"
                    class="filter-item search-item"
                />
            </el-form-item>
            <el-form-item label="供货商">
                <el-input
                    size="mini"
                    style="width: 160px"
                    v-model="queryParams.supplierName"
                    placeholder="供货商"
                    @keyup.enter.native="search"
                    class="filter-item search-item"
                />
            </el-form-item>
            <el-form-item label="单据编号">
                <el-input
                    size="mini"
                    style="width: 160px"
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
        <el-divider>列表</el-divider>
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
                label="供货单位"
                prop="supplierName"
                :show-overflow-tooltip="true"
                align="center"
                min-width="120px"
            ></el-table-column>
            <el-table-column
                label="单号"
                :show-overflow-tooltip="true"
                align="center"
                min-width="150px"
                prop="orderNo"
            ></el-table-column>
            <el-table-column
                label="订单日期"
                :show-overflow-tooltip="true"
                align="center"
                min-width="160px"
                prop="orderDate"
            ></el-table-column>
            <el-table-column
                label="采购人员"
                :show-overflow-tooltip="true"
                align="center"
                prop="buyerName"
            ></el-table-column>
            <el-table-column
                label="金额"
                :show-overflow-tooltip="true"
                align="center"
                prop="totalAmount"
                min-width="90px"
            >
                <template slot-scope="{ row }">
                    {{ row.totalAmount | formatMoney }}
                </template>
            </el-table-column>
            <el-table-column
                label="零售金额"
                :show-overflow-tooltip="true"
                align="center"
                prop="totalRetailAmount"
                min-width="90px"
            >
                <template slot-scope="{ row }">
                    {{ row.totalRetailAmount | formatMoney }}
                </template>
            </el-table-column>
            <el-table-column
                label="备注"
                :show-overflow-tooltip="true"
                align="center"
                prop="remark"
            ></el-table-column>
            <el-table-column
                label="状态"
                :show-overflow-tooltip="true"
                align="center"
                prop="shorthandCode"
            >
                <template slot-scope="{ row }">
                    <el-tag :type="row.status | statusFilter">{{
                        transStatus(row.status)
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                min-width="100px"
                fixed="right"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="{ row }">
                    <i
                        v-if="row.status == 1"
                        class="el-icon-setting table-operation"
                        style="color: #2db7f5"
                        v-has-permission="['purchaseOrder:update']"
                        @click="edit(row)"
                    />
                    <i
                        v-if="row.status == 1"
                        class="el-icon-delete table-operation"
                        v-has-permission="['purchaseOrder:delete']"
                        style="color: #f50"
                        @click="singleDelete(row)"
                    />
                    <el-link
                        v-if="row.status == 1"
                        v-has-no-permission="[
                            'purchaseOrder:update',
                            'purchaseOrder:delete',
                        ]"
                        class="no-perm"
                        >无权限</el-link
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
        <el-divider>明细</el-divider>
        <order-detail :detail="detailList" :tableHeight="tableHeight" />
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import OrderDetail from './components/OrderDetail';
import { debounce } from '@/utils';
export default {
    name: 'OrderList',
    components: { Pagination, OrderDetail },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: ''
            },
            tableHeight: 0,
            tableKey: 0,
            loading: false,
            list: [],
            detailList: [], //明细
            total: 0,
            queryParams: {},
            selection: [],
            pagination: {
                size: 10,
                num: 1
            }
        };
    },
    filters: {
        statusFilter(status) {
            const map = {
                1: 'info',
                2: 'success'
            };
            return map[status];
        }
    },
    created() {
        this.setTableHeight();
    },
    activated() {
        this.fetch();
    },
    mounted() {
        this.__resizeHandler = debounce(() => {
            this.setTableHeight();
        }, 100);
        window.addEventListener('resize', this.__resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.__resizeHandler);
    },
    methods: {
        transStatus(sex) {
            switch (Number(sex)) {
            case 1:
                return '草稿';
            case 2:
                return '已审核';
            default:
                return '--';
            }
        },
        setTableHeight() {
            this.$nextTick(() => {
                let creenHeight = document.body.clientHeight;
                let fixedHeight = document.getElementsByClassName(
                    'fixed-header'
                )[0].offsetHeight;
                let filterHeight = 0;
                let paginationHeight = 80;
                let dividerHeight = 50 * 2;
                let footerHeight = document.getElementsByClassName('footer')[0]
                    .offsetHeight;
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
        handleCurrentChange(val) {
            if (val) {
                this.detailList = val.purchaseOrderDetailList;
            }
        },
        onSelectChange(selection) {
            this.selection = selection;
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
        singleDelete(row) {
            this.selection.push(row);
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
                    console.log(err);
                });
        },
        delete(deleteIds) {
            this.$api
                .order_purchaseOrder_delete(deleteIds)
                .then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.fetch();
                    this.selection = [];
                })
                .catch((err) => {
                    console.log(err);
                    this.selection = [];
                });
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
            this.detailList = [];
            this.loading = true;
            this.$api
                .order_purchaseOrder_list(params)
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
.list-container {
    .table-container {
        padding: 20px 0;
    }
}
</style>
