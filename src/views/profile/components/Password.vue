<template>
  <el-form ref="form" :model="p" :rules="rules" label-position="right" label-width="80px" class="form">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="p.oldPassword" type="password" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="p.newPassword" type="password" />
    </el-form-item>
    <el-form-item label="再次确认" prop="confirmPassword">
      <el-input v-model="p.confirmPassword" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain :loading="buttonLoading" @click="submit">{{ $t('common.edit') }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
    data() {
        return {
            buttonLoading: false,
            p: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            rules: {
                oldPassword: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: (rule, value, callback) => {
                        this.$get('system/user/password/check', {
                            password: value
                        }).then((r) => {
                            if (r.data) {
                                callback();
                            } else {
                                callback(this.$t('tips.oldPasswordIncorrect'));
                            }
                        }).catch(() => {
                            callback();
                        });
                    }, trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { min: 6, max: 20, message:'长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: (rule, value, callback) => {
                        if (this.p.newPassword !== value) {
                            callback(this.$t('tips.notEqual'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    this.$put('system/user/password', {
                        password: this.p.newPassword
                    }).then(() => {
                        this.buttonLoading = false;
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.$refs.form.clearValidate();
                        this.$refs.form.resetFields();
                    });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
