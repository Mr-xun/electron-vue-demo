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
			<div class="print-container f16">
				<div class="print-header">
					<h6 class="print-title f18">
						{{ dataInfo.orgName }}处方笺
					</h6>
					<div class="bar-code">
						<VueBarcode
							:value="dataInfo.orderNo"
							width="1"
							height="40"
							fontSize="16"
							format="CODE128"
							marginTop="0"
							marginBottom="0"
							>转码失败</VueBarcode
						>
					</div>
				</div>
				<div class="patient-info">
					<span>姓名: {{ dataInfo.patientName }}</span>
					<span>年龄: {{ dataInfo.age }}</span>
					<span>性别: {{ dataInfo.sex }}</span>
					<span>科室: {{ dataInfo.departmentName }}</span>
				</div>
				<div class="print-body">
					<div class="lt-diagnose">
						<h6 class="lt-title">临床诊断</h6>
						<div class="diagnose-content f14">
							{{ dataInfo.diseaseSpecies }}
						</div>
					</div>
					<div class="rt-drug">
						<div class="drugs-content">
							<span
								v-for="v in dataInfo.prescriptionOrderDetailList"
								:key="v.id"
							>
								{{ v.itemName }}
								<em class="drug-num"
									>{{ v.qty }}{{ v.unit | flUnitName }}</em
								>
							</span>
						</div>
						<div class="prescribe-info f12">
							<p class="flex-between-wrap usage-tip">
								<span>付数：{{ dataInfo.doseNum }}</span>
								<span>服法用量:{{ dataInfo.dosage }}</span>
								<span>开单日期:{{ dataInfo.createTime }}</span>
							</p>
							<p class="flex-between-wrap">
								<span>工艺:{{ dataInfo.technologyName }}</span>
								<span>医师:{{ dataInfo.physician }}</span>
							</p>
							<p v-if="orgInfo.isPrintPrice == 1">
								<span
									>合计金额:{{
										dataInfo.totalAmount | flMoney
									}}</span
								>
							</p>
							<p v-if="orgInfo.isPrintPrice == 1">
								<span
									>单付金额:{{
										dataInfo.singleTotalAmount | flMoney
									}}</span
								>
							</p>
						</div>
					</div>
				</div>
				<div class="print-footer f12">
					<span>审核/调配:</span>
					<span>核对/发药：</span>
					<span>打印时间： {{ printTime }}</span>
				</div>
				<p class="physician-tip f12">
					药师提示：1、请遵医嘱服药；2、请在窗口店庆药品；3、处方当日有效；4、发出药品不予退还；
				</p>
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
            orgInfo: {},
            printTime: parseTime(new Date())
        };
    },
    watch: {
        $route: {
            handler() {
                this.$nextTick(()=>{
                    this.printTime = parseTime(new Date());
                    this.getData();
                });
            },
            immediate: true,
            deep: true
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
                    let p = {
                        id: this.$store.state.account.user.orgId
                    };
                    this.$api
                        .basic_baseOrg_getOneOrg(p)
                        .then((res) => {
                            this.orgInfo = res.data;
                            this.loading = false;
                            this.$nextTick(() => {
                                this.$refs.printBtn.click();
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            this.loading = false;
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
	font-family: "宋体";
	.print-header {
		text-align: center;
		position: relative;
		height: 50px;
		line-height: 50px;
		.print-title {
			padding: 0;
			margin: 0;
		}
		.bar-code {
			position: absolute;
			right: 30px;
			top: 0;
		}
	}
	.patient-info {
		margin-top: 10px;
		margin-bottom: 5px;
		span {
			margin-right: 40px;
		}
	}
	.print-body {
		height: 400px;
		border: 1px solid black;
		display: flex;
		.lt-diagnose {
			width: 10%;
			min-width: 150px;
			border-right: 1px solid #000;
			display: flex;
			flex-direction: column;

			.lt-title {
				text-align: center;
				margin: 0;
				line-height: 24px;
			}
			.diagnose-content {
				display: flex;
				padding-left: 5px;
				flex: 1;
				flex-direction: column;
				justify-content: space-around;
			}
		}
		.rt-drug {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.drugs-content {
				padding-top: 40px;
				padding-left: 5px;
				span {
					display: inline-block;
					width: 22%;
					margin-left: 10px;
					line-height: 25px;
					color: #333;
				}
				em {
					font-size: 15px;
					font-style: normal;
				}
			}
			.prescribe-info {
				padding: 10px;
				.usage-tip {
					margin: 30px 0;
				}
			}
		}
	}
	.print-footer {
		line-height: 22px;
		padding-right: 30px;
		display: flex;
		justify-content: space-between;
		color: #333;
	}
	.physician-tip {
		line-height: 22px;
		color: #989898;
		margin: 0;
	}
}
</style>