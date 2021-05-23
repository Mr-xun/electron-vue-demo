<template>
	<div class="app-container">
		<div class="adjust-form-container">
			<div
				class="adjust-tip f16 fbold text-center"
				:class="operateOrderStatus?'success-tip':'fail-tip'"
				v-if="this.operateOrderInfo"
			>{{this.operateOrderInfo}}</div>
			<div class="form-wrapper flex-all-center">
				<el-form ref="form" :inline="true" :model="adjustForm" label-position="top" label-width="70px">
					<el-form-item label="加工人：" class="adjust-form-item">
						<el-input
							ref="processingPersionCode"
							:style="{width:itemWidth}"
							v-model.trim="adjustForm.processingPersionCode"
							placeholder="加工人"
							@keyup.enter.native="getProcessingPersioner(adjustForm.processingPersionCode)"
						/>
						<span class="adjust-name">{{processingPersionName}}</span>
					</el-form-item>
					<el-form-item label="流水号：" class="adjust-form-item">
						<el-input
							ref="orderNo"
							:style="{width:itemWidth}"
							v-model.trim="adjustForm.orderNo"
							placeholder="流水号"
							@keyup.enter.native="getPrescription()"
						/>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="center-container choosed-data-wrapper">
			<el-table
				ref="table"
				:data="choosedData"
				border
				fit
				style="width: 100%;"
				:header-cell-style="{background:'#eef1f6',color:'#606266'}"
				stripe
			>
				<el-table-column
					label="项目"
					prop="labelName"
					align="center"
					min-width="100px"
					:show-overflow-tooltip="true"
				></el-table-column>
				<el-table-column
					label="信息"
					prop="labelValue"
					align="center"
					min-width="100px"
					:show-overflow-tooltip="true"
				></el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
export default {
    name: 'ProcessingRegistration',
    data() {
        return {
            itemWidth: '200px',
            adjustForm: {
                processingPersionCode: '',
                orderNo: ''
            },
            processingPersionName: '',
            operateOrderStatus: true,
            operateOrderInfo: '', //当前操作处方
            choosedData: [
                {
                    labelKey: 'patientName',
                    labelName: '患者姓名',
                    labelValue: ''
                },
                {
                    labelKey: 'doseNum',
                    labelName: '付数',
                    labelValue: ''
                },
                {
                    labelKey: 'technologyName',
                    labelName: '加工类型',
                    labelValue: ''
                }

            ]
        };
    },
    activated(){
        this.resetForm();
    },
    methods: {
        //获取加工人
        getProcessingPersioner(val) {
            if (!val) {
                this.$message({
                    message: '不能为空!',
                    type: 'error'
                });
                this.processingPersionName = '';
                return;
            }
            let params = {
                code: this.adjustForm.processingPersionCode,
                pageSize: 10,
                pageNum: 1
            };
            this.$get('system/user', {
                ...params
            })
                .then((r) => {
                    let { rows, total } = r.data.data;
                    if (total) {
                        this.processingPersionName = rows[0].fullname;
                        this.iptJump(
                            'processingPersionCode',
                            '加工人',
                            'orderNo',
                            this.adjustForm.processingPersionCode
                        );
                    } else {
                        this.$message({
                            message: '加工人不存在',
                            type: 'warning'
                        });
                        this.adjustForm.processingPersionCode = '';
                        this.processingPersionName = '';
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.adjustForm.processingPersionCode = '';
                    this.processingPersionName = '';
                });
        },
        //获取处方信息
        getPrescription() {
            if (!this.adjustForm.orderNo) {
                this.$message({
                    message: '请录入流水号',
                    type: 'warning'
                });
                this.adjustForm.orderNo = '';
                return;
            }
            let params = {
                orderNo: this.adjustForm.orderNo
            };
            this.$api
                .prescription_prescriptionOrder_byOrderNo(params)
                .then((r) => {
                    let { data } = r.data;
                    if (data.orderStatus == 17) {
                        this.submit(data);
                    } else {
                        this.$message({
                            message: `此时的扫码处方状态必须为包装称重完成，当前处方状态为【${this.$options.filters[
                                'flOrderStatusName'
                            ](data.orderStatus)}】`,
                            type: 'error'
                        });
                        this.adjustForm.orderNo = '';
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.adjustForm.orderNo = '';
                });
        },
        //提交
        submit(row) {
            this.$api
                .prescription_prescriptionOrder_processingRegistration(
                    this.adjustForm
                )
                .then((res) => {
                    this.operateOrderStatus = true;
                    this.operateOrderInfo = `处方${row.orderNo}加工登记完成`;
                    this.$message({
                        message: `处方${row.orderNo}加工登记完成`,
                        type: 'success'
                    });
                    this.choosedData.forEach((item) => {
                        item.labelValue = row[item.labelKey];
                    });
                    this.resetForm();
                })
                .catch((err) => {
                    console.log(err);
                    this.operateOrderInfo = `处方${row.orderNo}加工登记失败`;
                    this.operateOrderStatus = false;
                });
        },
        //重置表单
        resetForm() {
            this.adjustForm.processingPersionCode = '';
            this.adjustForm.orderNo = '';
            this.processingPersionName = '';
            this.$refs['processingPersionCode'].focus();
        },
        /**
		 * @param {String} curRefKey 当前refKey
		 * @param {String} nextRefkey 当前refKey
		 * @param {String} curRefname 当前ref名字
		 * @param {String} val 输入框值
		 * @param {Boolean} verify 是否验证已输入
		 * @description input enter跳转
		 */
        iptJump(
            curRefKey,
            curRefname,
            nextRefkey,
            val,
            verify = true,
            autoCom = false
        ) {
            if (verify && !val) {
                this.$message({
                    message: `请输入${curRefname}`,
                    type: 'warning'
                });
            } else {
                this.$nextTick(() => {
                    setTimeout(() => {
                        if (autoCom) {
                            this.$refs[curRefKey].suggestions = [];
                        } else {
                            this.$refs[curRefKey].blur();
                        }
                        this.$refs[nextRefkey].focus();
                    }, 100);
                });
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.adjust-form-container {
	padding: 10px 10px 10px;
	margin-bottom: 5px;
	background: #fff;
	border-radius: 5px;
	.success-tip {
		color: #67c23a;
	}
	.fail-tip {
		color: #f56c6c;
	}
	.adjust-form-item {
		margin-right: 0;
		/deep/ .el-form-item__label {
			padding: 0;
		}
		.adjust-name {
			margin-left: 5px;
			color: red;
			font-size: 18px;
			font-weight: bold;
		}
	}
}
.choosed-data-wrapper {
	padding: 10px 10px 20px 10px;
}
</style>
