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
            label-width="120px"
        >
            <el-form-item label="名称：" prop="name">
                <el-input :style="{width:itemWidth}" v-model="editForm.name" @input="flPinyin" />
            </el-form-item>
            <el-form-item label="编码：" prop="code">
                <el-input
                    :style="{width:itemWidth}"
                    v-model="editForm.code"
                    :disabled="!!editForm.id"
                />
            </el-form-item>
            <el-form-item label="速记码：" prop="shorthandCode">
                <el-input :style="{width:itemWidth}" v-model="editForm.shorthandCode" />
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input :style="{width:itemWidth}" v-model="editForm.remark" />
            </el-form-item>
        </el-form>
        <el-divider>处方机构</el-divider>
        <add-org
            ref="addOrg"
            type="edit"
            :orgData="orgData"
        />
        <div slot="footer" class="dialog-footer">
            <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">取消</el-button>
            <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
import ChooseOrg from './components/ChooseOrg.vue';
import AddOrg from './components/AddOrg';

export default {
    name: 'PrescriptionRemarkEdit',
    components: {
        ChooseOrg,
        AddOrg
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
                        code: value
                    };
                    this.$api
                        .basic_basePrescriptionRemark_checkCode(params)
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
            itemWidth: '225px',
            orgVisible: false,
            orgData:[],
            choosedValue: '', //默认选择数据
            editForm: this.initEditForm(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            rules: {
                code: [
                    {
                        validator: checkCode,
                        required: true,
                        trigger: 'blur'
                    }
                ],
                orgId: [
                    {
                        message: '不能为空',
                        required: true,
                        trigger: 'change'
                    }
                ],
                orgNames: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                shorthandCode: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }
                ],
                remark: [
                    { required: true, message: '不能为空', trigger: 'blur' }
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
        chooseMorePro() {
            this.orgVisible = true;
        },
        removeOrgTag(item, index) {
            if (this.choosedValue.length) {
                this.choosedValue.splice(index, 1);
            }
        },
        flPinyin(text) {
            this.editForm.shorthandCode = this.$pinyin.getCamelChars(text);
        },
        sure(data) {
            let chooseStr = '';
            let chooseId = '';
            this.choosedValue = data.map((item) => item.id);
            data.forEach((item) => {
                chooseStr += item.name + ',';
                chooseId += item.id + ',';
            });
            this.editForm.orgNames = chooseStr.substring(
                0,
                chooseStr.length - 1
            );
            this.editForm.orgIds = chooseId.substring(0, chooseId.length - 1);
            this.orgVisible = false;
            this.$refs['form'].validateField('orgNames');
        },
        cancel() {
            this.orgVisible = false;
        },
        initEditForm() {
            this.choosedValue = '';
            this.orgData = [];
            return {
                code: '',
                name: '',
                orgId: '',
                orgNames: '',
                orgIds: '',
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
        setEditForm(val) {
            this.orgData = [];
            if(val.orgIds){
                val.orgIds.split(',').forEach(v=>{
                    this.orgArchives.forEach(h=>{
                        if(v ==h.id){
                            this.orgData.push({
                                orgId:h.id,
                                orgName:h.name,
                                orgCode:h.code
                            });
                        }
                    });
                });
            }
            this.editForm = { ...val };
            this.$nextTick(()=>{
                this.$refs.addOrg.initFlOrg();
            });
        },
        close() {
            this.$emit('close');
            this.orgVisible = false;
        },
        submitForm() {
            if(!this.orgData.length){
                this.$message({
                    message:'处方机构列表不能为空',
                    type:'error'
                });
                return;
            }
            let orgIds = [];
            let orgNames = [];
            let orgCodes  = [];
            this.orgData.forEach(item=>{
                orgIds.push(item.orgId);
                orgNames.push(item.orgName);
                orgCodes.push(item.orgCode);
            });
            this.editForm.orgIds = orgIds.join(',');
            this.editForm.orgNames = orgNames.join(',');
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (!this.editForm.id) {
                        // create
                        this.$api
                            .basic_basePrescriptionRemark_add(this.editForm)
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
                            .basic_basePrescriptionRemark_update(this.editForm)
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
.chooseOrg-item {
    display: flex;
    flex: 1;

    >>> .el-form-item__content {
        display: flex;
        align-items: center;
        flex: 1;
        > span {
            display: inline-block;
            width: 100%;
        }
    }

    >>> .el-button {
        margin-right: 0px;
    }
}
.org-tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content:  flex-start;
    border: 1px solid #ccc;
    line-height: 36px;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    outline: none;
    padding: 6px 15px;
    cursor: pointer;
    min-width: 225px;
    .tab-item {
        margin: 2px 3px 2px 0;
    }
    .no-tabs {
        line-height: 28px;
    }
}
</style>
