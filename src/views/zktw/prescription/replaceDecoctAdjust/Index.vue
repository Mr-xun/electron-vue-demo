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
					<el-form-item label="调剂师A：" class="adjust-form-item">
						<el-input
							ref="dispenser1Code"
							:style="{width:itemWidth}"
							v-model.trim="adjustForm.dispenser1Code"
							placeholder="调剂师A"
							@keyup.enter.native="getDispenser('A',adjustForm.dispenser1Code)"
						/>
						<span class="adjust-name">{{dispenserAName}}</span>
					</el-form-item>
					<el-form-item label="调剂师B：" class="adjust-form-item">
						<el-input
							ref="dispenser2Code"
							:style="{width:itemWidth}"
							v-model.trim="adjustForm.dispenser2Code"
							placeholder="调剂师B"
							@keyup.enter.native="getDispenser('B',adjustForm.dispenser2Code)"
						/>
						<span class="adjust-name">{{dispenserBName}}</span>
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
    name: 'ReplaceDecoctAdjust',
    data() {
        return {
            itemWidth: '200px',
            adjustForm: {
                dispenser1Code: '',
                dispenser2Code: '',
                orderNo: ''
            },
            dispenserAName: '',
            dispenserBName: '',
            operateOrderStatus: true,
            operateOrderInfo: '', //当前操作处方
            choosedData: [
                {
                    labelKey: 'dispenserAName',
                    labelName: '调剂师A',
                    labelValue: ''
                },
                {
                    labelKey: 'dispenserBName',
                    labelName: '调剂师B',
                    labelValue: ''
                },
                {
                    labelKey: 'warehouseName',
                    labelName: '出库库房',
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
    activated(){
        this.resetForm();
    },
    methods: {
        //获取调剂师A
        getDispenser(status, val) {
            if (!val) {
                this.$message({
                    message: '不能为空!',
                    type: 'error'
                });
                this[`dispenser${status}Name`] = '';
                return;
            }
            if (status === 'B' && !this.adjustForm.dispenser1Code) {
                this.$message({
                    message: '请优先录入调剂师A',
                    type: 'warning'
                });
                this.adjustForm.dispenser2Code = '';
                this.dispenserBName = '';
                return;
            }

            if (
                this.adjustForm.dispenser2Code == this.adjustForm.dispenser1Code
            ) {
                this.$message({
                    message: '调剂师不能相同！',
                    type: 'warning'
                });
                this.adjustForm.dispenser2Code = '';
                this.dispenserBName = '';
                return;
            }
            let params = {
                code:
					status === 'A'
					    ? this.adjustForm.dispenser1Code
					    : this.adjustForm.dispenser2Code,
                pageSize: 10,
                pageNum: 1
            };
            this.$get('system/user', {
                ...params
            })
                .then((r) => {
                    let { rows, total } = r.data.data;
                    if (total) {
                        this[`dispenser${status}Name`] = rows[0].fullname;
                        if (status == 'A') {
                            this.iptJump(
                                'dispenser1Code',
                                '调剂师A',
                                'dispenser2Code',
                                this.adjustForm.dispenser1Code
                            );
                        }
                        if (status == 'B') {
                            this.iptJump(
                                'dispenser2Code',
                                '调剂师B',
                                'orderNo',
                                this.adjustForm.dispenser2Code
                            );
                        }
                    } else {
                        this.$message({
                            message: `调剂师${status}不存在`,
                            type: 'warning'
                        });
                        this.adjustForm[
                            `dispenser${status == 'A' ? 1 : 2}Code`
                        ] = '';
                        this[`dispenser${status}Name`] = '';
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.adjustForm[`dispenser${status == 'A' ? 1 : 2}Code`] =
						'';
                    this[`dispenser${status}Name`] = '';
                });
        },
        //获取处方信息
        getPrescription() {
            if (!this.adjustForm.dispenser1Code) {
                this.$message({
                    message: '请录入调剂师A',
                    type: 'warning'
                });
                this.adjustForm.orderNo = '';
                return;
            }
            if (!this.adjustForm.dispenser2Code) {
                this.$message({
                    message: '请录入调剂师B',
                    type: 'warning'
                });
                this.adjustForm.orderNo = '';
                return;
            }
            if (
                !this.adjustForm.dispenser1Code &&
				!this.adjustForm.dispenser2Code
            ) {
                this.$message({
                    message: '请录入调剂师A和调剂师B',
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
                .then((r) => {
                    let { data  } = r.data;
                    if (data.orderStatus == 12) {
                        this.submit(data);
                    } else {
                        this.$message({
                            message: `此时的扫码处方状态必须为待调剂，当前处方状态为【${this.$options.filters[
                                'flOrderStatusName'
                            ](data.orderStatus)}】`,
                            type: 'warning'
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
                .prescription_prescriptionOrder_replaceDecoctAdjust(
                    this.adjustForm
                )
                .then((res) => {
                    this.operateOrderStatus = true;
                    this.operateOrderInfo = `处方${row.orderNo}代煎调剂完成`;
                    this.$message({
                        message: `处方${row.orderNo}代煎调剂完成`,
                        type: 'success'
                    });
                    this.choosedData.forEach((item) => {
                        if(item.labelKey =='dispenserAName'){
                            this.$set(item,'labelValue',this.dispenserAName);
                        }else if(item.labelKey =='dispenserBName'){
                            this.$set(item,'labelValue',this.dispenserBName);
                        }else{
                            item.labelValue = row[item.labelKey];
                        }
                    });
                    this.iptJump(
                        'orderNo',
                        '流水号',
                        'dispenser1Code',
                        this.adjustForm.orderNo
                    );
                    this.resetForm();
                })
                .catch((err) => {
                    console.log(err);
                    this.operateOrderInfo = `处方${row.orderNo}代煎调剂失败`;
                    this.operateOrderStatus = false;
                    console.log(this.operateOrderInfo);
                });
        },
        //重置表单
        resetForm() {
            this.adjustForm.dispenser1Code = '';
            this.adjustForm.dispenser2Code = '';
            this.adjustForm.orderNo = '';
            this.dispenserAName = '';
            this.dispenserBName = '';
            this.$refs['dispenser1Code'].focus();
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
