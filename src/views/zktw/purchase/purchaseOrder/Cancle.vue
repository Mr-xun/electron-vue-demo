<template>
    <div class="cancle-container">
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
                    value-format="yyyy-MM-dd HH:mm:ss"
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
        <p class="cancle-tip">单击订单行，可取消部分明细数量</p>
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
                min-width="160px"
            ></el-table-column>
            <el-table-column
                label="单号"
                :show-overflow-tooltip="true"
                align="center"
                min-width="150px"
                prop="purchaseOrderCode"
            ></el-table-column>
            <el-table-column
                label="单据日期"
                :show-overflow-tooltip="true"
                align="center"
                min-width="160px"
                prop="purchaseOrderDate"
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
                prop="amount"
                min-width="90px"
                ><template slot-scope="{ row }">
                    {{ row.amount | formatMoney }}
                </template></el-table-column
            >
            <el-table-column
                label="零售金额"
                :show-overflow-tooltip="true"
                align="center"
                prop="retailAmount"
                min-width="90px"
            >
                <template slot-scope="{ row }">
                    {{ row.retailAmount | formatMoney }}
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
                    <el-button
                        type="text"
                        :loading="cancleBtnLoading"
                        @click="cancleAll(row)"
                        v-has-permission="['purchaseOrder:cancle']"
                        >全部取消</el-button
                    >
                    <el-link
                        v-has-no-permission="['purchaseOrder:cancle']"
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
        <el-divider class="divider-line">
            <el-button
                type="success"
                size="mini"
                plain
                :loading="cancleBtnLoading"
                @click="submit"
                v-has-permission="['purchaseOrder:cancle']"
                >提交</el-button
            >
        </el-divider>
        <cancle-detail
            :detail="cancleDetailList"
            :loading="cancleDetailLoading"
            :tableHeight="tableHeight"
        />
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import CancleDetail from './components/CancleDetail';
import { debounce } from '@/utils';

export default {
    name: 'CancleOrder',
    components: { Pagination, CancleDetail },
    data() {
        return {
            cancleBtnLoading: false,
            cancleDetailLoading: false,
            cancleDetailList: [],
            orderNo: null,
            currentRow: null,
            tableHeight: 0,
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
    methods: {
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
                this.getDetailList(val);
                this.orderNo = val.purchaseOrderCode;
            }
        },
        getDetailList(row) {
            let params = {
                purchaseOrderCode: row.purchaseOrderCode
            };
            this.cancleDetailLoading = true;
            this.$api
                .order_purchasePending_detailList(params)
                .then((res) => {
                    this.cancleDetailLoading = false;
                    this.cancleDetailList = res.data.result;
                })
                .catch((err) => {
                    console.log(err);
                    this.cancleDetailLoading = false;
                    this.detailList = [];
                });
        },
        cancleAll(row) {
            this.$confirm('取消后订单明细数量全部为0, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let params = {
                        orderNo: row.purchaseOrderCode,
                        cancleDetailList: []
                    };
                    let res = await this.$api.order_purchasePending_detailList({
                        purchaseOrderCode: row.purchaseOrderCode
                    });
                    this.cancleDetailList = res.data.result;
                    this.cancleDetailList.forEach((item) => {
                        item.cancelQty = item.qty;
                        params.cancleDetailList.push({
                            cancelQty: item.qty,
                            itemId: item.itemId
                        });
                    });
                    this.cancleBtnLoading = true;
                    this.$api
                        .order_purchaseOrder_cancle(params)
                        .then((res) => {
                            this.$message({
                                message: '数量全部取消成功',
                                type: 'success'
                            });
                            this.fetch();
                            this.cancleBtnLoading = false;
                        })
                        .catch((err) => {
                            console.log(err);
                            this.cancleBtnLoading = false;
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        submit() {
            let params = {
                orderNo: this.orderNo,
                cancleDetailList: []
            };
            let flag = true; //是否可以提交
            if (this.cancleDetailList.length) {
                this.cancleDetailList.forEach((item) => {
                    if (item.cancelQty > item.qty) {
                        flag = false;
                    }
                    params.cancleDetailList.push({
                        cancelQty: item.cancelQty || 0,
                        itemId: item.itemId
                    });
                });
                if (flag) {
                    this.cancleBtnLoading = true;
                    this.$api
                        .order_purchaseOrder_cancle(params)
                        .then((res) => {
                            this.$message({
                                message: '取消数量成功',
                                type: 'success'
                            });
                            this.fetch();
                            this.cancleBtnLoading = false;
                        })
                        .catch((err) => {
                            console.log(err);
                            this.cancleBtnLoading = false;
                        });
                } else {
                    this.$message({
                        message: '明细取消数量应小于入库数量',
                        type: 'warning'
                    });
                }
            } else {
                this.$message({
                    message: '请选择修改的订单',
                    type: 'warning'
                });
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

        fetch() {
            this.orderNo = null;
            this.cancleDetailList = [];
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
                .order_purchasePending_mainInfoList(params)
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
.cancle-container {
    .table-container {
        padding: 20px 0;
    }
    .divider-line {
        margin: 5px 0 20px !important;
    }
    .cancle-tip {
        color: rgb(255, 0, 0);
        text-align: center;
        margin-bottom: 5px;
    }
}
</style>
