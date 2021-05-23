<template>
    <div class="print-page" v-loading="loading">
        <el-divider>
            <button ref="printBtn" v-print="printObj" plain class="submit-btn" type="success" icon="el-icon-printer" size="small">
                打印
            </button>
        </el-divider>
        <div id="printMe">
            <div class="print-container f13">
                <div class="pt-row">
                    <span class="">{{ dataInfo.orgPrintName }}</span>
                    <span class="" v-if="replaceBoll">[代煎]</span>
                    <span class="">{{ dataInfo.departmentName }}</span>
                </div>
                <div class="pt-row">
                    <span class="f16">{{ dataInfo.patientName }}</span>
                    <span>{{ dataInfo.sex | flSex }}</span>
                    <span>{{ `${dataInfo.age}  ${dataInfo.doseNum}付` }}</span>
                    <span class="fbold" v-if="dataInfo.isWard">{{
                        dataInfo.isWard | flClincOrWard
                    }}</span>
                </div>
                <div class="pt-row">
                    <span>{{ dataInfo.medicalRecordNumber }}</span>
                    <span class="fbold" v-if="dataInfo.isWard == 1">{{ dataInfo.wardArea }}-{{ dataInfo.bedNumber }}</span>
                </div>
                <div class="pt-row">
                    <span class="f12 wrap-span">{{ dataInfo.dosage }}</span>
                </div>

                <div class="bar-code">
                    <VueBarcode :value="dataInfo.orderNo" width="1" height="35" fontSize="14" format="CODE128" fontOptions="bold" :margin="1" :displayValue="false">转码失败</VueBarcode>
                </div>
                <div class="pt-row flex-all-center">
                    <span class="f14">{{
                        $moment(dataInfo.createTime).format("YY/DD/MM")
                    }}</span>
                    <span class="fbold">{{ dataInfo.orderNo }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import VueBarcode from 'vue-barcode';
export default {
    components: { VueBarcode },
    data() {
        return {
            printObj: {
                id: 'printMe',
                popTitle: '打印',
                endCallback: e => {
                    console.log(e, 333);
                }
            },
            loading: false,
            dataInfo: {}
        };
    },
    watch: {
        $route: {
            handler() {
                this.$nextTick(() => {
                    this.getData();
                });
            },
            immediate: true,
            deep: true
        }
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
                .then(r => {
                    let { data } = r.data;
                    this.dataInfo = data;
                    this.loading = false;
                    this.$nextTick(() => {
                        this.$refs.printBtn.click();
                    });
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.print-container {
    text-align: center;
    font-family: "宋体";
    padding: 4px 8px 2px;
    .pt-row {
        line-height: 1.1;
        white-space: nowrap;
        .wrap-span {
            white-space: normal;
        }
    }
}
</style>