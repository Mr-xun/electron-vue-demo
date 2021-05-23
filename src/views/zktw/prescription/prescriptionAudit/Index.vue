<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams" label-width="80px">
                <el-form-item label="机构名称" prop="orgId">
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
                <el-form-item
                    label="工艺"
                    prop="technologyId"
                    v-show="moreFilter"
                >
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
        <div class="center-container prescription-audit-container">
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
            <el-table
                id="table"
                ref="table"
                row-key="id"
                :expand-row-keys="entexpands"
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
                <el-table-column type="expand" width="1">
                    <template slot-scope="props">
                        <el-table
                            :data="props.row.prescriptionOrderDetailList"
                            key="expand"
                            border
                            fit
                            :header-cell-style="{
                                background: '#eef1f6',
                                color: '#606266',
                            }"
                            stripe
                            max-height="250px"
                            style="width: 80%; margin-left: 10px"
                        >
                            <el-table-column
                                align="center"
                                prop="itemCode"
                                min-width="100px"
                                :show-overflow-tooltip="true"
                                label="编码"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="itemName"
                                min-width="100px"
                                :show-overflow-tooltip="true"
                                label="名称"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="specification"
                                label="规格"
                                :show-overflow-tooltip="true"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="name"
                                label="单位"
                                min-width="60px"
                                :show-overflow-tooltip="true"
                            >
                                <template slot-scope="{ row }">
                                    <span>{{ row.unit | flUnitName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="qty"
                                min-width="60px"
                                :show-overflow-tooltip="true"
                                label="数量"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="price"
                                label="单价"
                                min-width="80px"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="amount"
                                label="金额"
                                min-width="90px"
                            >
                                <template slot-scope="{ row }">
                                    {{ row.amount | formatMoney }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="remark"
                                label="说明"
                                min-width="140px"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="itemWeight"
                                label="重量"
                                min-width="60px"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="maxQty"
                                label="最大调剂"
                                min-width="80px"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="isToxicity"
                                label="是否毒麻"
                                min-width="80px"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        scope.row.isToxicity | flYesOrNo
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="isSmallPackage"
                                label="是否小包装"
                                min-width="100px"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        scope.row.isSmallPackage | flYesOrNo
                                    }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="isFines"
                                label="是否细料"
                                min-width="80px"
                            >
                                <template slot-scope="scope">
                                    <span>{{
                                        scope.row.isFines | flYesOrNo
                                    }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center"
                ></el-table-column>
                <el-table-column label="展开" align="center" min-width="60">
                    <template slot-scope="scope">
                        <template v-if="entexpands.indexOf(scope.row.id)">
                            <i
                                class="el-icon-plus handle-icon"
                                @click="
                                    orderShow($event, scope.row, scope.$index)
                                "
                            ></i>
                        </template>
                        <template v-else>
                            <i
                                class="el-icon-minus handle-icon"
                                @click="packUp($event, scope.row, scope.$index)"
                            ></i>
                        </template>
                    </template>
                </el-table-column>
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
                    label="操作"
                    align="center"
                    min-width="230px"
                    fixed="right"
                    class-name="small-padding fixed-width"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            size="mini"
                            type="success"
                            icon="el-icon-finished"
                            @click="auditPrint(row)"
                            v-has-permission="['auditPrint:print']"
                            >审核并打印</el-button
                        >
                        <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-close"
                            @click="auditRejected(row)"
                            v-has-permission="['auditRejected:rejected']"
                            >驳回</el-button
                        >
                        <el-link
                            v-has-no-permission="[
                                'auditPrint:print',
                                'auditRejected:rejected',
                            ]"
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
import { CURRENT_WEBSIT } from '@/config';
import Pagination from '@/components/Pagination';
import ExpandCollapse from '@/components/ExpandCollapse';
import { mapGetters, mapState } from 'vuex';
export default {
    name: 'PrescriptionAudit',
    components: { Pagination, ExpandCollapse },
    data() {
        return {
            autoTime: 10,
            autoTimer: null, //轮询请求
            entexpands: [],
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            selection: [],
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
        auditPrint(row) {
            let params = {
                prescriptionOrderId: row.id
            };

            this.$api
                .prescription_prescriptionOrder_auditPrint(params)
                .then((res) => {
                    this.$message({
                        message: '审核成功',
                        type: 'success'
                    });
                    this.fetch();
                    let hostUrl =
                        window.location.origin + window.location.pathname;
                    let routeUrl = this.$router.resolve({
                        path: '/print/preview',
                        query: {
                            printType:
                                CURRENT_WEBSIT == 1
                                    ? 'prescriptionAudit'
                                    : 'prescriptionAudit2',
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
        auditRejected(row) {
            let params = {
                prescriptionOrderId: row.id
            };
            this.$api
                .prescription_prescriptionOrder_auditRejected(params)
                .then((res) => {
                    console.log(res);
                    this.$message({
                        message: '驳回成功',
                        type: 'success'
                    });
                    this.fetch();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        orderShow(event, row, index) {
            Array.prototype.remove = function (val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            if (this.entexpands.indexOf(row.id) < 0) {
                this.entexpands = [];
                row.expand = true;
                this.entexpands.push(row.id);
            } else {
                this.entexpands.remove(row.id);
            }
        },
        packUp(event, row, index) {
            this.entexpands = [];
            row.expand = false;
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
                .prescription_prescriptionOrder_auditList(params)
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
.prescription-audit-container {
    /deep/ .el-table__expand-icon {
        color: transparent;
    }
    .handle-icon {
        cursor: pointer;
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
