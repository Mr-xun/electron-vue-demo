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
                <el-form-item
                    label="工艺"
                    prop="processingTechnic"
                    v-show="moreQuery"
                >
                    <el-select
                        v-model="queryParams.processingTechnic"
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
                <el-form-item label="流水号" v-show="moreQuery">
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
                    v-show="moreQuery"
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
                <el-form-item label="录入日期" v-show="moreQuery">
                    <el-date-picker
                        style="width: 440px"
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
                        moreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                    "
                    @click="togglehMoreQuery"
                ></i>
            </el-divider>
        </div>
        <div class="center-container prescription-audit-container">
            <div class="opt-wrapper">
                <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-suitcase"
                    @click="batchReceive"
                    v-has-permission="['batchReceiveDrug:receive']"
                    >批量收货</el-button
                >
                <el-button
                    type="info"
                    size="small"
                    icon="el-icon-help"
                    @click="scanCodeCollect"
                    v-has-permission="['scanReceiveDrug:receive']"
                    >扫码收货</el-button
                >
            </div>
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
                :row-class-name="tableRowBgColor"
                style="width: 100%"
                @selection-change="onSelectChange"
            >
                <el-table-column type="selection" align="center" width="40px" />
                <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="机构名称"
                    prop="orgId"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.orgId | flOrgName }}</span>
                    </template>
                </el-table-column>
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
                    min-width="100"
                    prop="doseNum"
                ></el-table-column>

                <el-table-column
                    label="工艺"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="technologyName"
                ></el-table-column>
                <el-table-column
                    label="订单状态"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="orderStatus"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.orderStatus | flOrderStatusName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="录入时间"
                    :show-overflow-tooltip="true"
                    min-width="160px"
                    align="center"
                    prop="createTime"
                ></el-table-column>
                <el-table-column
                    label="送货时间"
                    :show-overflow-tooltip="true"
                    min-width="160px"
                    align="center"
                    prop="postTime"
                ></el-table-column>

                <el-table-column
                    label="操作"
                    align="center"
                    min-width="220px"
                    fixed="right"
                    class-name="small-padding fixed-width"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-folder-add"
                            class="print-bn"
                            v-has-permission="['receiveDrug:receive']"
                            @click="receiveDrug(row)"
                            >收货</el-button
                        >
                        <el-button
                            size="mini"
                            type="success"
                            icon="el-icon-folder-remove"
                            class="print-bn"
                            v-has-permission="['fastSend:receive']"
                            @click="sendDrug(row)"
                            >快速发药</el-button
                        >
                        <el-link
                            v-has-no-permission="[
                                'receiveDrug:receive',
                                'fastSend:receive',
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
            <scan-code
                ref="scanCode"
                :dialog-visible="dialog.isVisible"
                :title="dialog.title"
                @success="scanSuccess"
                @close="scanClose"
            />
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import ExpandCollapse from '@/components/ExpandCollapse';
import { mapGetters, mapState } from 'vuex';
import ScanCode from './components/ScanCode';
export default {
    name: 'ReceiveDrugList',
    components: { Pagination, ExpandCollapse, ScanCode },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: '扫码收货'
            },
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
            moreQuery: false
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['orgArchives']),
        ...mapState('enum', ['carfts'])
    },
    activated() {
        this.fetch();
    },
    methods: {
        //添加底色
        tableRowBgColor({ row, rowIndex }) {
            if (row.technologyName.indexOf('代煎') != -1) {
                return 'replace-drug-color';
            }
            if (row.technologyName.indexOf('自煎') != -1) {
                return 'self-drug-color';
            }
            return '';
        },
        //收货
        receiveDrug(row) {
            let params = {
                orderNo: row.orderNo
            };
            this.$api
                .prescription_prescriptionOrder_receiveDrug(params)
                .then((res) => {
                    this.$message({
                        message: '收货成功',
                        type: 'success'
                    });
                    this.fetch();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //快速发药
        sendDrug(row) {
            let params = {
                orderNo: row.orderNo
            };
            this.$api
                .prescription_prescriptionOrder_fastSend(params)
                .then((res) => {
                    this.$message({
                        message: '快速发药成功',
                        type: 'success'
                    });
                    this.fetch();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //扫码收货弹窗
        scanCodeCollect() {
            this.dialog.isVisible = true;
        },
        //批量收货
        batchReceive() {
            if (!this.selection.length) {
                this.$message({
                    message: '请勾选处方',
                    type: 'warning'
                });
                return;
            }
            this.$api
                .prescription_prescriptionOrder_batchReceiveDrug(
                    this.selection.map((item) => item.orderNo)
                )
                .then((res) => {
                    this.$message({
                        message: '批量收货成功',
                        type: 'success'
                    });
                    this.fetch();
                    this.clearSelections();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        scanClose() {
            this.dialog.isVisible = false;
        },
        scanSuccess() {
            this.fetch();
        },
        //更多筛选条件
        togglehMoreQuery() {
            this.moreQuery = !this.moreQuery;
        },
        onSelectChange(selection) {
            this.selection = selection;
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

        clearSelections() {
            this.$refs.table.clearSelection();
        },

        fetch() {
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num
            };
            this.loading = true;
            this.$api
                .prescription_prescriptionOrder_receiveDrugList(params)
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
	/deep/ .replace-drug-color {
		tr,
		td {
			background: #abecc8 !important;
		}
	}
	/deep/ .self-drug-color {
		tr,
		td {
			background: #fed3da !important;
		}
	}
    .opt-wrapper {
        margin-top: -10px;
        margin-bottom: 10px;
    }
    .print-bn {
        margin-right: 0;
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
