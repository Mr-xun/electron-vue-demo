<template>
    <div class="dosage-container">
        <div class="operate-btn">
            <el-button class="filter-item" type="success" size="mini" plain @click.native="add">新增机构</el-button>
        </div>
        <el-table
            ref="table"
            :key="tableKey"
            :data="orgData"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            stripe
            border
            fit
            max-height='380px'
            style="width: 100%;"
        >
            <el-table-column label="机构名称" align="center" min-width="200px">
                <template slot-scope="scope">
                    <el-select
                        v-model="scope.row.orgId"
                        @change="getTargetName($event,'id','orgArchives',scope.row)"
                        filterable
                        clearable
                        style="width:100%;"
                        no-data-text="无可选机构"
                        :no-match-text="scope.row.orgName"
                    >
                        <el-option
                            v-for="item in flOrgArchiveOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="编码" align="center" min-width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.orgCode}}</span>
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('table.operation')"
                align="center"
                min-width="150px"
                fixed="right"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="{row,$index}">
                    <i
                        class="el-icon-delete table-operation"
                        style="color: #f50;"
                        @click="singleDelete(row,$index)"
                    />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'AddOrg',
    props: {
        orgData: {
            default: () => {
                return [];
            },
            type: Array
        }
    },
    computed: {
        ...mapGetters('basic', ['orgArchives'])
    },
    data() {
        return {
            tableKey: 0,
            beforeOrgData: [],
            flOrgArchiveOptions: this.orgArchives
        };
    },
    mounted() {
        this.beforeOrgData = JSON.parse(JSON.stringify(this.orgData));
    },
    methods: {
        //初始化可选机构
        initFlOrg() {
            this.flOrgArchiveOptions = this.orgArchives;
            this.$nextTick(() => {
                this.beforeOrgData = JSON.parse(JSON.stringify(this.orgData));
            });
        },
        //过滤已选过机构
        setFlOrg() {
            this.flOrgArchiveOptions = this.orgArchives.filter(
                (item) => !this.orgData.some((ele) => ele.orgId === item.id)
            );
        },
        getTargetName(val, key, options, row) {
            this[options].forEach((item) => {
                if (item[key] == val) {
                    row.orgName = item.name;
                    row.orgCode = item.code;
                }
            });
            let flag = this.beforeOrgData.some(
                (v) => v.orgId && v.orgId == val
            );
            if (flag) {
                this.$message({
                    message: '已选过该机构',
                    type: 'warning'
                });
                row.orgId = '';
                row.orgName = '';
                row.orgCode = '';
            } else {
                this.setFlOrg();
            }
            this.beforeOrgData = JSON.parse(JSON.stringify(this.orgData));
        },
        add() {
            this.setFlOrg();
            this.orgData.push({
                orgId: '',
                orgName: '',
                orgCode: ''
            });
        },
        singleDelete(row, index) {
            this.$confirm('选中数据将被移除，是否继续？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.orgData.splice(index, 1);
                this.beforeOrgData = JSON.parse(JSON.stringify(this.orgData));
                this.setFlOrg();
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.dosage-container {
    .operate-btn {
        text-align: right;
        margin: 15px;
    }
}
</style>
