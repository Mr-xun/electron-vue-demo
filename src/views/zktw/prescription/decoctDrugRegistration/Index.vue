<template>
    <div class="app-container">
        <div class="adjust-form-container">
            <div
                class="adjust-tip f16 fbold text-center"
                :class="operateOrderStatus ? 'success-tip' : 'fail-tip'"
                v-if="this.operateOrderInfo"
            >
                {{ this.operateOrderInfo }}
            </div>
            <div class="form-wrapper flex-all-center">
                <el-form
                    ref="form"
                    :inline="true"
                    :model="adjustForm"
                    label-position="top"
                    label-width="70px"
                    @submit.native.prevent
                >
                    <el-form-item label="流水号：" class="adjust-form-item">
                        <el-input
                            ref="orderNo"
                            :style="{ width: itemWidth }"
                            v-model.trim="adjustForm.orderNo"
                            placeholder="流水号"
                            @keyup.enter.native="getPrescription()"
                        />
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="center-container choosed-data-wrapper">
            <el-table
                ref="table"
                :data="choosedData"
                border
                fit
                style="width: 100%"
                :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
                stripe
            >
                <el-table-column
                    label="项目"
                    prop="labelName"
                    align="center"
                    min-width="100px"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    label="信息"
                    prop="labelValue"
                    align="center"
                    min-width="100px"
                    :show-overflow-tooltip="true"
                ></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    name: 'DecoctDrugRegistration',
    data() {
        return {
            itemWidth: '200px',
            adjustForm: {
                orderNo: ''
            },
            weigherName: '',
            packerName: '',
            operateOrderStatus: true,
            operateOrderInfo: '', //当前操作处方
            choosedData: [
                {
                    labelKey: 'doseNum',
                    labelName: '付数',
                    labelValue: ''
                },
                {
                    labelKey: 'smallPackingNumber',
                    labelName: '小包装数量',
                    labelValue: ''
                },
                {
                    labelKey: 'patientName',
                    labelName: '患者',
                    labelValue: ''
                },
                {
                    labelKey: 'notDecoctNum',
                    labelName: '另包不煎数量',
                    labelValue: ''
                }
            ]
        };
    },
    activated() {
        this.resetForm();
    },
    methods: {
        //获取处方信息
        getPrescription() {
            if (!this.adjustForm.orderNo) {
                this.$message({
                    message: '请录入流水号',
                    type: 'warning'
                });
                this.adjustForm.orderNo = '';
                return;
            }
            let params = {
                orderNo: this.adjustForm.orderNo
            };
            this.$api
                .prescription_prescriptionOrder_byOrderNo(params)
                .then((r) => {
                    let { data } = r.data;
                    if (data.orderStatus == 17) {
                        this.submit(data);
                    } else {
                        this.$message({
                            message: `此时的扫码处方状态必须为包装称重完成，当前处方状态为【${this.$options.filters[
                                'flOrderStatusName'
                            ](data.orderStatus)}】`,
                            type: 'error'
                        });
                        this.adjustForm.orderNo = '';
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.adjustForm.orderNo = '';
                });
        },
        //提交
        submit(row) {
            this.$api
                .prescription_decoctingStatus_decoctDrugRegistration(
                    this.adjustForm
                )
                .then((res) => {
                    this.operateOrderStatus = true;
                    this.operateOrderInfo = `处方${row.orderNo}煎药登记完成`;
                    this.$message({
                        message: `处方${row.orderNo}煎药登记完成`,
                        type: 'success'
                    });
                    this.choosedData.forEach((item) => {
                        item.labelValue = row[item.labelKey];
                    });
                    this.resetForm();
                })
                .catch((err) => {
                    console.log(err);
                    this.operateOrderInfo = `处方${row.orderNo}煎药登记失败`;
                    this.operateOrderStatus = false;
                });
        },
        //重置表单
        resetForm() {
            this.adjustForm.orderNo = '';
            this.$refs['orderNo'].focus();
        }
    }
};
</script>
<style lang="scss" scoped>
.adjust-form-container {
    padding: 10px 10px 10px;
    margin-bottom: 5px;
    background: #fff;
    border-radius: 5px;
    .success-tip {
        color: #67c23a;
    }
    .fail-tip {
        color: #f56c6c;
    }
    .adjust-form-item {
        margin-right: 0;
        /deep/ .el-form-item__label {
            padding: 0;
        }
        .adjust-name {
            margin-left: 5px;
            color: red;
            font-size: 18px;
            font-weight: bold;
        }
    }
}
.choosed-data-wrapper {
    padding: 10px 10px 20px 10px;
}
</style>
