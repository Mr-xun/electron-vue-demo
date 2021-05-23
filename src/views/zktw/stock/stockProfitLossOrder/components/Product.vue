<template>
	<el-dialog
		title="增加商品库存"
		v-el-drag-dialog
		:width="width"
		top="10px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:visible.sync="isVisible"
		class="add-products"
	>
		<div class="add-filter-container">
			<el-form
				ref="form"
				:inline="true"
				:model="searchForm"
				label-width="80px"
				class
			>
				<el-form-item label="搜索条件">
					<el-select
						size="mini"
						v-model="searchForm.select"
						@change="chooseContent"
						clearable
					>
						<el-option label="商品编码" value="code"></el-option>
						<el-option label="商品名称" value="name"></el-option>
						<el-option
							label="速记码"
							value="shorthandCode"
						></el-option>
					</el-select>
					<el-input
						v-if="searchForm.inputShow"
						v-model="searchForm.value"
						size="mini"
						style="width: 184px; margin-left: 10px"
						:disabled="disInput"
						clearable
						@keyup.enter.native="search"
						:placeholder="placeholder"
					></el-input>
					<el-select
						v-else
						v-model="searchForm.selectContent"
						:placeholder="placeholder"
						size="mini"
						style="width: 184px; margin-left: 10px"
						filterable
						clearable
					>
						<el-option
							v-for="(item, index) in searchForm.content"
							:label="item.label"
							:value="item.value"
							:key="index"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label=" " label-width="10px">
					<el-button
						class="filter-item"
						size="mini"
						type="primary"
						plain
						@click="search"
						>搜索</el-button
					>
					<el-button
						class="filter-item"
						size="mini"
						type="warning"
						plain
						@click="reset"
						>重置</el-button
					>
				</el-form-item>
			</el-form>
		</div>
		<el-table
			ref="table"
			v-loading="loading"
			:data="list"
			border
			fit
			stripe
			style="width: 100%"
			:header-cell-style="{ background: '#eef1f6', color: '#606266' }"
		>
			<el-table-column
				label="商品编码"
				prop="code"
				:show-overflow-tooltip="true"
				align="center"
				min-width="100px"
			></el-table-column>
			<el-table-column
				label="商品名称"
				:show-overflow-tooltip="true"
				align="center"
				min-width="120px"
				prop="name"
			></el-table-column>
			<el-table-column
				label="速记码"
				:show-overflow-tooltip="true"
				align="center"
				prop="shorthandCode"
			></el-table-column>
			<el-table-column
				label="规格"
				:show-overflow-tooltip="true"
				align="center"
				prop="specification"
			></el-table-column>
			<el-table-column
				label="单位"
				:show-overflow-tooltip="true"
				align="center"
				prop="unit"
			>
				<template slot-scope="{ row }">
					<span>{{ row.unit | flUnitName }}</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="location"
				label="货位"
			></el-table-column>
			<el-table-column
				align="center"
				prop="price"
				label="生产企业"
				min-width="160px"
			>
				<template slot-scope="scope">
					<el-select
						style="width: 95%"
						:class="
							!scope.row.productionEnterpriseId
								? 'addpro-input__error'
								: ''
						"
						size="mini"
						clearable
						filterable
						autocomplete="on"
						default-first-option
						v-model="scope.row.productionEnterpriseId"
						@change="changeTableEnterproce($event, scope.row)"
					>
						<el-option
							v-for="item in enterpriseOptions"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="qty"
				label="库存数量"
				min-width="100px"
			>
				<template slot-scope="{ row }">
					<span>{{ row.qty || 0 }}</span>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="lotNo"
				label="批号"
				min-width="120px"
			>
				<template slot-scope="scope">
					<el-input
						:class="!scope.row.lotNo ? 'addpro-input__error' : ''"
						style="width: 85%"
						size="mini"
						v-model="scope.row.lotNo"
					></el-input>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="productionDate"
				label="生产日期"
				min-width="170px"
			>
				<template slot-scope="scope">
					<el-date-picker
						style="width: 95%"
						size="mini"
						format="yyyy-MM-dd"
						value-format="yyyy-MM-dd"
						:picker-options="ltToDay"
						v-model="scope.row.productionDate"
						@change="changeProDate(scope.row)"
						type="date"
						placeholder="选择日期"
					></el-date-picker>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="expireDate"
				label="有效期至"
				min-width="170px"
			>
				<template slot-scope="scope">
					<el-date-picker
						style="width: 95%"
						size="mini"
						:picker-options="gtToDay"
						v-model="scope.row.expireDate"
						@change="changeExpireDate(scope.row)"
						format="yyyy-MM-dd"
						value-format="yyyy-MM-dd"
						type="date"
						placeholder="选择日期"
					></el-date-picker>
				</template>
			</el-table-column>
			<el-table-column
				label="成本价"
				:show-overflow-tooltip="true"
				align="center"
				prop="costPrice"
				min-width="110"
			>
				<template slot-scope="scope">
					<el-input
						style="width: 85%"
						size="mini"
						:class="
							!scope.row.costPrice ? 'addpro-input__error' : ''
						"
						v-model="scope.row.costPrice"
						v-number-only
						@input="changeSumPrice(scope.row)"
					></el-input>
				</template>
			</el-table-column>
			<el-table-column
				label="成本金额"
				:show-overflow-tooltip="true"
				align="center"
				prop="actualCostAmount"
				min-width="110"
			>
				<template slot-scope="{ row }">
					{{ row.actualCostAmount | formatMoney }}
				</template>
			</el-table-column>
			<el-table-column
				label="零售价"
				:show-overflow-tooltip="true"
				align="center"
				prop="retailPrice"
				min-width="110"
			></el-table-column>
			<el-table-column
				label="零售金额"
				:show-overflow-tooltip="true"
				align="center"
				prop="actualRetailAmount"
				min-width="110"
			>
				<template slot-scope="{ row }">
					{{ row.actualRetailAmount | formatMoney }}
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="actualQty"
				label="实盘数量"
				min-width="120px"
			>
				<template slot-scope="scope">
					<el-input
						style="width: 85%"
						size="mini"
						v-model.number="scope.row.actualQty"
						v-number-only
						@change="changeSumPrice(scope.row)"
					></el-input>
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="qtyDifference"
				label="数量差"
				min-width="120px"
			>
				<template slot-scope="{ row }">
					<span>{{ row.qtyDifference || 0 }}</span>
				</template>
			</el-table-column>

			<el-table-column
				align="center"
				prop="retailAmountDifference"
				label="零售金额差"
				min-width="120px"
			>
				<template slot-scope="{ row }">
					{{ row.retailAmountDifference | formatMoney }}
				</template>
			</el-table-column>
			<el-table-column
				align="center"
				prop="costAmountDifference"
				label="成本金额差"
				min-width="120px"
			>
				<template slot-scope="{ row }">
					{{ row.costAmountDifference | formatMoney }}
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				min-width="120px"
				class-name="small-padding fixed-width"
				fixed="right"
			>
				<template slot-scope="{ row }">
					<el-button
						type="success"
						size="mini"
						plain
						@click="addGood(row)"
						>加入单据</el-button
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
		<div slot="footer" class="dialog-footer">
			<el-button
				type="primary"
				plain
				:loading="buttonLoading"
				@click="isVisible = false"
				>确定</el-button
			>
		</div>
		<el-dialog :visible.sync="picVisible" append-to-body>
			<el-image :src="dialogImageUrl" style="width: 100%">
				<div slot="error" class="image-slot">
					<i class="el-icon-picture-outline"></i>
				</div>
			</el-image>
		</el-dialog>
	</el-dialog>
</template>
<script>
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination';
import numberOnly from '@/directive/number-only';
export default {
    name: 'BaseProductAdd',
    components: { Pagination },
    directives: {
        numberOnly
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            ltToDay: {
                //小于当前日期
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            gtToDay: {
                //大于当前日期
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            },
            loading: false,
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            list: [],
            total: 0,
            queryParams: {},
            selection: [],
            pagination: {
                size: 5,
                num: 1
            },
            placeholder: '请选择筛选条件',
            disInput: true,
            searchForm: {
                inputShow: true,
                selectContent: '',
                value: '',
                code: '',
                erpCode: '',
                name: '',
                commonName: '',
                letterF: '',
                content: []
            },
            enterpriseOptions: [],

            picVisible: false,
            dialogImageUrl: ''
        };
    },
    computed: {
        isVisible: {
            get() {
                return this.dialogVisible;
            },
            set() {
                this.close();
            }
        }
    },
    created() {
        this.getAllProductionEnterprise();
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
        this.fetch();
    },
    methods: {
        //更改生产日期
        changeProDate(row) {
            console.log(row, 33);
            if (row.productionDate) {
                if (row.effectivityDuration) {
                    let addProDate = new Date(row.productionDate);
                    addProDate.setMonth(
                        addProDate.getMonth() + Number(row.effectivityDuration)
                    );
                    addProDate.setDate(addProDate.getDate() - 1);
                    if (!row.expireDate) {
                        this.$set(
                            row,
                            'expireDate',
                            parseTime(addProDate, '{y}-{m}-{d}')
                        );
                    }
                }
            }
        },
        //更改有效期
        changeExpireDate(row) {
            if (row.expireDate) {
                if (row.effectivityDuration) {
                    let minExpireDate = new Date(row.expireDate);
                    minExpireDate.setMonth(
                        minExpireDate.getMonth() -
							Number(row.effectivityDuration)
                    );
                    minExpireDate.setDate(minExpireDate.getDate() + 1);
                    if (!row.productionDate) {
                        this.$set(
                            row,
                            'productionDate',
                            parseTime(minExpireDate, '{y}-{m}-{d}')
                        );
                    }
                }
            }
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
            this.$set(item, 'qtyDifference', item.actualQty - item.qty); //数量差
            this.$set(
                item,
                'actualCostAmount',
                item.actualQty * item.costPrice || 0
            ); //成本金额
            this.$set(
                item,
                'actualRetailAmount',
                item.actualQty * item.retailPrice || 0
            ); //销售金额
            this.$set(
                item,
                'costAmountDifference',
                item.qtyDifference * item.costPrice || 0
            ); //成本金额差
            this.$set(
                item,
                'retailAmountDifference',
                item.qtyDifference * item.retailPrice || 0
            ); //销售金额差
        },
        changeTableEnterproce(val, row) {
            let enterpriseName = '';
            this.enterpriseOptions.forEach((item) => {
                if (item.id == val) {
                    enterpriseName = item.name;
                }
            });
            this.$set(row, 'productionEnterpriseName', enterpriseName);
        },
        getAllProductionEnterprise() {
            this.$api.basic_baseProductionEnterprise_all().then((res) => {
                this.enterpriseOptions = res.data.result;
            });
        },
        chooseContent(value) {
            this.disInput = value ? false : true;
            this.searchForm.content = [];
            this.searchForm.value = '';
            this.searchForm.selectContent = '';
            switch (value) {
            case 'code':
                this.placeholder = '请输入商品编码';
                this.searchForm.inputShow = true;
                break;
            case 'name':
                this.placeholder = '请输入商品名';
                this.searchForm.inputShow = true;
                break;
            case 'shorthandCode':
                this.placeholder = '请输入速记码';
                this.searchForm.inputShow = true;
                break;
            default:
                this.searchForm.inputShow = true;
                this.placeholder = '请选择筛选条件';
                break;
            }
        },
        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 550) {
                return '95%';
            } else if (this.screenWidth < 990) {
                return '90%';
            } else if (this.screenWidth < 1400) {
                return '80%';
            } else {
                return '70%';
            }
        },
        close() {
            this.$emit('close');
        },
        addGood(row) {
            if (row.lotNo && row.productionEnterpriseId && row.costPrice) {
                row.itemShortCode = row.shorthandCode;
                this.$emit('addGood', row);
                this.$notify({
                    title: '商品新增成功',
                    message: `${row.name}成功新增${row.qty}个`,
                    type: 'success',
                    duration: 2000
                });
                row.lotNo = '';
                row.productionEnterpriseId = '';
                row.productionEnterpriseName = '';
                row.productionDate = '';
                row.expireDate = '';
                row.costPrice = '';
                row.actualCostAmount = 0;
                row.actualRetailAmount = 0;
                row.retailAmountDifference = 0;
                row.costAmountDifference = 0;
                row.actualQty = 0;
            } else {
                this.$message({
                    message: '请填写必要信息（批号、生产企业、成本价）',
                    type: 'error'
                });
            }
        },
        search() {
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.placeholder = '请选择筛选条件';
            this.disInput = true;
            this.searchForm.select = '';
            this.searchForm.value = '';
            this.$refs.table.clearFilter();
            this.search();
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        fetch() {
            let params = {};
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            if (this.searchForm.select) {
                params[this.searchForm.select] = this.searchForm.value;
            }
            this.loading = true;
            this.$api
                .basic_baseDrugInf_listByPage(params)
                .then((r) => {
                    let { result } = r.data;
                    this.total = result.total;
                    result.rows.forEach((item) => {
                        item.qty = 0;
                    });
                    this.list = result.rows;
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
<style lang="scss" >
.addpro-input__error {
	.el-input__inner {
		border-color: #ff4949;
	}
}
.add-products >>> .el-dialog__body {
	padding: 20px 20px 0;
}
</style>
