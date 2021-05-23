<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams" label-width="80px">
                <el-form-item label="处方号">
                    <el-input
                        v-model="queryParams.prescriptionNumber"
                        placeholder="处方号"
                        class="filter-item search-item"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label="患者">
                    <el-input
                        v-model="queryParams.patientName"
                        clearable
                        @clear="search"
                        placeholder="患者"
                        class="filter-item search-item"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label="工艺" prop="technologyId">
                    <el-select
                        v-model="queryParams.technologyId"
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
                            :value="Number(item.enumId)"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="流水号" v-show="moreFilter">
                    <el-input
                        v-model="queryParams.orderNo"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                        placeholder="流水号"
                        class="filter-item search-item"
                    />
                </el-form-item>
                <el-form-item
                    label="门诊/病房"
                    placeholder="请选择"
                    v-show="moreFilter"
                >
                    <el-select
                        v-model="queryParams.isWard"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                        @change="search"
                        class="filter-item search-item"
                    >
                        <el-option label="全部" value></el-option>
                        <el-option label="门诊" :value="2"></el-option>
                        <el-option label="病房" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="录入日期" v-show="moreFilter">
                    <el-date-picker
                        style="width: 435px"
                        @change="search"
                        v-model="queryParams.timeRange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        :default-time="['00:00:00', '23:59:59']"
                        range-separator="至"
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
                </el-form-item>
            </el-form>
            <el-divider class="more-filter">
                <i
                    :class="
                        moreFilter ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                    "
                    @click="showMoreFilter"
                ></i>
            </el-divider>
        </div>
        <div class="center-container prescripe-label-container">
            <div class="table-top-wrap flex-between-center">
                <div class="autoTimeChoose">
                    <div class="timeBox">
                        <div class="title">
                            <span v-if="autoTime"
                                >页面已启用定时刷新 每{{ autoTime }}(秒)</span
                            >
                            <span v-else>页面已停用定时刷新</span>
                        </div>
                        <div class="timeChoole">
                            <el-slider
                                v-model="autoTime"
                                @change="changeAutoTime"
                                :step="10"
                                :min="0"
                                :max="60"
                                show-stops
                            ></el-slider>
                        </div>
                    </div>
                </div>
                <div class="btn-color-tip flex-all-center">
                    <div class="label-print flex-cross-center">
                        <em class="bg-tag bg-tag__prescribe"></em>
                        <span class="tip-text fbold">处方打印</span>
                    </div>
                    <div class="label-print flex-cross-center">
                        <em class="bg-tag bg-tag__label"></em>
                        <span class="tip-text fbold">标签打印</span>
                    </div>
                    <div class="label-print flex-cross-center">
                        <em class="bg-tag bg-tag__todoor"></em>
                        <span class="tip-text fbold">上门签打印</span>
                    </div>
                    <div class="label-print flex-cross-center">
                        <em class="bg-tag bg-tag__prescribetag"></em>
                        <span class="tip-text fbold">处方签打印</span>
                    </div>
                </div>
            </div>
            <el-table
                ref="table"
                :key="tableKey"
                v-loading="loading"
                :data="list"
                border
                fit
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                :row-class-name="tablePrintedFlag"
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
                    prop="orgName"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                ></el-table-column>
                <el-table-column
                    label="流水号"
                    prop="orderNo"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                ></el-table-column>
                <el-table-column
                    label="处方号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="prescriptionNumber"
                ></el-table-column>
                <el-table-column
                    label="患者"
                    min-width="100px"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="patientName"
                ></el-table-column>
                <el-table-column
                    label="付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="60px"
                    prop="doseNum"
                ></el-table-column>
                <el-table-column
                    label="录入时间"
                    :show-overflow-tooltip="true"
                    min-width="160px"
                    align="center"
                    prop="createTime"
                ></el-table-column>
                <el-table-column
                    label="工艺"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="technologyName"
                ></el-table-column>
                <el-table-column
                    label="门诊/病房"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="90"
                    prop="isWard"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.isWard | flClincOrWard }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="紧急度"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="instantLevel"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.instantLevel | flUrgentName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="送货上门"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="isDeliveryToDoor"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.isDeliveryToDoor | flYesOrNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="处方打印数"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                    prop="prescriptionPrintNum"
                ></el-table-column>
                <el-table-column
                    label="标签打印数"
                    :show-overflow-tooltip="true"
                    min-width="100px"
                    align="center"
                    prop="labelPrintNum"
                ></el-table-column>
                <el-table-column
                    label="处方签打印数"
                    :show-overflow-tooltip="true"
                    min-width="110px"
                    align="center"
                    prop="prescriptionLabelPrintNum"
                ></el-table-column>
                <el-table-column
                    label="打印"
                    align="center"
                    min-width="90px"
                    fixed="right"
                    class-name="small-padding fixed-width"
                >
                    <template slot-scope="{ row }">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="处方签"
                            placement="top-start"
                        >
                            <el-button
                                circle
                                size="mini"
                                type="warning"
                                icon="el-icon-printer"
                                class="prescribe-tag-print__btn print-bn"
                                @click="prescribePrint(row)"
                                v-has-permission="['labelPrintDoor:print']"
                            ></el-button>
                        </el-tooltip>
                        <el-link
                            v-has-no-permission="['labelPrintDoor:print']"
                            class="no-perm"
                            >无权限</el-link
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
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import ExpandCollapse from '@/components/ExpandCollapse';
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'PrescriptionLabelPrint',
    components: { Pagination, ExpandCollapse },
    data() {
        return {
            autoTime: 10,
            autoTimer: null, //轮询请求
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            pagination: {
                size: 10,
                num: 1
            },
            moreFilter: false
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['orgArchives']),
        ...mapState('enum', ['carfts'])
    },
    activated() {
        this.fetch();
        this.autoTimer = setInterval(this.fetch, this.autoTime * 1000);
    },
    deactivated() {
        clearInterval(this.autoTimer);
    },
    destroyed() {
        clearInterval(this.autoTimer);
    },
    methods: {
        //处方签已打印添加底色
        tablePrintedFlag({ row, rowIndex }) {
            if (row.prescriptionLabelPrintNum > 1) {
                return 'prtlable-printed';
            }
            return '';
        },
        //更多筛选条件
        showMoreFilter() {
            this.moreFilter = !this.moreFilter;
        },
        //修改页面定时刷新时间
        changeAutoTime(val) {
            clearInterval(this.autoTimer);
            if (val) {
                this.fetch();
                this.autoTimer = setInterval(this.fetch, this.autoTime * 1000);
            }
        },
        prescribePrint(row) {
            let params = {
                prescriptionOrderId: row.id
            };
            this.$api
                .prescription_prescriptionOrder_prescriptionLabelPrint(params)
                .then((res) => {
                    this.$message({
                        message: '处方签打印成功',
                        type: 'success'
                    });
                    this.fetch();
                    let hostUrl =
                        window.location.origin + window.location.pathname;
                    let routeUrl = this.$router.resolve({
                        path: '/print/preview',
                        query: {
                            printType: 'prescriptionLabelPrint',
                            orderNo: row.orderNo
                        }
                    });
                    window.open(
                        hostUrl +
                            routeUrl.href +
                            '&timestamp=' +
                            new Date().getTime(),
                        'printPage',
                        'height=800,width=800,top=0,left=800,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no, status=no'
                    );
                })
                .catch((err) => {
                    console.log(err);
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
                .prescription_prescriptionOrder_prescriptionLabelPrintList(
                    params
                )
                .then((r) => {
                    let { rows, total } = r.data.result;
                    this.total = total;
                    this.list = rows;
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
.prescripe-label-container {
    /deep/ .el-table__expand-icon {
        color: transparent;
    }
    /deep/ .prtlable-printed {
        tr,
        td {
            background: #99edff !important;
        }
    }
    .table-top-wrap {
        .btn-color-tip {
            .label-print {
                margin-right: 20px;
            }
            .bg-tag {
                width: 25px;
                height: 16px;
                border-radius: 5px;
                margin-right: 5px;
                &__prescribe {
                    background: #13ce66;
                }
                &__label {
                    background: #8596e3;
                }
                &__todoor {
                    background: #f8ab6b;
                }
                &__prescribetag {
                    background: #13cbf3;
                }
            }
        }
        .autoTimeChoose {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: end;
            -ms-flex-pack: end;
            justify-content: flex-end;
            .timeBox {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                .title {
                    margin-right: 25px;
                }
                .timeChoole {
                    width: 120px;
                    margin-right: 20px;
                }
            }
        }
    }
    .print-bn {
        margin: 0 7px;
    }
    .label-tag-print__btn {
        background-color: #8596e3;
        border-color: #8596e3;
    }
    .to-door-tag-print__btn {
        background-color: #f8ab6b;
        border-color: #f8ab6b;
    }
    .prescribe-tag-print__btn {
        background-color: #13cbf3;
        border-color: #13cbf3;
    }
}
.more-filter {
    margin: 10px 0;
    /deep/ .el-divider__text {
        padding: 0 10px;
    }
    i {
        font-size: 22px;
        cursor: pointer;
    }
}
</style>
