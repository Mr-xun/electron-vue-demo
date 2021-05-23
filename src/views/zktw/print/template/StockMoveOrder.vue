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
				v-for="(tableData, index) in groupData"
				:key="index"
			>
				<div class="print-title fbold">
					中药饮品装斗前质量符合记录（调拨清单）{{
						dataInfo.creatorName
					}}
				</div>
				<div class="print-info fbold">
					<div>
						<span>录单日期：{{ dataInfo.createTime }}</span
						><span>单据编号：{{ dataInfo.orderNo }}</span>
					</div>
					<div>
						<span
							>移出货位：{{ dataInfo.moveOutWarehouseName }}</span
						><span
							>移入货位：{{ dataInfo.moveInWarehouseName }}</span
						>
					</div>
				</div>
				<div class="detail-container">
					<el-table
						ref="table"
						:data="tableData"
						fit
						border
						style="width: 100%"
						class="stock-move-order-table"
					>
						<el-table-column
							label="序号"
							type="index"
							width="80"
							align="center"
						>
							<template slot-scope="{ $index }">
								{{ index * 36 + $index + 1 }}
							</template></el-table-column
						>
						<el-table-column
							label="编码"
							prop="itemCode"
							:show-overflow-tooltip="true"
							align="center"
						></el-table-column>
						<el-table-column
							label="品名"
							:show-overflow-tooltip="true"
							align="center"
							prop="itemName"
						></el-table-column>
						<el-table-column
							label="生产厂商"
							:show-overflow-tooltip="true"
							align="center"
							min-width="120"
							prop="productionEnterpriseName"
						></el-table-column>
						<el-table-column
							label="数量"
							:show-overflow-tooltip="true"
							align="center"
							prop="qty"
						></el-table-column>
						<el-table-column
							label="单位"
							:show-overflow-tooltip="true"
							align="center"
							prop="unit"
							width="70"
						>
							<template slot-scope="{ row }">
								<span>{{ row.unit }}</span>
							</template>
						</el-table-column>
						<el-table-column
							label="生产批号"
							:show-overflow-tooltip="true"
							align="center"
							prop="lotNo"
						></el-table-column>
					</el-table>
				</div>
				<div class="footer-info">
					<div class="user-info">
						<span>制单人：{{ dataInfo.creatorName }}</span>
						<span>出货人：</span>
						<span>收货人：{{ dataInfo.consigneeName }}</span>
						<span>装斗人：</span>
						<span>装斗复核：{{ dataInfo.reviewerName }}</span>
					</div>
					<div class="tip fbold">
						<div class="tip-info">质量未见异常可销售</div>
						<div class="summary-info">
							<span>第{{ index + 1 }}页</span>
							<span
								>共{{
									groupData.length ? groupData.length : 0
								}}页</span
							>
							<span>
								总计：{{
									dataInfo.stockMoveOrderDetailList
										? dataInfo.stockMoveOrderDetailList
												.length
										: 0
								}}
								行
							</span>
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
        getSummaries(param) {
            const { columns } = param;
            const sums = [];
            const map = {
                0: '总计',
                1: ' ',
                3: ' ',
                4: ' ',
                5: ' ',
                6: ' '
            };
            columns.forEach((column, index) => {
                if (map[index]) {
                    sums[index] = map[index];
                    return sums;
                }
                if (index == 2) {
                    sums[index] = this.dataInfo.stockMoveOrderDetailList
                        ? this.dataInfo.stockMoveOrderDetailList.length +
						  '个品种'
                        : '0个品种';
                }
            });
            return sums;
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
                .stock_stockMoveOrder_list(params)
                .then(r => {
                    let { rows } = r.data.result;
                    this.dataInfo = rows[0];
                    this.groupData = this.group(
                        this.dataInfo.stockMoveOrderDetailList,
                        36
                    );
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
	width: 740px;
	margin-left: auto;
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
		.el-table__footer-wrapper td {
			border-top: 1px solid #757575;
		}
		.el-table__header-wrapper tbody td,
		.el-table__footer-wrapper tbody td {
			background-color: #ffffff;
		}
	}
	.print-title {
		text-align: center;
		padding: 20px 10px;
	}
	.print-info {
		margin: 5px 10px;
		span {
			display: inline-block;
			width: 300px;
			margin-bottom: 10px;
		}
	}
	.footer-info {
		.total-info {
			margin: 12px 10px;
		}
		.user-info {
			margin: 12px 10px;
			span {
				display: inline-block;
				width: 120px;
			}
		}
		.tip {
			margin: 10px;
			display: flex;
			justify-content: space-between;
			.tip-info {
				width: 170px;
			}
			.summary-info {
				text-align: right;
				width: 240px;
				span {
					margin-left: 8px;
				}
			}
		}
	}
}
</style>