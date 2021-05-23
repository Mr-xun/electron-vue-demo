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
			<div class="print-container f20">
				<div class="delivery-time">
					<span>{{ recommendedDeliveryDrugTime }}</span>
				</div>
				<div class="pt-title f18">
					<span class="orgname fbold f20">{{
						dataInfo.orgPrintName
					}}</span
					>中药饮片抓药清单<span class=" " v-if="replaceBoll"
						>&nbsp;[代煎]</span
					>
				</div>
				<div class="split-line">
					<hr />
				</div>
				<div class="pt-header f12">
					<p class="pt-p">
						<span>
							处方号:
							<em class="f16 fbold">{{
								dataInfo.prescriptionNumber
							}}</em>
						</span>
						<span>
							患者编号:
							<em class="f16 fbold">{{
								dataInfo.medicalRecordNumber
							}}</em>
						</span>
					</p>
					<p class="pt-p header-master">
						<span>
							患者:
							<em class="patient-name f32 fbold">{{
								dataInfo.patientName
							}}</em>
						</span>
						<span>
							流水号:
							<em class="patient-name f32 fbold">{{
								dataInfo.orderNo
							}}</em>
						</span>
					</p>
					<p class="pt-p">
						<span>
							性别:
							<em class="f16 fbold">{{
								dataInfo.sex | flSex
							}}</em>
						</span>
						<span>
							年龄:
							<em class="f16 fbold">{{ dataInfo.age }}</em>
						</span>
						<span>
							科室:
							<em class="f16 fbold">{{
								dataInfo.departmentName
							}}</em>
						</span>
					</p>
					<p class="pt-p">
						<span>
							病房:
							<em class="f16 fbold">{{ dataInfo.wardArea }}</em>
						</span>
						<span>
							床号:
							<em class="f16 fbold">{{ dataInfo.bedNumber }}</em>
						</span>
					</p>
				</div>
				<div class="split-line">
					<hr />
				</div>
				<div class="pt-drugs">
					<div class="durg-title">
						<div class="dg-row dg-pro f12">
							<span class="dg-col col-name">品名</span>
							<span class="dg-col col-qty">数量</span>
							<span class="dg-col col-unit">单位</span>
							<span class="dg-col col-note">说明</span>
							<span class="dg-col col-price">单价</span>
						</div>
					</div>
					<div class="drug-content">
						<div
							class="dg-row dg-info f14"
							v-for="(item,
							index) in dataInfo.prescriptionOrderDetailList"
							:key="index"
						>
							<span class="dg-col col-name">{{
								item.itemName
							}}</span>
							<span class="dg-col col-qty">{{ item.qty }}</span>
							<span class="dg-col col-unit">{{
								item.unit | flUnitName
							}}</span>
							<span class="dg-col col-note">{{
								item.remark || "--"
							}}</span>
							<span class="dg-col col-price">{{
								item.price
							}}</span>
						</div>
					</div>
					<div class="drug-info f14">
						<p class="pt-p">
							<span>
								总克数:
								<em class="f16"
									>{{ dataInfo.totalWeight }}克</em
								>
								<em class="advise-range"
									>【{{ dataInfo.permissibleRange2 }}】</em
								>
							</span>
						</p>
						<p class="pt-p">
							<span>
								服法用量:
								<em class="f16">{{ dataInfo.dosage }}</em>
							</span>
						</p>
						<p class="pt-p">
							<span>
								备注:
								<em class="f16">{{
									dataInfo.prescriptionRemarkName
								}}</em>
							</span>
						</p>
					</div>
				</div>
				<div class="split-line">
					<hr />
				</div>
				<div class="pt-amount-info f10">
					<p class="pt-p">
						<span>
							每付药合计金额:
							<em class="f16">{{
								dataInfo.singleTotalAmount
							}}</em>
						</span>
						<span>
							付数:
							<em class="f16">{{ dataInfo.doseNum }}</em>
						</span>
						<span>
							医师:
							<em class="f16">{{ dataInfo.physician }}</em>
						</span>
						<span>
							味数:
							<em class="f16">{{ dataInfo.flavourNumber }}</em>
						</span>
						<span>
							紧急度:
							<em class="f16">{{
								dataInfo.instantLevel | flUrgentName
							}}</em>
						</span>
					</p>
					<p class="pt-p">
						<span>
							收费时间:
							<em>{{ dataInfo.collectionTime }}</em>
						</span>
						<span>
							打印时间:
							<em>{{ printTime | parseTime("{h}:{i}:{s}") }}</em>
						</span>
					</p>
					<p class="pt-p p-flex">
						<span>
							计价员:
							<em>{{ dataInfo.creator }}</em>
						</span>
						<span>
							审核员:
							<em>{{ dataInfo.reviewer }}</em>
						</span>
					</p>
				</div>
				<div class="split-line">
					<hr />
				</div>
				<div class="pt-operater f12">
					<p class="pt-p p-flex">
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
							送药员:
							<em>{{ dataInfo.consigner }}</em>
						</span>
					</p>
					<p class="pt-p p-flex">
						<span>
							调剂员2:
							<em>{{ dataInfo.dispenser2 }}</em>
						</span>
						<span>
							复核员2:
							<em>{{ dataInfo.checker1 }}</em>
						</span>
						<span class="flex2">
							包装员:
							<em>{{ dataInfo.packer }}</em>
						</span>
					</p>
					<p class="pt-p p-flex">
						<span>
							调剂时间:
							<em>{{ dataInfo.dispenserFinishTime }}</em>
						</span>
						<span>
							复核时间:
							<em>{{ dataInfo.checkTime }}</em>
						</span>
						<span class="flex2">
							包装时间:
							<em>{{ dataInfo.packingTime }}</em>
						</span>
					</p>
				</div>
				<div class="split-line">
					<hr />
				</div>
				<div class="pt-footer f12">
					<p class="foot-title">北京同仁堂盛世医院药店销售凭证</p>
					<p class="pt-p">
						<span>
							患者姓名:
							<em>{{ dataInfo.patientName }}</em>
						</span>
						<span>
							性别:
							<em>{{ dataInfo.sex | flSex }}</em>
						</span>
						<span>
							年龄:
							<em>{{ dataInfo.age }}</em>
						</span>
					</p>
					<p class="pt-p">
						<span>
							日期:
							<em>{{ printTime | parseTime("{y}-{m}-{d}") }}</em>
						</span>
						<span>
							付数:
							<em>{{ dataInfo.doseNum }}</em>
						</span>
						<span>
							金额:
							<em>{{ dataInfo.totalAmount }}</em>
						</span>
					</p>
				</div>
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
                    // this.closeSelectedTag(window.selectedTag);
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
        recommendedDeliveryDrugTime() {
            if (this.dataInfo.recommendedDeliveryDrugTime) {
                return this.$options.filters['parseTime'](
                    this.dataInfo.recommendedDeliveryDrugTime,
                    '{h}:{i}'
                );
            }
            return '';
        },
        routes() {
            return this.$store.state.account.routes;
        }
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
        isActive(route) {
            return route.path === this.$route.path;
        },
        toLastView(visitedViews, view) {
            const latestView = visitedViews.slice(-1)[0];
            if (latestView) {
                this.$router.push(latestView);
            } else {
                // now the default is to redirect to the home page if there is no tags-view,
                // you can adjust it according to your needs.
                if (view.name === 'Dashboard') {
                    // to reload home page
                    this.$router.replace({ path: '/redirect' + view.fullPath });
                } else {
                    this.$router.push('/');
                }
            }
        },
        closeSelectedTag(view) {
            this.$store
                .dispatch('tagsView/delView', view)
                .then(({ visitedViews }) => {
                    if (this.isActive(view)) {
                        this.toLastView(visitedViews, view);
                    }
                });
        },
        beforePrint() {
            console.log('before');
        },
        afterPrint() {
            console.log('afterPrint');
        },
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
	width: 600px;
	// font-weight: 800;
	padding-left: 30px;
	box-sizing: content-box;
	font-family: '宋体';
	.split-line {
		height: 20px;
		width: 100%;
		font-weight: normal;
		line-height: 20px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		hr {
			border: none;
			border-bottom: 1px dashed;
			padding: 0;
			margin: 0;
		}
	}
	p {
		margin: 0;
	}
	em {
		font-style: normal;
	}
	.pt-p {
		span {
			line-height: 20px;
			margin-right: 8px;
		}
	}
	.p-flex {
		display: flex;
		justify-content: space-between;
		span {
			flex: 1;
		}
		.flex2 {
			flex: 2;
		}
	}
	.pt-operater {
		span {
			margin-right: 0;
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
		padding-left: 25px;
		font-size: 16px;
		font-weight: 800;
		height: 26px;
		.orgname {
			font-size: 20px;
			font-weight: bold;
			margin-right: 5px;
		}
	}
	.pt-header {
		.header-master {
			line-height: 42px;
		}
	}
	.pt-drugs {
		width: 400px;

		.dg-row {
			display: flex;
		}
		.col {
			&-name {
				width: 108px;
				font-size: 13px;
			}
			&-qty {
				width: 40px;
			}
			&-unit {
				width: 75px;
			}
			&-note {
				width: 83px;
			}
			&-price {
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
				line-height: 20px;
				text-decoration: underline;
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