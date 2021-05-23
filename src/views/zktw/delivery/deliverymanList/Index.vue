<template>
    <div class="app-container">
        <div class="workforce-container">
            <el-radio-group v-model="staffStatus">
                <div class="small-group">
                    <el-radio
                        :label="10"
                        border
                        class="custom-radio"
                        >签到</el-radio
                    >
                    <el-radio
                        :label="20"
                        border
                        class="custom-radio"
                        >签退</el-radio
                    >
                </div>
                <div class="small-group">
                    <el-radio
                        :label="11"
                        border
                        class="custom-radio"
                        >送药返回</el-radio
                    >
                    <el-radio
                        :label="22"
                        border
                        class="custom-radio"
                        >解除排队</el-radio
                    >
                    <el-radio
                        :label="12"
                        border
                        class="custom-radio"
                        >解除脱岗</el-radio
                    >
                </div>
            </el-radio-group>
            <el-button
                class="submit-btn"
                type="success"
                size="small"
                icon="el-icon-check"
                @click="submit"
                v-has-permission="['arrangeSubmit:submit']"
                >提交</el-button
            >
        </div>
        <div class="center-container">
            <el-table
                ref="table"
                :key="tableKey"
                v-loading="loading"
                :data="list"
                border
                fit
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
                :max-height="tableHeight"
                style="width: 100%"
                @selection-change="onSelectChange"
            >
                <el-table-column type="selection" align="center" width="40px" />
                <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="手机号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="mobileNo"
                ></el-table-column>
                <el-table-column
                    label="名称"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="name"
                ></el-table-column>
                <el-table-column
                    label="状态"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="hisCode"
                >
                    <template slot-scope="{ row }">
                        <span>{{ row.status | flDeliveryStatusName }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="pagination.num"
                :limit.sync="pagination.size"
                @pagination="fetch"
            />
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { mapGetters } from 'vuex';

export default {
    name: 'DeliverymanList',
    components: { Pagination },
    data() {
        return {
            staffStatus: null, //员工状态
            dialog: {
                isVisible: false,
                title: ''
            },
            tableKey: 0,
            loading: false,
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
        ...mapGetters(['tableHeight'])
    },
    activated() {
        this.fetch();
    },
    methods: {
        //提交
        submit() {
            if (!this.selection.length) {
                this.$message({
                    message: '至少选择一条记录!',
                    type: 'error'
                });
                return;
            }
            if (!this.staffStatus) {
                this.$message({
                    message: '请选择状态!',
                    type: 'error'
                });
                return;
            }
            let userCodeArr = this.selection.map((item) => item.userCode);
            let params = {
                status: this.staffStatus,
                userCodeList: userCodeArr
            };
            this.$api.delivery_deliveryman_submit(params).then((res) => {
                this.$message({
                    message: '排班更新成功',
                    type: 'success'
                });
                this.staffStatus = null;
                this.fetch();
                this.clearSelections();
            });
        },
        onSelectChange(selection) {
            this.selection = selection;
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        fetch() {
            let params = this.queryParams;
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;

            this.loading = true;
            this.$api
                .delivery_deliveryman_list(params)
                .then((r) => {
                    let { rows, total } = r.data.result;
                    this.total = total;
                    this.list = rows;
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
.workforce-container {
    padding: 20px;
    margin-bottom: 5px;
    background: #fff;
    border-radius: 5px;
    text-align: center;
    position: relative;
    .small-group {
        display: inline-block;
        margin: 0 5px;
    }
    .custom-radio {
        margin-right: 0 !important;
        margin-bottom: 10px !important;
    }
    .submit-btn {
        margin-left: 90px !important;
        margin-bottom: 10px !important;
    }
}
</style>
