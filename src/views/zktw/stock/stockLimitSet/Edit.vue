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
      :model="editForm"
      :rules="rules"
      label-position="right"
      label-width="120px"
    >
      <el-form-item label="商品名称：" prop="itemName" class="chooseOneProduct-item">
        <el-popover placement="bottom-start" v-model="productVisible">
          <choose-one-product
            ref="chooseOneProduct"
            @sure="sure"
            :choosedId="editForm.itemId"
            :filterVal="editForm.itemName"
          />
          <el-input
            :style="{width:itemWidth}"
            slot="reference"
            @input="changeName"
            placeholder="请点击选择"
            v-model="editForm.itemName"
          />
        </el-popover>
      </el-form-item>
      <el-form-item label="商品编码：" prop="itemCode">
        <el-input
          :style="{width:itemWidth}"
          placeholder="请选择商品"
          readonly
          v-model="editForm.itemCode"
        />
      </el-form-item>
      <el-form-item label="规格：" prop="itemSpecification">
        <el-input
          :style="{width:itemWidth}"
          v-model="editForm.itemSpecification"
          placeholder="请选择商品"
          readonly
        />
      </el-form-item>
      <el-form-item label="级别：" prop="itemLevel">
        <el-input
          :style="{width:itemWidth}"
          v-model="editForm.itemLevel"
          placeholder="请选择商品"
          readonly
        />
      </el-form-item>
      <el-form-item label="产地：" prop="itemPlaceOrigin">
        <el-input
          :style="{width:itemWidth}"
          v-model="editForm.itemPlaceOrigin"
          placeholder="请选择商品"
          readonly
        />
      </el-form-item>
      <el-form-item label="单位：" prop="itemUnit">
        <el-select
          :style="{width:itemWidth}"
          placeholder="请选择商品"
          v-model="editForm.itemUnit"
          filterable
          disabled
        >
          <el-option
            v-for="item in unitOptions"
            :key="item.enumId"
            :label="item.name"
            :value="Number(item.enumId)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库：" prop="warehouseId">
        <el-select
          :style="{width:itemWidth}"
          v-model="editForm.warehouseId"
          @change="changeWareHouse"
          clearable
          filterable
          autocomplete="on"
          default-first-option
        >
          <el-option
            v-for="item in wareHouseOptions"
            :label="item.name"
            :key="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="库存上限：" prop="stockUpLimit">
        <el-input :style="{width:itemWidth}" v-model="editForm.stockUpLimit" />
      </el-form-item>
      <el-form-item label="库存下限" prop="stockDownLimit">
        <el-input :style="{width:itemWidth}" v-model="editForm.stockDownLimit" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">取消</el-button>
      <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ChooseOneProduct from '@/components/ChooseProduct/ChooseOne';
import { mapState, mapGetters } from 'vuex';
export default {
    name: 'DrugPriceEdit',
    components: {
        ChooseOneProduct
    },
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
            productVisible: false,
            disDialog: false,
            wareHouseOptions: [],
            choosedValue: '', //默认选择数据
            choosedId: null,
            itemWidth: '235px',
            editForm: this.initEditForm(),
            buttonLoading: false,
            screenWidth: 0,
            enterpriseOptions: [],
            width: this.initWidth(),
            rules: {
                orgMoreId: [
                    {
                        message: '不能为空',
                        required: true,
                        trigger: 'change'
                    }
                ],
                warehouseId: [
                    {
                        message: '不能为空',
                        required: true,
                        trigger: 'change'
                    }
                ],
                itemName: [{ required: true, message: '不能为空', trigger: 'blur' }],
                itemCode: [{ required: true, message: '不能为空', trigger: 'blur' }],
                shorthandCode: [
                    { required: true, message: '不能为空', trigger: 'change' }
                ],
                stockUpLimit: [{ required: true, message: '不能为空', trigger: 'blur' }],
                stockDownLimit: [{ required: true, message: '不能为空', trigger: 'blur' }]
            }
        };
    },
    computed: {
        ...mapState({
            unitOptions: (state) => state.enum.units
        }),
        ...mapGetters('basic', ['orgArchives']),
        ...mapGetters('basic', ['drugInfArchives']),
        initOpen() {
            return productVisible;
        },
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
    created() {
        this.getAllWareHouse();
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    methods: {
        changeName(val) {
            this.editForm.itemCode = '';
            this.editForm.itemId = null;
        },
        changeWareHouse(val) {
            this.wareHouseOptions.forEach((v) => {
                if (v.id == val) {
                    this.editForm.warehouseName = v.name;
                }
            });
        },
        getAllWareHouse() {
            let params = {
                // isRetail: 2
            };
            this.$api.basic_baseWarehouse_all(params).then((res) => {
                let { result } = res.data;
                this.wareHouseOptions = result;
            });
        },
        sure(data) {
            this.editForm.itemCode = data.code;
            this.editForm.itemId = data.id;
            this.editForm.itemName = data.name;
            this.editForm.itemShorthandCode = data.shorthandCode;
            this.editForm.itemTaxRate = data.taxRate;
            this.editForm.itemSpecification = data.specification;
            this.editForm.itemLevel = data.level;
            this.editForm.itemUnit = data.unitId;
            this.editForm.itemPlaceOrigin = data.placeOrigin;
            this.$refs.form.validateField('itemName');
            this.$refs.form.validateField('shorthandCode');
            this.$refs.form.validateField('itemCode');
            this.productVisible = false;
        },
        initEditForm() {
            return {
                'itemCode': '',
                'itemId':null,
                'itemLevel': '',
                'itemName': '',
                'itemPlaceOrigin': '',
                'itemShorthandCode': '',
                'itemSpecification': '',
                'itemTaxRate': '',
                'itemUnit':'',
                'stockDownLimit': '',
                'stockUpLimit': '',
                'warehouseId':'',
                'warehouseName': ''
            };
        },
        initWidth() {
            this.screenWidth = document.body.clientWidth;
            if (this.screenWidth < 991) {
                return '90%';
            } else if (this.screenWidth < 1400) {
                return '70%';
            } else {
                return '80%';
            }
        },
        setEditForm(val) {
            this.editForm = { ...val };
            this.editForm.orgOneId = val.orgId;
        },
        close() {
            this.$emit('close');
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.buttonLoading = true;
                    if (!this.editForm.id) {
                        // create
                        this.$api
                            .stock_stockLimitSet_add(this.editForm)
                            .then((res) => {
                                let { code } = res.data;
                                if (code == 200) {
                                    this.isVisible = false;
                                    this.$message({
                                        message: this.$t('tips.createSuccess'),
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
                            .catch((err) => {
                                this.buttonLoading = false;
                            });
                    } else {
                        // update
                        this.$api
                            .stock_stockLimitSet_update(this.editForm)
                            .then((res) => {
                                let { code } = res.data;
                                if (code == 200) {
                                    this.isVisible = false;
                                    this.$message({
                                        message: this.$t('tips.updateSuccess'),
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
                            .catch((err) => {
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
.chooseCraft-item {
  display: flex;

  >>> .el-form-item__content {
    flex: 1;
  }

  >>> .el-checkbox {
    margin-right: 10px;
    line-height: 26px;
  }
}

</style>
