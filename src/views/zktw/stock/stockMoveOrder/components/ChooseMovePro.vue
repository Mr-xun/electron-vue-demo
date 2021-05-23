<template>
	<el-dialog
		title="增加商品"
		v-el-drag-dialog
		:width="width"
		top="10px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:visible.sync="isVisible"
		class="add-st-pro-products"
	>
		<div class="add-filter-container">
			<el-form
				ref="form"
				:inline="true"
				:model="searchForm"
				label-width="80px"
			>
				<el-form-item label="搜索条件">
					<el-select
						size="mini"
						style="width: 140px"
						v-model="searchForm.select"
						@change="chooseContent"
						clearable
					>
						<el-option
							label="商品名称"
							value="itemName"
						></el-option>
						<el-option
							label="商品编码"
							value="itemCode"
						></el-option>
						<el-option
							label="速记码"
							value="shorthandCode"
						></el-option>
						<el-option label="批号" value="lotNo"></el-option>
					</el-select>
					<el-input
						v-if="searchForm.inputShow"
						v-model="searchForm.value"
						size="mini"
						style="width: 184px; margin-left: 10px"
						:disabled="disInput"
						clearable
						:placeholder="placeholder"
						@keyup.enter.native="search"
					></el-input>
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
				label="序号"
				type="index"
				width="50"
				align="center"
			></el-table-column>
			<el-table-column
				label="商品编码"
				min-width="100px"
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
				label="批号"
				min-width="100"
				:show-overflow-tooltip="true"
				align="center"
				prop="lotNo"
			></el-table-column>
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
				label="移出库存数量"
				:show-overflow-tooltip="true"
				align="center"
				prop="moveOutStockQty"
				min-width="110"
			></el-table-column>
			<el-table-column
				label="移入库存数量"
				:show-overflow-tooltip="true"
				align="center"
				prop="moveInStockQty"
				min-width="110"
			></el-table-column>
			<el-table-column
				label="操作"
				align="center"
				min-width="260px"
				class-name="small-padding fixed-width"
				fixed="right"
			>
				<template slot-scope="{ row }">
					<el-input-number
						size="mini"
						:min="0"
						:max="row.moveOutStockQty"
						v-model="row.qty"
					></el-input-number>
					<el-button
						type="success"
						size="mini"
						plain
						@click="addGood(row)"
						>加入移库单</el-button
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
			<el-button type="primary" plain @click="isVisible = false"
				>确定</el-button
			>
		</div>
	</el-dialog>
</template>
<script>
import Pagination from '@/components/Pagination';
export default {
    name: 'StockBatchProAdd',
    components: { Pagination },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        moveInWarehouseId: {
            default: ''
        },
        moveOutWarehouseId: {
            default: ''
        }
    },
    data() {
        return {
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
                value: '',
                timeRange: []
            },
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

    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    methods: {
        chooseContent(value) {
            this.disInput = value ? false : true;
            this.searchForm.timeRange = [];
            this.searchForm.value = '';
            switch (value) {
            case 'itemName':
                this.placeholder = '请输入商品名称';
                this.searchForm.inputShow = true;
                break;
            case 'itemCode':
                this.placeholder = '请输入商品编号';
                this.searchForm.inputShow = true;
                break;
            case 'shorthandCode':
                this.placeholder = '请输入速记码';
                this.searchForm.inputShow = true;
                break;
            case 'lotNo':
                this.placeholder = '请输入批号';
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
            this.reset();
            this.$emit('close');
        },
        addGood(row) {
            row.qtyTipShow = false;
            row.returnPrice = row.price;
            row.stockQty = row.qty;
            row.stockAmount = row.amount;
            row.detailRemark = '';
            this.$emit('addGood', JSON.parse(JSON.stringify(row)));
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
            this.searchForm.timeRange = [];
            this.$refs.table.clearFilter();
            this.search();
        },
        fetch() {
            let params = {
                moveInWarehouseId: this.moveInWarehouseId,
                moveOutWarehouseId: this.moveOutWarehouseId,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num
            };
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            if (this.searchForm.select) {
                params[this.searchForm.select] = this.searchForm.value;
            }
            this.loading = true;
            this.$api
                .stock_stockMoveOrder_warehouseGoodsList(params)
                .then(r => {
                    let { result } = r.data;
                    this.total = result.total;
                    result.rows.forEach(item => {
                        //移出库存大于1000赋值1000 否则赋值移出库存数量
                        item.qty =
							item.moveOutStockQty >= 1000
							    ? 1000
							    : item.moveOutStockQty;
                    });
                    this.list = result.rows;
                    this.loading = false;
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
.add-st-pro-products >>> .el-dialog__body {
	padding: 20px 20px 0;
}
</style>
