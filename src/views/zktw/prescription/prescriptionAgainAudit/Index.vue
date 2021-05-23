<template>
	<div class="app-container">
		<div class="adjust-form-container">
			<div
				class="adjust-tip f16 fbold text-center"
				:class="operateOrderStatus ? 'success-tip' : 'fail-tip'"
				v-if="this.operateOrderInfo"
			>
				{{ this.operateOrderInfo }}
			</div>
			<div class="form-wrapper flex-all-center">
				<el-form
					ref="form"
					:inline="true"
					:model="adjustForm"
					label-position="top"
					label-width="70px"
				>
					<el-form-item label="复核人A：" class="adjust-form-item">
						<el-input
							ref="checker1Code"
							:style="{ width: itemWidth }"
							v-model.trim="adjustForm.checker1Code"
							placeholder="复核人A"
							@keyup.enter.native="
								getChecker('A', adjustForm.checker1Code)
							"
						/>
						<span class="adjust-name">{{ checkerAName }}</span>
					</el-form-item>
					<el-form-item label="复核人B：" class="adjust-form-item">
						<el-input
							ref="checker2Code"
							:style="{ width: itemWidth }"
							v-model.trim="adjustForm.checker2Code"
							placeholder="复核人B"
							@keyup.enter.native="
								getChecker('B', adjustForm.checker2Code)
							"
						/>
						<span class="adjust-name">{{ checkerBName }}</span>
					</el-form-item>
					<el-form-item label="流水号：" class="adjust-form-item">
						<el-input
							ref="orderNo"
							:style="{ width: itemWidth }"
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
				style="width: 100%"
				:header-cell-style="{ background: '#eef1f6', color: '#606266' }"
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
    name: 'PrescriptionAgainAudit',
    data() {
        return {
            itemWidth: '200px',
            adjustForm: {
                checker1Code: '',
                checker2Code: '',
                orderNo: ''
            },
            checkerAName: '',
            checkerBName: '',
            operateOrderStatus: true,
            operateOrderInfo: '', //当前操作处方
            choosedData: [
                {
                    labelKey: 'checkerAName',
                    labelName: '复核人A',
                    labelValue: ''
                },
                {
                    labelKey: 'checkerBName',
                    labelName: '复核人B',
                    labelValue: ''
                },
                {
                    labelKey: 'flavourNumber',
                    labelName: '味数',
                    labelValue: ''
                },
                {
                    labelKey: 'doseNum',
                    labelName: '付数',
                    labelValue: ''
                },
                {
                    labelKey: 'notDecoctNum',
                    labelName: '另包不煎',
                    labelValue: ''
                },
                {
                    labelKey: 'patientName',
                    labelName: '患者姓名',
                    labelValue: ''
                },
                {
                    labelKey: 'sex',
                    labelName: '性别',
                    labelValue: ''
                },
                {
                    labelKey: 'age',
                    labelName: '年龄',
                    labelValue: ''
                }
            ]
        };
    },
    mounted() {
        this.resetForm(1);
    },
    activated() {
        if (
            this.adjustForm.checker1Code ||
			this.adjustForm.checkerAName ||
			this.adjustForm.checker2Code
        ) {
            this.$refs['orderNo'].focus();
        }
    },
    methods: {
        //获取复核人A
        getChecker(status, val) {
            if (!val) {
                if (status == 'A') {
                    this.$message({
                        message: '不能为空!',
                        type: 'error'
                    });
                    this[`checker${status}Name`] = '';
                    return;
                } else {
                    this.iptJump(
                        'checker2Code',
                        '复核人B',
                        'orderNo',
                        this.adjustForm.checker2Code,
                        false
                    );
                    return;
                }
            }
            if (status === 'B' && !this.adjustForm.checker1Code) {
                this.$message({
                    message: '请优先录入复核人A',
                    type: 'warning'
                });
                this.adjustForm.checker2Code = '';
                this.checkerBName = '';
                return;
            }

            if (this.adjustForm.checker2Code == this.adjustForm.checker1Code) {
                this.$message({
                    message: '复核人不能相同！',
                    type: 'warning'
                });
                this.adjustForm.checker2Code = '';
                this.checkerBName = '';
                return;
            }
            let params = {
                code:
					status === 'A'
					    ? this.adjustForm.checker1Code
					    : this.adjustForm.checker2Code,
                pageSize: 10,
                pageNum: 1
            };
            this.$get('system/user', {
                ...params
            })
                .then(r => {
                    let { rows, total } = r.data.data;
                    if (total) {
                        this[`checker${status}Name`] = rows[0].fullname;
                        if (status == 'A') {
                            this.iptJump(
                                'checker1Code',
                                '复核人A',
                                'checker2Code',
                                this.adjustForm.checker1Code
                            );
                        }
                        if (status == 'B') {
                            this.iptJump(
                                'checker2Code',
                                '复核人B',
                                'orderNo',
                                this.adjustForm.checker2Code
                            );
                        }
                    } else {
                        this.$message({
                            message: `复核人${status}不存在`,
                            type: 'warning'
                        });
                        this.adjustForm[`checker${status == 'A' ? 1 : 2}Code`] =
							'';
                        this[`checker${status}Name`] = '';
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.adjustForm[`checker${status == 'A' ? 1 : 2}Code`] = '';
                    this[`checker${status}Name`] = '';
                });
        },
        //获取处方信息
        getPrescription() {
            if (!this.adjustForm.checker1Code) {
                this.$message({
                    message: '请录入复核人A',
                    type: 'warning'
                });
                this.adjustForm.orderNo = '';
                return;
            }
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
                .then(r => {
                    let { data } = r.data;
                    if (data.orderStatus == 14) {
                        this.submit(data);
                    } else {
                        this.$message({
                            message: `此时的扫码处方状态必须为待复核，当前处方状态为【${this.$options.filters[
                                'flOrderStatusName'
                            ](data.orderStatus)}】`,
                            type: 'warning'
                        });
                        this.adjustForm.orderNo = '';
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.adjustForm.orderNo = '';
                });
        },
        //提交
        submit(row) {
            this.$api
                .prescription_prescriptionOrder_prescriptionAgainAudit(
                    this.adjustForm
                )
                .then(res => {
                    this.operateOrderStatus = true;
                    this.operateOrderInfo = `处方${row.orderNo}复核成功`;
                    this.$message({
                        message: `处方${row.orderNo}复核成功`,
                        type: 'success'
                    });
                    this.choosedData.forEach(item => {
                        if (item.labelKey == 'checkerAName') {
                            this.$set(item, 'labelValue', this.checkerAName);
                        } else if (item.labelKey == 'checkerBName') {
                            this.$set(item, 'labelValue', this.checkerBName);
                        } else {
                            item.labelValue = row[item.labelKey];
                        }
                    });
                    this.iptJump(
                        'orderNo',
                        '流水号',
                        'orderNo',
                        this.adjustForm.orderNo
                    );
                    this.resetForm();
                })
                .catch(err => {
                    console.log(err);
                    this.operateOrderInfo = `处方${row.orderNo}复核失败`;
                    this.operateOrderStatus = false;
                });
        },
        //重置表单  type  1初始化页面  2 提交后
        resetForm(type) {
            this.adjustForm.checker2Code = '';
            this.adjustForm.orderNo = '';
            this.checkerBName = '';
            if (type == 1) {
                this.adjustForm.checker1Code = '';
                this.checkerAName = '';
                this.$refs['checker1Code'].focus();
            } else {
                this.$refs['orderNo'].focus();
            }
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
