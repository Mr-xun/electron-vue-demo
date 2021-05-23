<template>
    <el-dialog
        v-el-drag-dialog
        title="处方详情"
        :width="width"
        top="50px"
        :close-on-click-modal="false"
        :visible.sync="isVisible"
        class="prescription-details-dialog"
    >
        <div class="details-container">
            <div class="lt-info-wrapper">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="处方信息" name="preInfo">
                        <div class="pre-info">
                            <el-row :gutter="0">
                                <el-col :xs="24">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            医院名称：{{ detailData.orgName }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            录入时间：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.createTime }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            收费时间：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{
                                                detailData.collectionTime ||
                                                "---"
                                            }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            处方号：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.prescriptionNumber }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            患者编号：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.medicalRecordNumber }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            流水号：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.orderNo }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            姓名：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.patientName }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            性别：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.sex | flSex }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            年龄：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.age }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            科室：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.departmentName }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            医师：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.physician }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            付数：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.doseNum }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            用法用量：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.dosage }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            工艺：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.technologyName }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            紧急度：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{
                                                detailData.instantLevel
                                                    | flUrgentName
                                            }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            门诊/病房：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.isWard | flClincOrWard }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            病区：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.wardArea || "---" }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            床号：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.bedNumber || "---" }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            临床诊断：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{
                                                detailData.diseaseSpecies ||
                                                "---"
                                            }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            医保：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{
                                                detailData.isMedicalInsurance
                                                    | flYesOrNo
                                            }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            处方备注：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{
                                                detailData.prescriptionRemarkName
                                            }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            送货上门：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{
                                                detailData.isDeliveryToDoor
                                                    | flYesOrNo
                                            }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            地址：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.address || "---" }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            电话：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.tel || "---" }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            收货人：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.receiver || "---" }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            味数：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{ detailData.flavourNumber || 0 }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            药费：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{
                                                detailData.totalMedicineAmount
                                                    | formatMoney
                                            }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            煎药费：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{
                                                detailData.totalDecoctFee
                                                    | formatMoney
                                            }}
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="12">
                                    <div class="view-item">
                                        <div class="cell-box cell-title">
                                            总计：
                                        </div>
                                        <div
                                            class="cell-box cell-content fellip"
                                        >
                                            {{
                                                detailData.totalAmount
                                                    | formatMoney
                                            }}
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="药品明细" name="drugInfo">
                        <div class="drug-info">
                            <el-table
                                ref="drugTable"
                                :data="detailData.prescriptionOrderDetailList"
                                :header-cell-style="{
                                    background: '#eef1f6',
                                    color: '#606266',
                                }"
                                stripe
                                border
                                style="width: 100%"
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
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="操作记录" name="dd">
                        <el-table
                            ref="drugTable"
                            :data="detailData.prescriptionOrderLogList"
                            :header-cell-style="{
                                background: '#eef1f6',
                                color: '#606266',
                            }"
                            stripe
                            border
                            style="width: 100%"
                        >
                            <el-table-column
                                align="center"
                                prop="operateTime"
                                min-width="120px"
                                :show-overflow-tooltip="true"
                                label="操作时间"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="operator1"
                                min-width="80px"
                                :show-overflow-tooltip="true"
                                label="操作员1"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="operator2"
                                label="操作员2"
                                min-width="80px"
                                :show-overflow-tooltip="true"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="remark"
                                min-width="160px"
                                :show-overflow-tooltip="true"
                                label="处方状态"
                            ></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="rt-flow-wrapper">
                <el-timeline class="flow-timeline">
                    <el-timeline-item
                        v-for="(activity, index) in activities"
                        :key="index"
                        :icon="activity.icon"
                        :type="activity.type"
                        :color="activity.color"
                        size="large"
                        :timestamp="activity.timestamp"
                        >{{ activity.content }}</el-timeline-item
                    >
                </el-timeline>
            </div>
        </div>
        <!-- <div slot="footer" class="dialog-footer">
            <el-button type="primary" plain @click="isVisible = false">确定</el-button>
        </div>-->
    </el-dialog>
</template>
<script>
export default {
    name: 'PrescriptionDetail',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        detailData: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            screenWidth: 0,
            width: this.initWidth(),
            activeName: 'preInfo',
            choosedDrugData: [],
            activities: [
                {
                    content: '处方收费',
                    timestamp: '未收费',
                    type: 'warning',
                    color: '#aeafaf',
                    icon: 'el-icon-more'
                },
                {
                    content: '处方审核',
                    timestamp: '未审核',
                    type: 'warning',
                    color: '#aeafaf',
                    icon: 'el-icon-more'
                },
                {
                    content: '处方调剂',
                    timestamp: '未调剂',
                    type: 'warning',
                    color: '#aeafaf',
                    color: '#aeafaf',
                    icon: 'el-icon-more'
                },
                {
                    content: '处方复核',
                    timestamp: '未复核',
                    type: 'warning',
                    color: '#aeafaf',
                    icon: 'el-icon-more'
                },
                {
                    content: '处方煎药',
                    timestamp: '未煎药',
                    type: 'warning',
                    color: '#aeafaf',
                    icon: 'el-icon-more'
                },
                {
                    content: '处方送货',
                    timestamp: '未送货',
                    type: 'warning',
                    color: '#aeafaf',
                    icon: 'el-icon-more'
                },
                {
                    content: '流程结束',
                    type: 'warning',
                    color: '#aeafaf',
                    icon: 'el-icon-more'
                }
            ]
        };
    },
    watch: {
        detailData(data) {
            if (data.orderStatus == 0 || data.orderStatus == 10) {
                this.setFlow(0);
            }
            if (data.orderStatus == 11) {
                this.setFlow(1);
            }
            if (data.orderStatus == 12 || data.orderStatus == 13) {
                this.setFlow(2);
            }
            if (data.orderStatus == 14) {
                this.setFlow(3);
            }
            if (
                data.orderStatus == 15 ||
                data.orderStatus == 17 ||
                data.orderStatus == 18 ||
                data.orderStatus == 181
            ) {
                this.setFlow(4);
            }
            if (
                data.orderStatus == 182 ||
                data.orderStatus == 19 ||
                data.orderStatus == 191 ||
                data.orderStatus == 192
            ) {
                this.setFlow(5);
            }
            if (data.orderStatus == 20) {
                this.setFlow(6);
            }
            if (data.orderStatus == 22) {
                this.setFlow(7);
            }
        },
        dialogVisible(val) {
            this.activeName = 'preInfo';
            if (!val) {
                this.setFlow(0);
            }
        }
    },
    computed: {
        isVisible: {
            get() {
                return this.dialogVisible;
            },
            set() {
                this.close();
            }
        }
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    methods: {
        setFlow(step) {
            this.activities = [
                {
                    content: '处方收费',
                    timestamp:
                        step > 0 ? this.detailData.collectionTime : '未收费',
                    type: step > 0 ? 'success' : 'warning',
                    color: step > 0 ? '' : '#aeafaf',
                    icon: step > 0 ? 'el-icon-circle-check' : 'el-icon-more'
                },
                {
                    content: '处方审核',
                    timestamp: step > 1 ? this.detailData.reviewTime : '未审核',
                    type: step > 1 ? 'success' : 'warning',
                    color: step > 1 ? '' : '#aeafaf',
                    icon: step > 1 ? 'el-icon-circle-check' : 'el-icon-more'
                },
                {
                    content: '处方调剂',
                    timestamp:
                        step > 2
                            ? this.detailData.dispenserFinishTime
                            : '未调剂',
                    type: step > 2 ? 'success' : 'warning',
                    color: step > 2 ? '' : '#aeafaf',
                    icon: step > 2 ? 'el-icon-circle-check' : 'el-icon-more'
                },
                {
                    content: '处方复核',
                    timestamp: step > 3 ? this.detailData.checkTime : '未复核',
                    type: step > 3 ? 'success' : 'warning',
                    color: step > 3 ? '' : '#aeafaf',
                    icon: step > 3 ? 'el-icon-circle-check' : 'el-icon-more'
                },
                {
                    content: '处方煎药',
                    timestamp:
                        step > 4 ? this.detailData.decoctingPotTime : '未煎药',
                    type: step > 4 ? 'success' : 'warning',
                    color: step > 4 ? '' : '#aeafaf',
                    icon: step > 4 ? 'el-icon-circle-check' : 'el-icon-more'
                },
                {
                    content: '处方送货',
                    timestamp: step > 5 ? this.detailData.postTime : '未送货',
                    type: step > 5 ? 'success' : 'warning',
                    color: step > 5 ? '' : '#aeafaf',
                    icon: step > 5 ? 'el-icon-circle-check' : 'el-icon-more'
                },
                {
                    content: '流程结束',
                    timestamp: step > 6 ? '' : '',
                    type: step > 6 ? 'success' : 'warning',
                    color: step > 6 ? '' : '#aeafaf',
                    icon: step > 6 ? 'el-icon-circle-check' : 'el-icon-more'
                }
            ];
            if (
                this.detailData.technologyName &&
                this.detailData.technologyName.indexOf('代煎') == -1
            ) {
                this.activities.splice(4, 1);
            }
        },

        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 991) {
                return '90%';
            } else if (this.screenWidth < 1400) {
                return '70%';
            } else {
                return '80%';
            }
        },
        close() {
            this.$emit('close');
        }
    }
};
</script>
<style lang="scss" scoped>
.prescription-details-dialog {
    /deep/ .el-dialog__body {
        padding: 10px 20px 30px;
    }
    .details-container {
        display: flex;
        justify-content: space-between;
        .lt-info-wrapper {
            width: 70%;
            .pre-info {
                border-top: 1px solid #dfe6ec;
                border-left: 1px solid #dfe6ec;

                .view-item {
                    display: flex;
                    border-bottom: 1px solid #dfe6ec;
                    border-right: 1px solid #dfe6ec;
                    .cell-box {
                        line-height: 24px;
                        text-align: center;
                        padding: 3px 10px;
                    }
                    .cell-title {
                        flex: 2;
                        min-width: 120px;
                        border-right: 1px solid #dfe6ec;
                    }
                    .cell-content {
                        flex: 3;
                        color: #0a0a0a;
                        text-align: left;
                    }
                }
            }
        }
        .rt-flow-wrapper {
            width: 30%;
            display: flex;
            justify-content: center;
            padding-top: 40px;
            .flow-timeline {
                padding: 0;
            }
        }
    }
}
</style>
