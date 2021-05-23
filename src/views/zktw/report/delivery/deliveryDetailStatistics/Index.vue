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
                <el-form-item label="送货人">
                    <el-select
                        v-model="queryParams.deliverymanCode"
                        filterable
                        clearable
                        @change="search"
                        placeholder="请选择"
                        class="filter-item search-item"
                    >
                        <el-option
                            v-for="item in userOptions"
                            :label="item.fullname"
                            :value="item.code"
                            :key="item.userId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="送货单号">
                    <el-input
                        v-model="queryParams.orderNo"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                        placeholder="送货单号"
                        class="filter-item search-item"
                    />
                </el-form-item>
                <el-form-item label="流水号">
                    <el-input
                        v-model="queryParams.prescriptionOrderNo"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                        placeholder="流水号"
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
                <el-form-item label="单据日期">
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
                show-summary
                :summary-method="getSummaries"
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
                    label="日期"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="110px"
                    prop="date"
                ></el-table-column>
                <el-table-column
                    label="送货单号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="140px"
                    prop="orderNo"
                ></el-table-column>
                <el-table-column
                    label="线路名称"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="180px"
                    prop="routingName"
                ></el-table-column>
                <el-table-column
                    label="送货员编码"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="deliverymanCode"
                ></el-table-column>
                <el-table-column
                    label="送货员"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="deliveryman"
                ></el-table-column>

                <el-table-column
                    label="机构总数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="orgNum"
                    min-width="100px"
                ></el-table-column>
                <el-table-column
                    label="线路基础分值"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="routingBaseIntegral"
                    min-width="110px"
                    ><template slot-scope="{ row }">
                        {{ row.routingBaseIntegral | formatMoney }}
                    </template></el-table-column
                >
                <el-table-column
                    label="分值"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="integral"
                    min-width="80px"
                    ><template slot-scope="{ row }">
                        {{ row.integral | formatMoney }}
                    </template></el-table-column
                >
                <el-table-column
                    label="机构名称"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="orgName"
                    min-width="140px"
                ></el-table-column>
                <el-table-column
                    label="处方号"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="prescriptionNumber"
                    min-width="100px"
                ></el-table-column>
                <el-table-column
                    label="流水号"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="prescriptionOrderNo"
                    min-width="140px"
                ></el-table-column>
                <el-table-column
                    label="患者姓名"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="patientName"
                    min-width="100px"
                ></el-table-column>
                <el-table-column
                    label="工艺"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="processingTechnic"
                    min-width="100px"
                ></el-table-column>
                <el-table-column
                    label="付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="doseNum"
                    min-width="80px"
                >
                    <template slot-scope="{ row }">
                        {{ row.doseNum | formatMoney(0) }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="送货上门"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="toDoor"
                    min-width="80px"
                ></el-table-column>
                <el-table-column
                    label="收货人"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="deliveryReceiver"
                    min-width="100px"
                ></el-table-column>
                <el-table-column
                    label="联系电话"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="deliveryTel"
                    min-width="110px"
                ></el-table-column>
                <el-table-column
                    label="地址"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="deliveryAddress"
                    min-width="200px"
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
import { mapGetters } from 'vuex';
export default {
    name: 'DeliveryDetailStatistics',
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
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['orgArchives'])
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
                15: ' ',
                16: ' ',
                17: ' ',
                18: ' '
            };
            let noFormatVal = [14]; //不需要处理列
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
        //获取物流人员
        getAllUser() {
            let params = {
                isLogisticsPersonnel: 1,
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
            let exportRes = await this.$api.report_deliveryReport_deliveryDetailStatisticsExcel(
                params,
                `送货明细查询_${new Date().getTime()}.xlsx`
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
                .report_deliveryReport_getDeliveryDetailStatistics(params)
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
