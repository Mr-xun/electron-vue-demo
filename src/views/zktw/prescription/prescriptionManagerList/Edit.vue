<template>
	<el-dialog
		v-el-drag-dialog
		title="处方管理"
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
			<el-form-item label="处方号：" >
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.prescriptionNumber"
					disabled
				/>
			</el-form-item>
			<el-form-item label="患者编号：" >
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.medicalRecordNumber"
					disabled
				/>
			</el-form-item>
			<el-form-item label="患者：">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.patientName"
					disabled
				/>
			</el-form-item>
			<el-form-item label="性别：">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.sex"
					placeholder="请选择"
					disabled
				>
					<el-option label="男" :value="1"></el-option>
					<el-option label="女" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="联系电话：" prop="tel">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.tel"
					disabled
				/>
			</el-form-item>
			<el-form-item label="建议送药时间：">
				<el-date-picker
					disabled
					type="date"
					:style="{ width: itemWidth }"
					placeholder="选择时间"
					format="yyyy-MM-dd hh:mm:ss"
					value-format="yyyy-MM-dd HH:mm:ss"
					v-model="editForm.recommendedDeliveryDrugTime"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="工艺：" prop="technologyId">
				<el-select
					v-model="editForm.technologyId"
					filterable
					:style="{ width: itemWidth }"
					@change="
						getTargetName(
							$event,
							'enumId',
							'carftOptions',
							'technologyName'
						)
					"
				>
					<el-option
						v-for="item in carftOptions"
						:label="item.name"
						:value="Number(item.enumId)"
						:key="item.enumId"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="调剂人1：">
				<el-select
					v-model="editForm.dispenser1Id"
					filterable
					clearable
					:style="{ width: itemWidth }"
					@change="
						changeUser($event, 'dispenser1Code', 'dispenser1Id')
					"
				>
					<el-option
						v-for="item in userOptions"
						:label="item.fullname"
						:value="item.userId"
						:key="item.userId"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="调剂人2：">
				<el-select
					v-model="editForm.dispenser2Id"
					filterable
					clearable
					:style="{ width: itemWidth }"
					@change="
						changeUser($event, 'dispenser2Code', 'dispenser2Id')
					"
				>
					<el-option
						v-for="item in userOptions"
						:label="item.fullname"
						:value="item.userId"
						:key="item.userId"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="复核员：">
				<el-select
					v-model="editForm.checkerId"
					filterable
					clearable
					:style="{ width: itemWidth }"
					@change="changeUser($event, 'checkerCode', 'checkerId')"
				>
					<el-option
						v-for="item in userOptions"
						:label="item.fullname"
						:value="item.userId"
						:key="item.userId"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="复核员1：">
				<el-select
					v-model="editForm.checker1Id"
					filterable
					clearable
					:style="{ width: itemWidth }"
					@change="changeUser($event, 'checker1Code', 'checker1Id')"
				>
					<el-option
						v-for="item in userOptions"
						:label="item.fullname"
						:value="item.userId"
						:key="item.userId"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="称重人：">
				<el-select
					v-model="editForm.weigherId"
					filterable
					clearable
					:style="{ width: itemWidth }"
					@change="changeUser($event, 'weigherCode')"
				>
					<el-option
						v-for="item in userOptions"
						:label="item.fullname"
						:value="item.userId"
						:key="item.userId"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="包装人：">
				<el-select
					v-model="editForm.packerId"
					filterable
					clearable
					:style="{ width: itemWidth }"
					@change="changeUser($event, 'packerCode')"
				>
					<el-option
						v-for="item in userOptions"
						:label="item.fullname"
						:value="item.userId"
						:key="item.userId"
					></el-option>
				</el-select>
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
import { mapGetters, mapState } from 'vuex';
export default {
    name: 'PrescriptionManagerEdit',
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
            userOptions: [],
            disDialog: false,
            itemWidth: '225px',
            editForm: this.initEditForm(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            rules: {
                prescriptionNumber: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }
                ],
                medicalRecordNumber: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }
                ],
                patientName: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }
                ],

                sex: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                technologyId: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ]
            }
        };
    },
    computed: {
        ...mapGetters('basic', ['orgArchives']),
        ...mapState({
            carftOptions: (state) => state.enum.carfts
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
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    created() {
        this.getAllUser();
    },
    methods: {
        getTargetName(val, key, options, targetKey) {
            this[options].forEach((item) => {
                if (item[key] == val) {
                    this.editForm[targetKey] = item.name;
                }
            });
        },
        changeUser(val, targetKey, curKey) {
            switch (curKey) {
            case 'dispenser1Id':
                if (val == this.editForm.dispenser2Id) {
                    this.$message({
                        message: '调剂员不能相同！',
                        type: 'warning'
                    });
                    this.editForm.dispenser1Id = '';
                } else {
                    this.getTargetCode(val, targetKey);
                }
                break;
            case 'dispenser2Id':
                if (val == this.editForm.dispenser1Id) {
                    this.$message({
                        message: '调剂员不能相同！',
                        type: 'warning'
                    });
                    this.editForm.dispenser2Id = '';
                } else {
                    this.getTargetCode(val, targetKey);
                }
                break;
            case 'checkerId':
                if (val == this.editForm.checker1Id) {
                    this.$message({
                        message: '复核员不能相同！',
                        type: 'warning'
                    });
                    this.editForm.checkerId = '';
                } else {
                    this.getTargetCode(val, targetKey);
                }
                break;
            case 'checker1Id':
                if (val == this.editForm.checkerId) {
                    this.$message({
                        message: '复核员不能相同！',
                        type: 'warning'
                    });
                    this.editForm.checker1Id = '';
                } else {
                    this.getTargetCode(val, targetKey);
                }
                break;
            default:
                this.getTargetCode(val, targetKey);
                break;
            }
        },
        getTargetCode(val, targetKey) {
            this.userOptions.forEach((item) => {
                if (item.userId == val) {
                    this.editForm[targetKey] = item.code;
                }
            });
        },
        getAllUser() {
            this.$api
                .system_user_all()
                .then((r) => {
                    const { data } = r.data;
                    this.userOptions = data;
                })
                .catch((err) => {
                    this.userOptions = [];
                });
        },
        initEditForm() {
            return {
                prescriptionOrderId: ''
            };
        },
        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 991) {
                return '90%';
            } else if (this.screenWidth < 1400) {
                return '45%';
            } else {
                return '800px';
            }
        },
        setEditForm(val) {
            this.editForm = { ...val };
            console.log(this.editForm, 77);
        },
        close() {
            this.$emit('close');
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    let params = {
                        checker1Code: this.editForm.checker1Code,
                        checkerCode: this.editForm.checkerCode,
                        dispenser1Code: this.editForm.dispenser1Code,
                        dispenser2Code: this.editForm.dispenser2Code,
                        packerCode: this.editForm.packerCode,
                        prescriptionOrderId: this.editForm.id,
                        technologyId: this.editForm.technologyId,
                        technologyName: this.editForm.technologyName,
                        weigherCode: this.editForm.weigherCode
                    };
                    console.log(params, 33);
                    // create
                    this.$api
                        .prescription_prescriptionOrder_management(params)
                        .then((res) => {
                            let { code } = res.data;
                            if (code == 200) {
                                this.isVisible = false;
                                this.$message({
                                    message: '处方管理修改成功',
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
