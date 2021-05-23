S<template>
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
			<div class="print-container f14">
				<div class="print-title fbold">
					{{ dataInfo.orgName }}中药饮片送货单
				</div>
				<div class="print-tip f16">
					<div class="pt-row">【温馨提示】</div>
					<div class="pt-row">
						&nbsp;&nbsp;&nbsp;&nbsp;
						我们保证药品送出时包装完好无损。请您在收到药品时当场仔细核对数量及处方信息是否正确。如发现药品缺少、包装破损或处方信息不正确请当场指出并拒收，由送货员与调剂中心联系，我们将为您重新配送。如您已签收或他人代为签收，则视为包装完好，数量正确，感谢您对我们工作的支持！
					</div>
					<div class="pt-row">联系电话：010-65238966</div>
				</div>
				<div class="split-line fbold">
					----------------------------------------------
				</div>
				<div class="patient-info f13 fbold">
					<div class="pt-row">
						<span
							>患者：<em class="f30">{{
								dataInfo.patientName
							}}</em
							></span
						>
						<span>流水号<em class="orderNo f30">{{ dataInfo.orderNo }}</em></span>
					</div>
					<div class="pt-row">
						<span>性别：{{ dataInfo.sex |flSex }}</span>
						<span>年龄：{{ dataInfo.age }}</span>
						<span>电话：{{ dataInfo.tel }}</span>
					</div>
					<div class="pt-row">
						地址：{{ dataInfo.address }}
					</div>
				</div>
				<div class="split-line fbold">
					----------------------------------------------
				</div>
				<div class="drug-info f14">
					<div class="pt-row">
						<span
							>付数：{{ dataInfo.doseNum }} 付<em
								><em v-if="replaceBoll">(代煎)</em> </em
							></span
						>
						<span> 包装总重量：<i class="blank">{{dataInfo.totalWeight}}</i> 克</span>
					</div>
					<div class="pt-row">
						<span>包装内有：另包药 <i class="blank">{{dataInfo.notDecoctNum}}</i>袋</span>
						<span>细料药 <i class="blank">{{dataInfo.itemName}}</i>瓶/盒/袋</span>
					</div>
				</div>
				<div class="split-line fbold">
					----------------------------------------------
				</div>
				<div class="input-info">
					<div class="pt-row">
						关系：本人<em class="checkbox">□</em>亲属<em
							class="checkbox"
							>□</em
						>同事<em class="checkbox">□</em>其他<em class="checkbox"
							>□</em
						><i class="line-blank">_______________</i>
					</div>
					<div class="pt-row">
						<span class="ipt-span"
							>接收人签字<i class="line-blank"
								>_______________</i
							></span
						>
						<span class="ipt-span"
							>接收时间<i class="line-blank"
								>_______________</i
							></span
						>
					</div>
					<div class="pt-row">
						<span class="ipt-span">
							送货人签字<i class="line-blank"
								>_______________</i
							></span
						>
					</div>
				</div>
				<div class="bar-code">
					<VueBarcode
						:value="dataInfo.orderNo"
						:displayValue="false"
						width="1"
						height="40"
						fontSize="16"
						format="CODE128"
						marginTop="0"
						marginBottom="0"
						>{{ dataInfo.orderNo }}</VueBarcode
					>
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
                endCallback: (e) => {
                    console.log(e, 333);
                }
            },
            loading: false,
            dataInfo: {}
        };
    },
    computed:{
        replaceBoll(){//判断是否代煎
            if(this.dataInfo.technologyName){
                if (this.dataInfo.technologyName.indexOf('代煎') != -1) {
                    return true;
                }else{
                    return false;
                }
            }
        }

    },
    watch: {
        $route: {
            handler() {
                this.$nextTick(()=>{
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
	width: 400px;
	padding-bottom: 20px;
	font-family: "宋体";
	.print-title {
		font-size: 20px;
		font-weight: bold;
		font-family: 黑体;
		text-align: center;
	}
	.print-tip {
		line-height: 18px;
	}
	.patient-info {
		em {
			margin-right: 5px;
		}
		.orderNo {
			display: block;
		}
		.pt-row {
			margin-top: 3px;
		}
	}
	.drug-info {
		.pt-row {
			line-height: 18px;
		}
		span {
			display: inline-block;
			width: 180px;
		}
		em {
			margin-left: 5px;
		}
		.blank {
			display: inline-block;
			min-width: 20px;
            font-style: normal;
		}
	}
	.input-info {
		.pt-row {
			margin-bottom: 8px;
		}
		.checkbox {
			font-size: 24px;
			margin: 0 5px;
		}
		.ipt-span {
			display: inline-block;

			width: 180px;
		}
		.line-blank {
			margin-left: 2px;
		}
	}
}
</style>