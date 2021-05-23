<template>
	<div class="app-container">
		<div class="filter-container">
			<el-form :inline="true" :model="queryParams" label-width="90px">
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
				<el-form-item label="煎药锅状态" placeholder="请选择" >
					<el-select
						v-model="queryParams.status"
						clearable
						filterable
						autocomplete="on"
						default-first-option
						@change="search"
						class="filter-item search-item"
					>
						<el-option label="全部" value></el-option>
						<el-option label="使用中" :value="1"></el-option>
						<el-option label="未使用" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label style="margin-left:0.75rem;">
					<el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
					<el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>

		<div class="center-container prescription-order-container">
			<el-table
				ref="table"
				:key="tableKey"
				v-loading="loading"
				:data="list"
				border
				fit
				:header-cell-style="{background:'#eef1f6',color:'#606266'}"
				stripe
				:max-height="tableHeight"
				style="width: 100%;"
			>
				<el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
				<el-table-column
					label="流水号"
					prop="flowNumber"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
				></el-table-column>
				<el-table-column
					label="处方号"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="prescriptionNum"
				></el-table-column>
				<el-table-column
					label="煎药时间"
					:show-overflow-tooltip="true"
					min-width="160px"
					align="center"
					prop="decoctTime"
				></el-table-column>
				<el-table-column
					label="付数"
					:show-overflow-tooltip="true"
					align="center"
					min-width="60px"
					prop="doseQty"
				></el-table-column>
				<el-table-column
					label="煎药锅编码"
					:show-overflow-tooltip="true"
					min-width="100px"
					align="center"
					prop="decoctCode"
				></el-table-column>
				<el-table-column
					label="小包装数量"
					:show-overflow-tooltip="true"
					min-width="100px"
					align="center"
					prop="smallPackQty"
				></el-table-column>
				<el-table-column
					label="味数"
					:show-overflow-tooltip="true"
					min-width="80px"
					align="center"
					prop="tasteQty"
				>
					<template slot-scope="{row}">
						<span>{{row.tasteQty || 0}}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="煎药锅状态"
					:show-overflow-tooltip="true"
					min-width="100px"
					align="center"
					prop="status"
				>
					<template slot-scope="{row}">
						<span>{{row.status == 1?'未使用':row.status == 2?'使用中':'--'}}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="操作"
					align="center"
					min-width="80px"
					fixed="right"
					class-name="small-padding fixed-width"
				>
					<template slot-scope="{row}" v-if="row.status ==2">
						<el-button type="text" @click="relieve(row)" v-has-permission="['relieveDecoctDrug:decoct']" >解除</el-button>
						<el-link v-has-no-permission="['relieveDecoctDrug:decoct']" class="no-perm">无权限</el-link>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-show="total>0"
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
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'DecoctDrugList',
    components: { Pagination, ExpandCollapse  },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: '',
                detailData: {}
            },
            entexpands: [],
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
        ...mapGetters(['tableHeight']),
        ...mapState({
            unitOptions: (state) => state.enum.units
        })
    },

    activated() {
        this.fetch();
    },
    methods: {
        //解除煎药锅使用状态
        relieve(row) {
            let params = {
                decoctingPotCode:row.decoctCode
            };
            this.$api.prescription_decoctingStatus_relieveDecoctDrug(params).then(res=>{
                this.$message({
                    message: '解除成功',
                    type: 'success'
                });
                this.fetch();
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
            let params = this.queryParams;
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.loading = true;
            this.$api
                .prescription_decoctingStatus_decoctDrugList(params)
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
.prescription-order-container {
	/deep/ .el-table__expand-icon {
		color: transparent;
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
.handle-icon {
	cursor: pointer;
}
</style>
