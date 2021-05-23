<template>
	<div class="app-container">
		<div class="filter-container">
			<el-form :inline="true" :model="queryParams" label-width="70px">
				<el-form-item label="流水号">
					<el-input
						v-model="queryParams.orderNo"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						placeholder="流水号"
						class="filter-item search-item"
					/>
				</el-form-item>
				<el-form-item label="患者">
					<el-input
						v-model="queryParams.patientName"
						clearable
						@clear="search"
						placeholder="患者"
						class="filter-item search-item"
						@keyup.enter.native="search"
					/>
				</el-form-item>
				<el-form-item label="处方号">
					<el-input
						v-model="queryParams.prescriptionNumber"
						placeholder="处方号"
						class="filter-item search-item"
						clearable
						@clear="search"
						@keyup.enter.native="search"
					/>
				</el-form-item>
				<el-form-item label="患者编号" v-show="moreQuery">
					<el-input
						v-model="queryParams.medicalRecordNumber"
						placeholder="病历号/患者卡号"
						class="filter-item search-item"
						clearable
						@clear="search"
						@keyup.enter.native="search"
					/>
				</el-form-item>
				<el-form-item
					label="医保报销"
					placeholder="请选择"
					v-show="moreQuery"
				>
					<el-select
						v-model="queryParams.isMedicalInsurance"
						clearable
						filterable
						autocomplete="on"
						default-first-option
						@change="search"
						class="filter-item search-item"
					>
						<el-option label="全部" value></el-option>
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="2"></el-option>
					</el-select>
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
			<el-divider class="more-filter">
				<i
					:class="
						moreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
					"
					@click="togglehMoreQuery"
				></i>
			</el-divider>
		</div>

		<div class="center-container">
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
			>
				<el-table-column
					label="序号"
					type="index"
					width="50"
					align="center"
				></el-table-column>
				<el-table-column
					label="流水号"
					prop="orderNo"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
				></el-table-column>
				<el-table-column
					label="处方号"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="prescriptionNumber"
				></el-table-column>
				<el-table-column
					label="患者"
					min-width="100px"
					:show-overflow-tooltip="true"
					align="center"
					prop="patientName"
				></el-table-column>
				<el-table-column
					label="订单状态"
					:show-overflow-tooltip="true"
					min-width="120px"
					align="center"
					prop="orderStatus"
				>
					<template slot-scope="{ row }">
						<span>{{ row.orderStatus | flOrderStatusName }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="付数"
					:show-overflow-tooltip="true"
					align="center"
					min-width="60px"
					prop="doseNum"
				></el-table-column>
				<el-table-column
					label="工艺"
					:show-overflow-tooltip="true"
					min-width="100px"
					align="center"
					prop="technologyName"
				></el-table-column>
				<el-table-column
					label="科室"
					:show-overflow-tooltip="true"
					min-width="120px"
					align="center"
					prop="departmentName"
				></el-table-column>
				<el-table-column
					label="医师"
					:show-overflow-tooltip="true"
					min-width="120px"
					align="center"
					prop="physician"
				></el-table-column>
				<el-table-column
					label="处方备注"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="prescriptionRemarkName"
				></el-table-column>

				<el-table-column
					label="总金额"
					:show-overflow-tooltip="true"
					align="center"
					prop="totalAmount"
					min-width="90px"
				>
					<template slot-scope="{ row }">
						{{ row.totalAmount | formatMoney }}
					</template>
				</el-table-column>
				<el-table-column
					label="煎药费"
					:show-overflow-tooltip="true"
					align="center"
					prop="totalDecoctFee"
				>
					<template slot-scope="{ row }">
						{{ row.totalDecoctFee | formatMoney }}
					</template>
				</el-table-column>
				<el-table-column
					label="药费"
					:show-overflow-tooltip="true"
					align="center"
					prop="totalMedicineAmount"
				>
					<template slot-scope="{ row }">
						{{ row.totalMedicineAmount | formatMoney }}
					</template></el-table-column
				>
				<el-table-column
					label="录入时间"
					:show-overflow-tooltip="true"
					min-width="160px"
					align="center"
					prop="createTime"
				></el-table-column>
				<el-table-column
					label="操作"
					align="center"
					min-width="140px"
					fixed="right"
					class-name="small-padding fixed-width"
				>
					<template slot-scope="{ row }">
						<el-button
							size="mini"
							type="success"
							icon="el-icon-check"
							@click="cancleConfirm(row)"
							v-has-permission="['cancleConfirm:confirm']"
							>确认取消</el-button
						>
						<el-link
							v-has-no-permission="['cancleConfirm:confirm']"
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
    name: 'CancleConfirmList',
    components: { Pagination, ExpandCollapse },
    data() {
        return {
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            selection: [],
            pagination: {
                size: 10,
                num: 1
            },
            moreQuery: false
        };
    },
    computed: {
        ...mapGetters(['tableHeight'])
    },

    activated() {
        this.fetch();
    },
    methods: {
        //取消确认
        cancleConfirm(row) {
            let params = {
                prescriptionOrderId: row.id
            };
            this.$api
                .prescription_prescriptionOrder_cancleConfirm(params)
                .then((res) => {
                    this.$message({
                        message: '取消确认成功',
                        type: 'success'
                    });
                    this.fetch();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //更多筛选条件
        togglehMoreQuery() {
            this.moreQuery = !this.moreQuery;
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
            let params = this.queryParams;
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.loading = true;
            this.$api
                .prescription_prescriptionOrder_cancleConfirmList(params)
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
