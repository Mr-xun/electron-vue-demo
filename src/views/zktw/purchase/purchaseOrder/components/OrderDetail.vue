<template>
	<div class="detail-container">
		<el-table
			ref="table"
			:key="tableKey"
			:data="detail"
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
				label="商品编码"
				prop="itemCode"
				min-width="100px"
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
				label="税率"
				:show-overflow-tooltip="true"
				align="center"
				prop="tax"
			></el-table-column>
			<el-table-column
				label="订单数量"
				:show-overflow-tooltip="true"
				align="center"
				prop="qty"
			></el-table-column>

			<el-table-column
				label="入库数量"
				:show-overflow-tooltip="true"
				align="center"
				prop="inboundQty"
			>
				<template slot-scope="{ row }">
					<span>{{ row.inboundQty || 0 }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="取消数量"
				:show-overflow-tooltip="true"
				align="center"
				prop="cancelQty"
			>
				<template slot-scope="{ row }">
					<span>{{ row.cancelQty || 0 }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="拒收数量"
				:show-overflow-tooltip="true"
				align="center"
				prop="rejectedQty"
			>
				<template slot-scope="{ row }">
					<span>{{ row.rejectedQty || 0 }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="单价"
				:show-overflow-tooltip="true"
				align="center"
				prop="purchasePrice"
			></el-table-column>
			<el-table-column
				label="金额"
				:show-overflow-tooltip="true"
				align="center"
				prop="amount"
				min-width="90px"
			>
				<template slot-scope="{ row }">
					{{ row.amount | formatMoney }}
				</template>
			</el-table-column>
			<el-table-column
				label="零售价"
				:show-overflow-tooltip="true"
				align="center"
				prop="retailPrice"
			></el-table-column>
			<el-table-column
				label="零售金额"
				:show-overflow-tooltip="true"
				align="center"
				prop="retailAmount"
				min-width="90px"
				><template slot-scope="{ row }">
					{{ row.retailAmount | formatMoney }}
				</template>
			</el-table-column>
			<el-table-column
				label="备注"
				:show-overflow-tooltip="true"
				align="center"
				prop="detailRemark"
			></el-table-column>
		</el-table>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';

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
    },
    computed: {
        ...mapGetters('basic', ['orgArchives'])
    }
};
</script>
<style lang="scss" scoped>
</style>