<template>
  <el-dialog
    :title="title"
    :width="width"
    top="100px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="user" :rules="rules" label-position="right" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username" :readonly="user.id === '' ? false : 'readonly'" />
      </el-form-item>
      <el-form-item v-if="user.id === ''" label="密码" prop="password">
        <el-input v-model="user.password" type="password" />
      </el-form-item>
      <el-form-item label="权限" prop="roles">
        <el-select v-model="user.roles" multiple value="" placeholder="" style="width:100%">
          <el-option
            v-for="item in roles"
            :key="item.roleId"
            :label="item.roleName"
            :value="String(item.roleName)"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">
        取消
      </el-button>
      <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import r from '@/utils/route-request';

export default {
    name: 'RouteUserEdit',
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
            user: this.initUser(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            roles: [
                { roleId: 1, roleName: 'admin' },
                { roleId: 2, roleName: 'user' }
            ],
            rules: {
                username: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' },
                    { validator: (rule, value, callback) => {
                        if (!this.user.id) {
                            r.get(`route/auth/user/${value}`).then((r) => {
                                if (r.data) {
                                    callback('该用户名已存在');
                                } else {
                                    callback();
                                }
                            });
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { min: 6, max: 20, message:'长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                roles: { required: true, message: '不能为空', trigger: 'change' }
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
    methods: {
        initUser() {
            return {
                id: '',
                username: '',
                password: '',
                roles: []
            };
        },
        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 991) {
                return '90%';
            } else if (this.screenWidth < 1400) {
                return '35%';
            } else {
                return '600px';
            }
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
                    if (!this.user.id) {
                        // create
                        r.post('route/auth/user', { ...this.user }).then(() => {
                            this.buttonLoading = false;
                            this.isVisible = false;
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.$emit('success');
                        }).catch(r => {
                            this.buttonLoading = false;
                        });
                    } else {
                        // update
                        r.put('route/auth/user', { ...this.user }).then(() => {
                            this.buttonLoading = false;
                            this.isVisible = false;
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.$emit('success');
                        }).catch(r => {
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
