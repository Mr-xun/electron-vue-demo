<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams" label-width="70px">
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
                <el-form-item label="性别" v-show="moreQuery">
                    <el-select
                        v-model="queryParams.sex"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                        @change="search"
                        class="filter-item search-item"
                    >
                        <el-option label="全部" value></el-option>
                        <el-option label="男" :value="1"></el-option>
                        <el-option label="女" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="科室"
                    prop="departmentName"
                    v-show="moreQuery"
                >
                    <el-input
                        v-model="queryParams.departmentName"
                        clearable
                        @clear="search"
                        placeholder="科室"
                        class="filter-item search-item"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item
                    label="工艺"
                    prop="technologyId"
                    v-show="moreQuery"
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
                <el-form-item
                    label="处方备注"
                    prop="prescriptionRemarkName"
                    v-show="moreQuery"
                >
                    <el-input
                        v-model="queryParams.prescriptionRemarkName"
                        clearable
                        @clear="search"
                        placeholder="处方备注"
                        class="filter-item search-item"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item
                    label="处方状态"
                    placeholder="请选择"
                    v-show="moreQuery"
                >
                    <el-select
                        v-model="queryParams.orderStatus"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                        @change="search"
                        class="filter-item search-item"
                    >
                        <el-option label="全部" value></el-option>
                        <el-option label="待收费" :value="10"></el-option>
                        <el-option label="待审方" :value="11"></el-option>
                        <el-option label="待调剂" :value="12"></el-option>
                        <el-option label="调剂中" :value="13"></el-option>
                        <el-option label="待复核" :value="14"></el-option>
                        <el-option label="待称重" :value="15"></el-option>
                        <el-option label="包装称重完成" :value="17"></el-option>
                        <el-option label="待煎药" :value="18"></el-option>
                        <el-option label="煎药开始" :value="181"></el-option>
                        <el-option label="煎药完成" :value="182"></el-option>
                        <el-option label="待加工" :value="19"></el-option>
                        <el-option label="加工开始" :value="191"></el-option>
                        <el-option label="加工完成" :value="192"></el-option>
                        <el-option label="送货中" :value="20"></el-option>
                        <el-option label="待发药" :value="21"></el-option>
                        <el-option label="发药完成" :value="22"></el-option>
                        <el-option label="取消申请" :value="90"></el-option>
                        <el-option label="取消确认" :value="91"></el-option>
                        <el-option label="销毁申请" :value="92"></el-option>
                        <el-option label="销毁确认" :value="93"></el-option>
                        <el-option label="重发申请" :value="94"></el-option>
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
                    <el-button
                        v-has-permission="[
                            'prescriptionDeliveryOrder:delivery',
                        ]"
                        class="filter-item"
                        type="success"
                        plain
                        @click="outOrder"
                        >出单</el-button
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
        <div class="center-container prescription-manage-container">
            <el-table
                ref="table"
                :data="list"
                v-loading="loading"
                border
                fit
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
                :max-height="tableHeight"
                @selection-change="onSelectChange"
                :row-class-name="tableRowBgColor"
                style="width: 100%"
                row-key="id"
            >
                <el-table-column
                    type="selection"
                    :reserve-selection="true"
                    align="center"
                    width="40px"
                />
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
                    min-width="160px"
                    prop="orgName"
                ></el-table-column>
                <el-table-column
                    label="流水号"
                    prop="orderNo"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
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
                    label="工艺"
                    :show-overflow-tooltip="true"
                    min-width="100px"
                    align="center"
                    prop="technologyName"
                ></el-table-column>
                <el-table-column
                    label="科室"
                    :show-overflow-tooltip="true"
                    min-width="120px"
                    align="center"
                    prop="departmentName"
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
                    label="调剂员1"
                    align="center"
                    prop="dispenser1"
                    min-width="120px"
                >
                    <template slot-scope="{ row }">
                        <span v-if="row.dispenser1">{{ row.dispenser1 }}</span>
                        <el-select
                            v-model="row.dispenser1Code"
                            filterable
                            clearable
                            style="width: 100%"
                            size="mini"
                            v-else
                            @change="changeDispenser1($event, row)"
                        >
                            <el-option
                                v-for="item in userOptions"
                                :label="item.fullname"
                                :value="item.code"
                                :key="item.userId"
                            ></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    label="调剂员2"
                    align="center"
                    prop="dispenser2"
                    min-width="120px"
                >
                    <template slot-scope="{ row }">
                        <span v-if="row.dispenser2">{{ row.dispenser2 }}</span>
                        <el-select
                            v-model="row.dispenser2Code"
                            filterable
                            clearable
                            style="width: 100%"
                            size="mini"
                            v-else
                            @change="changeDispenser2($event, row)"
                        >
                            <el-option
                                v-for="item in userOptions"
                                :label="item.fullname"
                                :value="item.code"
                                :key="item.userId"
                            ></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    label="复核员"
                    align="center"
                    min-width="120px"
                    prop="checker"
                >
                    <template slot-scope="{ row }">
                        <span v-if="row.checker">{{ row.checker }}</span>
                        <el-select
                            v-model="row.checkerCode"
                            filterable
                            clearable
                            style="width: 100%"
                            size="mini"
                            v-else
                            @change="changeChecker($event, row)"
                        >
                            <el-option
                                v-for="item in userOptions"
                                :label="item.fullname"
                                :value="item.code"
                                :key="item.userId"
                            ></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    label="复核员1"
                    align="center"
                    min-width="120px"
                    prop="checker1"
                >
                    <template slot-scope="{ row }">
                        <span v-if="row.checker1">{{ row.checker1 }}</span>
                        <el-select
                            v-model="row.checker1Code"
                            filterable
                            clearable
                            style="width: 100%"
                            size="mini"
                            v-else
                            @change="changeChecker1($event, row)"
                        >
                            <el-option
                                v-for="item in userOptions"
                                :label="item.fullname"
                                :value="item.code"
                                :key="item.userId"
                            ></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    label="称重人"
                    align="center"
                    prop="weigher"
                    min-width="120px"
                >
                    <template slot-scope="{ row }">
                        <span v-if="row.weigher">{{ row.weigher }}</span>
                        <el-select
                            v-model="row.weigherCode"
                            filterable
                            clearable
                            style="width: 100%"
                            size="mini"
                            v-else
                        >
                            <el-option
                                v-for="item in userOptions"
                                :label="item.fullname"
                                :value="item.code"
                                :key="item.userId"
                            ></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    label="包装人"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="packer"
                    min-width="120px"
                >
                    <template slot-scope="{ row }">
                        <span v-if="row.packer">{{ row.packer }}</span>
                        <el-select
                            v-model="row.packerCode"
                            filterable
                            clearable
                            style="width: 100%"
                            size="mini"
                            v-else
                        >
                            <el-option
                                v-for="item in userOptions"
                                :label="item.fullname"
                                :value="item.code"
                                :key="item.userId"
                            ></el-option>
                        </el-select>
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
                    label="建议送药时间"
                    :show-overflow-tooltip="true"
                    min-width="160px"
                    align="center"
                    prop="recommendedDeliveryDrugTime"
                ></el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="240px"
                    fixed="right"
                    class-name="small-padding fixed-width"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            size="mini"
                            icon="el-icon-view"
                            circle
                            @click="view(row)"
                            v-has-permission="[
                                'prescriptionManagerList:detail',
                            ]"
                        ></el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            v-has-permission="[
                                'prescriptionAgainAllocation:again',
                            ]"
                            @click="reallocate(row)"
                            >重分配</el-button
                        >
                        <el-button
                            size="mini"
                            type="info"
                            v-has-permission="[
                                'prescriptionManager:management',
                            ]"
                            @click="toManage(row)"
                            >管理</el-button
                        >
                        <el-link
                            v-has-no-permission="[
                                'prescriptionManagerList:detail',
                                'prescriptionAgainAllocation:again',
                                'prescriptionDeliveryOrder:delivery',
                                'prescriptionManager:management',
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
            <manage-edit
                ref="edit"
                :dialog-visible="dialog.isVisible"
                :title="dialog.title"
                @success="editSuccess"
                @close="editClose"
            />
            <prescription-details
                ref="details"
                :dialog-visible="detailDialog.isVisible"
                @close="viewClose"
                :detailData="detailDialog.detailData"
            />
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { mapGetters, mapState } from 'vuex';
import ManageEdit from './Edit';
import PrescriptionDetails from './components/Details';
import elTableInfiniteScroll from 'el-table-infinite-scroll';
export default {
    name: 'PrescriptionManagerList',
    components: { Pagination, ManageEdit, PrescriptionDetails },
    directives: {
        'el-table-infinite-scroll': elTableInfiniteScroll
    },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: ''
            },
            detailDialog: {
                isVisible: false,
                title: '',
                detailData: {}
            },
            userOptions: [],
            tableKey: 0,
            noMore: false,
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
    created() {
        this.getAllUser();
    },
    activated() {
        this.search();
        this.clearSelections();
    },
    methods: {
        //添加底色
        tableRowBgColor({ row, rowIndex }) {
            if (!row.invoiceOrderNo) {
                let nowTime = new Date().getTime();
                let redDeliveTime = row.recommendedDeliveryDrugTime
                    ? new Date(row.recommendedDeliveryDrugTime)
                    : 0;
                if (
                    row.recommendedDeliveryDrugTime &&
                    nowTime > redDeliveTime
                ) {
                    if (row.technologyName.indexOf('代煎') != -1) {
                        return 'replace-drug-color';
                    }
                    if (row.technologyName.indexOf('自煎') != -1) {
                        return 'self-drug-color';
                    }
                }
            }
            return '';
        },
        //更改调剂员1
        changeDispenser1(val, row) {
            if (val == row.dispenser2Code) {
                this.$message({
                    message: '调剂员不能相同！',
                    type: 'warning'
                });
                row.dispenser1Code = '';
            }
        },
        //更改调剂员2
        changeDispenser2(val, row) {
            if (val == row.dispenser1Code) {
                this.$message({
                    message: '调剂员不能相同！',
                    type: 'warning'
                });
                row.dispenser2Code = '';
            }
        },
        //更改复核员
        changeChecker(val, row) {
            if (val == row.checker1Code) {
                this.$message({
                    message: '复核员不能相同！',
                    type: 'warning'
                });
                row.checkerCode = '';
            }
        },
        //更改复核员1
        changeChecker1(val, row) {
            if (val == row.checkerCode) {
                this.$message({
                    message: '复核员不能相同！',
                    type: 'warning'
                });
                row.checker1Code = '';
            }
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        getRowKeys(rows) {
            return rows.id;
        },
        view(row) {
            this.detailDialog.detailData = row;
            this.detailDialog.isVisible = true;
        },
        viewClose() {
            this.detailDialog.detailData = {};
            this.detailDialog.isVisible = false;
        },
        editClose() {
            this.dialog.isVisible = false;
        },
        editSuccess() {
            this.fetch();
        },
        getAllUser() {
            let params = {
                isLogisticsPersonnel: 2,
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
        //出单
        outOrder(row) {
            if (!this.selection.length) {
                this.$message({
                    message: '请先选择需要操作的数据',
                    type: 'warning'
                });
                return;
            }
            let allowOutOrder = true; //是否允许出单
            this.selection.forEach((item) => {
                if (
                    item.orderStatus != 17 &&
                    item.orderStatus != 182 &&
                    item.orderStatus != 192
                ) {
                    allowOutOrder = false;
                }
            });
            if (!allowOutOrder) {
                this.$message({
                    message: '所选处方状态应为包装称重完成或加工完成或煎药完成',
                    type: 'warning'
                });
                return;
            }
            let orderNoList = this.selection.map((item) => item.orderNo);
            this.$api
                .prescription_prescriptionOrder_deliveryOrder(orderNoList)
                .then((r) => {
                    this.$message({
                        message: '出单成功',
                        type: 'success'
                    });
                    this.fetch();
                    this.$router.push({
                        name: '送货单',
                        params: {
                            type: 'outOrder',
                            orders: orderNoList.join(',')
                        }
                    });
                    this.clearSelections();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //重分配
        reallocate(row) {
            let params = {
                checker1Code: row.checker1Code,
                checkerCode: row.checkerCode,
                dispenser1Code: row.dispenser1Code,
                dispenser2Code: row.dispenser2Code,
                packerCode: row.packerCode,
                prescriptionOrderId: row.id,
                weigherCode: row.weigherCode
            };
            this.$api
                .prescription_prescriptionOrder_againAllocation(params)
                .then((r) => {
                    this.$message({
                        message: '重分配成功',
                        type: 'success'
                    });
                    this.fetch();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //管理
        toManage(row) {
            this.$refs.edit.setEditForm(row);
            this.dialog.title = '修改';
            this.dialog.isVisible = true;
        },
        onSelectChange(selection) {
            console.log(selection, 33);
            this.selection = selection;
        },
        //更多筛选条件
        togglehMoreQuery() {
            this.moreQuery = !this.moreQuery;
        },
        search() {
            this.list = [];
            this.noMore = false;
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.list = [];
            this.noMore = false;
            this.pagination.num = 1;
            this.queryParams = {};
            this.fetch();
        },
        load() {
            if (this.noMore) {
                return;
            }
            this.pagination.num += 1;
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
                .prescription_prescriptionOrder_managerList(params)
                .then((r) => {
                    const data = r.data.result;
                    this.total = data.total;
                    this.list = data.rows;
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.loading = false;
                    this.noMore = true;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.prescription-manage-container {
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
.handle-icon {
    cursor: pointer;
}
</style>
