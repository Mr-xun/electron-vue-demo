<template>
    <div class="app-container purchase-inboundrecord-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams">
                <el-form-item label="商品">
                    <el-select
                        :filter-method="filterDrugsOpts"
                        v-model="queryParams.itemCode"
                        @change="search"
                        clearable
                        filterable
                        placeholder="请选择"
                        class="filter-item search-item"
                        popper-class="form-select-panel"
                        :popper-append-to-body="false"
                        default-first-option
                    >
                        <el-option
                            v-for="item in durgOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.code"
                        >
                            <div class="sel-tr">
                                <div class="sel-cell cl-code wd100">
                                    {{ item.code }}
                                </div>
                                <div class="sel-cell cl-name wd100">
                                    {{ item.name }}
                                </div>
                                <div class="sel-cell cl-std wd100">
                                    {{ item.shorthandCode }}
                                </div>
                            </div>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="供应商">
                    <el-select
                        :filter-method="filterSupplierOpts"
                        v-model="queryParams.supplierCode"
                        @change="search"
                        clearable
                        filterable
                        placeholder="请选择"
                        class="filter-item search-item"
                        popper-class="form-select-panel"
                        :popper-append-to-body="false"
                        default-first-option
                    >
                        <el-option
                            v-for="item in supplierOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.code"
                        >
                            <div class="sel-tr">
                                <div class="sel-cell cl-code wd100">
                                    {{ item.code }}
                                </div>
                                <div class="sel-cell cl-name wd100">
                                    {{ item.name }}
                                </div>
                            </div>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="批号">
                    <el-input
                        v-model="queryParams.lotNo"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                        placeholder="批号"
                        class="filter-item search-item"
                    />
                </el-form-item>
                <el-form-item label="业务类型">
                    <el-select
                        v-model="queryParams.orderTypes"
                        clearable
                        filterable
                        multiple
                        collapse-tags
                        autocomplete="on"
                        default-first-option
                        @change="search"
                        class="filter-item search-item"
                    >
						<el-option label="移入" :value="5010"></el-option>
                        <el-option label="移出" :value="5020"></el-option>
						<el-option label="盘盈" :value="3010"></el-option>
                        <el-option label="盘亏" :value="3020"></el-option>
                        <el-option label="销售出库" :value="2020"></el-option>
                        <el-option label="采购入库" :value="1010"></el-option>
                        <el-option label="采购退货" :value="4020"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker
                        style="width: 340px"
                        @change="search"
                        v-model="queryParams.timeRange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange"
                        range-separator="至"
                        :default-time="['00:00:00', '23:59:59']"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="filter-item search-item"
                    ></el-date-picker>
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
                    <el-dropdown trigger="click" class="filter-item">
                        <el-button type="info" plain :loading="exportLoading">
                            导出
                            <i class="el-icon-arrow-down el-icon--right" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                @click.native="exportExcel('current')"
                                >导出当前</el-dropdown-item
                            >
                            <el-dropdown-item @click.native="exportExcel('all')"
                                >导出全部</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
            </el-form>
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
                show-summary
                :summary-method="getSummaries"
                style="width: 100%"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="机构ID"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="70"
                    prop="orgId"
                ></el-table-column>
                <el-table-column
                    label="创建日期"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="110"
                    prop="createTime"
                ></el-table-column>
                <el-table-column
                    label="业务类型"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="orderTypeName"
                ></el-table-column>
                <el-table-column
                    label="单据编号"
                    prop="orderNo"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                ></el-table-column>
                <el-table-column
                    label="行号"
                    min-width="70px"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="rid"
                ></el-table-column>
                <el-table-column
                    label="库房名称"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="warehouseName"
                ></el-table-column>
                <el-table-column
                    label="供应商"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="supplierName"
                ></el-table-column>
                <el-table-column
                    label="商品编码"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="itemCode"
                ></el-table-column>
                <el-table-column
                    label="商品名称"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="itemName"
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
                    min-width="120"
                    prop="productionEnterpriseName"
                ></el-table-column>
                <el-table-column
                    label="批号"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="lotNo"
                    min-width="100px"
                ></el-table-column>
                <el-table-column
                    label="批次号"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="batchNo"
                    min-width="130px"
                ></el-table-column>
                <el-table-column
                    label="生产日期"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="productionDate"
                    min-width="160px"
                ></el-table-column>
                <el-table-column
                    label="有效期至"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="expireDate"
                    min-width="160px"
                ></el-table-column>
                <el-table-column
                    label="税率"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="tax"
                ></el-table-column>
                <el-table-column
                    label="数量"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="qty"
                >
                    <template slot-scope="{ row }">
                        {{ row.qty | formatMoney(0) }}
                    </template></el-table-column
                >
                <el-table-column
                    label="成本价"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="costPrice"
                ></el-table-column>
                <el-table-column
                    label="成本金额"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="costAmount"
                    min-width="100px"
                >
                    <template slot-scope="{ row }">
                        {{ row.costAmount | formatMoney }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="结余数量"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="stockBalanceQty"
                >
                    <template slot-scope="{ row }">
                        {{ row.stockBalanceQty | formatMoney(0) }}
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="total > 0"
                :total="total"
                :pageSizes="[5, 10, 20, 30, 50, 100, 200]"
                :page.sync="pagination.num"
                :limit.sync="pagination.size"
                @pagination="fetch"
            />
        </div>
    </div>
</template>

<script>
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination';
import { mapGetters } from 'vuex';
export default {
    name: 'DrugStockChangeDetail',
    components: { Pagination },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: ''
            },
            exportLoading: false,
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {
                timeRange: [
                    `${parseTime(new Date(), '{y}-{m}-{d}')} 00:00:00`,
                    `${parseTime(new Date(), '{y}-{m}-{d}')} 23:59:59`
                ]
            },
            pagination: {
                size: 10,
                num: 1
            },
            allDurgOptions: [],
            durgOptions: [],
            allSupplierOptions: [],
            supplierOptions: []
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['drugInfArchives'])
    },
    created() {
        // this.getAllDrug();
        this.getAllSupplier();
    },
    mounted() {
        this.fetch();
        this.durgOptions = this.allDurgOptions = this.drugInfArchives;
    },
    methods: {
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            const map = {
                0: '总计',
                1: ' ',
                2: ' ',
                3: ' ',
                4: ' ',
                5: ' ',
                6: ' ',
                7: ' ',
                8: ' ',
                9: ' ',
                10: ' ',
                11: ' ',
                12: ' ',
                13: ' ',
                14: ' ',
                15: ' ',
                16: ' ',
                18: ' '
            };
            function toFixedFix(num, fixed) {
                var pos = num.toString().indexOf('.'),
                    decimalPlaces = num.toString().length - pos - 1,
                    _int = num * Math.pow(10, decimalPlaces),
                    divisorOne = Math.pow(10, decimalPlaces - fixed),
                    divisorTwo = Math.pow(10, fixed);
                return Math.round(_int / divisorOne) / divisorTwo;
            }
            columns.forEach((column, index) => {
                if (map[index]) {
                    sums[index] = map[index];
                    return sums;
                }
                const values = data.map((item) =>
                    Number(item[column.property])
                );
                if (!values.every((value) => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return (
                                Number(toFixedFix(prev, 2)) +
                                Number(toFixedFix(curr, 2))
                            );
                        } else {
                            return prev;
                        }
                    }, 0);
                    if (index !== 17 && index !== 20) {
                        sums[index] = this.$options.filters['formatMoney'](
                            sums[index]
                        );
                    }
                    sums[index] += ' ';
                } else {
                    if (index === 17 || index === 20) {
                        sums[index] = 0;
                    } else {
                        sums[index] = '0.00';
                    }
                }
            });
            return sums;
        },
        //获取药品
        getAllDrug() {
            let params = {
                multiCondition: ''
            };
            this.$api
                .basic_baseDrugInf_all(params)
                .then((r) => {
                    this.durgOptions = this.allDurgOptions = r.data.result;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getAllSupplier() {
            this.$api.basic_baseSupplier_all().then((res) => {
                let { result } = res.data;
                this.supplierOptions = this.allSupplierOptions = result;
            });
        },
        filterDrugsOpts(val) {
            this.queryParams.itemCode = val;
            if (val) {
                this.durgOptions = this.allDurgOptions.filter((item) => {
                    if (
                        !!~item.name.indexOf(val) ||
                        !!~item.code.indexOf(val) ||
                        !!~item.shorthandCode
                            .toUpperCase()
                            .indexOf(val.toUpperCase())
                    ) {
                        return true;
                    }
                });
            } else {
                this.durgOptions = Object.assign(this.allDurgOptions);
            }
        },
        filterSupplierOpts(val) {
            this.queryParams.supplierCode = val;
            if (val) {
                this.supplierOptions = this.allSupplierOptions.filter(
                    (item) => {
                        if (
                            !!~item.name.indexOf(val) ||
                            !!~item.code.indexOf(val)
                        ) {
                            return true;
                        }
                    }
                );
            } else {
                this.supplierOptions = Object.assign(this.allSupplierOptions);
            }
        },
        search() {
            this.durgOptions = Object.assign(this.allDurgOptions);
            this.supplierOptions = Object.assign(this.allSupplierOptions);
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.pagination.num = 1;
            this.queryParams = {};
            this.queryParams.timeRange = [
                `${parseTime(new Date(), '{y}-{m}-{d}')} 00:00:00`,
                `${parseTime(new Date(), '{y}-{m}-{d}')} 23:59:59`
            ];
            this.fetch();
        },
        async exportExcel(type = 'current') {
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num
            };
            if (type == 'all') {
                params.pageSize = -1;
            }
            if (this.queryParams.timeRange) {
                params.startTime = this.queryParams.timeRange[0];
                params.endTime = this.queryParams.timeRange[1];
            }
            this.exportLoading = true;
            let exportRes = await this.$api.report_stockReport_drugStockChangeDetailExcel(
                params,
                `商品入出库明细_${new Date().getTime()}.xlsx`
            );
            if (exportRes === 'requestEnd') {
                this.exportLoading = false;
            }
        },
        fetch() {
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num
            };
            if (this.queryParams.timeRange) {
                params.startTime = this.queryParams.timeRange[0];
                params.endTime = this.queryParams.timeRange[1];
            }
            this.loading = true;
            this.$api
                .report_stockReport_getDrugStockChangeDetail(params)
                .then((r) => {
                    let { records, total } = r.data.result;
                    this.total = total;
                    this.list = records;
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
.purchase-inboundrecord-container {
    /deep/ .form-select-panel {
        width: auto !important;
        .sel-cell {
            display: inline-block;
            text-align: center;
            vertical-align: middle;
        }
    }
    /deep/ .table-select-panel {
        .el-select-dropdown__item {
            padding: 0px;
        }
        .el-select-dropdown__item.hover {
            background: rgb(236, 245, 255);
        }
        .sel-tr {
            font-size: 0;
            .sel-cell {
                display: inline-block;
                border-bottom: 1px solid #dfe6ec;
                border-right: 1px solid #dfe6ec;
                text-align: center;
                line-height: 34px;
                height: 34px;
                font-size: 14px;
                vertical-align: middle;
            }
        }
    }
}
</style>
