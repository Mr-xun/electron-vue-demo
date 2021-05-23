<template>
    <div class="chooseOrg-component">
        <div class="filter-box">
            <el-input
                v-model="queryParams.content"
                size="mini"
                placeholder="机构名称/速记码"
                class="filter-item search-item"
                @input="flOrg"
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
            :header-cell-style="{background:'#eef1f6',color:'#606266'}" stripe
        >
            <el-table-column type="selection" align="center" width="40px" />
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="机构名称" align="center" :show-overflow-tooltip="true" prop="name"></el-table-column>
            <el-table-column
                label="速记码"
                align="center"
                :show-overflow-tooltip="true"
                prop="shorthandCode"
            ></el-table-column>
        </el-table>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import { mapGetters } from 'vuex';

export default {
    name: 'ChooseOrg',
    components: { Pagination },
    props: {
        columns: {
            type: Array,
            default() {
                return ['机构名称'];
            }
        },
        init: {
            //默认选中数据
            default: ''
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
        ...mapGetters('basic',['orgArchives'] )
    },
    watch: {
        init(data) {
            if (data) {
                this.selection = this.list.filter(item => {
                    return data.findIndex(_v => item[this.unique] == _v) > -1;
                });
                this.$nextTick(()=>{
                    this.clearSelections();
                    this.selection.forEach(row => {
                        this.$refs.table.toggleRowSelection(row, true);
                        this.onSelectChange(this.selection);
                    });
                });

            }
        }
    },
    mounted(){
        this.list = this.allList = this.orgArchives;
    },
    methods: {
        chooseSelectd() {
            this.clearSelections();
            this.selection = this.list.filter(v => v.selected);
            this.selection.forEach(row => {
                this.$refs.table.toggleRowSelection(row, true);
            });
        },
        flOrg(val) {
            if (!val && val != 0) {
                this.list = this.allList;
            } else {
                var reg = RegExp(`${val}`);
                this.list = this.allList.filter(
                    item => reg.test(item.name) || reg.test(item.shorthandCode)
                );
                this.$nextTick(() => {
                    this.chooseSelectd();
                });
            }
        },
        sure() {
            this.$emit('sure', this.selection);
        },
        cancel() {
            this.$emit('cancel');
        },
        oneSelect(selection) {
            this.onSelectChange(selection);
        },
        allSelect(selection) {
            this.onSelectChange(selection);
        },
        onSelectChange(selection) {
            this.selection = selection;
            let selLen = selection.length;
            let listLen = this.list.length;
            for (let i = 0; i < listLen; i++) {
                this.list[i].selected = false;
                for (let j = 0; j < selLen; j++) {
                    if (this.list[i].id == selection[j].id) {
                        this.list[i].selected = true;
                        break;
                    }
                }
            }
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        fetch() {
            this.loading = true;
            this.$api
                .basic_baseOrg_all()
                .then(r => {
                    this.list = this.allList = r.data.result;
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.chooseOrg-component {
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
}
</style>
