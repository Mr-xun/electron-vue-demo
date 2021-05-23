<template>
    <div class="login-container">
        <div class="login-info">
            <!-- <div class="main-title">Tiv-DCMS Cloud</div> -->
            <div class="theme-wrap">
                <img
                    class="theme-title"
                    src="../../../assets/gc/login-title.png"
                    alt=""
                    srcset=""
                />
                <img
                    class="theme-img"
                    src="../../../assets/gc/login-bg.jpg"
                    alt=""
                    srcset=""
                />
            </div>
        </div>
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="rules"
            class="login-form"
            autocomplete="off"
            label-position="left"
        >
            <div class="title-container">
                <h3 class="title">
                    <img
                        class="logo-img"
                        src="../../../assets/gc/main-logo.png"
                        alt=""
                        srcset=""
                    />
                    <span>煎药中心管理系统登录</span>
                </h3>
                <!-- <lang-select class="set-language" /> -->
            </div>
            <span v-if="login.type === 'up'">
                <el-form-item prop="username">
                    <el-input
                        ref="username"
                        v-model="loginForm.username"
                        placeholder="账号"
                        prefix-icon="el-icon-user"
                        name="username"
                        type="text"
                        autocomplete="off"
                        @keyup.enter.native="handleLogin"
                    />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        ref="password"
                        v-model="loginForm.password"
                        prefix-icon="el-icon-key"
                        type="password"
                        placeholder="个人密码"
                        name="password"
                        autocomplete="off"
                        :show-password="true"
                        @keyup.enter.native="handleLogin"
                    />
                </el-form-item>
                <el-form-item prop="code" class="code-input">
                    <el-input
                        ref="code"
                        v-model="loginForm.code"
                        prefix-icon="el-icon-lock"
                        placeholder="验证码"
                        name="code"
                        type="text"
                        autocomplete="off"
                        style="width: 70%"
                        @keyup.enter.native="handleLogin"
                    />
                </el-form-item>
                <img
                    :src="imageCode"
                    alt="codeImage"
                    class="code-image"
                    @click="getCodeImage"
                />
                <el-button
                    :loading="loading"
                    type="primary"
                    style="width: 100%; margin-bottom: 14px"
                    @click.native.prevent="handleLogin"
                >
                    立即登录
                </el-button>
            </span>
            <span v-if="login.type === 'social'">
                选择以下账号登录：
                <div>
                    <template v-for="(l, index) in logo">
                        <div :key="index" class="logo-wrapper">
                            <img
                                :src="resolveLogo(l.img)"
                                alt=""
                                :class="{ radius: l.radius }"
                                @click="socialLogin(l.name)"
                            />
                        </div>
                    </template>
                </div>
            </span>
            <span v-if="login.type === 'bind'" style="margin-top: -1rem">
                <el-tabs v-model="tabActiveName" @tab-click="handleTabClick">
                    <el-tab-pane label="绑定并登录" name="bindLogin">
                        <el-form-item prop="bindUsername">
                            <el-input
                                ref="bindUsername"
                                v-model="loginForm.bindUsername"
                                placeholder="账号"
                                prefix-icon="el-icon-user"
                                name="bindUsername"
                                type="text"
                                autocomplete="off"
                            />
                        </el-form-item>
                        <el-form-item prop="bindPassword">
                            <el-input
                                ref="bindPassword"
                                v-model="loginForm.bindPassword"
                                placeholder="个人密码"
                                prefix-icon="el-icon-key"
                                name="bindPassword"
                                type="password"
                                :show-password="true"
                                autocomplete="off"
                            />
                        </el-form-item>
                        <el-button
                            :loading="loading"
                            type="primary"
                            style="width: 100%; margin-bottom: 14px"
                            @click.native.prevent="bindLogin"
                        >
                            绑定并登录
                        </el-button>
                    </el-tab-pane>
                    <el-tab-pane label="注册并登录" name="signLogin">
                        <el-form-item prop="signUsername">
                            <el-input
                                ref="signUsername"
                                v-model="loginForm.signUsername"
                                placeholder="账号"
                                prefix-icon="el-icon-user"
                                name="signUsername"
                                type="text"
                                autocomplete="off"
                            />
                        </el-form-item>
                        <el-form-item prop="signPassword">
                            <el-input
                                ref="signPassword"
                                v-model="loginForm.signPassword"
                                placeholder="个人密码"
                                prefix-icon="el-icon-key"
                                name="signPassword"
                                type="password"
                                :show-password="true"
                                autocomplete="off"
                            />
                        </el-form-item>
                        <el-button
                            :loading="loading"
                            type="primary"
                            style="width: 100%; margin-bottom: 14px"
                            @click.native.prevent="signLogin"
                        >
                            注册并登录
                        </el-button>
                    </el-tab-pane>
                </el-tabs>
            </span>
            <!-- <el-dropdown class="login-type" placement="top-end">
        <span class="el-dropdown-link">
          <el-link type="primary">其他登录方式</el-link>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="login.type === 'up'" @click.native="login.type = 'up'">账号密码登录</el-dropdown-item>
          <el-dropdown-item :disabled="login.type === 'social'" @click.native="login.type = 'social'">第三方账号登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
        </el-form>
        <span class="login-footer">
            © 2020 <a target="_blank" href="#">北京中科天维科技有限公司</a> -
            DCMS
        </span>
    </div>
</template>

<script>
import LangSelect from '@/components/LangSelect';
import db from '@/utils/localstorage';
import { randomNum } from '@/utils';
import axios from 'axios';
import { socialLoginUrl } from '@/settings';
import { mapMutations } from 'vuex';
import baseURL from '@/utils/baseURL';

export default {
    name: 'Login',
    components: { LangSelect },
    data() {
        return {
            tabActiveName: 'bindLogin',
            codeUrl: `${baseURL}auth/captcha`,
            socialLoginUrl: socialLoginUrl,
            login: {
                type: 'up'
            },
            logo: [
                { img: 'gitee.png', name: 'gitee', radius: true },
                { img: 'github.png', name: 'github', radius: true },
                {
                    img: 'tencent_cloud.png',
                    name: 'tencent_cloud',
                    radius: true
                },
                { img: 'qq.png', name: 'qq', radius: false },
                { img: 'dingtalk.png', name: 'dingtalk', radius: true },
                { img: 'microsoft.png', name: 'microsoft', radius: false }
            ],
            loginForm: {
                username: '',
                password: '',
                bindUsername: '',
                bindPassword: '',
                signUsername: '',
                signPassword: ''
            },
            rules: {
                username: {
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                },
                password: {
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                },
                code: { required: true, message: '不能为空', trigger: 'blur' },
                bindUsername: {
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                },
                bindPassword: {
                    required: true,
                    message: '不能为空',
                    trigger: 'blur'
                },
                signUsername: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    {
                        min: 4,
                        max: 10,
                        message: '长度在 4 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
                signPassword: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    {
                        min: 6,
                        max: 20,
                        message: '长度在 6 到 20 个字符',
                        trigger: 'blur'
                    }
                ]
            },
            authUser: null,
            loading: false,
            showDialog: false,
            redirect: undefined,
            otherQuery: {},
            randomId: randomNum(24, 16),
            imageCode: '',
            page: {
                width: window.screen.width * 0.5,
                height: window.screen.height * 0.5
            }
        };
    },
    mounted() {
        db.clear();
        this.getCodeImage();
    },
    destroyed() {
        window.removeEventListener('message', this.resolveSocialLogin);
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
        getCodeImage() {
            axios({
                method: 'GET',
                url: `${this.codeUrl}?key=${this.randomId}`,
                responseType: 'arraybuffer'
            })
                .then((res) => {
                    return (
                        'data:image/png;base64,' +
                        btoa(
                            new Uint8Array(res.data).reduce(
                                (data, byte) =>
                                    data + String.fromCharCode(byte),
                                ''
                            )
                        )
                    );
                })
                .then((res) => {
                    this.imageCode = res;
                })
                .catch((e) => {
                    if (e.toString().indexOf('429') !== -1) {
                        this.$message({
                            message: '获取验证码过于频繁，请稍后再试',
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            message: '获取图形验证码失败',
                            type: 'error'
                        });
                    }
                });
        },
        handleTabClick(tab, event) {
            this.tabActiveName = tab.name;
        },
        resolveLogo(logo) {
            return require(`@/assets/logo/${logo}`);
        },
        socialLogin(oauthType) {
            const url = `${this.socialLoginUrl}/${oauthType}/login`;
            window.open(
                url,
                'newWindow',
                `resizable=yes, height=${this.page.height}, width=${this.page.width}, top=10%, left=10%, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no`
            );
            window.addEventListener('message', this.resolveSocialLogin, false);
        },
        resolveSocialLogin(e) {
            const data = e.data;
            const that = this;
            if (data.message === 'not_bind') {
                that.login.type = 'bind';
                const authUser = data.data;
                that.authUser = authUser;
                that.$confirm(
                    '当前' +
                        authUser.source +
                        '账号' +
                        authUser.nickname +
                        '尚未绑定任何系统账户，您可以绑定系统账户或者注册一个新的账户并绑定。',
                    '提示',
                    {
                        confirmButtonText: '注册并登录',
                        cancelButtonText: '绑定并登录',
                        type: 'warning'
                    }
                )
                    .then(() => {
                        that.tabActiveName = 'signLogin';
                    })
                    .catch(() => {
                        that.tabActiveName = 'bindLogin';
                    });
            } else if (data.message === 'social_login_success') {
                that.saveLoginData(data.data);
                that.getUserDetailInfo();
                that.loginSuccessCallback();
            } else {
                // do nothing
            }
        },
        bindLogin() {
            let usernameC = false;
            let passwordC = false;
            this.$refs.loginForm.validateField('bindUsername', (e) => {
                if (!e) {
                    usernameC = true;
                }
            });
            this.$refs.loginForm.validateField('bindPassword', (e) => {
                if (!e) {
                    passwordC = true;
                }
            });
            if (usernameC && passwordC) {
                this.loading = true;
                const that = this;
                const params = {
                    bindUsername: that.loginForm.bindUsername,
                    bindPassword: that.loginForm.bindPassword,
                    ...that.authUser
                };
                params.token = null;
                that.$post('auth/social/bind/login', params)
                    .then((r) => {
                        const data = r.data.data;
                        this.saveLoginData(data);
                        this.getUserDetailInfo();
                        this.loginSuccessCallback();
                    })
                    .catch((error) => {
                        console.error(error);
                        that.loading = false;
                    });
            }
        },
        signLogin() {
            let usernameC = false;
            let passwordC = false;
            this.$refs.loginForm.validateField('signUsername', (e) => {
                if (!e) {
                    usernameC = true;
                }
            });
            this.$refs.loginForm.validateField('signPassword', (e) => {
                if (!e) {
                    passwordC = true;
                }
            });
            if (usernameC && passwordC) {
                this.loading = true;
                const that = this;
                const params = {
                    bindUsername: that.loginForm.signUsername,
                    bindPassword: that.loginForm.signPassword,
                    ...that.authUser
                };
                params.token = null;
                that.$post('auth/social/sign/login', params)
                    .then((r) => {
                        const data = r.data.data;
                        this.saveLoginData(data);
                        this.getUserDetailInfo();
                        this.loginSuccessCallback();
                    })
                    .catch((error) => {
                        console.error(error);
                        that.loading = false;
                    });
            }
        },
        handleLogin() {
            let usernameC = false;
            let passwordC = false;
            let codeC = false;
            this.$refs.loginForm.validateField('username', (e) => {
                if (!e) {
                    usernameC = true;
                }
            });
            this.$refs.loginForm.validateField('password', (e) => {
                if (!e) {
                    passwordC = true;
                }
            });
            this.$refs.loginForm.validateField('code', (e) => {
                if (!e) {
                    codeC = true;
                }
            });
            if (usernameC && passwordC && codeC) {
                this.loading = true;
                const that = this;
                this.$login('auth/oauth/token', {
                    ...that.loginForm,
                    key: this.randomId
                })
                    .then((r) => {
                        const data = r.data;
                        this.saveLoginData(data);
                        this.getUserDetailInfo();
                        this.loginSuccessCallback();
                        this.saveEnumData();
                        this.$store.dispatch('basic/setOrgArchives');
                        this.$store.dispatch('basic/setDrugInfArchives');
                    })
                    .catch((error) => {
                        console.error(error);
                        that.loading = false;
                        that.getCodeImage();
                    });
            }
        },
        saveLoginData(data) {
            this.$store.commit('account/setAccessToken', data.access_token);
            this.$store.commit(
                'account/setRefreshToken',
                data.refresh_token || ''
            );
            const current = new Date();
            const expireTime = current.setTime(
                current.getTime() + 1000 * data.expires_in
            );
            this.$store.commit('account/setExpireTime', expireTime);
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
        getUserDetailInfo() {
            this.$get('auth/user')
                .then((r) => {
                    this.$store.commit('account/setUser', r.data.principal);
                    this.getUserOrgInfo(r.data.principal.orgId);
                    this.$message({
                        message: '登录成功',
                        type: 'success'
                    });
                    this.loading = false;
                    this.$router.push('/');
                })
                .catch((error) => {
                    this.$message({
                        message: '登录失败',
                        type: 'error'
                    });
                    console.error(error);
                    this.loading = false;
                });
        },
        //获取所属机构信息
        getUserOrgInfo(orgId) {
            let params = {
                id: orgId
            };
            this.$api.basic_baseOrg_getOneOrg(params).then((res) => {
                this.$store.commit('account/setUserOrg', res.data || {});
            });
        },
        loginSuccessCallback() {
            this.$get('system/user/success').catch((e) => {
                console.log(e);
            });
        }
    }
};
</script>

<style lang="scss">
@import "login";
</style>
<style lang="scss" scoped>
@import "login-scoped";
</style>
