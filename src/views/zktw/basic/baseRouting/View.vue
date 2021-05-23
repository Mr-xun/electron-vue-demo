<template>
  <el-dialog
    v-el-drag-dialog
    title="查看"
    :width="width"
    top="5vh"
    :visible.sync="isVisible"
    class="baseRouting-details"
  >
    <el-divider>基本信息</el-divider>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <div class="view-item">
          <span>线路名称：</span>
          {{ info.lineName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <div class="view-item">
          <span>积分：</span>
          {{ info.lineName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <div class="view-item">
          <span>基础剂数：</span>
          {{ info.lineName }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <div class="view-item">
          <span>备注：</span>
          {{ info.remark }}
        </div>
      </el-col>
    </el-row>
    <el-divider>线路安排</el-divider>
    <line-plan ref="linePlan" :type="0" :table-data="info.baseRoutingOrgList" />
  </el-dialog>
</template>
<script>
import LinePlan from './compontents/LinePlan';

export default {
    name: 'BaseRoutingView',
    components: { LinePlan },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            screenWidth: 0,
            width: this.initWidth(),
            info: {}
        };
    },
    computed: {
        isVisible: {
            get() {
                return this.dialogVisible;
            },
            set() {
                this.close();
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
            if (this.screenWidth < 550) {
                return '95%';
            } else if (this.screenWidth < 990) {
                return '90%';
            } else if (this.screenWidth < 1400) {
                return '80%';
            } else {
                return '70%';
            }
        },
        setInfo(val) {
            this.info = { ...val };
        },
        close() {
            this.$emit('close');
        }
    }
};
</script>
<style lang="scss" scoped>
.baseRouting-details /deep/ .el-dialog__body {
  padding-top: 0;
}
.baseRouting-details {
  .view-item {
    margin: 7px;
    i {
      font-size: 0.97rem;
    }
    span {
      margin-left: 5px;
    }
  }
}
</style>
