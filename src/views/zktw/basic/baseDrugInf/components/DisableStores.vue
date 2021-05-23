<template>
  <el-dialog
    title="禁用机构"
    v-el-drag-dialog
    width="800px"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    :append-to-body="true"
  >
    <el-transfer
      filterable
      filter-placeholder="请输入机构"
      v-model="chooseData"
      :props="{
      key: 'id',
      label: 'name'
    }"
      :data="allOrg"
      class="disable-transfer"
      :titles="['解禁列', '禁用列']"
      :button-texts="['解禁', '禁用']"
    ></el-transfer>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain @click="isVisible = false">取消</el-button>
      <el-button type="primary" plain @click="sure">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
    name: 'DisableStore',
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        allOrg:{
            type:Array,
            default(){
                return [];
            }
        }
    },
    data() {
        return {
            chooseData: [],
            orgData: []
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
    created() {
    },
    mounted() {},
    methods: {
        setChooesdData(data) {
            console.log(data, 3);
            if(data.length){
                data = data.map(v=>Number(v));
            }
            this.chooseData = data;
        },
        close() {
            this.$emit('close');
        },
        sure() {
            this.$emit('success', this.chooseData);
        },
        reset() {
            this.chooseData = [];
        }
    }
};
</script>
<style lang="scss" scoped>
.disable-transfer {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
