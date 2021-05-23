<template>
    <el-dialog v-el-drag-dialog :title="title" :width="width" top="50px" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="isVisible">
        <el-form ref="form" :model="baseEnum" :rules="rules" label-position="right" label-width="130px">
            <el-form-item label="枚举类型名称：" prop="enumType">
                <el-select v-model="baseEnum.enumType" @change="changeEnumType" :disabled="!!baseEnum.id" value-key="id" filterable style="width:100%;">
                    <el-option v-for="item in enumList" :key="item.enumType" :label="item.enumTypeName" :value="item.enumType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="编码：" prop="code">
                <el-input v-model="baseEnum.code" :placeholder="baseEnum.enumType?'':'请先选择枚举类型'" :disabled=" !!baseEnum.id" />
            </el-form-item>
            <el-form-item label="名称：" prop="name">
                <el-input v-model="baseEnum.name" @input="flPinyin" />
            </el-form-item>
            <el-form-item label="简称：" prop="abbreviation">
                <el-input v-model="baseEnum.abbreviation" />
            </el-form-item>
            <el-form-item label="速记码：">
                <el-input v-model="baseEnum.shorthandCode" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">取消</el-button>
            <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapMutations } from 'vuex';
import { enumList } from '@/config';
export default {
    name: 'BaseEnumEdit',
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
                if (!this.baseEnum.id) {
                    let params = {
                        code: value
                    };
                    this.$api
                        .basic_enum_checkCode(params)
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
            initFlag: false,
            baseEnum: this.initBaseEnum(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            enumList: enumList,
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
                abbreviation: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                enumType: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    computed: {
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
        ...mapMutations('enum', [
            'setMedicareType',
            'setReimbursementType',
            'setPrescriptionType',
            'setCrafts',
            'setUnits',
            'setUrgent',
            'setClassifies',
            'setOrgType',
            'setDrugNotes',
            'setIncompatibility',
            'setRefuseSendReason'
        ]),
        flPinyin(text) {
            this.baseEnum.shorthandCode = this.$pinyin.getCamelChars(text);
        },
        changeEnumType() {},
        initBaseEnum() {
            return {
                code: '',
                name: '',
                enumType: '',
                enumTypeName: '',
                abbreviation: '',
                shorthandCode: ''
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
        setBaseEnum(val) {
            this.baseEnum = { ...val };
        },
        close() {
            this.$emit('close');
        },
        saveEnumData() {
            this.$api.basic_enum_condition().then((res) => {
                let result = res.data.result;
                let emunMap = {
                    1: this.setMedicareType,
                    2: this.setReimbursementType,
                    3: this.setPrescriptionType,
                    4: this.setCrafts,
                    5: this.setUnits,
                    6: this.setUrgent,
                    7: this.setClassifies,
                    8: this.setOrgType,
                    9: this.setDrugNotes,
                    10: this.setIncompatibility,
                    11: this.setRefuseSendReason
                };
                result.map((item) => {
                    emunMap[item.enumType](item.baseEnumBoList);
                });
            });
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (!this.baseEnum.id) {
                        // create
                        this.$api
                            .basic_enum_add(this.baseEnum)
                            .then((res) => {
                                this.isVisible = false;
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.saveEnumData();
                                this.$emit('success');

                                this.buttonLoading = false;
                            })
                            .catch((err) => {
                                this.buttonLoading = false;
                            });
                    } else {
                        // update
                        this.$api
                            .basic_enum_update(this.baseEnum)
                            .then((res) => {
                                this.isVisible = false;
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.saveEnumData();
                                this.$emit('success');
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
            this.baseEnum = this.initBaseEnum();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
