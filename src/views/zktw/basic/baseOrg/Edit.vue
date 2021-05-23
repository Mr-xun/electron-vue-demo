<template>
	<div>
		<el-dialog
			v-el-drag-dialog
			:title="title"
			:width="width"
			top="50px"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:visible.sync="isVisible"
		>
			<el-form
				ref="form"
				:inline="true"
				:model="editForm"
				:rules="rules"
				label-position="right"
				label-width="140px"
			>
				<el-form-item label="机构名称：" prop="name">
					<el-input
						:style="{ width: itemWidth }"
						v-model="editForm.name"
						@input="flPinyin"
					/>
				</el-form-item>
				<el-form-item label="机构编码：" prop="code">
					<el-input
						:style="{ width: itemWidth }"
						v-model="editForm.code"
						:disabled="!!editForm.id"
					/>
				</el-form-item>
				<el-form-item label="HIS编码：">
					<el-input
						:style="{ width: itemWidth }"
						v-model="editForm.hisCode"
					/>
				</el-form-item>
				<el-form-item label="打印名称：" prop="printName">
					<el-input
						:style="{ width: itemWidth }"
						v-model="editForm.printName"
					/>
				</el-form-item>
				<el-form-item label="分类：" prop="classification">
					<el-select
						:style="{ width: itemWidth }"
						v-model="editForm.classification"
						filterable
						@change="
							getTargetName(
								$event,
								'classifyOptions',
								'classificationName'
							)
						"
					>
						<el-option
							v-for="item in classifyOptions"
							:key="item.enumId"
							:label="item.name"
							:value="Number(item.enumId)"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="速记码：" prop="shorthandCode">
					<el-input
						:style="{ width: itemWidth }"
						v-model="editForm.shorthandCode"
					/>
				</el-form-item>
				<el-form-item label="电话：" prop="tel">
					<el-input
						:style="{ width: itemWidth }"
						v-model="editForm.tel"
					/>
				</el-form-item>
				<el-form-item label="医保处方默认值：" prop="mipdValue">
					<el-select
						:style="{ width: itemWidth }"
						v-model="editForm.mipdValue"
						filterable
					>
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="是否送货上门："
					prop="isSupportDeliveryToDoor"
				>
					<el-select
						:style="{ width: itemWidth }"
						v-model="editForm.isSupportDeliveryToDoor"
						filterable
					>
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地址：">
					<el-input
						:style="{ width: itemWidth }"
						v-model="editForm.location"
					/>
				</el-form-item>
				<el-form-item label="坐标X：">
					<el-input
						:style="{ width: itemWidth }"
						v-model="editForm.coordinateX"
					/>
				</el-form-item>
				<el-form-item label="坐标Y：">
					<el-input
						:style="{ width: itemWidth }"
						v-model="editForm.coordinateY"
					/>
				</el-form-item>

				<el-form-item label="是否打印价格：" prop="isPrintPrice">
					<el-select
						:style="{ width: itemWidth }"
						v-model="editForm.isPrintPrice"
						filterable
					>
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="机构类型：" prop="orgType">
					<el-select
						:style="{ width: itemWidth }"
						v-model="editForm.orgType"
						filterable
						@change="
							getTargetName(
								$event,
								'orgTypeOptions',
								'orgTypeName'
							)
						"
					>
						<el-option
							v-for="item in orgTypeOptions"
							:key="item.enumId"
							:label="item.name"
							:value="Number(item.enumId)"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="代煎费：" prop="fryingFee">
					<el-radio-group
						v-model="editForm.fryingFee"
						:style="{ width: itemWidth }"
					>
						<el-radio :label="1">收</el-radio>
						<el-radio :label="2">不收</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="二维码解析：" prop="qrcodeRule">
					<el-select
						:style="{ width: itemWidth }"
						v-model="editForm.qrcodeRule"
						filterable
					>
						<el-option label="方案一" value="1001"></el-option>
						<el-option label="方案二" value="1002"></el-option>
						<el-option label="方案三" value="1003"></el-option>
					</el-select>
					<i
						class="el-icon-question qrcode-rule-tips"
						@click="lookQrRule"
					></i>
				</el-form-item>
				<el-form-item label="备注：">
					<el-input
						:style="{ width: itemWidth }"
						v-model="editForm.remark"
						type="textarea"
						:autosize="{ minRows: 1, maxRows: 4 }"
						placeholder="请输入内容"
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
		<qrcode-rule-tips :dialog-visible.sync="qrcodeRuleisVisible" schemeRule='all'/>
	</div>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog';
import { mapState } from 'vuex';
import QrcodeRuleTips from './components/QrcodeRuleTips';
export default {
    name: 'BaseOrgEdit',
    directives: { elDragDialog },
    components: { QrcodeRuleTips },
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
                        .basic_baseOrg_checkCode(params)
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
            qrcodeRuleisVisible: false,
            rules: {
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
                printName: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                tel: [{ required: true, message: '不能为空', trigger: 'blur' }],
                orgType: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                classification: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                firstLetter: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                shorthandCode: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                mipdValue: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                isSupportDeliveryToDoor: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                isPrintPrice: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                fryingFee: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                qrcodeRule: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ]
            }
        };
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    computed: {
        ...mapState({
            orgTypeOptions: state => state.enum.orgType,
            classifyOptions: state => state.enum.classifies
        }),
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
    methods: {
        flPinyin(text) {
            this.editForm.shorthandCode = this.$pinyin.getCamelChars(text);
        },
        //查看二维码解析规则
        lookQrRule() {
            this.qrcodeRuleisVisible = true;
        },
        getTargetName(val, options, targetKey) {
            this[options].forEach(item => {
                if (item.enumId == val) {
                    this.editForm[targetKey] = item.name;
                }
            });
        },
        initEditForm() {
            return {
                classification: '',
                classificationName: '',
                code: '',
                coordinateX: '',
                coordinateY: '',
                hisCode: '',
                isPrintPrice: '',
                isSupportDeliveryToDoor: '',
                location: '',
                mipdValue: '',
                name: '',
                orgType: '',
                orgTypeName: '',
                printName: '',
                remark: '',
                shorthandCode: '',
                tel: '',
                fryingFee: 1,
                qrcodeRule: '1001'
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
                        this.$api
                            .basic_baseOrg_add(this.editForm)
                            .then(() => {
                                this.buttonLoading = false;
                                this.isVisible = false;
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            })
                            .catch(err => {
                                console.log(err);
                                this.buttonLoading = false;
                            });
                    } else {
                        this.$api
                            .basic_baseOrg_update(this.editForm)
                            .then(() => {
                                this.buttonLoading = false;
                                this.isVisible = false;
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            })
                            .catch(err => {
                                console.log(err);
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
            // this.resetDeptTree()
        }
    }
};
</script>
<style lang="scss" scoped>
.qrcode-rule-tips {
	color: #409eff;
	font-size: 18px;
	cursor: pointer;
}
</style>
