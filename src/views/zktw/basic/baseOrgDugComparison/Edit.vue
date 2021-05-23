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
            <el-form-item label="机构名称：" prop="orgId">
                <el-select :style="{width:itemWidth}" v-model="editForm.orgId" filterable>
                    <el-option
                        v-for="item in orgArchives"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="对照编码：" prop="code">
                <el-input
                    :style="{width:itemWidth}"
                    v-model="editForm.code"
                    :disabled="!!editForm.id"
                />
            </el-form-item>
            <el-form-item label="商品名称：" prop="name" class="chooseOneProduct-item">
                <el-popover placement="bottom-start" v-model="productVisible">
                    <choose-one-product
                        ref="chooseOneProduct"
                        @sure="sure"
                        :choosedId="editForm.drugInfId"
                        :filterVal="editForm.name"
                    />
                    <el-input
                        :style="{width:itemWidth}"
                        slot="reference"
                        @input="changeName"
                        placeholder="请点击选择"
                        v-model="editForm.name"
                    />
                </el-popover>
            </el-form-item>
            <el-form-item label="商品编码：" prop="drugCode">
                <el-input :style="{width:itemWidth}" readonly v-model="editForm.drugCode" />
            </el-form-item>
            <el-form-item label="速记码：" prop="shorthandCode">
                <el-input :style="{width:itemWidth}" v-model="editForm.shorthandCode" />
            </el-form-item>
            <el-form-item label="备注：">
                <el-input :style="{width:itemWidth}" v-model="editForm.remark" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">取消</el-button>
            <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import ChooseOneProduct from '@/components/ChooseProduct/ChooseOne';

import { mapGetters } from 'vuex';
export default {
    name: 'BaseOrgDugComparisonEdit',
    components: {
        ChooseOneProduct
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
        var checkCode = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('不能为空'));
            } else {
                if (!this.editForm.id) {
                    let params = {
                        code: value,
                        orgId: this.editForm.orgId
                    };
                    this.$api
                        .basic_baseOrgDugComparison_checkCode(params)
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
            productVisible: false,
            choosedValue: '', //默认选择数据
            choosedId: null,
            itemWidth: '225px',
            editForm: this.initEditForm(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            rules: {
                orgId: [
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
                    { validator: checkCode, required: true, trigger: 'blur' }
                ],
                drugCode: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }
                ],
                drugCode: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                shorthandCode: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                remark: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    watch: {
        'editForm.name': {
            handler(val) {
                this.editForm.shorthandCode = this.$pinyin.getCamelChars(val);
            },
            deep: true,
            immediate: false
        }
    },
    computed: {
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
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    methods: {
        changeName(val) {
            this.editForm.drugCode = '';
            this.editForm.drugInfId = null;
        },
        sure(data) {
            this.editForm.name = data.name;
            this.editForm.drugCode = data.code;
            this.editForm.drugInfId = data.id;
            this.productVisible = false;
            this.$refs.form.validateField('name');
            this.$refs.form.validateField('shorthandCode');
            this.$refs.form.validateField('drugCode');
        },
        initEditForm() {
            return {
                code: '',
                drugCode: '',
                drugInfId: null,
                shorthandCode: '',
                name: '',
                orgId: null,
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
                            .basic_baseOrgDugComparison_add(this.editForm)
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
                        this.$api
                            .basic_baseOrgDugComparison_update(this.editForm)
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
