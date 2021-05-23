<template>
    <el-dialog title="增加商品" v-el-drag-dialog :width="width" top="10px" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="isVisible" class="add-products">
        <div class="add-filter-container">
            <el-form ref="form" :inline="true" :model="searchForm" label-width="80px">
                <el-form-item label="搜索条件">
                    <el-select size="mini" style="width: 140px" v-model="searchForm.select" @change="chooseContent" clearable>
                        <el-option label="商品编码" value="itemCode"></el-option>
                        <el-option label="商品名称" value="itemName"></el-option>
                        <el-option label="供应商" value="supplierName"></el-option>
                        <el-option label="库房" value="warehouseName"></el-option>
                        <el-option label="入库单号" value="inboundOrderNo"></el-option>
                        <el-option label="单据日期" value="orderDate"></el-option>
                    </el-select>
                    <el-input v-if="searchForm.inputShow" v-model="searchForm.value" size="mini" style="width: 184px; margin-left: 10px" :disabled="disInput" clearable :placeholder="placeholder" @keyup.enter.native="search"></el-input>
                    <el-date-picker v-else size="mini" style="width: 280px" v-model="searchForm.timeRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item search-item" @change="search"></el-date-picker>
                </el-form-item>
                <el-form-item label=" " label-width="10px">
                    <el-button class="filter-item" size="mini" type="primary" plain @click="search">搜索</el-button>
                    <el-button class="filter-item" size="mini" type="warning" plain @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table ref="table" v-loading="loading" :data="list" border fit stripe style="width: 100%" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="商品编码" min-width="100px" prop="itemCode" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column label="商品名称" :show-overflow-tooltip="true" align="center" min-width="120px" prop="itemName"></el-table-column>
            <el-table-column label="规格" :show-overflow-tooltip="true" align="center" prop="specification"></el-table-column>
            <el-table-column label="生产企业" :show-overflow-tooltip="true" align="center" min-width="120px" prop="productionEnterpriseName"></el-table-column>

            <el-table-column label="仓库名称" :show-overflow-tooltip="true" align="center" min-width="130" prop="warehouseName"></el-table-column>
            <el-table-column label="库存数量" :show-overflow-tooltip="true" align="center" prop="qty" min-width="100"></el-table-column>
            <el-table-column label="单位" :show-overflow-tooltip="true" align="center" prop="unit" min-width="80">
                <template slot-scope="{ row }">
                    <span>{{ row.unit }}</span>
                </template>
            </el-table-column>
            <el-table-column label="税率" :show-overflow-tooltip="true" align="center" prop="tax" min-width="80"></el-table-column>
            <el-table-column label="批号" :show-overflow-tooltip="true" align="center" prop="lotNo" min-width="100"></el-table-column>
            <el-table-column label="退货单价" :show-overflow-tooltip="true" align="center" prop="price" min-width="80"><template slot-scope="{ row }">
                    {{ row.price }}
                </template></el-table-column>
            <el-table-column label="零售价" :show-overflow-tooltip="true" align="center" prop="retailPrice" min-width="80"><template slot-scope="{ row }">
                    {{ row.retailPrice }}
                </template>
            </el-table-column>
            <el-table-column label="生产日期" :show-overflow-tooltip="true" align="center" prop="productionDate" min-width="110"></el-table-column>
            <el-table-column label="有效期至" :show-overflow-tooltip="true" align="center" prop="expireDate" min-width="110"></el-table-column>
            <el-table-column label="批次号" :show-overflow-tooltip="true" align="center" prop="batchNo" min-width="140"></el-table-column>
            <el-table-column label="入库单号" :show-overflow-tooltip="true" align="center" prop="inboundOrderNo" min-width="150"></el-table-column>
            <el-table-column label="采购单价" :show-overflow-tooltip="true" align="center" prop="purchasePrice" min-width="80"></el-table-column>
            <el-table-column label="库存金额" :show-overflow-tooltip="true" align="center" prop="amount" min-width="110">
                <template slot-scope="{ row }">
                    {{ row.amount | formatMoney }}
                </template>
            </el-table-column>
            <el-table-column label="成本单价" :show-overflow-tooltip="true" align="center" prop="costPrice" min-width="80"></el-table-column>
            <el-table-column label="操作" align="center" min-width="260px" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="{ row }">
                    <el-input-number size="mini" :min="0" :max="row.qty" v-model="row.returnQty"></el-input-number>
                    <el-button type="success" size="mini" plain @click="addGood(row)">加入订单</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="fetch" />
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" plain @click="isVisible = false">确定</el-button>
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
                this.reset();
                this.close();
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.fetch();
            }
        }
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
        chooseContent(value) {
            this.disInput = value ? false : true;
            this.searchForm.timeRange = [];
            this.searchForm.value = '';
            switch (value) {
            case 'itemCode':
                this.placeholder = '请输入商品编码';
                this.searchForm.inputShow = true;
                break;
            case 'itemName':
                this.placeholder = '请输入商品名称';
                this.searchForm.inputShow = true;
                break;
            case 'supplierName':
                this.placeholder = '请输入供应商';
                this.searchForm.inputShow = true;
                break;
            case 'warehouseName':
                this.placeholder = '请输入库房';
                this.searchForm.inputShow = true;
                break;
            case 'orderDate':
                this.placeholder = '请选择日期';
                this.searchForm.inputShow = false;
                break;
            case 'inboundOrderNo':
                this.placeholder = '入库单号';
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
            row.returnQtyTipShow = false;
            row.returnPrice = row.price || 0;
            row.stockQty = row.qty;
            row.stockAmount = row.amount || 0;
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
            this.search();
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        fetch(params = {}) {
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            if (this.searchForm.select) {
                params[this.searchForm.select] = this.searchForm.value;
            }
            if (this.searchForm.timeRange) {
                params.startTime = this.searchForm.timeRange[0];
                params.endTime = this.searchForm.timeRange[1];
            }
            this.loading = true;
            this.$api
                .order_stockBatch_list(params)
                .then(r => {
                    let { result } = r.data;
                    this.total = result.total;
                    result.rows.forEach(item => {
                        item.returnQty = 1;
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
.add-products >>> .el-dialog__body {
    padding: 20px 20px 0;
}
</style>
