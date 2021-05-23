<template>
  <el-form
    ref="form"
    :model="user"
    :rules="rules"
    label-position="right"
    label-width="80px"
    class="form"
  >
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" />
    </el-form-item>
    <el-form-item label="电话" prop="mobile">
      <el-input v-model="user.mobile" />
    </el-form-item>
    <el-form-item label="部门" prop="deptId">
      <treeselect
        v-model="user.deptId"
        :multiple="false"
        :options="depts"
        clear-value-text="清除"
        placeholder=" "
        @select="onSelect"
      />
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-select v-model="user.sex" value placeholder>
        <el-option :value="1" label="男" />
        <el-option :value="2" label="女" />
        <el-option :value="0" label="保密" />
      </el-select>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model="user.description" type="textarea" rows="3" />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        plain
        :loading="buttonLoading"
        @click="submit"
      >编辑</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { validMobile } from '@/utils/my-validate';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
    components: { Treeselect },
    props: {
        user: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    email: ''
                };
            }
        }
    },
    data() {
        return {
            depts: [],
            buttonLoading: false,
            deptName: '',
            change: false,
            rules: {
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
                sex: {
                    required: true,
                    message: '不能为空',
                    trigger: 'change'
                },
                description: {
                    max: 100,
                    message: '长度不能超过100个字符',
                    trigger: 'blur'
                }
            }
        };
    },
    mounted() {
        this.initDept();
    },
    methods: {
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.buttonLoading = true;
                    const temp = { ...this.user };
                    temp.lastLoginTime = temp.modifyTime = temp.createTime = null;
                    this.$put('system/user/profile', { ...temp }).then(() => {
                        this.buttonLoading = false;
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        });
                        if (this.change) {
                            this.user.deptName = this.deptName;
                        }
                        this.$store.commit('account/setUser', this.user);
                    });
                } else {
                    return false;
                }
            });
        },
        onSelect(a, b) {
            this.deptName = a.label;
            this.change = true;
        },
        initDept() {
            this.$get('system/dept')
                .then(r => {
                    this.depts = r.data.data.rows;
                })
                .catch(error => {
                    console.error(error);
                    this.$message({
                        message: '获取数据失败',
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.form {
  padding: 10px 0 0 0;
}
</style>
