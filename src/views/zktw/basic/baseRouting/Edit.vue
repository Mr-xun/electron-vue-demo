<template>
	<el-dialog
		v-el-drag-dialog
		:title="title"
		:width="width"
		top="50px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:visible.sync="isVisible"
		class="product-dialog"
	>
		<el-form
			ref="form"
			:inline="true"
			:model="editForm"
			:rules="rules"
			label-position="right"
			label-width="125px"
		>
			<el-form-item label="线路名称：" prop="lineName">
				<el-input :style="{width:itemWidth}" v-model="editForm.lineName" />
			</el-form-item>
			<el-form-item label="积分：" prop="integral">
				<el-input-number :min='1' controls-position="right"  :style="{width:itemWidth}" v-model="editForm.integral" />
			</el-form-item>
			<el-form-item label="基础剂数：" prop="baseNumber">
				<el-input-number :min='1' controls-position="right"  :style="{width:itemWidth}" v-model="editForm.baseNumber" />
			</el-form-item>
			<el-form-item label="备注：">
				<el-input
					:style="{width:itemWidth}"
					type="textarea"
					:autosize="{ minRows: 1, maxRows: 1}"
					v-model="editForm.remark"
				/>
			</el-form-item>
			<el-divider content-position="center">线路安排</el-divider>
			<line-plan ref="linePlan" :type="1" :table-data="editForm.baseRoutingOrgList" />
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">取消</el-button>
			<el-button type="primary" plain :loading="buttonLoading" @click="submitForm">确定</el-button>
		</div>
	</el-dialog>
</template>
<script>
import LinePlan from './compontents/LinePlan';
import { mapGetters } from 'vuex';
export default {
    name: 'BaseRoutingEdit',
    components: {
        LinePlan
    },
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
            linePlanData: [],
            itemWidth: '225px',
            editForm: this.initEditForm(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            rules: {
                orgid: [
                    {
                        message: '不能为空',
                        required: true,
                        trigger: 'change'
                    }
                ],
                lineName: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                baseNumber: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                integral: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }
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
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    methods: {
        getTargetName(val, options, targetKey) {
            this[options].forEach((item) => {
                if (item.enumId == val) {
                    this.editForm[targetKey] = item.name;
                }
            });
        },
        initEditForm() {
            return {
                baseNumber: '',
                baseRoutingOrgList: [
                    {
                        integralBase: '',
                        isExecuteDecoctingMultiple: '',
                        orgId: '',
                        orgName: '',
                        routintgId: '',
                        serialNumber: ''
                    }
                ],
                integral: '',
                lineName: '',
                remark: ''
            };
        },
        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 991) {
                return '90%';
            } else if (this.screenWidth < 1400) {
                return '70%';
            } else {
                return '80%';
            }
        },
        setEditForm(val) {
            this.editForm = JSON.parse(JSON.stringify(val));
            this.$nextTick(()=>{
                this.$refs.linePlan.initFlOrg();
            });
        },
        close() {
            this.$emit('close');
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (!this.editForm.id) {
                        // create
                        this.$api
                            .basic_baseRouting_add(this.editForm)
                            .then((res) => {
                                let { code } = res.data;
                                if (code == 200) {
                                    this.isVisible = false;
                                    this.$message({
                                        message: '新增成功',
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
                    } else {
                        // update
                        this.$api
                            .basic_baseRouting_update(this.editForm)
                            .then((res) => {
                                let { code } = res.data;
                                if (code == 200) {
                                    this.isVisible = false;
                                    this.$message({
                                        message: '修改成功',
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
                    }
                } else {
                    return false;
                }
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
