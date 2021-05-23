<template>
    <div class="print-page" v-loading="loading">
        <el-divider>
            <button ref="printBtn" v-print="printObj" plain class="submit-btn" type="success" icon="el-icon-printer" size="small">
                打印
            </button>
        </el-divider>
        <div id="printMe">
            <div class="print-container f16">
                <div class="order-wrapper" v-for="(item, index) in dataInfo" :key="index">
                    <div class="print-title f22 fbold">
                        {{ item.printTitle }}
                    </div>
                    <div class="detail-container">
                        <el-table ref="table" :data="item.deliveryOrderDetailList" border style="width: 100%">
                            <el-table-column label="序号" type="index" width="40px" align="center"></el-table-column>
                            <el-table-column label="流水号" prop="prescriptionOrderNo" width="100px" align="center"></el-table-column>
                            <el-table-column label="姓名" width="80px" prop="patientName" align="center"></el-table-column>
                            <el-table-column label="付数" align="center" width="40px" prop="doseNum"></el-table-column>
                            <el-table-column label="细料数" align="center" prop="itemName"></el-table-column>
                            <el-table-column label="备注" align="center" prop="">
                                <span style="white-space: normal">&nbsp;日&nbsp;点取</span>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="footer-info">
                        <div class="user-info">
                            <p class="flex-between-center">
                                <span>送药流水号：{{ item.orderNo }}</span>
                                <span>送药时间：{{ item.deliveryTime }}</span>
                            </p>
                            <p class="flex-between-center">
                                <span>收药人：</span>
                                <span>送药人：{{ item.deliveryman }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import VueBarcode from 'vue-barcode';
import printJS from 'print-js';

export default {
    components: { VueBarcode },
    data() {
        return {
            printObj: {
                id: 'printMe',
                popTitle: '打印',
                endCallback: e => {
                    console.log(e, 333);
                }
            },
            loading: false,
            dataInfo: []
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
        printPage() {
            printJS({
                printable: 'printMe',
                type: 'html',
                targetStyles: ['*']
            });
        },
        getData() {
            this.loading = true;
            let params = {
                deliveryOrderNo: this.$route.query.deliveryOrderNo
            };
            this.$api
                .delivery_deliveryOrder_deliveryOrderPrint(params)
                .then(r => {
                    let { result } = r.data;
                    //进行名称排序
                    result.forEach(item => {
                        item.deliveryOrderDetailList.sort((p1, p2) => {
                            return p1.patientName.localeCompare(
                                p2.patientName,
                                'zh'
                            );
                        });
                    });
                    this.dataInfo = result;
                    console.log(this.dataInfo, 888);
                    this.loading = false;
                    this.$nextTick(() => {
                        // this.printPage();
                        setTimeout(() => {
                            this.$refs.printBtn.click();
                        }, 100);
                    });
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
.print-container {
    width: 430px;
    margin: auto;
    padding-bottom: 10px;
    font-family: "宋体";
    /deep/ .detail-container {
        .el-table {
            font-size: 12px !important;
        }
        .el-table--group,
        .el-table--border {
            border: 1px solid #757575;
        }
        .el-table th.is-center {
            padding: 1px 0 !important;
            border-bottom: 1px solid #757575;
        }
        .el-table td.is-center {
            padding: 0px 0 !important;
        }
        .el-table--border th,
        .el-table--border td {
            border-right: 1px solid #757575;
        }
        .el-table th.is-leaf,
        .el-table td {
            border-bottom: 1px solid #757575;
        }
        .el-table__footer-wrapper td {
            border-top: 1px solid #757575;
        }
        .el-table__header-wrapper tbody td,
        .el-table__footer-wrapper tbody td {
            background-color: #ffffff;
        }
        .el-table .cell {
            padding-left: 2px;
            padding-right: 2px;
        }
    }
    .print-title {
        text-align: center;
        margin: 0px 10px 20px;
    }
    .print-info {
        margin: 5px 10px;
        span {
            display: inline-block;
            width: 300px;
            margin-bottom: 5px;
        }
    }
    .footer-info {
        margin-bottom: 40px;
        .user-info {
            margin: 10px;
            span {
                display: inline-block;
                width: 230px;
            }
            span:nth-of-type(2) {
                text-align: right;
            }
        }
    }
}
</style>