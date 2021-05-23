<template>
	<div class="print-page" v-loading="loading">
		<el-divider>
			<button
				ref="printBtn"
				@click="printPage('printMe', 'html')"
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
			<div
				class="print-container f14"
				v-for="(data, index) in groupData"
				:key="index"
			>
				<div class="print-title">盘点单</div>
				<div class="print-info flex-between-center">
					<div>盘点时间：{{ dataInfo.createTime }}</div>
					<div>仓库：{{ dataInfo.warehouseName }}</div>
					<div>机构名称：{{ dataInfo.orgId | flOrgName }}</div>
				</div>
				<div class="detail-container">
					<div class="group-box">
						<el-table
							ref="table"
							:data="data"
							border
							fit
							style="width: 100%"
							class="group-table"
						>
							<el-table-column
								label="序号"
								type="index"
								width="55"
								align="center"
							>
								<template slot-scope="{ $index }">
									{{ index * 38 + $index + 1 }}
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								prop="itemCode"
								width="100px"
								:show-overflow-tooltip="true"
								label="商品编码"
							></el-table-column>
							<el-table-column
								align="center"
								prop="itemName"
								label="商品名称"
								:show-overflow-tooltip="true"
								min-width="120px"
							>
								<template slot-scope="{row}">
										{{row.itemLocation + ' '+ row.itemName}}
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								prop="unit"
								label="单位"
								width="60px"
								:show-overflow-tooltip="true"
							></el-table-column>
							<el-table-column
								align="center"
								prop="stockQty"
								label="库存数"
								width="80px"
							></el-table-column>
							<el-table-column
								align="center"
								prop="lotNo"
								label="批号"
								width="100"
							></el-table-column>
							<el-table-column
								label="生产日期"
								:show-overflow-tooltip="true"
								align="center"
								prop="productionDate"
								width="110"
							></el-table-column>
							<el-table-column
								align="center"
								prop="actualQty"
								label="实盘数"
							>
								<template> <span></span></template>
							</el-table-column>
						</el-table>
						<div class="footer-info">
							<div class="total-info">
								<span>第{{ index + 1 }}页</span>
								<span
									>共{{
										groupData.length ? groupData.length : 0
									}}页</span
								>
								<span>
									总计：{{
										dataInfo.stockProfitLossOrderDetailList
											? dataInfo
													.stockProfitLossOrderDetailList
													.length
											: 0
									}}
									行
								</span>
							</div>
							<div class="user-info">
								<span>制单人：{{ dataInfo.creatorName }}</span>
								<span>复核人：</span>
								<span>财务确认：</span>
							</div>
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
            dataInfo: {},
            groupData: []
        };
    },
    watch: {
        $route: {
            handler() {
                this.$nextTick(()=>{
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
        //分组
        group(arr, step) {
            if (arr.length == 1) {
                return [arr];
            }
            return arr.reduce((x, y) => {
                return Array.isArray(x)
                    ? x[x.length - 1].push(y) == step
                        ? [...x, []]
                        : x
                    : [[x, y]];
            });
        },

        getData() {
            let params = {
                orderNo: this.$route.query.orderNo,
                pageSize: 1,
                pageNum: 1
            };
            this.loading = true;
            this.$api
                .stock_stockProfitLossOrder_detail(params)
                .then(r => {
                    let { rows } = r.data.result;
                    this.dataInfo = rows[0];
                    this.groupData = this.group(this.dataInfo.stockProfitLossOrderDetailList,38);
                    this.loading = false;
                    this.$nextTick(() => {
                        this.printPage();
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
	width: 822px;
	margin-left: auto;
	font-family: "宋体";
	/deep/ .detail-container {
		.group-table {
			margin-bottom: 12px;
		}
		.el-table {
			font-size: 12px !important;
		}
		.el-table--group,
		.el-table--border {
			border: 1px solid #757575;
		}
		.el-table th.is-center {
			padding: 3px 0 !important;
			border-bottom: 2px solid #757575;
		}
		.el-table td.is-center {
			padding: 1px 0 !important;
		}
		.el-table--border th,
		.el-table--border td {
			border-right: 1px solid #757575;
		}
		.el-table th.is-leaf,
		.el-table td {
			border-bottom: 1px solid #757575;
		}
	}
	.print-title {
		text-align: center;
		padding: 10px 10px;
		font-weight: bold;
	}
	.print-info {
		margin-bottom: 12px;
		div {
			width: 250px;
			text-align: center;
		}
	}
	.footer-info {
		.total-info {
			margin: 10px;
			span {
				margin-right: 15px;
			}
		}
		.user-info {
			margin: 10px 0 0;

			height: 40px;
			span {
				display: inline-block;
				width: 200px;
			}
		}
	}
}
</style>