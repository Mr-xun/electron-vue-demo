<template>
    <div class="chooseMoreProduct-component">
        <div class="filter-box">
            <el-input
                v-model="queryParams.content"
                size="mini"
                placeholder="商品名称/速记码"
                class="filter-item search-item"
                @input="filterProduct"
            />
            <el-button class="filter-item" size="mini" type="primary" plain @click="sure">确定</el-button>
            <el-button class="filter-item" size="mini" type="warning" plain @click="cancel">取消</el-button>
        </div>
        <el-table
            ref="table"
            v-loading="loading"
            :data="list"
            border
            :max-height="250"
            fit
            style="width: 100%;"
            @select="oneSelect"
            @select-all="allSelect"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            stripe
        >
            <el-table-column type="selection" align="center" width="40px" />
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="商品名称" align="center" :show-overflow-tooltip="true" prop="name"></el-table-column>
            <el-table-column label="商品编码" align="center" :show-overflow-tooltip="true" prop="code"></el-table-column>
            <el-table-column
                label="规格"
                align="center"
                :show-overflow-tooltip="true"
                prop="specification"
            ></el-table-column>
            <el-table-column
                label="产地"
                align="center"
                :show-overflow-tooltip="true"
                prop="placeOrigin"
            ></el-table-column>
            <el-table-column label="单位" align="center" :show-overflow-tooltip="true" prop="unit">
                <template slot-scope="{row}">{{row.unit |flUnitName}}</template>
            </el-table-column>
            <el-table-column
                label="速记码"
                align="center"
                :show-overflow-tooltip="true"
                prop="shorthandCode"
            ></el-table-column>
        </el-table>
        <pagination
            class="small-pagin"
            v-show="allList.length>0"
            :total="allList.length"
            :small="true"
            :page.sync="pagination.num"
            :limit.sync="pagination.size"
            @pagination="paging"
        />
    </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import { mapGetters } from 'vuex';

export default {
    name: 'ChooseMoreProduct',
    components: { Pagination },
    props: {
        columns: {
            type: Array,
            default() {
                return ['商品名称'];
            }
        },
        initData: {
            //默认选中数据
            type: Array,
            default() {
                return [];
            }
        },
        unique: {
            type: String,
            default: 'id'
        }
    },
    data() {
        return {
            addDialog: false,
            editDialog: false,
            loading: false,
            flList: [],
            allList: [],
            list: [],
            total: 0,
            queryParams: {},
            selection: [],
            pagination: {
                size: 10,
                num: 1
            }
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapGetters('basic', ['drugInfArchives'])
    },
    watch: {
        initData: {
            handler(data) {
                if (data && data.length) {
                    this.selection = data;
                } else {
                    this.selection = [];
                }
                this.$nextTick(() => {
                    this.clearSelections();
                    this.selection.forEach((row) => {
                        this.$refs.table.toggleRowSelection(row, true);
                    });
                    this.onSelectChange(this.selection);
                });
            },
            immediate: true //首次传值也需要执行
        }
    },
    mounted() {
        this.allList = this.drugInfArchives;
        this.paging();
    },
    methods: {
        chooseSelectd() {
            this.selection = this.drugInfArchives.filter((v) => v.selected);
            this.selection.forEach((row) => {
                this.$refs.table.toggleRowSelection(row, true);
            });
        },
        //过滤产品
        filterProduct(val) {
            var reg = RegExp(`${val}`);
            this.allList = this.drugInfArchives.filter(
                (item) => reg.test(item.name) || reg.test(item.shorthandCode)
            );
            this.paging();

            // if (!val && val != 0) {
            //     this.list = this.allList;
            // } else {
            //     var reg = RegExp(`${val}`);
            //     this.list = this.allList.filter(
            //         (item) =>
            //             reg.test(item.name) || reg.test(item.shorthandCode)
            //     );
            //     this.$nextTick(() => {
            //         this.chooseSelectd();
            //     });
            // }
        },
        sure() {
            this.$emit('sure', this.selection);
        },
        cancel() {
            this.$emit('cancel');
        },
        //分页
        paging() {
            this.list = this.allList.slice(
                this.pagination.size * (this.pagination.num - 1),
                this.pagination.size * this.pagination.num
            );
            this.$nextTick(() => {
                this.chooseSelectd();
            });
        },
        //单个选中
        oneSelect(selection) {
            this.onSelectChange(selection);
        },
        //全部选中
        allSelect(selection) {
            this.onSelectChange(selection);
        },
        onSelectChange(selection) {
            this.selection = selection;
            let selLen = selection.length;
            let listLen = this.list.length;
            for (let i = 0; i < listLen; i++) {
                this.$set(this.list[i], 'selected', false);
                for (let j = 0; j < selLen; j++) {
                    if (this.list[i].id == selection[j].id) {
                        this.$set(this.list[i], 'selected', true);
                        break;
                    }
                }
            }
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        }
    }
};
</script>
<style lang="scss" scoped>
.chooseMoreProduct-component {
    .filter-box {
        display: flex;
        margin-bottom: 3px;
    }

    >>> .el-button--mini {
        padding: 7px 15px;
        margin-left: 5px !important;
    }

    >>> .el-table td {
        padding: 7px 0;
    }
    .small-pagin {
        padding: 10px 0 0;
    }
}
</style>
