<template>
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
            label-width="120px"
        >
            <el-form-item
                label="商品名称："
                prop="drugInfName"
                class="chooseOneProduct-item"
            >
                <el-popover placement="bottom-start" v-model="productVisible">
                    <choose-one-product
                        ref="chooseOneProduct"
                        @sure="sure"
                        :choosedId="editForm.drugInfId"
                        :filterVal="editForm.drugInfName"
                    />
                    <el-input
                        :style="{ width: itemWidth }"
                        slot="reference"
                        @input="changeName"
                        placeholder="请点击选择"
                        v-model="editForm.drugInfName"
                    />
                </el-popover>
            </el-form-item>
            <el-form-item label="商品编码：">
                <el-input
                    :style="{ width: itemWidth }"
                    placeholder="请选择商品"
                    readonly
                    v-model="editForm.drugInfCode"
                />
            </el-form-item>
            <el-form-item label="规格：">
                <el-input
                    :style="{ width: itemWidth }"
                    v-model="editForm.drugInfSpecification"
                    placeholder="请选择商品"
                    readonly
                />
            </el-form-item>
            <el-form-item label="级别：">
                <el-input
                    :style="{ width: itemWidth }"
                    v-model="editForm.drugInfLevel"
                    placeholder="请选择商品"
                    readonly
                />
            </el-form-item>
            <el-form-item label="产地：">
                <el-input
                    :style="{ width: itemWidth }"
                    v-model="editForm.drugInfPlaceOrigin"
                    placeholder="请选择商品"
                    readonly
                />
            </el-form-item>
            <el-form-item label="单位：">
                <el-select
                    :style="{ width: itemWidth }"
                    placeholder="请选择商品"
                    v-model="editForm.drugInfUnit"
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
            <el-form-item label="税率：">
                <el-input
                    :style="{ width: itemWidth }"
                    placeholder="请选择商品"
                    v-model="editForm.drugInfTaxRate"
                    readonly
                />
            </el-form-item>
            <el-form-item
                label="机构："
                prop="orgOneId"
                v-if="editForm.id"
                :key="editForm.id"
            >
                <el-select
                    :style="{ width: itemWidth }"
                    v-model="editForm.orgOneId"
                    filterable
                    clearable
                    @change="changeOrg"
                >
                    <el-option
                        v-for="item in orgArchives"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="机构："
                prop="orgMoreId"
                v-if="!editForm.id"
                :key="editForm.id"
            >
                <el-select
                    :style="{ width: itemWidth }"
                    v-model="editForm.orgMoreId"
                    filterable
                    clearable
                    multiple
                    collapse-tags
                >
                    <el-option
                        v-for="item in orgArchives"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="零售价：" prop="retailPrice">
                <el-input
                    @input="changeRetailPrice"
                    :style="{ width: itemWidth }"
                    v-model="editForm.retailPrice"
                    v-number-only
                />
            </el-form-item>
            <el-form-item label="折扣率：" prop="discountRate">
                <el-input
                    @input="changeDiscountRate"
                    :style="{ width: itemWidth }"
                    v-model="editForm.discountRate"
                    v-number-only
                    :disabled="!editForm.retailPrice"
                />
            </el-form-item>
            <el-form-item label="采购价格：" prop="buyingPrice">
                <el-input
                    @input="changeBuyingPrice"
                    :style="{ width: itemWidth }"
                    v-model="editForm.buyingPrice"
                    v-number-only
                    :disabled="!editForm.retailPrice"
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
import ChooseOneProduct from '@/components/ChooseProduct/ChooseOne';
import { mapState, mapGetters } from 'vuex';
import numberOnly from '@/directive/number-only';

export default {
    name: 'DrugPriceEdit',
    components: {
        ChooseOneProduct
    },
    directives: {
        numberOnly
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
            productVisible: false,
            disDialog: false,
            choosedValue: '', //默认选择数据
            choosedId: null,
            itemWidth: '235px',
            editForm: this.initEditForm(),
            buttonLoading: false,
            screenWidth: 0,
            enterpriseOptions: [],
            width: this.initWidth(),
            rules: {
                orgMoreId: [
                    {
                        message: '不能为空',
                        required: true,
                        trigger: 'change'
                    }
                ],
                orgOneId: [
                    {
                        message: '不能为空',
                        required: true,
                        trigger: 'change'
                    }
                ],
                retailPrice: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                discountRate: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                buyingPrice: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ]
            }
        };
    },
    computed: {
        ...mapState({
            unitOptions: (state) => state.enum.units
        }),
        ...mapGetters('basic', ['orgArchives']),
        initOpen() {
            return productVisible;
        },
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
    created() {},
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
        changeName(val) {
            this.editForm.drugInfCode = '';
            this.editForm.drugInfId = null;
        },
        changeOrg(val) {
            if (this.editForm.id) {
                this.orgArchives.forEach((item) => {
                    if (item.id == val) {
                        this.editForm.orgName = item.name;
                    }
                });
            }
        },
        sure(data) {
            this.editForm.drugInfCode = data.code;
            this.editForm.drugInfId = data.id;
            this.editForm.drugInfName = data.name;
            this.editForm.drugInfSpecification = data.specification;
            this.editForm.drugInfLevel = data.level;
            this.editForm.drugInfUnit = data.unitId;
            this.editForm.drugInfTaxRate = data.taxRate;
            this.editForm.drugInfPlaceOrigin = data.placeOrigin;
            this.editForm.drugInfRemark = data.remark;
            this.$refs.form.validateField('drugInfName');
            this.$refs.form.validateField('shorthandCode');
            this.$refs.form.validateField('drugInfCode');
            this.productVisible = false;
        },
        initEditForm() {
            return {
                drugInfName: '',
                drugInfCode: '',
                drugInfId: null,
                shorthandCode: '',
                drugInfSpecification: '',
                drugInfLevel: '',
                drugInfUnit: '',
                drugInfTaxRate: '',
                drugInfPlaceOrigin: '',
                drugInfRemark: '',
                orgMoreId: [],
                orgOneId: '',
                retailPrice: '',
                discountRate: '',
                buyingPrice: ''
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
            this.$set(this.editForm, 'orgMoreId', []);
            this.$set(this.editForm, 'orgOneId', val.orgId);
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
                        this.editForm.orgIds = this.editForm.orgMoreId.join(
                            ','
                        );
                        delete this.editForm.orgMoreId;
                        delete this.editForm.orgOneId;
                        let params = JSON.parse(JSON.stringify(this.editForm));
                        delete params.drugInfUnit;
                        this.$api
                            .price_baseDrugPrice_add(params)
                            .then((res) => {
                                let { code } = res.data;
                                if (code == 200) {
                                    this.isVisible = false;
                                    this.$message({
                                        message: this.$t('tips.createSuccess'),
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
                        this.editForm.orgIds = this.editForm.orgOneId;
                        this.editForm.orgId = this.editForm.orgOneId;
                        delete this.editForm.orgMoreId;
                        delete this.editForm.orgOneId;
                        let params = JSON.parse(JSON.stringify(this.editForm));
                        delete params.drugInfUnit;
                        this.$api
                            .price_baseDrugPrice_update(params)
                            .then((res) => {
                                let { code } = res.data;
                                if (code == 200) {
                                    this.isVisible = false;
                                    this.$message({
                                        message: this.$t('tips.updateSuccess'),
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
.chooseCraft-item {
    display: flex;

    >>> .el-form-item__content {
        flex: 1;
    }

    >>> .el-checkbox {
        margin-right: 10px;
        line-height: 26px;
    }
}
</style>
