<template>
    <div class="app-container report-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams">
                <el-form-item label="复核员">
                    <el-select
                        v-model="queryParams.checker"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                        @change="search"
                        class="filter-item search-item"
                    >
                        <el-option
                            v-for="item in userOptions"
                            :label="item.fullname"
                            :value="item.fullname"
                            :key="item.userId"
                        ></el-option>
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
                    label="复核员"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="checker"
                ></el-table-column>
                <el-table-column
                    label="非代煎处方数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="fdjPrescription"
                    min-width="110px"
                >
                    <template slot-scope="{ row }">
                        {{ row.fdjPrescription | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="代煎处方数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="djPrescription"
                    min-width="100px"
                >
                    <template slot-scope="{ row }">
                        {{ row.djPrescription | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="总处方数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="totalPrescriptionNum"
                >
                    <template slot-scope="{ row }">
                        {{ row.totalPrescriptionNum | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="非代煎付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="fdjDosNum"
                    min-width="110px"
                >
                    <template slot-scope="{ row }">
                        {{ row.fdjDosNum | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="代煎付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="djDosNum"
                >
                    <template slot-scope="{ row }">
                        {{ row.djDosNum | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="总付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="totalDosNum"
                >
                    <template slot-scope="{ row }">
                        {{ row.totalDosNum | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="非代煎味数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="fdjFlavourNumber"
                    min-width="110px"
                >
                    <template slot-scope="{ row }">
                        {{ row.fdjFlavourNumber | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="代煎味数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="djFlavourNumber"
                >
                    <template slot-scope="{ row }">
                        {{ row.djFlavourNumber | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="总味数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="totalFlavourNumber"
                >
                    <template slot-scope="{ row }">
                        {{ row.totalFlavourNumber | formatMoney(0) }}
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
    name: 'CheckerStatistics',
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
            userOptions: []
        };
    },
    computed: {
        ...mapGetters(['tableHeight'])
    },
    created() {
        this.getAllUser();
    },
    mounted() {
        this.fetch();
    },
    methods: {
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            const map = {
                0: '总计',
                1: ' '
            };
            let noFormatVal = [2, 3, 4, 5, 6, 7, 8, 9, 10]; //不需要处理列

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
                            return prev + curr;
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
        //获取人员
        getAllUser() {
            let params = {
                status: 1
            };
            this.$api
                .system_user_all(params)
                .then((r) => {
                    const { data } = r.data;
                    this.userOptions = data;
                })
                .catch((err) => {
                    this.userOptions = [];
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
            let exportRes= await this.$api.report_prescriptionReport_checkerStatisticsExcel(
                params,
                `复核员统计_${new Date().getTime()}.xlsx`
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
                .report_prescriptionReport_getCheckerStatistics(params)
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
