<template>
    <dv-full-screen-container>
        <div class="app-container report-container decort-table">
            <el-table
                ref="leftTable"
                v-loading="loading"
                :data="leftTableList"
                border
                fit
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
                :max-height="tableHeight"
                style="width: 40%"
                class="left-table"
            >
                <el-table-column
                    label="机构名称"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="105px"
                    prop="prescriptionOrgName"
                ></el-table-column>
                <el-table-column
                    label="处方号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="60px"
                    prop="prescriptionNum"
                ></el-table-column>
                <el-table-column
                    label="流水号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="flowNumber"
                ></el-table-column>
                <el-table-column
                    label="煎药时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="130px"
                    prop="decoctTime"
                ></el-table-column>
                <el-table-column
                    label="付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="doseQty"
                    min-width="50px"
                    ><template slot-scope="{ row }">
                        {{ row.doseQty | formatMoney(0) }}
                    </template></el-table-column
                >
                <el-table-column
                    label="煎药锅编号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="decoctCode"
                ></el-table-column>
                <el-table-column
                    label="小包装数量"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="70px"
                    prop="smallPackQty"
                >
                    <template slot-scope="{ row }">
                        {{ row.smallPackQty | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="味数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="tasteQty"
                    min-width="50px"
                >
                    <template slot-scope="{ row }">
                        {{ row.tasteQty | formatMoney(0) }}
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                ref="rightTable"
                v-loading="loading"
                :data="rightTableList"
                border
                fit
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
                :max-height="tableHeight"
                style="width: 40%"
                class="right-table"
            >
                <el-table-column
                    label="机构名称"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="105px"
                    prop="prescriptionOrgName"
                ></el-table-column>
                <el-table-column
                    label="处方号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="60px"
                    prop="prescriptionNum"
                ></el-table-column>
                <el-table-column
                    label="流水号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="flowNumber"
                ></el-table-column>
                <el-table-column
                    label="煎药时间"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="130px"
                    prop="decoctTime"
                ></el-table-column>
                <el-table-column
                    label="付数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="doseQty"
                    min-width="50px"
                >
                    <template slot-scope="{ row }">
                        {{ row.doseQty | formatMoney(0) }}
                    </template></el-table-column
                >
                <el-table-column
                    label="煎药锅编号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                    prop="decoctCode"
                ></el-table-column>
                <el-table-column
                    label="小包装数量"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="70px"
                    prop="smallPackQty"
                >
                    <template slot-scope="{ row }">
                        {{ row.smallPackQty | formatMoney(0) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="味数"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="tasteQty"
                    min-width="50px"
                >
                    <template slot-scope="{ row }">
                        {{ row.tasteQty | formatMoney(0) }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </dv-full-screen-container>
</template>

<script>
import Vue from 'vue';
import { debounce } from '@/utils';
import { fullScreenContainer } from '@jiaminghi/data-view';
Vue.use(fullScreenContainer);
export default {
    name: 'DecoctMonitor',
    data() {
        return {
            tableHeight: 300,
            tableKey: 0,
            loading: false,
            leftTableList: [],
            rightTableList: [],
            oneMinuteTimeUpdate: null
        };
    },

    created() {
        this.initHeight();
    },
    mounted() {
        this.fetch();
        this.oneMinuteTimeUpdate = setInterval(() => {
            this.fetch();
        }, 60000);
        this.__resizeHandler = debounce(() => {
            this.initHeight();
        }, 100);
        window.addEventListener('resize', this.__resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.__resizeHandler);
    },
    destroyed() {
        clearInterval(this.oneMinuteTimeUpdate);
    },
    methods: {
        initHeight() {
            this.$nextTick(() => {
                let creenHeight = document.body.clientHeight;
                let tableHeight = creenHeight - 10;
                if (tableHeight < 150) tableHeight = 150;
                this.tableHeight = tableHeight;
            });
        },
        fetch() {
            this.$api
                .report_decoctMonitor_getDecoctMonitor()
                .then((r) => {
                    let { result } = r.data;
                    this.leftTableList = result.filter((item, index) => {
                        return index % 2 == 0;
                    });
                    this.rightTableList = result.filter((item, index) => {
                        return index % 2 != 0;
                    });
                    this.loading = false;
                    this.$nextTick(() => {
                        this.$refs.leftTable.bodyWrapper.scrollTop = this.$refs.leftTable.bodyWrapper.scrollHeight;
                        this.$refs.rightTable.bodyWrapper.scrollTop = this.$refs.rightTable.bodyWrapper.scrollHeight;
                    });
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
.decort-table {
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-around;
    .left-table {
        margin-right: 0.25rem;
    }
    /deep/ .el-table .cell {
        padding-left: 0.25rem !important;
        padding-right: 0.25rem !important;
        font-size: 0.75rem !important;
    }
}
</style>
