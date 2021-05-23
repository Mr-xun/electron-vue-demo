<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="client" :rules="rules" label-position="right" label-width="165px">
      <el-form-item label="客户端ID" prop="clientId">
        <el-input v-model="client.clientId" :readonly="type === 'add' ? false : 'readonly'" />
      </el-form-item>
      <el-form-item label="客户端秘钥" prop="clientSecret">
        <el-input v-model="client.clientSecret" :readonly="type === 'add' ? false : 'readonly'" />
      </el-form-item>
      <el-form-item label="范围" prop="scope">
        <el-input v-model="client.scope" />
      </el-form-item>
      <el-form-item label="认证模式" prop="authorizedGrantTypes">
        <el-select v-model="client.authorizedGrantTypes" multiple value="" placeholder="" style="width:100%">
          <el-option
            v-for="item in grantTypes"
            :key="item.type"
            :label="item.type"
            :value="item.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重定向地址" prop="webServerRedirectUri">
        <el-input v-model="client.webServerRedirectUri" />
      </el-form-item>
      <el-form-item label="访问令牌有效期（秒）" prop="accessTokenValidity">
        <el-input v-model="client.accessTokenValidity" />
      </el-form-item>
      <el-form-item label="刷新令牌有效期（秒）" prop="refreshTokenValidity">
        <el-input v-model="client.refreshTokenValidity" />
      </el-form-item>
      <el-form-item label="自动授权" prop="autoapprove">
        <el-select v-model="client.autoapprove" placeholder="" value="" style="width:100%">
          <el-option label="true" value="1" />
          <el-option label="false" value="0" />
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
import { isIntegerGreaterThanZero, validURL } from '@/utils/my-validate';

export default {
    name: 'ClientEdit',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            screenWidth: 0,
            buttonLoading: false,
            width: this.initWidth(),
            client: this.initClient(),
            rules: {
                clientId: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
                    { validator: (rule, value, callback) => {
                        if (this.type === 'add') {
                            this.$get(`auth/client/check/${value}`).then((r) => {
                                if (!r.data) {
                                    callback('该Client ID已存在');
                                } else {
                                    callback();
                                }
                            });
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ],
                scope: [
                    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
                    { required: true, message: '不能为空', trigger: 'blur' }
                ],
                webServerRedirectUri: { validator: (rule, value, callback) => {
                    if (value !== '' && value != null && !validURL(value)) {
                        callback(new Error('不是有效的URL'));
                    } else {
                        callback();
                    }
                }, trigger: 'blur' },
                clientSecret: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { min: 6, max: 20, message:'长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                accessTokenValidity: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: (rule, value, callback) => {
                        if (!isIntegerGreaterThanZero(value)) {
                            callback(new Error('请输入大于零的整数'));
                        } else if (value.toString().length > 11) {
                            callback(new Error('长度不能超过11个字符'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ],
                refreshTokenValidity: [
                    { validator: (rule, value, callback) => {
                        if (value === null || value === '') {
                            callback();
                        } else if (!isIntegerGreaterThanZero(value)) {
                            callback(new Error('请输入大于零的整数'));
                        } else if (value.toString().length > 11) {
                            callback(new Error('长度不能超过11个字符'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ],
                authorizedGrantTypes: { required: true, message: '不能为空', trigger: 'blur' }
            },
            grantTypes: [
                { type: 'refresh_token' },
                { type: 'authorization_code' },
                { type: 'client_credentials' },
                { type: 'password' },
                { type: 'implicit' }
            ]
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
        initClient() {
            return {
                clientId: '',
                resourceIds: '',
                clientSecret: '',
                scope: '',
                authorizedGrantTypes: '',
                webServerRedirectUri: '',
                accessTokenValidity: null,
                refreshTokenValidity: null,
                autoapprove: ''
            };
        },
        setClient(val) {
            this.client = { ...val };
            let authorizedGrantTypes = [];
            if (this.client.authorizedGrantTypes && typeof this.client.authorizedGrantTypes === 'string') {
                authorizedGrantTypes = this.client.authorizedGrantTypes.split(',');
                this.client.authorizedGrantTypes = authorizedGrantTypes;
            }
            this.client.clientSecret = '******';
            this.client.autoapprove = this.client.autoapprove !== null ? this.client.autoapprove + '' : '';
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (this.type === 'add') {
                        // create
                        this.client.authorizedGrantTypes = this.client.authorizedGrantTypes.join(',');
                        this.$post('auth/client', { ...this.client }).then(() => {
                            this.buttonLoading = false;
                            this.isVisible = false;
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.$emit('success');
                        });
                    } else {
                        // update
                        this.client.authorizedGrantTypes = this.client.authorizedGrantTypes.join(',');
                        this.$put('auth/client', { ...this.client }).then(() => {
                            this.buttonLoading = false;
                            this.isVisible = false;
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.$emit('success');
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        close() {
            this.$emit('close');
        },
        reset() {
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
            this.client = this.initClient();
        }
    }
};
</script>
