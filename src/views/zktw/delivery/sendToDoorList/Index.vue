<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams" label-width="70px">
                <el-form-item label="送货单号">
                    <el-input
                        v-model="queryParams.deliveryOrderNo"
                        placeholder="送货单号"
                        class="filter-item search-item"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label style="margin-left: 0.75rem">
                    <el-button
                        class="filter-item"
                        type="primary"
                        plain
                        @click="search"
                        >搜索</el-button
                    >
                    <el-button
                        class="filter-item"
                        type="warning"
                        plain
                        @click="reset"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <div class="center-container label-print-container">
            <el-table
                ref="table"
                :key="tableKey"
                v-loading="loading"
                :row-class-name="tablePrintedFlag"
                :data="list"
                border
                fit
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
                :max-height="tableHeight"
                style="width: 100%"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="送货单号"
                    prop="orderNo"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="140px"
                ></el-table-column>
                <el-table-column
                    label="快递员姓名"
                    min-width="100px"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="deliveryMan"
                ></el-table-column>
                <el-table-column
                    label="送货时间"
                    :show-overflow-tooltip="true"
                    min-width="110px"
                    align="center"
                    prop="deliveryTime"
                ></el-table-column>
                <el-table-column
                    label="流水号"
                    :show-overflow-tooltip="true"
                    min-width="120px"
                    align="center"
                    prop="prescriptionOrderNo"
                ></el-table-column>
                <el-table-column
                    label="姓名"
                    :show-overflow-tooltip="true"
                    min-width="110px"
                    align="center"
                    prop="patientName"
                ></el-table-column
                ><el-table-column
                    label="工艺"
                    :show-overflow-tooltip="true"
                    min-width="110px"
                    align="center"
                    prop="processingTechnic"
                ></el-table-column>
                <el-table-column
                    label="付数"
                    :show-overflow-tooltip="true"
                    min-width="110px"
                    align="center"
                    prop="doseNum"
                ></el-table-column>
                <el-table-column
                    label="送货地址"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="180px"
                    prop="deliveryAddress"
                ></el-table-column>
                <el-table-column
                    label="联系人"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="deliveryReceiver"
                ></el-table-column>
                <el-table-column
                    label="联系电话"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="deliveryTel"
                    min-width="110px"
                ></el-table-column>
                <el-table-column
                    label="打印次数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="toDoorPrintNum"
                    min-width="80px"
                ></el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="90px"
                    fixed="right"
                    class-name="small-padding fixed-width"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            size="mini"
                            type="success"
                            icon="el-icon-printer"
                            @click="toPrint(row)"
                            v-has-permission="['sendToDoorList:send']"
                            >打印</el-button
                        >
                        <el-link
                            v-has-no-permission="['sendToDoorList:send']"
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
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import ExpandCollapse from '@/components/ExpandCollapse';
import { mapGetters } from 'vuex';

export default {
    name: 'SendToDoorList',
    components: { Pagination, ExpandCollapse },
    data() {
        return {
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            pagination: {
                size: 10,
                num: 1
            }
        };
    },
    computed: {
        ...mapGetters(['tableHeight'])
    },
    activated() {
        this.fetch();
    },
    methods: {
        //已打印添加底色
        tablePrintedFlag({ row, rowIndex }) {
            if (row.toDoorPrintNum > 1) {
                return 'todoor-printed';
            }
            return '';
        },
        //打印
        toPrint(row) {
            let params = {
                deliveryOrderNo: row.orderNo,
                prescriptionOrderNo: row.prescriptionOrderNo
            };
            this.$api
                .delivery_deliveryOrder_deliveryToDoorPrintCount(params)
                .then((res) => {
                    this.$message({
                        message: '打印成功',
                        type: 'success'
                    });
                    this.fetch();
                    let hostUrl =
                        window.location.origin + window.location.pathname;
                    let routeUrl = this.$router.resolve({
                        path: '/print/preview',
                        query: {
                            printType: 'sendToDoor',
                            orderNo: row.prescriptionOrderNo
                        }
                    });
                    window.open(
                        hostUrl +
                            routeUrl.href +
                            '&timestamp=' +
                            new Date().getTime(),
                        'printPage',
                        'height=800,width=800,top=0,left=800,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no, status=no'
                    );
                })
                .catch((err) => {
                    console.log(err);
                });
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
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num
            };
            this.loading = true;
            this.$api
                .delivery_deliveryOrder_sendToDoorList(params)
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
.label-print-container {
    /deep/ .el-table__expand-icon {
        color: transparent;
    }
    /deep/ .todoor-printed {
        tr,
        td {
            background: #9de2bc !important;
        }
    }
    .table-top-wrap {
        .btn-color-tip {
            .label-print {
                margin-right: 20px;
            }
            .bg-tag {
                width: 25px;
                height: 16px;
                border-radius: 5px;
                margin-right: 5px;
                &__prescribe {
                    background: #13ce66;
                }
                &__label {
                    background: #8596e3;
                }
                &__todoor {
                    background: #f8ab6b;
                }
                &__prescribetag {
                    background: #13cbf3;
                }
            }
        }
    }
    .print-bn {
        margin: 0 7px;
    }
    .label-tag-print__btn {
        background-color: #8596e3;
        border-color: #8596e3;
    }
    .to-door-tag-print__btn {
        background-color: #f8ab6b;
        border-color: #f8ab6b;
    }
    .prescribe-tag-print__btn {
        background-color: #13cbf3;
        border-color: #13cbf3;
    }
}
.more-filter {
    margin: 10px 0;
    /deep/ .el-divider__text {
        padding: 0 10px;
    }
    i {
        font-size: 22px;
        cursor: pointer;
    }
}
</style>
