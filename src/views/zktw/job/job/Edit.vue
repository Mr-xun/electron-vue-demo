<template>
  <el-dialog
    :title="title"
    :width="width"
    top="100px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="job" :rules="rules" label-position="right" label-width="129px">
      <el-form-item label="Bean名称" prop="beanName">
        <el-input v-model="job.beanName" />
      </el-form-item>
      <el-form-item label="方法名称" prop="methodName">
        <el-input v-model="job.methodName" />
      </el-form-item>
      <el-form-item label="方法参数" prop="params">
        <el-input v-model="job.params" />
      </el-form-item>
      <el-form-item label="Cron表达式" prop="cronExpression">
        <el-input v-model="job.cronExpression" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="job.remark" />
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

export default {
    name: 'JobEdit',
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
            job: this.initJob(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            rules: {
                beanName: { required: true, message: '不能为空', trigger: 'blur' },
                methodName: { required: true, message: '不能为空', trigger: 'blur' },
                cronExpression: [
                    { required: true, message: '不能为空', trigger: '[ blur]' },
                    { validator: (rule, value, callback) => {
                        this.$get('job/cron/check', {
                            cron: value
                        }).then((r) => {
                            if (!r.data) {
                                callback('Cron表达式不合法');
                            } else {
                                callback();
                            }
                        });
                    }, trigger: 'change' }
                ]
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
        initJob() {
            return {
                jobId: null,
                beanName: '',
                methodName: '',
                params: '',
                cronExpression: '',
                remark: ''
            };
        },
        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 991) {
                return '90%';
            } else if (this.screenWidth < 1400) {
                return '50%';
            } else {
                return '700px';
            }
        },
        setJob(val) {
            this.job = { ...val };
        },
        close() {
            this.$emit('close');
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (!this.job.jobId) {
                        // create
                        this.$post('job', { ...this.job }).then(() => {
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
                        this.job.createTime = null;
                        this.$put('job', { ...this.job }).then(() => {
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
            this.job = this.initJob();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
