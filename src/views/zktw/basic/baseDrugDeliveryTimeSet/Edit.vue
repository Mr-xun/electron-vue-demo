<template>
  <el-dialog
    v-el-drag-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    class="product-dialog"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="editForm"
      :rules="rules"
      label-position="right"
      label-width="135px"
    >
      <el-form-item label="机构名称：" prop="orgId">
        <el-select
          :style="{width:itemWidth}"
          v-model="editForm.orgId"
          @change="getTargetName($event,'id','orgArchives','orgName')"
          filterable
          clearable
          style="width:100%;"
        >
          <el-option v-for="item in orgArchives" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="加工工艺：" prop="processingTechnic">
        <el-select
          :style="{width:itemWidth}"
          v-model="editForm.processingTechnic"
          @change="getTargetName($event,'enumId','carfts','processingTechnicName')"
          filterable
          clearable
          style="width:100%;"
        >
          <el-option v-for="item in carfts" :key="item.enumId" :label="item.name" :value="Number(item.enumId)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="抓药付数开始：" prop="minDoseNum">
        <el-input :style="{width:itemWidth}" v-model="editForm.minDoseNum" />
      </el-form-item>
      <el-form-item label="抓药付数结束：" prop="maxDoseNum">
        <el-input :style="{width:itemWidth}" v-model="editForm.maxDoseNum" />
      </el-form-item>
      <el-form-item label="需要时间(小时)：" prop="needTime">
        <el-input :style="{width:itemWidth}" v-model="editForm.needTime" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">取消</el-button>
      <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters,mapState  } from 'vuex';

export default {
    name: 'BaseDrugDeliveryTimeSetEdit',
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
            itemWidth: '225px',
            editForm: this.initEditForm(),
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            rules: {
                orgId: [
                    {
                        message: '不能为空',
                        required: true,
                        trigger: 'change'
                    }
                ],
                processingTechnic: [
                    {
                        message: '不能为空',
                        required: true,
                        trigger: 'change'
                    }
                ],
                minDoseNum: [{ required: true, message: '不能为空', trigger: 'blur' }],
                maxDoseNum: [{ required: true, message: '不能为空', trigger: 'blur' }],
                needTime: [{ required: true, message: '不能为空', trigger: 'blur' }]
            }
        };
    },
    computed: {
        ...mapGetters('basic', ['orgArchives']),
        ...mapState('enum', ['carfts']),
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
        getTargetName(val,key, options, targetKey) {
            this[options].forEach(item => {
                if (item[key] == val) {
                    this.editForm[targetKey] = item.name;
                }
            });
        },
        initEditForm() {
            return {
                maxDoseNum: null,
                minDoseNum: null,
                needTime: null,
                orgId: null,
                processingTechnic: null,
                processingTechnicName: ''
            };
        },
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
        setEditForm(val) {
            this.editForm = { ...val };
        },
        close() {
            this.$emit('close');
        },
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.buttonLoading = true;
                    if (!this.editForm.id) {
                        // create
                        this.$api
                            .basic_baseDrugDeliveryTimeSet_add(this.editForm)
                            .then(res => {
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
                            .catch(err => {
                                this.buttonLoading = false;
                            });
                    } else {
                        // update
                        this.$api
                            .basic_baseDrugDeliveryTimeSet_update(this.editForm)
                            .then(res => {
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
                            .catch(err => {
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
.disable-store {
  display: flex;
  >>> .el-form-item__content {
    display: flex;
    align-items: center;
  }
}
</style>
