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
			label-width="100px"
		>

			<el-form-item label="来源机构：">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.orgId"
					@change="
						getTargetName($event, 'id', 'orgArchives', 'orgName')
					"
					filterable
					style="width: 100%"
				>
					<el-option
						v-for="item in orgArchives"
						:key="item.id"
						:label="item.name"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="患者名称：" prop="name">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.name"
					@input="flPinyin"
				/>
			</el-form-item>
			<el-form-item label="患者编码：">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.code"
					:disabled="!!editForm.id"
				/>
			</el-form-item>
			<el-form-item label="出生年：" >
				<el-date-picker
					:style="{ width: itemWidth }"
					v-model="editForm.dateBirth"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择日期"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="性别：" prop="sex">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.sex"
					placeholder="性别"
				>
					<el-option label="男" :value="1"></el-option>
					<el-option label="女" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态：" prop="status">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.status"
					placeholder="请选择"
				>
					<el-option label="有效" :value="1"></el-option>
					<el-option label="无效" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="地址：">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.address"
				/>
			</el-form-item>
			<el-form-item label="电话：">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.tel"
				/>
			</el-form-item>
			<el-form-item label="X坐标：">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.coordinateX"
				/>
			</el-form-item>
			<el-form-item label="Y坐标：">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.coordinateY"
				/>
			</el-form-item>
			<el-form-item label="距离：">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.distance"
				/>
			</el-form-item>
			<el-form-item label="备注：">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.remark"
				/>
			</el-form-item>
		</el-form>
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
    name: 'BasePatieninfEdit',
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
        var checkCode = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('不能为空'));
            } else {
                if (!this.editForm.id) {
                    let params = {
                        code: value
                    };
                    this.$api
                        .basic_basePatieninf_checkCode(params)
                        .then(res => {
                            let { result } = res.data;
                            if (result) {
                                return callback();
                            } else {
                                return callback(new Error('编码不能重复'));
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            return callback(
                                new Error('系统错误，编码验证失败')
                            );
                        });
                } else {
                    return callback();
                }
            }
        };
        return {
            itemWidth: '170px',
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
                code: [
                    {
                        validator: checkCode,
                        required: true,
                        trigger: 'blur'
                    }
                ],
                name: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                dateBirth: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                sex: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                status: [
                    { required: true, message: '不能为空', trigger: 'change' }
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
        flPinyin(text) {
            this.editForm.shorthandCode = this.$pinyin.getCamelChars(text);
        },
        getTargetName(val, key, options, targetKey) {
            this[options].forEach(item => {
                if (item[key] == val) {
                    this.editForm[targetKey] = item.name;
                }
            });
        },
        initEditForm() {
            return {
                address: '',
                code: '',
                coordinateX: '',
                coordinateY: '',
                dateBirth: '',
                distance: '',
                name: '',
                orgId: '',
                remark: '',
                sex: null,
                status: null,
                tel: ''
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
        setEditForm(val) {
            this.editForm = { ...val };
        },
        close() {
            this.$emit('close');
        },
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.buttonLoading = true;
                    if (!this.editForm.id) {
                        // create
                        this.$api
                            .basic_basePatieninf_add(this.editForm)
                            .then(res => {
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
                            .catch(err => {
                                this.buttonLoading = false;
                            });
                    } else {
                        // update
                        this.$api
                            .basic_basePatieninf_update(this.editForm)
                            .then(res => {
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
                            .catch(err => {
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
