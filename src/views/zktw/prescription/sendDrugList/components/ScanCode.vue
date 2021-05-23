<template>
	<el-dialog
		v-el-drag-dialog
		:title="title"
		:width="width"
		top="50px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:visible.sync="isVisible"
		class="scancode-dialog"
	>
		<el-form
			ref="form"
			:inline="true"
			:model="editForm"
			label-position="right"
			label-width="110px"
			:rules="rules"
			style="width:290px;margin:auto;"
		>
			<div
				class="adjust-tip f16 fbold text-center"
				:class="operateOrderStatus?'success-tip':'fail-tip'"
				v-if="this.operateOrderInfo"
			>{{this.operateOrderInfo}}</div>
			<el-form-item label="流水号扫描：" prop="orderNo">
				<el-input
                ref="orderNo"
					:style="{width:itemWidth}"
					v-model="editForm.orderNo"
					clearable
					@keyup.enter.native="getPrescription()"
				/>
			</el-form-item>
			<el-form-item label="患者：">
				<el-input readonly :style="{width:itemWidth}" v-model="editForm.patientName" />
			</el-form-item>
			<el-form-item label="性别：">
				<el-input readonly :style="{width:itemWidth}" v-model="editForm.sex" />
			</el-form-item>
			<el-form-item label="付数：">
				<el-input readonly :style="{width:itemWidth}" v-model="editForm.doseNum" />
			</el-form-item>
			<el-form-item label="小包装数量：">
				<el-input readonly :style="{width:itemWidth}" v-model="editForm.smallPackingNumber" />
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">关闭</el-button>
		</div>
	</el-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'ScanCode',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            operateOrderStatus: true,
            operateOrderInfo: '', //当前操作处方
            disDialog: false,
            itemWidth: '170px',
            editForm: this.initEditForm(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            rules: {
                orderNo: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        ...mapGetters('basic', ['orgArchives']),
        isVisible: {
            get() {
                return this.dialogVisible;
            },
            set() {
                this.close();
                this.reset();
            }
        }
    },
    watch:{
        dialogVisible(val){
            if(val){
                this.$nextTick(() => {
                    this.$refs.orderNo.focus();
                });
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
        //获取处方信息
        getPrescription() {
            if (!this.editForm.orderNo) {
                this.$message({
                    message: '请录入流水号',
                    type: 'warning'
                });
                this.reset();
                return;
            }
            let params = {
                orderNo: this.editForm.orderNo
            };
            this.$api
                .prescription_prescriptionOrder_byOrderNo(params)
                .then((r) => {
                    let { data } = r.data;
                    if (data.orderStatus == 21) {
                        this.editForm = data;
                        this.submit(data);
                    } else {
                        this.$message({
                            message: `此时的扫码处方状态必须为待发药，当前处方状态为【${this.$options.filters[
                                'flOrderStatusName'
                            ](data.orderStatus)}】`,
                            type: 'error'
                        });
                        this.reset();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.reset();
                });
        },

        initEditForm() {
            this.operateOrderStatus = true;
            this.operateOrderInfo = ''; //当前操作处方
            return {
                orderNo: ''
            };
        },
        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 991) {
                return '90%';
            } else if (this.screenWidth < 1400) {
                return '50%';
            } else {
                return '800px';
            }
        },
        close() {
            this.$emit('close');
        },
        //提交
        submit(row) {
            this.$api
                .prescription_prescriptionOrder_scanSendDrug([row.orderNo])
                .then((res) => {
                    this.operateOrderStatus = true;
                    this.operateOrderInfo = `处方${row.orderNo}发药完成`;
                    this.$message({
                        message: `处方${row.orderNo}发药完成`,
                        type: 'success'
                    });
                    this.reset();
                    this.$emit('success');

                })
                .catch((err) => {
                    console.log(err);
                    this.operateOrderInfo = `处方${row.orderNo}发药失败`;
                    this.operateOrderStatus = false;
                });
        },
        reset() {
            // 先清除校验，再清除表单，不然有奇怪的bug
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
            this.editForm = this.initEditForm();
        }
    }
};
</script>
<style lang="scss" scoped>
.adjust-tip {
	padding-bottom: 10px;
}
.success-tip {
	color: #67c23a;
}
.fail-tip {
	color: #f56c6c;
}
.scancode-dialog {
	/deep/ .el-dialog__body {
		padding: 10px 20px 30px;
	}
}
</style>
