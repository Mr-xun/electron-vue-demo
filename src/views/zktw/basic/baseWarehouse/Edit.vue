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
                <el-select
                    :style="{width:itemWidth}"
                    v-model="editForm.orgId"
                    @change="getTargetName($event,'id','orgArchives','orgName')"
                    filterable
                    style="width:100%;"
                >
                    <el-option
                        v-for="item in orgArchives"
                        :key="item.id"
                        :label="item.name"
                        :value="Number(item.id)"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="库房名称：" prop="name">
                <el-input :style="{width:itemWidth}" v-model="editForm.name" />
            </el-form-item>
            <el-form-item label="库房编码：" prop="code">
                <el-input
                    :style="{width:itemWidth}"
                    v-model="editForm.code"
                    :disabled="!!editForm.id"
                />
            </el-form-item>
            <el-form-item label="条码：" prop="barCode">
                <el-input :style="{width:itemWidth}" v-model="editForm.barCode" />
            </el-form-item>
            <el-form-item label="外部编码：" prop="externalCode">
                <el-input :style="{width:itemWidth}" v-model="editForm.externalCode" />
            </el-form-item>
            <el-form-item label="是否有效：">
                <el-select
                    :style="{width:itemWidth}"
                    v-model="editForm.isValid"
                    filterable
                    style="width:100%;"
                >
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否零售：">
                <el-select
                    :style="{width:itemWidth}"
                    v-model="editForm.isRetail"
                    filterable
                    style="width:100%;"
                >
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否代煎：">
                <el-select
                    :style="{width:itemWidth}"
                    v-model="editForm.isAgentDecoct"
                    filterable
                    style="width:100%;"
                >
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否贵细货架：">
                <el-select
                    :style="{width:itemWidth}"
                    v-model="editForm.isFineRack"
                    filterable
                    style="width:100%;"
                >
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注：">
                <el-input :style="{width:itemWidth}" v-model="editForm.remark" />
            </el-form-item>
            <el-form-item label="负责人：">
                <el-select
                    :style="{width:itemWidth}"
                    v-model="editForm.principalsIdArr"
                    multiple
                    clearable
                    filterable
                    style="width:100%;"
                >
                    <el-option
                        v-for="item in userOptions"
                        :label="item.fullname"
                        :value="item.userId"
                        :key="item.userId"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="工艺：" class="chooseCraft-item">
                <el-select
                    v-model="editForm.carftIds"
                    multiple
                    clearable
                    filterable
                    style="width:100%;"
                >
                    <el-option
                        v-for="item in carftOptions"
                        :label="item.name"
                        :value="item.enumId"
                        :key="item.enumId"
                    ></el-option>
                </el-select>
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
import AddOrg from './components/AddOrg';
import { mapState, mapGetters } from 'vuex';
export default {
    name: 'BaseWarehouseEdit',
    components: {
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
                        .basic_baseWarehouse_checkCode(params)
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
            orgData:[],
            itemWidth: '225px',
            editForm: this.initEditForm(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            userOptions: [],
            principalsNames: '',
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
                barCode: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'blur'
                    }
                ],
                code: [
                    {
                        required: true,
                        validator: checkCode,
                        trigger: 'blur'
                    }
                ],
                externalCode: [
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
        ...mapState({
            carftOptions: (state) => state.enum.carfts
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
    created() {
        this.getAllUser();
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    methods: {
        getAllUser() {
            this.$api.system_user_all().then((res) => {
                this.userOptions = res.data.data;
            });
        },
        getTargetName(val,key, options, targetKey) {
            this[options].forEach((item) => {
                if (item[key] == val) {
                    this.editForm[targetKey] = item.name;
                }
            });
        },
        initEditForm() {
            this.orgData = [];
            return {
                barCode: '',
                code: '',
                externalCode: '',
                isAgentDecoct: '',
                isFineRack: '',
                isRetail: '',
                isValid: '',
                name: '',
                orgId: '',
                orgName: '',
                carftIds: [],
                prescriptionOrgid: '',
                prescriptionTechnology: '',
                remark: '',
                principalsNames: '',
                principalsIdArr: [],
                principalsIds: ''
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
            this.orgData = [];
            let principalsIds = (val.principalsIds
                ? val.principalsIds.split(',')
                : []
            ).map(Number);
            this.editForm = { ...val };
            this.$set(
                this.editForm,
                'carftIds',
                val.prescriptionTechnology
                    ? val.prescriptionTechnology.split(',')
                    : []
            );
            if(val.prescriptionOrgid){
                val.prescriptionOrgid.split(',').forEach(v=>{
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
            this.$set(this.editForm, 'principalsIdArr', principalsIds);
            this.$nextTick(()=>{
                this.$refs.addOrg.initFlOrg();
            });
        },
        close() {
            this.$emit('close');
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    let prescriptionOrgid = [];
                    let prescriptionOrgName = [];
                    this.orgData.forEach(item=>{
                        prescriptionOrgid.push(item.orgId);
                        prescriptionOrgName.push(item.orgName);
                    });
                    this.editForm.prescriptionOrgid = prescriptionOrgid.join(',');
                    this.editForm.prescriptionOrgName = prescriptionOrgName.join(',');
                    this.editForm.prescriptionTechnology = this.editForm.carftIds.join(
                        ','
                    );
                    this.editForm.principalsNames = '';
                    for (
                        let i = 0;
                        i < this.editForm.principalsIdArr.length;
                        i++
                    ) {
                        for (let j = 0; j < this.userOptions.length; j++) {
                            if (
                                this.editForm.principalsIdArr[i] ==
                                this.userOptions[j].userId
                            ) {
                                this.editForm.principalsNames +=
                                    this.userOptions[j].fullname + ',';
                            }
                        }
                    }
                    this.editForm.principalsIds = this.editForm.principalsIdArr.join(
                        ','
                    );
                    this.editForm.principalsNames = this.editForm.principalsNames.substring(
                        0,
                        this.editForm.principalsNames.length - 1
                    );
                    delete this.editForm.carftIds;
                    if (!this.editForm.id) {
                        // create
                        this.$api
                            .basic_baseWarehouse_add(this.editForm)
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
                            .basic_baseWarehouse_update(this.editForm)
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
