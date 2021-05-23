<template>
    <div class="app-container report-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams">
                <el-form-item label="机构名称">
                    <el-select
                        v-model="queryParams.orgId"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                        @change="search"
                        class="filter-item search-item"
                    >
                        <el-option
                            v-for="item in orgArchives"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="药品">
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
                <el-form-item label="流水号">
                    <el-input
                        v-model="queryParams.lotNo"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                        placeholder="流水号"
                        class="filter-item search-item"
                    />
                </el-form-item>
                <el-form-item label="门诊/病房" placeholder="请选择">
                    <el-select v-model="queryParams.isWard" clearable filterable autocomplete="on" default-first-option @change="search" class="filter-item search-item">
                        <el-option label="全部" value></el-option>
                        <el-option label="门诊" :value="2"></el-option>
                        <el-option label="病房" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建日期">
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
                        <el-button
                            type="info"
                            plain
                            :loading="exportLoading"
                        >
                            导出
                            <i class="el-icon-arrow-down el-icon--right" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-tooltip
                                class="item"
                                effect="light"
                                content="当前页码内容数量"
                                placement="right"
                            >
                                <el-dropdown-item
                                    @click.native="exportExcel('current')"
                                    >导出当前</el-dropdown-item
                                >
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                effect="light"
                                content="查询总计内容数量"
                                placement="right"
                            >
                                <el-dropdown-item
                                    @click.native="exportExcel('all')"
                                    >导出全部</el-dropdown-item
                                >
                            </el-tooltip>
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
                    label="机构名称"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="140px"
                    prop="orgName"
                ></el-table-column>
                <el-table-column
                    label="医生"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="physician"
                ></el-table-column>
                <el-table-column
                    label="药品编码"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="itemCode"
                ></el-table-column>
                <el-table-column
                    label="药品名称"
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
                    label="单位"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="unit"
                ></el-table-column>
                <el-table-column
                    label="数量"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="totalQty"
                    ><template slot-scope="{ row }">
                        {{ row.totalQty | formatMoney(0) }}
                    </template></el-table-column
                >
                <el-table-column
                    label="金额"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="totalAmount"
                >
                    <template slot-scope="{ row }">
                        {{ row.totalAmount | formatMoney }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="代煎数量"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="decoctQty"
                >
                    <template slot-scope="{ row }">
                        {{ row.decoctQty | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="代煎金额"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="decoctTotalAmount"
                >
                    <template slot-scope="{ row }">
                        {{ row.decoctTotalAmount | formatMoney }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="非代煎数量"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="notDecoctQty"
                    min-width="110px"
                >
                    <template slot-scope="{ row }">
                        {{ row.notDecoctQty | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="非代煎金额"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="notDecoctTotalAmount"
                    min-width="100px"
                >
                    <template slot-scope="{ row }">
                        {{ row.notDecoctTotalAmount | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="代煎处方数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="decoctNum"
                    min-width="100px"
                >
                    <template slot-scope="{ row }">
                        {{ row.decoctNum | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="非代煎处方数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="notDecoctNum"
                    min-width="110px"
                >
                    <template slot-scope="{ row }">
                        {{ row.notDecoctNum | formatMoney(0) }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="总处方数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="totalPrescriptionOrder"
                >
                    <template slot-scope="{ row }">
                        {{ row.totalPrescriptionOrder | formatMoney(0) }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="代煎付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="decoctDose"
                >
                    <template slot-scope="{ row }">
                        {{ row.decoctDose | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="非代煎付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="notDecoctDose"
                    min-width="110px"
                >
                    <template slot-scope="{ row }">
                        {{ row.notDecoctDose | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="总付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="totalDose"
                >
                    <template slot-scope="{ row }">
                        {{ row.totalDose | formatMoney(0) }}
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
import { mapGetters } from 'vuex';
export default {
    name: 'HospitalDoctorDrugStatistics',
    components: { Pagination },
    data() {
        return {
            exportLoading: false,

            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            pagination: {
                size: 10,
                num: 1
            },
            allDurgOptions: [],
            durgOptions: []
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['drugInfArchives']),
        ...mapGetters('basic', ['orgArchives'])
    },
    created() {
        // this.getAllDrug();
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
                6: ' '
            };
            let noFormatVal = [7, 9, 11, 13, 14, 15, 16, 17, 18, 19]; //不需要处理列
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
                    if (noFormatVal.indexOf(index) == -1) {
                        sums[index] = this.$options.filters['formatMoney'](
                            sums[index]
                        );
                    }
                    sums[index] += ' ';
                } else {
                    if (noFormatVal.indexOf(index) > -1) {
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
        search() {
            this.durgOptions = Object.assign(this.allDurgOptions);
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.pagination.num = 1;
            this.queryParams = {};
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
            let exportRes= await this.$api.report_prescriptionReport_hospitalDoctorDrugStatisticsExcel(
                params,
                `医院医生药品统计汇总_${new Date().getTime()}.xlsx`
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
                .report_prescriptionReport_getHospitalDoctorDrugStatistics(
                    params
                )
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
.report-container {
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
