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
            :model="user"
            :rules="rules"
            label-position="right"
            label-width="140px"
        >
            <el-form-item label="机构：" prop="orgId">
                <el-select
                    :style="{ width: itemWidth }"
                    v-model="user.orgId"
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
            <el-form-item label="编码：" prop="code">
                <el-input
                    :style="{ width: itemWidth }"
                    v-model="user.code"
                    :disabled="!!user.userId"
                />
            </el-form-item>
            <el-form-item label="用户名：" prop="username">
                <el-input
                    :style="{ width: itemWidth }"
                    v-model="user.username"
                    :disabled="!!user.userId"
                />
            </el-form-item>
            <el-form-item label="姓名：" prop="fullname">
                <el-input
                    :style="{ width: itemWidth }"
                    v-model="user.fullname"
                    @input="flPinyin"
                />
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input :style="{ width: itemWidth }" v-model="user.email" />
            </el-form-item>
            <el-form-item label="拼音：" prop="firstLetter">
                <el-input
                    :style="{ width: itemWidth }"
                    v-model="user.firstLetter"
                />
            </el-form-item>
            <el-form-item
                v-show="!user.userId"
                label="密码："
                prop="password"
            >
                <el-tooltip
                    class="item"
                    effect="dark"
                    :content="`用户的默认密码为${userPwd}`"
                    placement="top-start"
                >
                    <el-input
                        :style="{ width: itemWidth }"
                        :value="userPwd"
                        type="password"
                        readonly
                    />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="电话：">
                <el-input :style="{ width: itemWidth }" v-model="user.mobile" />
            </el-form-item>
            <el-form-item label="部门：" prop="deptId">
                <treeselect
                    v-model="user.deptId"
                    :style="{ width: itemWidth }"
                    :multiple="false"
                    :options="depts"
                    clear-value-text="清除"
                    placeholder=" "
                    style="width: 100%"
                />
            </el-form-item>
            <el-form-item label="角色：" prop="roleId">
                <el-select
                    :style="{ width: itemWidth }"
                    v-model="user.roleId"
                    multiple
                    value
                    placeholder
                    style="width: 100%"
                >
                    <el-option
                        v-for="item in roles"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="String(item.roleId)"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
                <el-select
                    :style="{ width: itemWidth }"
                    v-model="user.sex"
                    placeholder
                    style="width: 100%"
                >
                    <el-option :value="1" label="男" />
                    <el-option :value="2" label="女" />
                    <el-option :value="0" label="保密" />
                </el-select>
            </el-form-item>

            <el-form-item label="描述：" prop="description">
                <el-input
                    :style="{ width: itemWidth }"
                    v-model="user.description"
                />
            </el-form-item>
            <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="user.status" :style="{ width: itemWidth }">
                    <el-radio label="1">有效</el-radio>
                    <el-radio label="2">禁用</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="物流人员：" prop="isLogisticsPersonnel">
                <el-radio-group v-model="user.isLogisticsPersonnel"  :style="{ width: itemWidth }">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                label="身份证号："
                prop="idcard"
                v-if="user.isLogisticsPersonnel == 1"
            >
                <el-input :style="{ width: itemWidth }" v-model="user.idcard" />
            </el-form-item>
            <el-form-item
                label="紧急联系人电话："
                prop="emergencyContactNumber"
                v-if="user.isLogisticsPersonnel == 1"
            >
                <el-input
                    :style="{ width: itemWidth }"
                    v-model="user.emergencyContactNumber"
                />
            </el-form-item>
            <el-form-item
                label="推荐人联系电话："
                prop="refereesNumber"
                v-if="user.isLogisticsPersonnel == 1"
            >
                <el-input
                    :style="{ width: itemWidth }"
                    v-model="user.refereesNumber"
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
import { validMobile } from '@/utils/my-validate';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { mapGetters } from 'vuex';
const WEBSIT = process.env.VUE_APP_BASE_WEBSIT || 'trt';

export default {
    name: 'UserEdit',
    components: { Treeselect },
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
                if (!this.user.userId) {
                    let params = {
                        code: value
                    };
                    this.$api
                        .system_user_checkCode(params)
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
            itemWidth: '295px',
            initFlag: false,
            user: this.initUser(),
            userPwd:WEBSIT =='trt'?'1234qwer':'123456',
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            depts: [],
            roles: [],
            deptTree: [],
            orginizationOptions: [],

            rules: {
                orgId: [
                    {
                        message: '请选择机构',
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
                fullname: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                firstLetter: [
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    {
                        min: 4,
                        max: 10,
                        message: '长度在 4 到 10 个字符',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (!this.user.userId) {
                                this.$get(`system/user/check/${value}`).then(
                                    (r) => {
                                        if (!r.data) {
                                            callback('该用户已存在');
                                        } else {
                                            callback();
                                        }
                                    }
                                );
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                email: {
                    type: 'email',
                    message: '请输入正确的邮箱地址',
                    trigger: 'blur'
                },
                mobile: {
                    validator: (rule, value, callback) => {
                        if (value !== '' && !validMobile(value)) {
                            callback('请输入合法的手机号');
                        } else {
                            callback();
                        }
                    },
                    trigger: 'blur'
                },
                roleId: {
                    required: true,
                    message: '不能为空',
                    trigger: 'change'
                },
                sex: { required: true, message: '不能为空', trigger: 'change' },

                status: {
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                },
                isLogisticsPersonnel: {
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                },
                idcard: {
                    required: true,
                    message: '请选择',
                    trigger: 'blur'
                },
                emergencyContactNumber: {
                    required: true,
                    message: '请选择',
                    trigger: 'blur'
                },
                refereesNumber: {
                    required: true,
                    message: '请选择',
                    trigger: 'blur'
                }
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
        this.initDept();
        this.initRoles();
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    methods: {
        flPinyin(text) {
            this.user.firstLetter = this.$pinyin.getCamelChars(text);
        },
        initUser() {
            return {
                orgId: '',
                avatar: '',
                code: '',
                deptId: null,
                deptIds: '',
                deptName: '',
                description: '',
                email: '',
                emergencyContactNumber: '',
                idcard: '',
                isLogisticsPersonnel: 2,
                mobile: '',
                password: this.userPwd,
                refereesNumber: '',
                roleId: [],
                roleName: '',
                sex: '',
                status: '1',
                username: '',
                fullname: '',
                firstLetter: ''
            };
        },
        getTargetName(val, key, options, targetKey) {
            this[options].forEach((item) => {
                if (item[key] == val) {
                    this.user[targetKey] = item.name;
                }
            });
        },
        initWidth() {
            this.screenWidth = document.body.clientWidth;

            return '1000px';
        },
        initDept() {
            this.$get('system/dept')
                .then((r) => {
                    this.depts = r.data.data.rows;
                    this.deptTree = this.depts;
                })
                .catch((error) => {
                    console.error(error);
                    this.$message({
                        message: '获取数据失败',
                        type: 'error'
                    });
                });
        },
        initRoles() {
            this.$get('system/role/options')
                .then((r) => {
                    this.roles = r.data.data;
                })
                .catch((error) => {
                    console.error(error);
                    this.$message({
                        message: '获取数据失败',
                        type: 'error'
                    });
                });
        },
        setUser(val) {
            this.user = { ...val };
        },
        close() {
            this.$emit('close');
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    this.user.roleId = this.user.roleId.join(',');
                    if (!this.user.deptIds) {
                        this.user.deptIds = '';
                    }
                    if (!this.user.userId) {
                        // create
                        this.$api
                            .system_user_add(this.user)
                            .then(() => {
                                this.buttonLoading = false;
                                this.isVisible = false;
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            })
                            .catch((err) => {
                                console.log(err);
                                this.buttonLoading = false;
                            });
                    } else {
                        // update
                        delete this.user.createTime;
                        delete this.user.modifyTime;
                        delete this.user.lastLoginTime;
                        delete this.user.createTimeFrom;
                        delete this.user.createTimeTo;
                        delete this.user.password;
                        this.$api
                            .system_user_update(this.user)
                            .then(() => {
                                this.buttonLoading = false;
                                this.isVisible = false;
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            })
                            .catch((err) => {
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
            this.user = this.initUser();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
