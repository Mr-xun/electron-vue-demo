<template>
	<div class="detail-container">
		<u-table
			ref="table"
			v-loading="loading"
			:key="tableKey"
			:data="detail"
			use-virtual
			border
			fit
			:header-cell-style="{ background: '#eef1f6', color: '#606266' }"
			stripe
			:max-height="tableHeight"
			:row-height="40"
			style="width: 100%"
		>
			<u-table-column
				label="序号"
				type="index"
				width="50"
				align="center"
			></u-table-column>
			<u-table-column
				align="center"
				prop="itemCode"
				min-width="100px"
				:show-overflow-tooltip="true"
				label="商品编码"
			></u-table-column>
			<u-table-column
				align="center"
				prop="itemName"
				label="商品名称"
				:show-overflow-tooltip="true"
				min-width="120px"
			></u-table-column>
			<u-table-column
				align="center"
				prop="itemShortCode"
				label="速记码"
				:show-overflow-tooltip="true"
			></u-table-column
			><u-table-column
				align="center"
				prop="specification"
				label="规格"
				:show-overflow-tooltip="true"
			></u-table-column>
			<u-table-column
				align="center"
				prop="name"
				label="单位"
				:show-overflow-tooltip="true"
			>
				<template slot-scope="{ row }">
					<span>{{ row.unit }}</span>
				</template>
			</u-table-column>
			<u-table-column
				align="center"
				prop="itemLocation"
				label="货位"
			></u-table-column>
			<u-table-column
				align="center"
				prop="productionEnterpriseName"
				label="生产企业"
				min-width="160px"
			></u-table-column>
			<u-table-column
				align="center"
				prop="stockQty"
				label="库存数量"
				min-width="100px"
			></u-table-column>
			<u-table-column
				align="center"
				prop="lotNo"
				label="批号"
				min-width="100px"
			></u-table-column>
			<u-table-column
				label="生产日期"
				:show-overflow-tooltip="true"
				align="center"
				prop="productionDate"
				min-width="110"
			></u-table-column>
			<u-table-column
				label="有效期至"
				:show-overflow-tooltip="true"
				align="center"
				prop="expireDate"
				min-width="110"
			></u-table-column>
			<u-table-column
				label="成本价"
				:show-overflow-tooltip="true"
				align="center"
				prop="stockCostPrice"
				min-width="110"
			></u-table-column>
			<u-table-column
				label="实际成本金额"
				:show-overflow-tooltip="true"
				align="center"
				prop="actualCostAmount"
				min-width="110"
			>
				<template slot-scope="{ row }">
					{{ row.actualCostAmount | formatMoney }}
				</template>
			</u-table-column>
			<u-table-column
				label="零售价"
				:show-overflow-tooltip="true"
				align="center"
				prop="retailPrice"
				min-width="110"
			></u-table-column>
			<u-table-column
				label="实际零售金额"
				:show-overflow-tooltip="true"
				align="center"
				prop="actualRetailAmount"
				min-width="110"
			>
				<template slot-scope="{ row }">
					{{ row.actualRetailAmount | formatMoney }}
				</template>
			</u-table-column>
			<u-table-column
				align="center"
				prop="actualQty"
				label="实盘数量"
				min-width="120px"
			></u-table-column>
			<u-table-column
				align="center"
				prop="qtyDifference"
				label="数量差"
				min-width="120px"
			></u-table-column>
			<u-table-column
				align="center"
				prop="retailAmountDifference"
				label="零售金额差"
				min-width="120px"
			>
				<template slot-scope="{ row }">
					{{ row.retailAmountDifference | formatMoney }}
				</template>
			</u-table-column>
			<u-table-column
				align="center"
				prop="costAmountDifference"
				label="成本金额差"
				min-width="120px"
			>
				<template slot-scope="{ row }">
					{{ row.costAmountDifference | formatMoney }}
				</template>
			</u-table-column>
		</u-table>
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
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tableKey: 0
        };
    }
};
</script>
<style lang="scss" scoped>
</style>