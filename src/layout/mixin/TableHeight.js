import {
    debounce
} from '@/utils';

export default {
    watch: {
        $route: {
            handler: function (val, oldVal) {
                this.$nextTick(function () {  //页面加载完成后执行
                    setTimeout(() => {
                        this.initHeight();
                    }, 600);
                });
            },
            // 深度观察监听
            deep: true
        }
    },
    created() {
        this.initHeight();
    },
    mounted() {
        this.__resizeHandler = debounce(() => {
            this.initHeight();
        }, 100);
        window.addEventListener('resize', this.__resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.__resizeHandler);
    },
    methods: {
        initHeight() {
            this.$nextTick(() => {
                let creenHeight = document.body.clientHeight;
                let fixedHeight = document.getElementsByClassName('fixed-header')[0]
                    .offsetHeight;
                let filterHeight = 0;
                let paginationHeight = 80;
                let footerHeight = document.getElementsByClassName('footer')[0]
                    .offsetHeight;
                let filterContainer = document.getElementsByClassName(
                    'filter-container'
                );
                if (filterContainer && filterContainer.length) {
                    filterHeight = filterContainer[0].offsetHeight;
                }
                let paginationContainer = document.getElementsByClassName(
                    'pagination-container'
                );
                if (paginationContainer && paginationContainer.length) {
                    paginationHeight = paginationContainer[0].offsetHeight || 80;
                }
                let tableHeight =
                    creenHeight -
                    fixedHeight -
                    filterHeight -
                    paginationHeight -
                    footerHeight - 50;
                if (tableHeight < 150) tableHeight = 150;
                this.$store.commit('setting/setTableHeight', tableHeight);
            });
        }
    }
};
