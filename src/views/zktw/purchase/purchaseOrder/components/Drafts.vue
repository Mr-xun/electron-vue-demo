<template>
    <el-dialog
        title="草稿箱"
        v-el-drag-dialog
        :width="width"
        top="10px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="isVisible"
        class="drafts-dialog"
    >
        <div class="dialog-filter-container">
            <el-form ref="form" :inline="true" :model="queryParams" class="">
                <el-form-item label="单据日期">
                    <el-date-picker
                        size="mini"
                        style="width:280px;"
                        v-model="queryParams.timeRange"
                        type="daterange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="filter-item search-item"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label=" " label-width="10px">
                    <el-button
                        class="filter-item"
                        type="primary"
                        size="mini"
                        plain
                        @click="search"
                    >搜索</el-button>
                    <el-button
                        class="filter-item"
                        type="warning"
                        size="mini"
                        plain
                        @click="reset"
                    >重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table ref="table" v-loading="loading" :data="list" border fit style="width: 100%;">
            <el-table-column
                label="单据编号"
                prop="orderNo"
                :show-overflow-tooltip="true"
                align="center"
                min-width="150px"
            ></el-table-column>
            <el-table-column
                label="订单日期"
                :show-overflow-tooltip="true"
                align="center"
                min-width="80px"
                prop="orderDate"
            ></el-table-column>
            <el-table-column
                label="采购人员"
                :show-overflow-tooltip="true"
                align="center"
                prop="creatorName"
            ></el-table-column>
            <el-table-column
                label="供货单位"
                :show-overflow-tooltip="true"
                align="center"
                prop="supplierName"
                min-width="120px"
            ></el-table-column>
            <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
                fixed="right"
            >
                <template slot-scope="{row}">
                    <el-button type="success" size="mini" plain @click="chooseDraft(row)">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="pagination.num"
            :limit.sync="pagination.size"
            @pagination="fetch"
        />
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" plain :loading="buttonLoading" @click="isVisible = false">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import Pagination from '@/components/Pagination';
export default {
    name: 'Drafts',
    components: { Pagination },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            loading: false,
            buttonLoading: false,
            screenWidth: 0,
            width: this.initWidth(),
            list: [],
            total: 0,
            queryParams: {},
            selection: [],
            pagination: {
                size: 5,
                num: 1
            },
            queryParams: {
                inputShow: true,
                selectContent: '',
                value: '',
                code: '',
                erpCode: '',
                name: '',
                commonName: '',
                letterF: '',
                content: []
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
            }
        }
    },

    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
        this.fetch();
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
        close() {
            this.$emit('close');
        },
        chooseDraft(row) {
            this.$emit('chooseDraft', row);
        },
        search() {
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.queryParams = {};
            this.$refs.table.clearFilter();
            this.search();
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        fetch() {
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num,
                status:1
            };
            if (this.queryParams.timeRange) {
                params.startTime = this.queryParams.timeRange[0];
                params.endTime = this.queryParams.timeRange[1];
            }
            this.loading = true;
            this.$api
                .order_purchaseOrder_list(params)
                .then((r) => {
                    let { result } = r.data;
                    this.total = result.total;
                    this.list = result.rows;
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.drafts-dialog {
    >>> .el-dialog__body {
        padding: 20px 20px 0;
    }
}
</style>
