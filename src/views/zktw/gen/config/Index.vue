<template>
  <div class="app-container">
    <div class="center-container">
      <el-form ref="form" :model="config" :rules="rules" label-position="right" label-width="150px">
        <el-form-item label="作者名称" prop="author">
          <el-input v-model="config.author" />
        </el-form-item>
        <el-form-item label="基础包名" prop="basePackage">
          <el-input v-model="config.basePackage" />
        </el-form-item>
        <el-form-item label="entity包名" prop="entityPackage">
          <el-input v-model="config.entityPackage" />
        </el-form-item>
        <el-form-item label="mapper包名" prop="mapperPackage">
          <el-input v-model="config.mapperPackage" />
        </el-form-item>
        <el-form-item label="mapperXml包名" prop="mapperXmlPackage">
          <el-input v-model="config.mapperXmlPackage" />
        </el-form-item>
        <el-form-item label="service包名" prop="servicePackage">
          <el-input v-model="config.servicePackage" />
        </el-form-item>
        <el-form-item label="serviceImpl包名" prop="serviceImplPackage">
          <el-input v-model="config.serviceImplPackage" />
        </el-form-item>
        <el-form-item label="controller包名" prop="controllerPackage">
          <el-input v-model="config.controllerPackage" />
        </el-form-item>
        <el-form-item label="是否去除表前缀" prop="isTrim">
          <el-radio-group v-model="config.isTrim">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="config.isTrim === '1'"
          label="表前缀"
          prop="trimValue"
        >
          <el-input v-model="config.trimValue" />
        </el-form-item>
        <el-form-item v-has-permission="['gen:config:update']">
          <el-button
            type="primary"
            plain
            :loading="buttonLoading"
            @click="submit"
          >修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
    name: 'GeneratorConfig',
    data() {
        return {
            config: this.initConfig(),
            buttonLoading: false,
            rules: {
                author: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { max: 20, message:'长度不能超过20个字符', trigger: 'blur' }
                ],
                basePackage: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
                ],
                entityPackage: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
                ],
                mapperPackage: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
                ],
                mapperXmlPackage: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
                ],
                servicePackage: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
                ],
                serviceImplPackage: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
                ],
                controllerPackage: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
                ],
                trimValue: [
                    {
                        validator: (rule, value, callback) => {
                            if (this.config.isTrim === '1' && !value.trim().length) {
                                callback('不能为空');
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    },
                    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
                ]
            }
        };
    },
    mounted() {
        this.getConfig();
    },
    methods: {
        initConfig() {
            return {
                id: '',
                author: '',
                basePackage: '',
                entityPackage: '',
                mapperPackage: '',
                mapperXmlPackage: '',
                servicePackage: '',
                serviceImplPackage: '',
                controllerPackage: '',
                isTrim: '',
                trimValue: ''
            };
        },
        getConfig() {
            this.$get('generator/config').then(r => {
                const data = r.data.data;
                this.config = { ...data };
            });
        },
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.buttonLoading = true;
                    this.$post('generator/config', { ...this.config }).then(() => {
                        this.buttonLoading = false;
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
