<template>
	<div class="takemedicine-container">
		<div class="operate-btn" v-if="type == 1">
			<el-button
				class="filter-item"
				type="success"
				size="mini"
				plain
				@click.native="add"
				>新增</el-button
			>
		</div>
		<el-table
			ref="table"
			:key="tableKey"
			:data="tableData"
			border
			fit
			style="width: 100%"
			:header-cell-style="{ background: '#eef1f6', color: '#606266' }"
			stripe
		>
			<el-table-column
				label="顺序号"
				align="center"
				min-width="80px"
				:show-overflow-tooltip="true"
			>
				<template slot-scope="scope">
					<el-input
						size="mini"
						v-model="scope.row.serialNumber"
						v-if="type == 1"
					></el-input>
					<span v-else>{{ scope.row.serialNumber }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="机构名称"
				align="center"
				min-width="140px"
				:show-overflow-tooltip="true"
			>
				<template slot-scope="scope">
					<el-select
						v-model="scope.row.orgId"
						size="mini"
						filterable
						style="width: 100%"
                        no-data-text="无可选机构"
                        :no-match-text="scope.row.orgName"
						@change="
							getTargetName(
								$event,
								'id',
								'orgArchives',
								scope.row
							)
						"
						v-if="type == 1"
					>
						<el-option
							v-for="item in flOrgArchiveOptions"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
					<span v-else>{{ scope.row.orgId | flOrgName }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="是否执行煎药倍数"
				align="center"
				min-width="90px"
				:show-overflow-tooltip="true"
			>
				<template slot-scope="scope">
					<el-select
						size="mini"
						v-model="scope.row.isExecuteDecoctingMultiple"
						filterable
						placeholder="请选择"
						v-if="type == 1"
					>
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="2"></el-option>
					</el-select>
					<span v-else>{{
						scope.row.isExecuteDecoctingMultiple | flYesOrNo
					}}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="积分基数"
				class-name="status-col"
			>
				<template slot-scope="scope">
					<el-input-number
						size="mini"
						:min='1'
						controls-position="right"
						v-model="scope.row.integralBase"
						v-if="type == 1"
					></el-input-number>
					<span v-else>{{ scope.row.integralBase }}</span>
				</template>
			</el-table-column>
			<el-table-column
				v-if="type == 1"
				label="操作"
				align="center"
				min-width="60px"
				fixed="right"
				class-name="small-padding fixed-width"
			>
				<template slot-scope="{ row, $index }">
					<i
						class="el-icon-delete table-operation"
						style="color: #f50"
						@click="singleDelete(row, $index)"
					/>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'LinePlan',
    props: {
        type: {
            default: 0, // 0-详情 1-新增or编辑
            type: Number
        },
        tableData: {
            default: () => {
                return [];
            },
            type: Array
        }
    },
    data() {
        return {
            tableKey: 0,
            beforeOrgData: [],
            flOrgArchiveOptions: this.orgArchives
        };
    },
    created() {},
    computed: {
        ...mapGetters('basic', ['orgArchives'])
    },
    methods: {
        //初始化可选机构
        initFlOrg() {
            this.flOrgArchiveOptions = this.orgArchives;
            this.$nextTick(() => {
                this.beforeOrgData = JSON.parse(JSON.stringify(this.tableData));
            });
        },

        //过滤已选过机构
        setFlOrg() {
            this.flOrgArchiveOptions = this.orgArchives.filter(
                (item) => !this.tableData.some((ele) => ele.orgId === item.id)
            );
        },
        add() {
            this.setFlOrg();
            this.tableData.push({
                integralBase: '',
                isExecuteDecoctingMultiple: '',
                orgId: '',
                orgName: '',
                routintgName: '',
                serialNumber: ''
            });
        },
        getTargetName(val, key, options, row) {
            this[options].forEach((item) => {
                if (item[key] == val) {
                    row.orgName = item.name;
                }
            });
            let flag = this.beforeOrgData.some((v) => v.orgId == val);
            if (flag) {
                this.$message({
                    message: '已选过该机构',
                    type: 'warning'
                });
                row.orgId = '';
                row.orgName = '';
            } else {
                this.setFlOrg();
            }
            this.beforeOrgData = JSON.parse(JSON.stringify(this.tableData));
        },
        singleDelete(row, index) {
            this.$confirm('选中数据将被移除, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tableData.splice(index, 1);
                this.beforeOrgData = JSON.parse(JSON.stringify(this.tableData));
                this.setFlOrg();
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.takemedicine-container {
	.operate-btn {
		text-align: right;
		margin: 15px;
	}
}
</style>
