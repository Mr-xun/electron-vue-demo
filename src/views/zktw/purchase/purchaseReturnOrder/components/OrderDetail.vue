<template>
    <div class="detail-container">
        <el-table
            ref="table"
            :key="tableKey"
            v-loading="loading"
            :data="detail"
            border
            fit
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            stripe
            :max-height="tableHeight"
            style="width: 100%"
        >
            <el-table-column
                label="商品编码"
                min-width="120px"
                prop="itemCode"
                :show-overflow-tooltip="true"
                align="center"
            ></el-table-column>
            <el-table-column
                label="商品名称"
                :show-overflow-tooltip="true"
                align="center"
                min-width="120px"
                prop="itemName"
            ></el-table-column>
            <el-table-column
                align="center"
                prop="itemShortCode"
                label="速记码"
                :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
                label="规格"
                :show-overflow-tooltip="true"
                align="center"
                prop="specification"
            ></el-table-column>
            <el-table-column
                label="生产企业"
                :show-overflow-tooltip="true"
                align="center"
                min-width="120px"
                prop="productionEnterpriseName"
            ></el-table-column>
            <el-table-column
                label="单位"
                :show-overflow-tooltip="true"
                align="center"
                prop="unit"
            >
                <template slot-scope="{ row }">
                    <span>{{ row.unit }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="税率"
                :show-overflow-tooltip="true"
                align="center"
                prop="tax"
            ></el-table-column>
            <el-table-column
                label="批号"
                :show-overflow-tooltip="true"
                align="center"
                prop="lotNo"
                min-width="100px"
            ></el-table-column>
            <el-table-column
                label="库存数量"
                :show-overflow-tooltip="true"
                align="center"
                prop="stockQty"
            ></el-table-column>
            <el-table-column
                label="退货数量"
                :show-overflow-tooltip="true"
                align="center"
                prop="returnQty"
            ></el-table-column>
            <el-table-column
                label="单价"
                :show-overflow-tooltip="true"
                align="center"
                prop="returnPrice"
                min-width="110"
            ></el-table-column>
            <el-table-column
                label="零售价"
                :show-overflow-tooltip="true"
                align="center"
                prop="retailPrice"
                min-width="110"
            ></el-table-column>
            <el-table-column
                label="退货金额"
                :show-overflow-tooltip="true"
                align="center"
                prop="returnAmount"
                min-width="110"
            >
				<template slot-scope="{ row }">
					{{ row.returnAmount | formatMoney }}
				</template>
			</el-table-column>
            <el-table-column
                label="零售金额"
                :show-overflow-tooltip="true"
                align="center"
                prop="retailAmount"
                min-width="110"
            >
				<template slot-scope="{ row }">
					{{ row.retailAmount | formatMoney }}
				</template>
			</el-table-column>
            <el-table-column
                label="生产日期"
                :show-overflow-tooltip="true"
                align="center"
                prop="productionDate"
                min-width="110"
            ></el-table-column>
            <el-table-column
                label="有效期至"
                :show-overflow-tooltip="true"
                align="center"
                prop="expireDate"
                min-width="110"
            ></el-table-column>
            <el-table-column
                label="批次号"
                :show-overflow-tooltip="true"
                align="center"
                prop="batchNo"
                min-width="140"
            ></el-table-column>
            <el-table-column
                label="入库单号"
                :show-overflow-tooltip="true"
                align="center"
                prop="inboundOrderNo"
                min-width="140"
            ></el-table-column>
            <el-table-column
                label="采购单价"
                :show-overflow-tooltip="true"
                align="center"
                prop="purchasePrice"
                min-width="110"
            ></el-table-column>
            <el-table-column
                label="库存金额"
                :show-overflow-tooltip="true"
                align="center"
                prop="stockAmount"
                min-width="110"
            >
				<template slot-scope="{ row }">
					{{ row.stockAmount | formatMoney }}
				</template>
			</el-table-column>
            <el-table-column
                label="成本单价"
                :show-overflow-tooltip="true"
                align="center"
                prop="costPrice"
                min-width="110"
            ></el-table-column>
            <el-table-column
                label="成本金额"
                :show-overflow-tooltip="true"
                align="center"
                prop="costAmount"
                min-width="110"
            >
				<template slot-scope="{ row }">
					{{ row.costAmount | formatMoney }}
				</template>
			</el-table-column>
            <el-table-column
                label="备注"
                :show-overflow-tooltip="true"
                align="center"
                prop="detailRemark"
                min-width="100"
            ></el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    name: 'OrderDetail',
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
        }
    },
    data() {
        return {
            tableKey: 0,
            loading: false
        };
    }
};
</script>
<style lang="scss" scoped>
.detail-container {
    padding: 20px 0;
}
</style>