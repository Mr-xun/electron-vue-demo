<template>
    <div class="cancle-detail-container">
        <ux-grid ref="table" highlight-current-row :key="tableKey" v-loading="loading" :data="detail" border fit :header-cell-style="{ background: '#eef1f6', color: '#606266' }" stripe :max-height="tableHeight" style="width: 100%">
            <ux-table-column type="index" width="60" align="center" title="序号"></ux-table-column>
            <ux-table-column align="center" field="itemCode" min-width="100px" :show-overflow-tooltip="true" title="商品编码"></ux-table-column>
            <ux-table-column align="center" field="itemName" title="商品名称" :show-overflow-tooltip="true" min-width="120px"></ux-table-column>
            <ux-table-column align="center" field="itemShortCode" title="速记码" min-width="100" :show-overflow-tooltip="true"></ux-table-column>
            <ux-table-column align="center" field="specification" title="规格" min-width="100" :show-overflow-tooltip="true"></ux-table-column>
            <ux-table-column align="center" field="name" title="单位" min-width="60" :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                    <span>{{ row.unit }}</span>
                </template>
            </ux-table-column>
            <ux-table-column align="center" min-width="80" field="itemLocation" title="货位"></ux-table-column>
            <ux-table-column align="center" field="productionEnterpriseName" title="生产企业" min-width="160px"></ux-table-column>
            <ux-table-column align="center" field="stockQty" title="库存数量" min-width="100px"></ux-table-column>
            <ux-table-column align="center" field="actualQty" title="实盘数量" min-width="120px">
                <template slot-scope="scope">
                    <el-input style="width: 85%" size="mini" v-model="scope.row.actualQty" v-number-only @input="changeSumPrice(scope.row)"></el-input>
                </template>
            </ux-table-column>
            <ux-table-column align="center" field="qtyDifference" title="数量差" min-width="120px"></ux-table-column>
            <ux-table-column align="center" field="lotNo" title="批号" min-width="100px"></ux-table-column>
            <ux-table-column title="生产日期" :show-overflow-tooltip="true" align="center" field="productionDate" min-width="110"></ux-table-column>
            <ux-table-column title="有效期至" :show-overflow-tooltip="true" align="center" field="expireDate" min-width="110"></ux-table-column>
            <ux-table-column title="成本价" :show-overflow-tooltip="true" align="center" field="stockCostPrice" min-width="110"></ux-table-column>
            <ux-table-column title="实际成本金额" :show-overflow-tooltip="true" align="center" field="actualCostAmount" min-width="110">
                <template slot-scope="{ row }">
                    {{ row.actualCostAmount | formatMoney }}
                </template>
            </ux-table-column>
            <ux-table-column title="零售价" :show-overflow-tooltip="true" align="center" field="retailPrice" min-width="110"></ux-table-column>
            <ux-table-column title="实际零售金额" :show-overflow-tooltip="true" align="center" field="actualRetailAmount" min-width="110">
                <template slot-scope="{ row }">
                    {{ row.actualRetailAmount | formatMoney }}
                </template>
            </ux-table-column>

            <ux-table-column align="center" field="retailAmountDifference" title="零售金额差" min-width="120px">
                <template slot-scope="{ row }">
                    {{ row.retailAmountDifference | formatMoney }}
                </template>
            </ux-table-column>
            <ux-table-column align="center" field="costAmountDifference" title="成本金额差" min-width="120px">
                <template slot-scope="{ row }">
                    {{ row.costAmountDifference | formatMoney }}
                </template>
            </ux-table-column>
            <ux-table-column title="操作" align="center" min-width="80px" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="{ row, $index }">
                    <i class="el-icon-delete table-operation" style="color: #f50" @click="singleDelete(row, $index)" />
                </template>
            </ux-table-column>
        </ux-grid>
    </div>
</template>
<script>
import numberOnly from '@/directive/number-only';
export default {
    name: 'TakeStockSure',
    props: {
        detail: {
            type: Array,
            default() {
                return [];
            }
        },
        tableHeight: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: false
        },
        searchDetailIpt: {
            type: String,
            default: ''
        }
    },
    directives: {
        numberOnly
    },
    watch: {
        searchDetailIpt(val) {
            if (val && this.detail.length) {
                let str = val.toLowerCase();
                let findArr = this.detail.filter((item) => {
                    return (
                        item.itemCode.toLowerCase().indexOf(str) > -1 ||
                        item.itemName.toLowerCase().indexOf(str) > -1 ||
                        item.itemShortCode.toLowerCase().indexOf(str) > -1
                    );
                });
                if (findArr.length) {
                    this.scrollToRow(findArr[0]);
                }
            } else {
                this.$refs.table.setCurrentRow();
            }
        }
    },
    data() {
        return {
            tableKey: 0,
            visible: true
        };
    },
    methods: {
        //定位到查询行
        scrollToRow(row) {
            this.$refs.table.scrollToRow(row);
            this.$refs.table.setCurrentRow(row);
        },
        //格式化小数值
        formatDecimal(value) {
            let x = String(value).indexOf('.') + 1; //得到小数点的位置
            let pointCount = x == 0 ? 0 : String(value).length - x; //小数点的位数
            if (pointCount > 2) {
                value = Number(value).toFixed(2);
            }
            return value;
        },
        changeSumPrice(item) {
            this.$set(item, 'qtyDifference', item.actualQty - item.stockQty);
            this.$set(
                item,
                'actualCostAmount',
                this.formatDecimal(item.actualQty * item.stockCostPrice)
            ); //实际成本金额
            this.$set(
                item,
                'actualRetailAmount',
                this.formatDecimal(item.actualQty * item.retailPrice)
            ); //实际销售金额
            this.$set(
                item,
                'costAmountDifference',
                this.formatDecimal(item.qtyDifference * item.stockCostPrice)
            ); //成本金额差
            this.$set(
                item,
                'retailAmountDifference',
                this.formatDecimal(item.qtyDifference * item.retailPrice)
            ); //销售金额差
        },
        singleDelete(row, index) {
            this.$confirm('该数据将被移除, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.detail.splice(index, 1);
            });
        }
    }
};
</script>
<style lang="scss" >
.cancelOrder-tool-tip {
    font-size: 11px;
}
.qty-error {
    .el-input__inner {
        border-color: #ff4949;
    }
}
</style>