<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.loginTime" placement="top">
        <el-card>
          <p><el-icon class="el-icon-link" />  IP：{{ item.ip }} </p>
          <p><el-icon class="el-icon-location-outline" />  登录地点：{{ item.location }} </p>
          <p><el-icon class="el-icon-bangzhu" />  浏览器：{{ item.browser }} </p>
          <p><el-icon class="el-icon-monitor" />  登录系统：{{ item.system }} </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
    data() {
        return {
            timeline: []
        };
    },
    mounted() {
        this.getTimeLine();
    },
    methods: {
        getTimeLine() {
            this.$get('system/loginLog/currentUser').then((r) => {
                this.timeline = r.data.data;
            });
        }
    }
};
</script>
<style lang="scss" scoped>
  .el-card.is-always-shadow {
    box-shadow: none;
  }
  .el-card {
    border: 1px solid #f1f1f1;
    border-radius: 2px;
  }
</style>
