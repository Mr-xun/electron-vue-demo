<template>
    <div class="print-page" v-loading="loading">
        <el-divider>
            <button
                ref="printBtn"
                v-print="printObj"
                plain
                class="submit-btn"
                type="success"
                icon="el-icon-printer"
                size="small"
            >
                打印
            </button>
        </el-divider>
        <div id="printMe">
            <div class="print-container f14">
                <div class="print-title">盘点复核单</div>
                <div class="print-info flex-between-center">
                    <div>盘点时间：{{ dataInfo.createTime }}</div>
                    <div>仓库：{{ dataInfo.warehouseName }}</div>
                    <div>机构名称：{{ dataInfo.orgId | flOrgName }}</div>
                </div>
                <div class="detail-container">
                    <el-table
                        ref="table"
                        :data="dataInfo.stockProfitLossOrderDetailList"
                        border
                        style="width: 100%"
                    >
                        <el-table-column
                            align="center"
                            prop="itemCode"
                            min-width="100px"
                            :show-overflow-tooltip="true"
                            label="商品编码"
                        ></el-table-column>
                        <el-table-column
                            align="center"
                            prop="itemName"
                            label="商品名称"
                            :show-overflow-tooltip="true"
                            min-width="100px"
                        ></el-table-column>
                        <el-table-column
                            align="center"
                            prop="specification"
                            label="规格"
                            :show-overflow-tooltip="true"
                        ></el-table-column>
                        <el-table-column
                            align="center"
                            prop="name"
                            label="单位"
                            :show-overflow-tooltip="true"
                        >
                            <template slot-scope="{ row }">
                                <span>{{ row.unit }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="stockQty"
                            label="库存数量"
                            min-width="100px"
                        ></el-table-column>
                        <el-table-column
                            align="center"
                            prop="lotNo"
                            label="批号"
                            min-width="100px"
                        ></el-table-column>
                        <el-table-column
                            label="生产日期"
                            :show-overflow-tooltip="true"
                            align="center"
                            prop="productionDate"
                            min-width="110"
                        ></el-table-column>
                        <el-table-column
                            align="center"
                            prop="actualQty"
                            label="实盘数量"
                            min-width="120px"
                        ></el-table-column>
                        <el-table-column
                            align="center"
                            prop="qtyDifference"
                            label="数量差"
                            min-width="100px"
                        ></el-table-column>
                    </el-table>
                </div>
                <div class="footer-info">
                    <div class="total-info">
                        总计：{{
                            dataInfo.stockProfitLossOrderDetailList
                                ? dataInfo.stockProfitLossOrderDetailList.length
                                : 0
                        }}
                        行
                    </div>
                    <div class="user-info">
                        <span>制单人：{{ dataInfo.creatorName }}</span>
                        <span>复核人：{{ dataInfo.reviewer }}</span>
                        <span>财务确认：</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import VueBarcode from 'vue-barcode';
export default {
    components: { VueBarcode },
    data() {
        return {
            printObj: {
                id: 'printMe',
                popTitle: '打印',
                endCallback: (e) => {
                    console.log(e, 333);
                }
            },
            loading: false,
            dataInfo: {}
        };
    },
    watch: {
        $route: {
            handler() {
                this.$nextTick(() => {
                    this.getData();
                });
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        getData() {
            let params = {
                orderNo: this.$route.query.orderNo,
                pageSize: 1,
                pageNum: 1
            };
            this.loading = true;
            this.$api
                .stock_stockProfitLossOrder_list(params)
                .then((r) => {
                    let { rows } = r.data.result;
                    this.dataInfo = rows[0];
                    this.loading = false;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$refs.printBtn.click();
                        }, 300);
                    });
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
.print-container {
    width: 98%;
    margin: auto;
    font-family: "宋体";
    .print-title {
        text-align: center;
        margin: 20px 10px;
    }
    .print-info {
        margin: 10px;
    }
    .footer-info {
        .total-info {
            margin: 10px;
        }
        .user-info {
            margin: 10px;
            height: 40px;
            span {
                display: inline-block;
                width: 200px;
            }
        }
    }
}
</style>