<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams" label-width="70px">
                <el-form-item label="送货单号">
                    <el-input
                        v-model="queryParams.deliveryOrderNo"
                        placeholder="送货单号"
                        class="filter-item search-item"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label="流水号">
                    <el-input
                        v-model="queryParams.prescriptionOrderNo"
                        clearable
                        @clear="search"
                        @keyup.enter.native="search"
                        placeholder="流水号"
                        class="filter-item search-item"
                    />
                </el-form-item>

                <el-form-item label style="margin-left: 0.75rem">
                    <el-button
                        class="filter-item"
                        type="primary"
                        plain
                        @click="search"
                        >搜索</el-button
                    >
                    <el-button
                        class="filter-item"
                        type="warning"
                        plain
                        @click="reset"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <div class="center-container prescription-audit-container">
            <el-table
                id="table"
                ref="table"
                row-key="id"
                :expand-row-keys="entexpands"
                :key="tableKey"
                v-loading="loading"
                :data="list"
                border
                fit
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
                :max-height="tableHeight"
                style="width: 100%"
            >
                <el-table-column type="expand" width="1">
                    <template slot-scope="props">
                        <el-table
                            :data="props.row.deliveryOrderDetailList"
                            key="expand"
                            border
                            fit
                            :header-cell-style="{
                                background: '#eef1f6',
                                color: '#606266',
                            }"
                            stripe
                            max-height="250px"
                            style="width: calc(100% - 330px); margin: 10px"
                        >
                            <el-table-column
                                align="center"
                                prop="prescriptionOrderNo"
                                min-width="140px"
                                :show-overflow-tooltip="true"
                                label="流水号"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="patientName"
                                min-width="140px"
                                label="姓名"
                                :show-overflow-tooltip="true"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="deliveryAddress"
                                min-width="180px"
                                :show-overflow-tooltip="true"
                                label="送货地址"
                            ></el-table-column>
                            <el-table-column
                                align="center"
                                prop="doseNum"
                                label="付数"
                                min-width="80px"
                            ></el-table-column>
                            <el-table-column
                                label="送货上门打印次数"
                                :show-overflow-tooltip="true"
                                min-width="160px"
                                align="center"
                                prop="toDoorPrintNum"
                            ></el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                    label="序号"
                    type="index"
                    width="50"
                    align="center"
                ></el-table-column>
                <el-table-column label="展开" align="center" min-width="60">
                    <template slot-scope="scope">
                        <template v-if="entexpands.indexOf(scope.row.id)">
                            <i
                                class="el-icon-plus handle-icon"
                                @click="
                                    orderShow($event, scope.row, scope.$index)
                                "
                            ></i>
                        </template>
                        <template v-else>
                            <i
                                class="el-icon-minus handle-icon"
                                @click="packUp($event, scope.row, scope.$index)"
                            ></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    label="送货单号"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="150px"
                    prop="orderNo"
                ></el-table-column>
                <el-table-column
                    label="快递员"
                    min-width="100px"
                    :show-overflow-tooltip="true"
                    align="center"
                    prop="deliveryman"
                ></el-table-column>
                <el-table-column
                    label="发货时间"
                    :show-overflow-tooltip="true"
                    min-width="160px"
                    align="center"
                    prop="createTime"
                ></el-table-column>

                <el-table-column
                    label="操作"
                    align="center"
                    width="320px"
                    fixed="right"
                    class-name="small-padding fixed-width"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            size="mini"
                            type="success"
                            icon="el-icon-finished"
                            @click="toPrint(row)"
                            v-has-permission="['deliveryOrderPrint:print']"
                            >打印</el-button
                        >
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-plus"
                            @click="addTo(row)"
                            v-has-permission="['deliveryOrder:plus']"
                            >追加</el-button
                        >
                        <el-button
                            size="mini"
                            type="warning"
                            icon="el-icon-refresh-left"
                            @click="changeConsigner(row)"
                            v-has-permission="['replaceDeliveryMan:replace']"
                            >更换发货人</el-button
                        >
                        <el-link
                            v-has-no-permission="[
                                'deliveryOrder:print',
                                'deliveryOrder:plus',
                                'replaceDeliveryMan:replace',
                            ]"
                            class="no-perm"
                            >无权限</el-link
                        >
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
            <el-dialog
                title="更换发货人"
                v-el-drag-dialog
                :visible.sync="changeDeliverMandialogVisible"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :before-close="closeChange"
                width="500px"
            >
                <el-form
                    :model="changeForm"
                    label-width="100px"
                    ref="form"
                    :rules="rules"
                >
                    <el-form-item label="快递员：" prop="deliverymanCode">
                        <el-select
                            ref="deliverymanCode"
                            v-model="changeForm.deliverymanCode"
                            filterable
                            style="width: 200px"
                        >
                            <el-option
                                v-for="item in userOptions"
                                :label="item.name"
                                :value="item.userCode"
                                :key="item.userCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeChange()">取 消</el-button>
                    <el-button type="primary" @click="sureChange()"
                        >确 定</el-button
                    >
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import ExpandCollapse from '@/components/ExpandCollapse';
import { mapGetters } from 'vuex';
export default {
    name: 'DeliveryList',
    components: { Pagination, ExpandCollapse },
    data() {
        return {
            userOptions: [],
            changeDeliverMandialogVisible: false,
            changeForm: {
                deliverymanCode: '',
                deliveryOrderId: ''
            },
            entexpands: [],
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            selection: [],
            pagination: {
                size: 10,
                num: 1
            },
            rules: {
                deliverymanCode: [
                    {
                        message: '不能为空',
                        required: true,
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters(['tableHeight'])
    },
    activated() {
        this.fetch();
    },
    deactivated() {},
    destroyed() {},
    methods: {
        //去打印
        toPrint(row) {
            let hostUrl = window.location.origin + window.location.pathname;
            let routeUrl = this.$router.resolve({
                path: '/print/preview',
                query: {
                    printType: 'deliveryOrder',
                    deliveryOrderNo: row.orderNo
                }
            });
            window.open(
                hostUrl + routeUrl.href + '&timestamp=' + new Date().getTime(),
                'printPage',
                'height=800,width=800,top=0,left=800,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no, status=no'
            );
        },
        //追加
        addTo(row) {
            this.$router.push({
                name: '送货单',
                params: {
                    type: 'toAdd',
                    deliveryOrderId: row.id
                }
            });
        },
        getAllowPersoner() {
            let params = {
                pageNum: 1,
                pageSize: 100
            };
            this.$api
                .delivery_deliveryman_getAllowPersonList(params)
                .then((r) => {
                    let { rows } = r.data.result;
                    this.userOptions = rows || [];
                });
        },
        //变更发货人
        changeConsigner(row, type) {
            this.changeForm.deliveryOrderId = row.id;
            this.getAllowPersoner();
            this.changeDeliverMandialogVisible = true;
        },
        sureChange() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let params = {
                        deliveryOrderId: this.changeForm.deliveryOrderId,
                        deliverymanCode: this.changeForm.deliverymanCode
                    };
                    this.$api
                        .delivery_deliveryOrder_replaceDeliveryMan(params)
                        .then((res) => {
                            this.$message({
                                message: '更换发货人成功',
                                type: 'success'
                            });
                            this.closeChange();
                            this.fetch();
                        });
                } else {
                    return false;
                }
            });
        },
        closeChange() {
            this.changeDeliverMandialogVisible = false;
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
            this.changeForm.deliverymanCode = '';
            this.changeForm.deliveryOrderId = '';
        },
        orderShow(event, row, index) {
            Array.prototype.remove = function (val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            if (this.entexpands.indexOf(row.id) < 0) {
                this.entexpands = [];
                row.expand = true;
                this.entexpands.push(row.id);
            } else {
                this.entexpands.remove(row.id);
            }
        },
        packUp(event, row, index) {
            this.entexpands = [];
            row.expand = false;
        },

        search() {
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.pagination.num = 1;
            this.queryParams = {};
            this.fetch();
        },
        fetch() {
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num
            };
            this.loading = true;
            this.$api
                .delivery_deliveryOrder_list(params)
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
.prescription-audit-container {
    /deep/ .el-table__expand-icon {
        color: transparent;
    }
    .handle-icon {
        cursor: pointer;
    }
    .autoTimeChoose {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: end;
        -ms-flex-pack: end;
        justify-content: flex-end;
        .timeBox {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            .title {
                margin-right: 25px;
            }
            .timeChoole {
                width: 120px;
                margin-right: 20px;
            }
        }
    }
}
.more-filter {
    margin: 10px 0;
    /deep/ .el-divider__text {
        padding: 0 10px;
    }
    i {
        font-size: 22px;
        cursor: pointer;
    }
}
</style>
