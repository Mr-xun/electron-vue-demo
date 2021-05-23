
<template>
        <div class="exp-col">
            <el-divider >
                <i class="el-icon-mobile-phone"  @click="tack"></i>
            </el-divider>
        </div>
</template>
<script>
export default {
    data() {
        return {
            moreQuery: true // 展开收缩按钮
        };
    },
    methods: {
    /**
     * @function 顶部展开收缩
     */
        tack() {
            if (this.moreQuery) {
                const data = document.getElementsByClassName('filter-container');
                data[0].style.height = 'auto';
                this.moreQuery = false;
            } else {
                const data = document.getElementsByClassName('filter-container');
                data[0].style.height = '50px';
                this.moreQuery = true;
            }
        }
    }
};
</script>