<template>
    <div class="print-page" v-loading="loading">
        <el-divider>
            <button
                ref="printBtn"
                v-print="printObj"
                plain
                class="submit-btn"
                type="success"
                icon="el-icon-printer"
                size="small"
            >
                打印
            </button>
        </el-divider>
        <div id="printMe">
            <div class="print-container f18">
                <div class="pt-title f22">
                    <span class="orgname fbold f32">{{
                        dataInfo.orgPrintName
                    }}</span
                    >中药饮片抓药清单<span class="" v-if="replaceBoll"
                        >[代煎]</span
                    ><span style="margin-right: -20px"
                        >【{{ recommendedDeliveryDrugTime }}】</span
                    >
                    <span class="" v-if="isToDoor">【上门】</span>
                </div>
                <div class="split-line">
                    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                </div>
                <div class="pt-header f18">
                    <div class="lt-info">
                        <p class="pt-p">
                            <span>
                                处方号:
                                <em class="fbold">{{
                                    dataInfo.prescriptionNumber
                                }}</em>
                            </span>
                            <span>
                                患者编号:
                                <em class="fbold">{{
                                    dataInfo.medicalRecordNumber
                                }}</em>
                            </span>
                            <span>
                                科别:
                                <em class="fbold">{{
                                    dataInfo.departmentName
                                }}</em>
                            </span>
                        </p>
                        <p class="pt-p">
                            <span>
                                患者:
                                <em class="patient-name f30 fbold">{{
                                    dataInfo.patientName
                                }}</em>
                            </span>
                            <span>
                                性别:
                                <em class="fbold">{{
                                    dataInfo.sex | flSex
                                }}</em>
                            </span>
                            <span>
                                年龄:
                                <em class="fbold">{{ dataInfo.age }}</em>
                            </span>
                        </p>
                        <p class="pt-p" v-if="dataInfo.isWard == 1">
                            <span>
                                病房:
                                <em class="fbold">{{
                                    dataInfo.wardArea
                                }}</em>
                            </span>
                            <span>
                                床号:
                                <em class="fbold">{{ dataInfo.bedNumber }}</em>
                            </span>
                        </p>
                    </div>
                    <div class="rt-barcode">
                        <VueBarcode
                            :value="dataInfo.orderNo"
                            width="1.1"
                            height="50"
                            font="SimSun"
                            fontSize="20"
                            format="CODE128"
                            fontOptions="bold"
                            marginTop="0"
                            marginBottom="0"
                            >转码失败</VueBarcode
                        >
                    </div>
                </div>
                <div class="split-line">
                    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                </div>
                <div class="pt-drugs">
                    <div class="durg-title">
                        <div class="dg-row dg-pro f16">
                            <span class="dg-col col-warehouse">货位</span>
                            <span class="dg-col col-name">品名</span>
                            <span class="dg-col col-qty">数量</span>
                            <span class="dg-col col-unit">单位</span>
                            <span class="dg-col col-note">说明</span>
                            <span class="dg-col col-price">单价</span>
                        </div>
                        <div class="dg-row dg-pro f16">
                            <span class="dg-col col-warehouse">货位</span>
                            <span class="dg-col col-name">品名</span>
                            <span class="dg-col col-qty">数量</span>
                            <span class="dg-col col-unit">单位</span>
                            <span class="dg-col col-note">说明</span>
                            <span class="dg-col col-price">单价</span>
                        </div>
                    </div>
                    <div class="drug-content">
                        <div class="dg-lt-con">
                            <div
                                class="dg-row dg-info f16"
                                v-for="(
                                    item, index
                                ) in dataInfo.prescriptionOrderDetailList"
                                :key="item.id"
                            >
                                <span
                                    v-if="index % 2 == 0"
                                    class="dg-col col-warehouse"
                                    >{{ item.location }}</span
                                >
                                <span
                                    v-if="index % 2 == 0"
                                    class="dg-col col-name"
                                    >{{ item.itemName }}</span
                                >
                                <span
                                    v-if="index % 2 == 0"
                                    class="dg-col col-qty"
                                    >{{ item.qty }}</span
                                >
                                <span
                                    v-if="index % 2 == 0"
                                    class="dg-col col-unit"
                                    >{{ item.unit | flUnitName }}</span
                                >
                                <span
                                    v-if="index % 2 == 0"
                                    class="dg-col col-note f16"
                                    >{{ item.remark || "--" }}</span
                                >
                                <span
                                    v-if="index % 2 == 0"
                                    class="dg-col col-price"
                                    >{{ item.price }}</span
                                >
                            </div>
                        </div>
                        <div class="dg-rt-con">
                            <div
                                class="dg-row dg-info f16"
                                v-for="(
                                    item, index
                                ) in dataInfo.prescriptionOrderDetailList"
                                :key="item.id"
                            >
                                <span
                                    v-if="index % 2 == 1"
                                    class="dg-col col-warehouse"
                                    >{{ item.location }}</span
                                >
                                <span
                                    v-if="index % 2 == 1"
                                    class="dg-col col-name"
                                    >{{ item.itemName }}</span
                                >
                                <span
                                    v-if="index % 2 == 1"
                                    class="dg-col col-qty"
                                    >{{ item.qty }}</span
                                >
                                <span
                                    v-if="index % 2 == 1"
                                    class="dg-col col-unit"
                                    >{{ item.unit | flUnitName }}</span
                                >
                                <span
                                    v-if="index % 2 == 1"
                                    class="dg-col col-note"
                                    >{{ item.remark || "--" }}</span
                                >
                                <span
                                    v-if="index % 2 == 1"
                                    class="dg-col col-price"
                                    >{{ item.price }}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div class="split-line">
                    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                </div>
                <div class="pt-drug-amout f22">
                    <p class="pt-p">
                        <span>
                            总克数:
                            <em class="">{{ dataInfo.totalWeight }}克</em>
                            <em class="advise-range"
                                >【{{
                                    selfBoll
                                        ? dataInfo.permissibleRange
                                        : dataInfo.permissibleRange2
                                }}】</em
                            >
                        </span>
                    </p>
                    <p class="pt-p">
                        <span>
                            服法用量:
                            <em class="">{{ dataInfo.dosage }}</em>
                        </span>
                    </p>
                </div>
                <div class="split-line">
                    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                </div>
                <div class="pt-amount-info f22">
                    <p class="pt-p">
                        <span class="large-span">
                            每付药合计金额:
                            <em class="">{{
                                dataInfo.singleTotalAmount | formatMoney
                            }}</em>
                        </span>
                        <span>
                            付数:
                            <em class="">{{ dataInfo.doseNum }}</em>
                        </span>
                        <span>
                            味数:
                            <em class="">{{ dataInfo.flavourNumber }}</em>
                        </span>
                        <span>
                            医师:
                            <em class="">{{ dataInfo.physician }}</em>
                        </span>
                    </p>
                    <p class="pt-p">
                        <span class="large-span">
                            总金额:
                            <em>{{ dataInfo.totalAmount | formatMoney }}</em>
                        </span>
                        <span>
                            备注:
                            <em>{{ dataInfo.prescriptionRemarkName }}</em>
                        </span>
                        <span>
                            <em></em>
                        </span>
                        <span>
                            紧急度:
                            <em>{{ dataInfo.instantLevel | flUrgentName }}</em>
                        </span>
                    </p>
                    <p class="pt-p p-flex">
                        <span class="ave-span">
                            计价员:
                            <em>{{ dataInfo.creator }}</em>
                        </span>
                        <span class="ave-span">
                            审核员:
                            <em>{{ dataInfo.reviewer }}</em>
                        </span>
                    </p>
                    <p class="pt-p">
                        <span class="ave-span">
                            收费时间:
                            <em>{{ dataInfo.collectionTime }}</em>
                        </span>
                        <span class="ave-span">
                            打印时间:
                            <em>{{ printTime | parseTime("{h}:{i}:{s}") }}</em>
                        </span>
                    </p>
                </div>
                <div class="split-line">
                    --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                </div>
                <div class="pt-operater f20">
                    <p class="pt-p">
                        <span>
                            调剂员1:
                            <em>{{ dataInfo.dispenser1 }}</em>
                        </span>
                        <span>
                            复核员1:
                            <em>{{ dataInfo.checker }}</em>
                        </span>
                        <span>
                            称重员:
                            <em>{{ dataInfo.weigher }}</em>
                        </span>
                        <span>
                            发药人:
                            <em>{{ dataInfo.consigner }}</em>
                        </span>
                    </p>
                    <p class="pt-p">
                        <span>
                            调剂员2:
                            <em>{{ dataInfo.dispenser2 }}</em>
                        </span>
                        <span>
                            复核员2:
                            <em>{{ dataInfo.checker1 }}</em>
                        </span>
                        <span>
                            包装员:
                            <em>{{ dataInfo.packer }}</em>
                        </span>
                    </p>
                    <p class="pt-p">
                        <span>
                            调剂时间:
                            <em>{{ dataInfo.dispenserFinishTime | flTime }}</em>
                        </span>
                        <span>
                            复核时间:
                            <em>{{ dataInfo.checkTime | flTime }}</em>
                        </span>
                        <span>
                            包装时间:
                            <em>{{ dataInfo.packingTime | flTime }}</em>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { parseTime } from '@/utils';
import VueBarcode from 'vue-barcode';
export default {
    components: { VueBarcode },
    data() {
        return {
            printObj: {
                id: 'printMe',
                popTitle: '打印',
                endCallback: (e) => {
                    console.log(e, 333);
                }
            },
            loading: false,
            dataInfo: {},
            printTime: parseTime(new Date())
        };
    },
    computed: {
        replaceBoll() {
            //判断是否代煎
            if (this.dataInfo.technologyName) {
                if (this.dataInfo.technologyName.indexOf('代煎') != -1) {
                    return true;
                } else {
                    return false;
                }
            }
        },

        selfBoll() {
            //判断是否自煎
            if (this.dataInfo.technologyName) {
                if (this.dataInfo.technologyName.indexOf('自煎') != -1) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        isToDoor() {
            //判断是否上门
            if (
                this.dataInfo.isDeliveryToDoor &&
                this.dataInfo.isDeliveryToDoor == 1
            ) {
                return true;
            } else {
                return false;
            }
        },
        recommendedDeliveryDrugTime() {
            if (this.dataInfo.recommendedDeliveryDrugTime) {
                return this.$options.filters['parseTime'](
                    this.dataInfo.recommendedDeliveryDrugTime,
                    '{h}:{i}'
                );
            }
            return '';
        }
    },
    watch: {
        $route: {
            handler() {
                this.$nextTick(() => {
                    this.getData();
                    this.printTime = parseTime(new Date());
                });
            },
            immediate: true,
            deep: true
        }
    },
    filters: {
        flTime(time) {
            if (time) {
                return parseTime(time, '{h}:{i}:{s}');
            }
            return '';
        }
    },
    methods: {
        getData() {
            let params = {
                orderNo: this.$route.query.orderNo
            };
            this.loading = true;
            this.$api
                .prescription_prescriptionOrder_byOrderNo(params)
                .then((r) => {
                    let { data } = r.data;
                    this.dataInfo = data;
                    this.loading = false;
                    this.$nextTick(() => {
                        this.$refs.printBtn.click();
                    });
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
.print-container {
    width: 780px;
    // font-weight: 600;
    box-sizing: content-box;
    font-family: "宋体";
    margin-left: 10px;
    padding-bottom: 20px;
    .split-line {
        width: 100%;
        overflow: hidden;
        height: 20px;
        font-weight: normal;
        line-height: 20px;
    }
    p {
        margin: 0;
    }
    em {
        font-style: normal;
    }
    .pt-p {
        span {
            line-height: 24px;
            margin-right: 8px;
        }
    }
    .p-flex {
        display: flex;
        justify-content: space-between;
        span {
            flex: 1;
        }
    }
    .delivery-time {
        span {
            display: block;
            height: 34px;
            line-height: 34px;
            padding-left: 5px;
            width: 130px;
            font-weight: bold;
            font-size: 20px;
            margin: auto;
            border: 1px solid #000;
        }
    }

    .pt-title {
        font-weight: 800;
        // height: 26px;
        text-align: center;
        .orgname {
            // font-size: 20px;
            font-weight: bold;
            margin-right: 5px;
        }
    }
    .pt-header {
        display: flex;
        justify-content: space-between;
        align-content: center;
        .lt-info {
            flex: 1;
            .pt-p {
                margin: 15px 0;
                span {
                    line-height: 24px;
                    margin-right: 0;
                    display: inline-block;
                }
                span:nth-of-type(1) {
                    width: 40%;
                }
                span:nth-of-type(2) {
                    width: 28%;
                }
                span:nth-of-type(3) {
                    width: 28%;
                }
            }
        }
    }
    .pt-drugs {
        width: 100%;
        .durg-title {
            display: flex;
            flex: 1;
            justify-content: space-between;
            .dg-pro {
                width: 49.2%;
            }
        }
        .drug-content {
            display: flex;
            flex: 1;
            justify-content: space-between;
            .dg-lt-con,
            .dg-rt-con {
                display: flex;
                flex-wrap: wrap;
                width: 49.2%;
                justify-content: space-around;
            }
            .dg-info {
                width: 100%;
                font-weight: 800;
            }
        }
        .dg-row {
            display: flex;
        }
        .col {
            &-warehouse {
                flex: 1;
                width: 70px;
            }
            &-name {
                flex: 2;
                width: 108px;
                font-size: 18px;
            }
            &-qty {
                flex: 1;
                width: 40px;
            }
            &-unit {
                width: 40px;
            }
            &-note {
                flex: 1;
                width: 120px;
            }
            &-price {
                flex: 1;
                width: 83px;
            }
        }
        .dg-pro {
            span {
                line-height: 18px;
            }
        }
        .dg-info {
            span {
                line-height: 24px;
                text-decoration: underline;
            }
        }
    }
    .pt-drug-amout {
        display: flex;
        justify-content: space-around;
        width: 100%;
        .pt-p {
            flex: 1;
        }
        .advise-range {
            margin-left: 15px;
        }
    }
    .pt-amount-info {
        .pt-p {
            margin: 8px 0;
        }
        span {
            display: inline-block;
            margin-right: 40px;
        }
        .large-span {
            width: 36%;
        }
        .ave-span {
            width: 49%;
            margin-right: 0px;
        }
    }
    .pt-operater {
        .pt-p {
            span {
                width: 178px;
                display: inline-block;
                line-height: 26px;
                margin-right: 6px;
                white-space: nowrap;
            }
        }
    }
    .pt-footer {
        p {
            text-align: center;
        }
    }
    .bar-code {
        text-align: center;
        margin: auto;
    }
}
</style>