<template>
    <el-dialog
        v-el-drag-dialog
        :title="title"
        :width="width"
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
            <el-form-item label="规则：" prop="ruleTypeCode">
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="切换规则将重新渲染禁忌列表"
                    placement="top-start"
                >
                    <el-select
                        :style="{width:itemWidth}"
                        @change="getTargetName($event,'incompatibilities','ruleTypeName')"
                        v-model="editForm.ruleTypeCode"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in incompatibilities"
                            :label="item.name"
                            :value="String(item.code)"
                            :key="item.enumId"
                        ></el-option>
                    </el-select>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="名称：" prop="drug1Name">
                <el-popover
                    placement="bottom-start"
                    :disabled="!!this.editForm.id"
                    v-model="productVisible "
                >
                    <choose-one-product
                        ref="chooseOneProduct"
                        @sure="sureDrug1"
                        :choosedId="editForm.drug1Id"
                        :filterVal="editForm.drug1Name"
                    />
                    <el-input
                        :style="{width:itemWidth}"
                        slot="reference"
                        @input="changeName"
                        :disabled="!!this.editForm.id"
                        placeholder="请点击选择"
                        v-model="editForm.drug1Name"
                    />
                </el-popover>
            </el-form-item>
            <el-form-item label="编码：" prop="drug1Code">
                <el-input :style="{width:itemWidth}" readonly v-model="editForm.drug1Code" />
            </el-form-item>
            <el-form-item label="规格：" prop="drug1Specification">
                <el-input
                    :style="{width:itemWidth}"
                    v-model="editForm.drug1Specification"
                    placeholder="请选择商品"
                    readonly
                />
            </el-form-item>
            <el-form-item label="单位：" prop="drug1Unit">
                <el-select
                    :style="{width:itemWidth}"
                    placeholder="请选择商品"
                    v-model="editForm.drug1Unit"
                    filterable
                    disabled
                >
                    <el-option
                        v-for="item in unitOptions"
                        :key="item.enumId"
                        :label="item.name"
                        :value="Number(item.enumId)"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-divider>禁忌列表</el-divider>
        <add-drug2 ref="logistics" type="edit" :drug2Data="choosedDrug2Data" />
        <div slot="footer" class="dialog-footer">
            <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">取消</el-button>
            <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import ChooseOneProduct from '@/components/ChooseProduct/ChooseOne';
import ChooseMoreProduct from '@/components/ChooseProduct/ChooseMore';
import AddDrug2 from './components/AddDrug2';
import { mapState  } from 'vuex';
export default {
    name: 'BaseIncompatibilityEdit',
    components: { ChooseMoreProduct, ChooseOneProduct, AddDrug2 },
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
            productVisible: false,
            itemWidth: '225px',
            editForm: this.initEditForm(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            choosedDrug2Data: [],
            rules: {
                ruleTypeCode: [
                    {
                        message: '不能为空',
                        required: true,
                        trigger: 'change'
                    }
                ],
                drug1Name: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        ...mapState({
            incompatibilities: (state) => state.enum.incompatibilities,
            unitOptions: (state) => state.enum.units
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
    methods: {
        changeName(val) {
            this.editForm.drug1Code = '';
            this.editForm.drugInfId = null;
        },
        //选择药品1
        sureDrug1(data) {
            if (!this.editForm.id) {
                this.editForm.drug1Name = data.name;
                this.editForm.drug1Id = data.id;
                this.editForm.drug1Code = data.code;
                this.editForm.drug1Specification = data.specification;
                this.editForm.drug1Unit = data.unitId;
                this.productVisible = false;
                this.$refs.form.validateField('drug1Name');
            }
        },
        //切换规则获取已选择药品2
        async getTargetName(val, options, targetKey) {
            this.editForm.ruleTypeCode = val;
            this[options].forEach((item) => {
                if (item.enumId == val) {
                    this.editForm[targetKey] = item.name;
                }
            });
            let res = await this.$api.basic_baseIncompatibility_byDrug1Id({
                drug1Id: this.editForm.drug1Id,
                ruleTypeCode: val
            });
            this.choosedDrug2Data = res.data.result;
        },
        initEditForm() {
            this.choosedDrug2Data = [];
            return {
                baseIncompatibilityParamList: [],
                drug1Code: '',
                drug1Id: null,
                drug1Name: '',
                drug1Specification: '',
                drug1Unit: null,
                remark: '',
                ruleTypeCode: ''
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
            this.choosedDrug2Data = val.baseIncompatibilityParamList;
            this.editForm = { ...val };
        },
        close() {
            this.$emit('close');
        },
        submitForm() {
            this.editForm.baseIncompatibilityParamList = [];
            if (this.choosedDrug2Data.length) {
                this.choosedDrug2Data.forEach((item) => {
                    if (item.drug2Id) {
                        this.editForm.baseIncompatibilityParamList.push({
                            drug2Id: item.drug2Id,
                            drug2Code: item.drug2Code,
                            drug2Name: item.drug2Name,
                            drug2Specification: item.drug2Specification,
                            drug2Unit: item.drug2Unit
                        });
                    }
                });
                let params = {
                    ...this.editForm
                };
                params.ruleTypeCode = this.editForm.ruleTypeCode;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        if (!this.editForm.id) {
                            this.$api
                                .basic_baseIncompatibility_add(params)
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
                                .basic_baseIncompatibility_update(params)
                                .then((res) => {
                                    let { code } = res.data;
                                    if (code == 200) {
                                        this.isVisible = false;
                                        this.$message({
                                            message: '更新成功',
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
            } else {
                this.$message({
                    message: '药品2不能为空',
                    type: 'error'
                });
            }
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
</style>
