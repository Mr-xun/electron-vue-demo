<template>
  <div class="dept">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="app-container">
          <div class="filter-container">
            <el-input
              v-model="deptName"
              placeholder="部门名称"
              class="filter-item search-item"
            />
            <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
            <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
            <el-dropdown
              v-has-any-permission="['dept:add','dept:delete','dept:export']"
              trigger="click"
              class="filter-item"
            >
              <el-button>
                更多操作
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-has-permission="['dept:add']" @click.native="add">新增</el-dropdown-item>
                <el-dropdown-item v-has-permission="['dept:delete']" @click.native="deleteDept">删除</el-dropdown-item>
                <el-dropdown-item v-has-permission="['dept:export']" @click.native="exportExcel">导出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="center-container">
            <el-tree
              ref="deptTree"
              :data="deptTree"
              :check-strictly="true"
              show-checkbox
              accordion
              node-key="id"
              highlight-current
              :filter-node-method="filterNode"
              @node-click="nodeClick"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ dept.deptId === '' ? "新增" : "修改" }}</span>
          </div>
          <div>
            <el-form
              ref="form"
              :model="dept"
              :rules="rules"
              label-position="right"
              label-width="100px"
            >
              <el-form-item label="上级部门" prop="parentId">
                <treeselect
                  v-model="dept.parentId"
                  :multiple="false"
                  :options="deptTree"
                  clear-value-text="清除"
                  placeholder=" "
                  style="width:100%"
                />
              </el-form-item>
              <el-form-item label="部门名称" prop="deptName">
                <el-input v-model="dept.deptName" />
              </el-form-item>
              <el-form-item label="排序" prop="orderNum">
                <el-input-number
                  v-model="dept.orderNum"
                  :min="0"
                  :max="100"
                  @change="handleNumChange"
                />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: -2rem;">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button
                type="primary"
                plain
                :loading="buttonLoading"
                @click="submit"
              >{{ dept.deptId === '' ? "新增" : "修改" }}</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
    name: 'DeptManager',
    components: { Treeselect },
    data() {
        return {
            deptName: '',
            buttonLoading: false,
            deptTree: [],
            dept: this.initDept(),
            rules: {
                deptName: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    mounted() {
        this.initDeptTree();
    },
    methods: {
        initDept() {
            return {
                deptId: '',
                deptName: '',
                parentId: null,
                orderNum: 0
            };
        },
        initDeptTree() {
            this.$get('system/dept').then(r => {
                this.deptTree = r.data.data.rows;
            });
        },
        exportExcel() {
            this.$download(
                'system/dept/excel',
                {
                    deptName: this.deptName
                },
                `dept_${new Date().getTime()}.xlsx`
            );
        },
        handleNumChange(val) {
            this.dept.orderNum = val;
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        nodeClick(data) {
            this.dept.parentId = data.parentId;
            if (this.dept.parentId === '0') {
                this.dept.parentId = null;
            }
            this.dept.orderNum = data.orderNum;
            this.dept.deptName = data.label;
            this.dept.deptId = data.id;
            this.$refs.form.clearValidate();
        },
        add() {
            this.resetForm();
            this.$message({
                message: '请在表单中填写相关信息',
                type: 'info'
            });
        },
        deleteDept() {
            const checked = this.$refs.deptTree.getCheckedKeys();
            if (checked.length === 0) {
                this.$message({
                    message: '请先选择节点',
                    type: 'warning'
                });
            } else {
                this.$confirm('选中节点及其子结点将被永久删除, 是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.dept.deptIds = checked.join(',');
                        this.$delete(`system/dept/${this.dept.deptIds}`).then(() => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.reset();
                        });
                    })
                    .catch(() => {
                        this.$refs.deptTree.setCheckedKeys([]);
                    });
            }
        },
        search() {
            this.$refs.deptTree.filter(this.deptName);
        },
        reset() {
            this.initDeptTree();
            this.deptName = '';
            this.resetForm();
        },
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.buttonLoading = true;
                    this.dept.createTime = this.dept.modifyTime = null;
                    if (this.dept.deptId) {
                        this.$put('system/dept', { ...this.dept }).then(() => {
                            this.buttonLoading = false;
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.reset();
                        });
                    } else {
                        this.$post('system/dept', { ...this.dept }).then(() => {
                            this.buttonLoading = false;
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                            this.reset();
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
            this.dept = this.initDept();
        }
    }
};
</script>
<style lang="scss" scoped>
.dept {
  margin: 10px;
  .app-container {
    margin: 0 0 10px 0 !important;
  }
}
.el-card.is-always-shadow {
  box-shadow: none;
}
.el-card {
  border-radius: 0;
  border: none;
  .el-card__header {
    padding: 10px 20px !important;
    border-bottom: 1px solid #f1f1f1 !important;
  }
}
</style>
<style lang="scss">
.vue-treeselect__menu {
  max-height: 165px !important;
}
</style>
