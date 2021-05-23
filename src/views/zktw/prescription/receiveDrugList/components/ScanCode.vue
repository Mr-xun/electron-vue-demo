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
			label-width="135px"
			style="text-align: center"
		>
			<el-form-item label="流水号扫描：">
				<el-input
					ref="orderNo"
					:style="{ width: itemWidth }"
					v-model="editForm.orderNo"
					@keyup.enter.native="getPrescription()"
				/>
			</el-form-item>
		</el-form>
		<div class="choosed-data">
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
					label="流水号"
					prop="orderNo"
					align="center"
					min-width="120px"
					:show-overflow-tooltip="true"
				></el-table-column>
				<el-table-column
					label="处方号"
					prop="prescriptionNumber"
					align="center"
					min-width="100px"
					:show-overflow-tooltip="true"
				></el-table-column>
				<el-table-column
					label="患者姓名"
					prop="patientName"
					align="center"
					min-width="100px"
					:show-overflow-tooltip="true"
				></el-table-column>
				<el-table-column
					label="性别"
					prop="sex"
					align="center"
					min-width="60px"
					:show-overflow-tooltip="true"
				></el-table-column>
				<el-table-column
					label="年龄"
					prop="age"
					align="center"
					min-width="60px"
					:show-overflow-tooltip="true"
				></el-table-column>
				<el-table-column
					label="操作"
					align="center"
					min-width="60px"
					fixed="right"
					class-name="small-padding fixed-width"
				>
					<template slot-scope="{ row, $index }">
						<i
							class="el-icon-delete table-operation"
							style="color: #f50"
							@click="singleDelete(row, $index)"
						/>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button
				type="warning"
				plain
				:loading="buttonLoading"
				@click="isVisible = false"
				>取消</el-button
			>
			<el-button
				type="primary"
				plain
				:loading="buttonLoading"
				@click="submitForm"
				>确定</el-button
			>
		</div>
	</el-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'SupplierEdit',
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
            disDialog: false,
            itemWidth: '225px',
            editForm: this.initEditForm(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            choosedData: []
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
    watch: {
        dialogVisible(val) {
            if (val) {
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
                this.editForm.orderNo = '';
                return;
            }
            let params = {
                orderNo: this.editForm.orderNo,
                pageSize: 10,
                pageNum: 1
            };
            this.$api
                .prescription_prescriptionOrder_list(params)
                .then((r) => {
                    let { rows, total } = r.data.result;
                    if (total) {
                        if (rows[0].orderStatus) {
                            let isRepet = this.choosedData.some(
                                (item) => (item.id = rows[0].id)
                            );
                            if (isRepet) {
                                this.$message({
                                    message: '该处方已存在',
                                    type: 'error'
                                });
                            } else {
                                this.choosedData.push(rows[0]);
                            }
                        } else {
                            this.$message({
                                message: `此时的扫码处方状态必须为调剂中，当前处方状态为【${this.$options.filters[
                                    'flOrderStatusName'
                                ](rows[0].orderStatus)}】`,
                                type: 'error'
                            });
                        }
                    } else {
                        this.$message({
                            message: '该处方不存在',
                            type: 'error'
                        });
                    }
                    this.editForm.orderNo = '';
                })
                .catch((err) => {
                    console.log(err);
                    this.editForm.orderNo = '';
                });
        },
        initEditForm() {
            this.choosedData = [];
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
        singleDelete(row, index) {
            this.$confirm('选中数据将被移除, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.choosedData.splice(index, 1);
            });
        },
        setEditForm(val) {
            this.editForm = { ...val };
        },
        close() {
            this.$emit('close');
        },
        submitForm() {
            if (!this.choosedData.length) {
                this.$message({
                    message: '请扫码提交',
                    type: 'waring'
                });
                return;
            }
            this.buttonLoading = true;
            this.$api
                .prescription_prescriptionOrder_scanReceiveDrug(
                    this.choosedData.map((item) => item.orderNo)
                )
                .then((res) => {
                    let { code } = res.data;
                    if (code == 200) {
                        this.isVisible = false;
                        this.$message({
                            message: '扫码收货成功',
                            type: 'success'
                        });
                        this.$emit('success');
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    this.buttonLoading = false;
                })
                .catch((err) => {
                    this.buttonLoading = false;
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
.disable-store {
	display: flex;
	>>> .el-form-item__content {
		display: flex;
		align-items: center;
	}
}
</style>
