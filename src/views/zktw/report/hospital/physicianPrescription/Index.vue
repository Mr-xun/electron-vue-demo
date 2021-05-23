<template>
    <div class="app-container record-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams">
                <el-form-item label="科室">
                    <el-autocomplete
                        @keyup.enter.native="search"
                        v-model="queryParams.departmentName"
                        class="filter-item search-item"
                        :fetch-suggestions="departmentNameQuerySearch"
                        placeholder="科室"
                        @select="search"
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
                <el-form-item label="医师">
                    <el-autocomplete
                        @keyup.enter.native="search"
                        v-model="queryParams.physician"
                        class="filter-item search-item"
                        :fetch-suggestions="physicianQuerySearch"
                        placeholder="医师"
                        @select="search"
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
                <el-form-item label="创建日期">
                    <el-date-picker
						style="width: 400px"
						@change="search"
						v-model="queryParams.timeRange"
						value-format="yyyy-MM-dd HH:mm:ss"
						type="datetimerange"
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
                    min-width="120"
                    prop="orgName"
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
                    label="姓名"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="patientName"
                ></el-table-column>
                <el-table-column
                    label="性别"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="60px"
                    prop="sex"
                    ><template slot-scope="{ row }">
                        <span>{{ row.sex | flSex }}</span>
                    </template></el-table-column
                >
                <el-table-column
                    label="年龄"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="60px"
                    prop="age"
                ></el-table-column>
                <el-table-column
                    label="医生"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="physician"
                ></el-table-column>
                <el-table-column
                    label="工艺"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="technologyName"
                ></el-table-column>
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
                    label="总金额"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="totalAmount"
                    min-width="100px"
                >
                    <template slot-scope="{ row }">
                        {{ row.totalAmount | formatMoney }}
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
import { parseTime } from '@/utils';

export default {
    name: 'PhysicianPrescription',
    components: { Pagination },
    data() {
        return {
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
            departmentOptions: [],
            flDepOpts: [],
            physicianOptions: [],
            flPhysicianOpts: []
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['drugInfArchives'])
    },
    created() {
        this.getAllDepartment();
        this.getAllPhysician();
    },
    mounted() {
        this.fetch();
    },
    methods: {
        changeType(val) {
            this.search();
        },
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
        //医师过滤下拉框
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
        //获取所有医师
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
            this.queryParams.type = 1;
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
            delete params.timeRange;
            this.exportLoading = true;
            let exportRes= await this.$api.report_hospitalReport_physicianPrescriptionExcel(
                params,
                `医师处方_${new Date().getTime()}.xlsx`
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
            delete params.timeRange;
            this.loading = true;
            this.$api
                .report_hospitalReport_getPhysicianPrescription(params)
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
