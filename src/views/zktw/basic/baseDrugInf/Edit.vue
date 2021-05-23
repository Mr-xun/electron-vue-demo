<template>
	<el-dialog
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
			<el-form-item label="商品编码" prop="code">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.code"
					:disabled="!!editForm.id"
				/>
			</el-form-item>
			<el-form-item label="商品名称" prop="name">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.name"
					@input="flPinyin"
				/>
			</el-form-item>
			<el-form-item label="速记码" prop="shorthandCode">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.shorthandCode"
				/>
			</el-form-item>

			<el-form-item label="货位">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.location"
				/>
			</el-form-item>
			<el-form-item label="产地" prop="placeOrigin">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.placeOrigin"
					@input="flOringPinyin"
				/>
			</el-form-item>
			<el-form-item label="产地速记码" prop="placeOriginShorthandCode">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.placeOriginShorthandCode"
				/>
			</el-form-item>
			<el-form-item label="级别" prop="level">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.level"
				/>
			</el-form-item>
			<el-form-item label="是否毒麻" prop="isToxicity">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.isToxicity"
					value-key="id"
					filterable
					style="width: 100%"
				>
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.status"
					value-key="id"
					filterable
					style="width: 100%"
				>
					<el-option label="有效" :value="1"></el-option>
					<el-option label="无效" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="重量" prop="weight">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.weight"
					v-number-only
				/>
			</el-form-item>
			<el-form-item label="单位" prop="unitId">
				<el-select
					v-model="editForm.unitId"
					:style="{ width: itemWidth }"
					@change="
						getTargetName($event, 'enumId', 'unitOptions', 'unit')
					"
				>
					<el-option
						v-for="item in unitOptions"
						:key="item.enumId"
						:label="item.name"
						:value="Number(item.enumId)"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="规格" prop="specification">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.specification"
				/>
			</el-form-item>
			<el-form-item label="税率" prop="taxRate">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.taxRate"
					v-number-only
					placeholder="格式：0.00"
				/>
			</el-form-item>
			<el-form-item label="最大剂量" prop="maxNumber">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.maxNumber"
					v-number-only
				/>
			</el-form-item>
			<el-form-item label="外部编码" prop="externalCode">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.externalCode"
				/>
			</el-form-item>
			<el-form-item label="是否细料" prop="isFines">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.isFines"
				>
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否煎药费" prop="isDecoctingFee">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.isDecoctingFee"
				>
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否小包装">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.isSmallPackage"
					value-key="id"
					filterable
					style="width: 100%"
				>
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="报销类型">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.reimbursementType"
				>
					<el-option
						v-for="item in reimbursementOptions"
						:key="item.enumId"
						:label="item.name"
						:value="Number(item.enumId)"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="医保类型">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.medicalInsuranceType"
				>
					<el-option
						v-for="item in medicareOptions"
						:key="item.enumId"
						:label="item.name"
						:value="Number(item.enumId)"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="类别" prop="category">
				<el-input
					:style="{ width: itemWidth }"
					v-model="editForm.category"
				/>
			</el-form-item>
			<el-form-item label="处方药类型">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.prescriptionDrugType"
				>
					<el-option
						v-for="item in prescripeOptions"
						:key="item.enumId"
						:label="item.name"
						:value="Number(item.enumId)"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="零售价">
				<el-input
					@input="changeRetailPrice"
					:style="{ width: itemWidth }"
					v-model="editForm.retailPrice"
					v-number-only
				/>
			</el-form-item>
			<el-form-item label="折扣率">
				<el-input
					@input="changeDiscountRate"
					:style="{ width: itemWidth }"
					v-model="editForm.discountRate"
					v-number-only
					:disabled="!editForm.retailPrice"
				/>
			</el-form-item>
			<el-form-item label="采购价">
				<el-input
					@input="changeBuyingPrice"
					:style="{ width: itemWidth }"
					v-model="editForm.buyingPrice"
					v-number-only
					:disabled="!editForm.retailPrice"
				/>
			</el-form-item>
			<el-form-item label="说明">
				<el-select
					:style="{ width: itemWidth }"
					v-model="editForm.remark"
				>
					<el-option
						v-for="item in drugNoteOptions"
						:key="item.enumId"
						:label="item.name"
						:value="item.enumId"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="有效期">
				<el-input
					:style="{ width: itemWidth }"
					v-model.number="editForm.effectivityDuration"
					v-number-only
				>
					<template slot="append">月</template>
				</el-input>
			</el-form-item>
			<el-form-item label="禁用机构" class="disable-store">
				<el-input
					type="textarea"
					style="width: 400px; margin-right: 10px"
					:autosize="{ minRows: 1, maxRows: 4 }"
					v-model="editForm.prohibitedOrgname"
				/>
				<el-button
					type="success"
					size="small"
					plain
					@click="chooseDisable"
					>选择</el-button
				>
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
		<DisableStore
			ref="disableStore"
			:allOrg="orgArchives"
			:dialog-visible="disDialog"
			@success="chooseSuccess"
			@close="chooseClose"
		/>
	</el-dialog>
</template>
<script>
import DisableStore from './components/DisableStores';
import { mapState, mapGetters } from 'vuex';
import numberOnly from '@/directive/number-only';

export default {
    name: 'BaseDrugInfEdit',
    components: { DisableStore },
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
    directives: {
        numberOnly
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
                        .basic_baseDrugInf_checkCode(params)
                        .then((res) => {
                            let { result } = res.data;
                            if (result) {
                                return callback();
                            } else {
                                return callback(new Error('编码不能重复'));
                            }
                        })
                        .catch((err) => {
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
            disDialog: false,
            itemWidth: '160px',
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
                name: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                code: [
                    { required: true, validator: checkCode, trigger: 'blur' }
                ],
                shorthandCode: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                placeOrigin: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                placeOriginShorthandCode: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                level: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                isToxicity: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                status: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                weight: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                unitId: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                specification: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                taxRate: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                maxNumber: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                externalCode: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                isFines: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                isDecoctingFee: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                category: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        ...mapState({
            unitOptions: (state) => state.enum.units,
            reimbursementOptions: (state) => state.enum.reimbursementType,
            medicareOptions: (state) => state.enum.medicareType,
            prescripeOptions: (state) => state.enum.prescriptionType,
            drugNoteOptions: (state) => state.enum.drugNotes
        }),
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
        //格式化数值
        formatValue(value) {
            let x = String(value).indexOf('.') + 1; //得到小数点的位置
            let pointCount = x == 0 ? 0 : String(value).length - x; //小数点的位数
            if (pointCount > 6) {
                value = Number(value).toFixed(6);
            }
            return value;
        },
        //修改零售价
        changeRetailPrice(val) {
            if (this.editForm.discountRate) {
                let countNum =
					(this.editForm.retailPrice *
						10000 *
						(this.editForm.discountRate / 100)) /
					10000;
                this.$set(
                    this.editForm,
                    'buyingPrice',
                    this.formatValue(countNum)
                );
                return;
            }
            if (this.editForm.buyingPrice) {
                let countNum =
					(((this.editForm.buyingPrice * 10000) /
						this.editForm.retailPrice) *
						100) /
					10000;
                this.$set(
                    this.editForm,
                    'discountRate',
                    this.formatValue(countNum)
                );
                return;
            }
        },
        //修改折扣率
        changeDiscountRate(val) {
            let countNum =
				(this.editForm.retailPrice * 10000 * (val / 100)) / 10000;
            this.$set(this.editForm, 'buyingPrice', this.formatValue(countNum));
        },
        //修改采购价
        changeBuyingPrice(val) {
            let countNum =
				(((val * 10000) / this.editForm.retailPrice) * 100) / 10000;
            this.$set(
                this.editForm,
                'discountRate',
                this.formatValue(countNum)
            );
        },
        getTargetName(val, key, options, targetKey) {
            this[options].forEach((item) => {
                if (item[key] == val) {
                    this.editForm[targetKey] = item.name;
                }
            });
        },
        flPinyin(text) {
            this.editForm.shorthandCode = this.$pinyin.getCamelChars(text);
        },
        flOringPinyin(text) {
            this.editForm.placeOriginShorthandCode = this.$pinyin.getCamelChars(
                text
            );
        },
        chooseDisable() {
            this.disDialog = true;
            let disabledData = [];
            if (this.editForm.prohibitedOrgid) {
                disabledData = this.editForm.prohibitedOrgid.split(',');
            }
            this.$refs.disableStore.setChooesdData(disabledData);
        },
        chooseSuccess(data) {
            if (data.length) {
                let disabledId = data.join(',');
                let disabledName = [];
                this.orgArchives.forEach((item) => {
                    if (data.indexOf(item.id) > -1) {
                        disabledName.push(item.name);
                    }
                });
                this.editForm.prohibitedOrgid = disabledId;
                this.editForm.prohibitedOrgname = disabledName.join(',');
            } else {
                this.editForm.prohibitedOrgid = '';
                this.editForm.prohibitedOrgname = '';
            }
            this.disDialog = false;
        },
        chooseClose() {
            this.disDialog = false;
        },
        initEditForm() {
            return {
                buyingPrice: null,
                category: '',
                code: '',
                discountRate: null,
                externalCode: '',
                isDecoctingFee: null,
                isFines: null,
                isSmallPackage: null,
                isToxicity: null,
                level: '',
                location: '',
                maxNumber: null,
                medicalInsuranceType: null,
                name: '',
                orgId: null,
                placeOrigin: '',
                placeOriginShorthandCode: '',
                prescriptionDrugType: null,
                prohibitedOrgid: '',
                prohibitedOrgname: '',
                reimbursementType: null,
                remark: '',
                retailPrice: null,
                shorthandCode: '',
                specification: null,
                status: null,
                taxRate: null,
                unit: '',
                weight: '',
                effectivityDuration: ''
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
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (!this.editForm.id) {
                        // create
                        this.$api
                            .basic_baseDrugInf_add(this.editForm)
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
                            .basic_baseDrugInf_update(this.editForm)
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
