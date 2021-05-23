<template>
    <div class="app-container record-container">
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
                <el-form-item label="科室">
                    <el-autocomplete
                        @keyup.enter.native="search"
                        v-model="queryParams.departmentName"
                        class="filter-item search-item"
                        :fetch-suggestions="departmentNameQuerySearch"
                        placeholder="科室"
                        @select="search"
                        @clear="search"
                        clearable
                        highlight-first-item
                        popper-class="form-select-panel"
                        :popper-append-to-body="false"
                    >
                        <template slot-scope="{ item }">
                            <div class="sel-cell wd80">
                                {{ item.code }}
                            </div>
                            <div class="sel-cell wd80 fellip">
                                {{ (item.value = item.name) }}
                            </div>
                            <div class="sel-cell wd80">
                                {{ item.shorthandCode }}
                            </div>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item label="医生">
                    <el-autocomplete
                        @keyup.enter.native="search"
                        v-model="queryParams.physician"
                        class="filter-item search-item"
                        :fetch-suggestions="physicianQuerySearch"
                        placeholder="医生"
                        @select="search"
                        @clear="search"
                        clearable
                        highlight-first-item
                        popper-class="form-select-panel"
                        :popper-append-to-body="false"
                    >
                        <template slot-scope="{ item }">
                            <div class="sel-cell wd80">
                                {{ item.code }}
                            </div>
                            <div class="sel-cell wd80 fellip">
                                {{ (item.value = item.name) }}
                            </div>
                            <div class="sel-cell wd80">
                                {{ item.shorthandCode }}
                            </div>
                        </template>
                    </el-autocomplete>
                </el-form-item>
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
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                        placeholder="处方号"
                        class="filter-item search-item"
                    />
                </el-form-item>
                <el-form-item label="患者">
                    <el-input
                        v-model="queryParams.patientName"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                        placeholder="患者"
                        class="filter-item search-item"
                    />
                </el-form-item>

                <el-form-item label="门诊/病房">
                    <el-select
                        v-model="queryParams.isWard"
                        @change="search"
                        clearable
                        filterable
                        placeholder="请选择"
                        class="filter-item search-item"
                        default-first-option
                    >
                        <el-option label="门诊" :value="2"></el-option>
                        <el-option label="病房" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工艺" prop="technologyId">
                    <el-select
                        v-model="queryParams.technologyName"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                        @change="search"
                        class="filter-item search-item"
                    >
                        <el-option
                            v-for="item in carfts"
                            :key="item.enumId"
                            :label="item.name"
                            :value="item.name"
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
                        <el-button type="info" plain :loading="exportLoading">
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
                    min-width="140"
                    prop="orgName"
                ></el-table-column>
                <el-table-column
                    label="科室"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="departmentName"
                ></el-table-column>
                <el-table-column
                    label="医生"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="physician"
                ></el-table-column>
                <el-table-column
                    label="处方号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="prescriptionNumber"
                ></el-table-column>
                <el-table-column
                    label="流水号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="orderNo"
                ></el-table-column>
                <el-table-column
                    label="处方状态"
                    min-width="100px"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="orderStatus"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.orderStatus | flOrderStatusName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="患者"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="patientName"
                ></el-table-column>
                <el-table-column
                    label="工艺"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="technologyName"
                ></el-table-column>
                <el-table-column
                    label="付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="doseNum"
                >
                    <template slot-scope="{ row }">
                        {{ row.doseNum | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="味数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="flavourNumber"
                >
                    <template slot-scope="{ row }">
                        {{ row.flavourNumber | formatMoney(0) }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="门诊/病房"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="90"
                    prop="isWard"
                    ><template slot-scope="{ row }">
                        <span>{{ row.isWard }}</span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="代煎费"
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
                    </template>
                </el-table-column>
                <el-table-column
                    label="金额"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="totalAmount"
                    min-width="100px"
                >
                    <template slot-scope="{ row }">
                        {{ row.totalAmount | formatMoney }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="录入时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="createTime"
                ></el-table-column>
                <el-table-column
                    label="计价员"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="creator"
                ></el-table-column>
                <el-table-column
                    label="收费时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="collectionTime"
                ></el-table-column>
                <el-table-column
                    label="收费人"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="cashier"
                ></el-table-column>
                <el-table-column
                    label="审方时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="reviewTime"
                ></el-table-column>
                <el-table-column
                    label="审方人"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="reviewer"
                ></el-table-column>
                <el-table-column
                    label="调剂开始时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="dispenserStartTime"
                ></el-table-column>
                <el-table-column
                    label="调剂完成时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="dispenserFinishTime"
                ></el-table-column
                ><el-table-column
                    label="调剂员"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="130px"
                    prop="dispenser"
                ></el-table-column>
                <el-table-column
                    label="复核时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="checkTime"
                ></el-table-column>
                <el-table-column
                    label="复核员"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="checker"
                ></el-table-column>
                <el-table-column
                    label="包装时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="packingTime"
                ></el-table-column>
                <el-table-column
                    label="称重包装员"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="130px"
                    prop="weigher"
                ></el-table-column>
                <el-table-column
                    label="煎药登记时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="decoctRegistrationTime"
                ></el-table-column>
                <el-table-column
                    label="煎药开始时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="decoctingPotTime"
                ></el-table-column>
                <el-table-column
                    label="煎药完成时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="decoctingTime"
                ></el-table-column
                ><el-table-column
                    label="煎药人"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="decoctingPotPerson"
                ></el-table-column>
                <el-table-column
                    label="加工登记时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="processingRegisterTime"
                ></el-table-column>
                <el-table-column
                    label="加工开始时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="processingStartTime"
                ></el-table-column>
                <el-table-column
                    label="加工完成时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="processingCompleteTime"
                ></el-table-column
                ><el-table-column
                    label="加工人"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="processedPeople"
                ></el-table-column>
                <el-table-column
                    label="送货时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="postTime"
                ></el-table-column>
                <el-table-column
                    label="送货单号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="140px"
                    prop="invoiceOrderNo"
                ></el-table-column
                ><el-table-column
                    label="送货员"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="consigner"
                ></el-table-column>
                <el-table-column
                    label="收货时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="deliveryTime"
                ></el-table-column
                ><el-table-column
                    label="收货人"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="consignee"
                ></el-table-column>
                <el-table-column
                    label="发药时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                    prop="deliveryDrugTime"
                ></el-table-column
                ><el-table-column
                    label="发药员"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="drugUsers"
                ></el-table-column>
                <el-table-column
                    label="用时分钟"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="useTime"
                ></el-table-column>
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
import { mapState, mapGetters } from 'vuex';
export default {
    name: 'PrescriptionListStatistics',
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
            departmentOptions: [],
            flDepOpts: [],
            physicianOptions: [],
            flPhysicianOpts: []
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['drugInfArchives']),
        ...mapGetters('basic', ['orgArchives']),
        ...mapState('enum', ['carfts'])
    },
    created() {
        this.getAllDepartment();
        this.getAllPhysician();
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
                1: ' ',
                2: ' ',
                3: ' ',
                4: ' ',
                5: ' ',
                6: ' ',
                7: ' ',
                8: ' ',
                9: ' '
            };
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
                    if (index !== 3 && index !== 4) {
                        sums[index] = this.$options.filters['formatMoney'](
                            sums[index]
                        );
                    }
                    sums[index] += ' ';
                } else {
                    if (index === 3 || index === 4) {
                        sums[index] = 0;
                    } else {
                        sums[index] = '0.00';
                    }
                }
            });
            return sums;
        },
        //科室过滤下拉框
        departmentNameQuerySearch(queryString, cb) {
            var results = queryString
                ? this.departmentOptions.filter((item) => {
                    if (
                        !!~item.code.indexOf(queryString) ||
                          !!~item.name.indexOf(queryString)
                    ) {
                        return true;
                    }
                })
                : Object.assign(this.departmentOptions);
            cb(results);
        },
        //医生过滤下拉框
        physicianQuerySearch(queryString, cb) {
            var results = queryString
                ? this.physicianOptions.filter((item) => {
                    if (
                        !!~item.code.indexOf(queryString) ||
                          !!~item.name.indexOf(queryString) ||
                          ~item.shorthandCode.indexOf(queryString)
                    ) {
                        return true;
                    }
                })
                : Object.assign(this.physicianOptions);
            cb(results);
        },
        //获取所有科室
        getAllDepartment() {
            this.$api.basic_baseDepartment_all().then((res) => {
                let { result } = res.data;
                this.flDepOpts = this.departmentOptions = result;
            });
        },
        //获取所有医生
        getAllPhysician() {
            this.$api.basic_basePhysician_all().then((res) => {
                let { result } = res.data;
                this.flPhysicianOpts = this.physicianOptions = result;
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
            let exportRes = await this.$api.report_prescriptionReport_prescriptionListStatisticsExcel(
                params,
                `处方清单查询_${new Date().getTime()}.xlsx`
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
                .report_prescriptionReport_getPrescriptionListStatistics(params)
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
.record-container {
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
