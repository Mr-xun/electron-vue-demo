<template>
  <div>
    <span class="notify">
      网关管理模块操作需要认证，
      <el-link id="route-login" type="primary" @click="dialogFormVisible = true">点击认证</el-link>
      &nbsp;( 该模块功能需要预先开启网关增强，开启方法请参考文档：
      <el-link href="#" target="_blank"></el-link>
      &nbsp;)
    </span>
    <el-dialog
      :width="width"
      title=""
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form ref="form" :model="auth" :rules="rules">
        <el-form-item id="title">
          <i class="el-icon-lock" /> <span>DMS 网关管理认证</span>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="auth.username"
            placeholder="账号"
            prefix-icon="el-icon-user"
            name="username"
            type="text"
            autocomplete="off"
            @keyup.enter.native="login"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="auth.password"
            prefix-icon="el-icon-key"
            type="password"
            placeholder="密码"
            name="password"
            autocomplete="off"
            :show-password="true"
            @keyup.enter.native="login"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" plain @click="reset">
          取消
        </el-button>
        <el-button type="primary" plain @click="login">认证</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import r from '@/utils/route-request';
export default {
    name: 'RouteLogin',
    data() {
        return {
            dialogFormVisible: false,
            width: this.initWidth(),
            auth: {
                username: 'Jack',
                password: '123456'
            },
            rules: {
                username: { required: true, message: '不能为空', trigger: 'blur' },
                password: { required: true, message: '不能为空', trigger: 'blur' }
            }
        };
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    methods: {
        login() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    r.get('route/login', { ...this.auth }).then(v => {
                        this.$message({
                            message: '认证成功',
                            type: 'success'
                        });
                        const routeToken = v.data.data;
                        this.$store.commit('account/setRouteToken', routeToken);
                        this.reset();
                    });
                }
            });
        },
        reset() {
            this.dialogFormVisible = false;
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
        },
        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 991) {
                return '70%';
            } else if (this.screenWidth < 1400) {
                return '35%';
            } else {
                return '400px';
            }
        }
    }
};
</script>
<style lang="scss" scoped>
  span.notify {
    background-color: #fdf6ec;
    color: #e6a23c;
    width: 100%;
    padding: 1rem;
    margin: 0;
    box-sizing: border-box;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    opacity: 1;
    display: flex;
    align-items: center;
    transition: opacity .2s;
    font-size: .95rem;
    #route-login {
      font-size: .95rem;
    }
  }
  #title{
    text-align: center;
    color: #464159;
    span {
      font-size: 1.2rem;
      margin-left: 0.4rem;
      font-weight: 600;
    }
    i {
      font-size: 1.2rem;
      font-weight: 600;
    }
  }
</style>
