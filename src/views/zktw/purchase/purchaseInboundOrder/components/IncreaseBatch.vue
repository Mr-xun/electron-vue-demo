<template>
    <el-dialog
        v-el-drag-dialog
        title="增加批次"
        :width="width"
        top="50px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="isVisible"
        class="increase-batch"
    >
        <div class="form-container">
            <el-form
                ref="form"
                :model="formData"
                :inline="true"
                :rules="rules"
                class="custom-form"
            >
                <el-form-item label="商品编码">
                    <span class="form-bold">{{ formData.itemCode }}</span>
                </el-form-item>
                <el-form-item label="商品名">
                    <span class="form-bold">{{ formData.itemName }}</span>
                </el-form-item>
                <el-form-item label="规格">
                    <span class="form-bold">{{ formData.specification }}</span>
                </el-form-item>
                <el-form-item label="单位">
                    <span class="form-bold">{{
                        formData.unit | flUnitName
                    }}</span>
                </el-form-item>
                <br />

                <el-form-item label="产品质量">
                    <el-input
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="formData.productQty"
                    ></el-input>
                </el-form-item>
                <el-form-item label="验收结论" prop="acceptanceConclusion">
                    <el-input
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="formData.acceptanceConclusion"
                    ></el-input>
                </el-form-item>
                <el-form-item label="仓库" prop="warehouseId">
                    <el-select
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="formData.warehouseId"
                        @change="changeWarehouse"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                    >
                        <el-option
                            v-for="item in wareHouseOptions"
                            :label="item.name"
                            :key="item.id"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" " label-width="10px">
                    <el-button
                        class="filter-item"
                        type="success"
                        size="mini"
                        plain
                        @click="addBatch"
                        >新增批号</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <el-table
            ref="table"
            :data="tableData"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            stripe
            border
            fit
            style="width: 100%"
        >
            <el-table-column
                align="center"
                prop="lotNo"
                label="批号"
                :show-overflow-tooltip="true"
                min-width="150px"
            >
                <template slot-scope="scope">
                    <el-input
                        style="width: 90%"
                        size="mini"
                        v-model="scope.row.lotNo"
                        :class="
                            !scope.row.lotNo ? 'acceptance-input__error' : ''
                        "
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="productionDate"
                label="生产日期"
                min-width="170px"
            >
                <template slot-scope="scope">
                    <el-date-picker
                        style="width: 95%"
                        size="mini"
                        :class="
                            !scope.row.productionDate
                                ? 'acceptance-input__error'
                                : ''
                        "
                        :picker-options="ltToDay"
                        v-model="scope.row.productionDate"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        type="date"
                        @change="changeProDate(scope.row)"
                        placeholder="选择日期"
                    ></el-date-picker>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="expireDate"
                label="有效期至"
                min-width="170px"
            >
                <template slot-scope="scope">
                    <el-date-picker
                        style="width: 95%"
                        size="mini"
                        :class="
                            !scope.row.expireDate
                                ? 'acceptance-input__error'
                                : ''
                        "
                        :picker-options="gtToDay"
                        v-model="scope.row.expireDate"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        type="date"
                        @change="changeExpireDate(scope.row)"
                        placeholder="选择日期"
                    ></el-date-picker>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="arrivalQty"
                label="到货数量"
                min-width="120px"
            >
                <template slot-scope="scope">
                    <el-tooltip
                        key="arrivalQty"
                        v-model="scope.row.arrivalTipShow"
                        :manual="true"
                        :content="`不可大于待入库数量：${scope.row.qty}`"
                        popper-class="cancelOrder-tool-tip"
                        placement="right"
                    >
                        <el-input
                            style="width: 85%"
                            :class="
                                scope.row.arrivalTipShow
                                    ? 'acceptance-input__error'
                                    : ''
                            "
                            size="mini"
                            min="0"
                            :max="scope.row.qty"
                            v-model.number="scope.row.arrivalQty"
                            @input="changeArrivaQty(scope.row)"
                        ></el-input>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="qualifiedQty"
                label="合格数量"
                min-width="120px"
            >
                <template slot-scope="scope">
                    <el-tooltip
                        key="qualifiedQty"
                        v-model="scope.row.qualifiedTipShow"
                        :manual="true"
                        :content="`不可大于到货数量：${scope.row.arrivalQty}`"
                        popper-class="cancelOrder-tool-tip"
                        placement="right"
                    >
                        <el-input
                            style="width: 85%"
                            :class="
                                scope.row.qualifiedTipShow
                                    ? 'acceptance-input__error'
                                    : ''
                            "
                            size="mini"
                            min="0"
                            :max="scope.row.arrivalQty"
                            v-model.number="scope.row.qualifiedQty"
                            @input="changeQualifiedQty(scope.row)"
                        ></el-input>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="sampleQty"
                label="抽样数量"
                min-width="100px"
            >
                <template slot-scope="scope">
                    <el-input
                        style="width: 85%"
                        size="mini"
                        v-number-only
                        v-model.number="scope.row.sampleQty"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column
                label="产地"
                :show-overflow-tooltip="true"
                align="center"
                min-width="120px"
                prop="placeOrigin"
            ></el-table-column>
            <el-table-column
                align="center"
                prop="rejectedQty"
                label="拒收数量"
                min-width="100px"
            >
                <template slot-scope="scope">
                    <el-input
                        style="width: 85%"
                        size="mini"
                        v-number-only
                        v-model.number="scope.row.rejectedQty"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="rejectedReason"
                label="拒收原因"
                min-width="100px"
            >
                <template slot-scope="scope">
                    <el-input
                        style="width: 85%"
                        size="mini"
                        v-model="scope.row.rejectedReason"
                    ></el-input>
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                align="center"
                min-width="80px"
                class-name="small-padding fixed-width"
                fixed="right"
            >
                <template slot-scope="{ row , $index}">
                    <i
                        class="el-icon-delete table-operation"
                        style="color: #f50"
                        @click="remove(row, $index)"
                    />
                </template>
            </el-table-column>
        </el-table>
        <p class="batch-tip">
            提示：单件商品多个批号时，批号、灭菌批次、产地等项中建议不要有 ;
            (分号)，以免造成数据错误！
        </p>
        <div slot="footer" class="dialog-footer">
            <el-button type="warning" plain @click="isVisible = false"
                >取消</el-button
            >
            <el-button type="primary" plain @click="saveBatch">保存</el-button>
        </div>
    </el-dialog>
</template>
<script>
import numberOnly from '@/directive/number-only';
import { parseTime } from '@/utils';

export default {
    name: 'IncreaseBatch',
    directives: {
        numberOnly
    },

    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Array,
            default: () => {
                return [];
            }
        },
        formData: {
            type: Object,
            default: () => {
                return {};
            }
        },
        rowData: {
            type: Object,
            default: () => {
                return {};
            }
        },
        ridIndex: {
            type: Number,
            default: 0
        }
    },

    data() {
        return {
            ltToDay: {
                //小于当前日期
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            gtToDay: {
                //大于当前日期
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            },
            itemWidth: '160px',

            screenWidth: 0,
            width: this.initWidth(),
            rules: {
                warehouseId: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                acceptanceConclusion: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'blur'
                    }
                ]
            },
            wareHouseOptions: []
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
    created() {
        this.getAllwareHouse();
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.width = this.initWidth();
            })();
        };
    },
    methods: {
        //更改生产日期
        changeProDate(row) {
            if (row.productionDate) {
                this.$api
                    .basic_baseDrugInf_getOneDrugInfo(row.itemCode)
                    .then((res) => {
                        let { data } = res;
                        if (data.effectivityDuration) {
                            let addProDate = new Date(row.productionDate);
                            addProDate.setMonth(
                                addProDate.getMonth() +
                                    Number(data.effectivityDuration)
                            );
                            addProDate.setDate(addProDate.getDate() - 1);
                            if (!row.expireDate) {
                                this.$set(row, 'expireDate',parseTime(addProDate, '{y}-{m}-{d}')  );
                            }
                        }
                    });
            }
        },
        //更改有效期
        changeExpireDate(row) {
            if (row.expireDate) {
                this.$api
                    .basic_baseDrugInf_getOneDrugInfo(row.itemCode)
                    .then((res) => {
                        let { data } = res;
                        if (data.effectivityDuration) {
                            let minExpireDate = new Date(row.expireDate);
                            minExpireDate.setMonth(
                                minExpireDate.getMonth() -
                                    Number(data.effectivityDuration)
                            );
                            minExpireDate.setDate(minExpireDate.getDate() + 1);
                            if (!row.productionDate) {
                                this.$set(row, 'productionDate',parseTime(minExpireDate, '{y}-{m}-{d}') );
                            }
                        }
                    });
            }
        },

        changeArrivaQty(row) {
            //修改到货数量
            if (row.arrivalQty > row.qty) {
                row.arrivalTipShow = true;
            } else {
                row.arrivalTipShow = false;
                row.qualifiedQty = row.arrivalQty;
                this.changeQualifiedQty(row);
                this.calculateRejectedQty(row);
                this.calculateAmount(row);
            }
        },
        changeQualifiedQty(row) {
            //修改合格数量
            if (row.qualifiedQty > row.arrivalQty) {
                row.qualifiedTipShow = true;
            } else {
                row.qualifiedTipShow = false;
                this.calculateRejectedQty(row);
                this.calculateAmount(row);
            }
        },
        calculateRejectedQty(row) {
            //计算拒收数量
            row.rejectedQty = row.arrivalQty - row.qualifiedQty;
        },
        calculateAmount(row) {
            //计算金额
            row.amount = row.actualPurchasePrice * row.qualifiedQty;
        },
        changeWarehouse(val, row) {
            this.formData.warehouseName = '';
            this.wareHouseOptions.forEach((item) => {
                if (item.id == val) {
                    this.formData.warehouseName = item.name;
                }
            });
        },
        getAllwareHouse() {
            let params = {
                isRetail: 2
            };
            this.$api.basic_baseWarehouse_all(params).then((res) => {
                let { result } = res.data;
                this.wareHouseOptions = result;
            });
        },
        addBatch() {
            let len = this.tableData.length - 1;
            if (
                !this.tableData[len].arrivalQty ||
                !this.tableData[len].qualifiedQty ||
                !this.tableData[len].lotNo ||
                !this.tableData[len].productionDate ||
                !this.tableData[len].expireDate
            ) {
                this.$message({
                    message: `第${
                        len + 1
                    }条数据批号、到货数量、合格数量、生产日期、有效期至为必填项！`,
                    type: 'error'
                });
                return;
            }
            if (
                this.tableData[len].rejectedQty &&
                !this.tableData[len].rejectedReason
            ) {
                this.$message({
                    message: `第${
                        len + 1
                    }条数据存在拒收数量，必须填写拒收原因！`,
                    type: 'error'
                });
                return;
            }
            if (
                this.tableData[len].qualifiedQty >
                this.tableData[len].arrivalQty
            ) {
                this.$message({
                    message: `第${len + 1}条数据合格数量不可大于到货数量！`,
                    type: 'error'
                });
                return;
            }
            if (this.tableData[len].arrivalQty > this.tableData[len].qty) {
                this.$message({
                    message: `第${len + 1}条数据到货数量不可大于待入库数量！`,
                    type: 'error'
                });
                return;
            }
            let residueQty = 0;
            let useQty = 0;
            this.tableData.forEach(item=>{
                useQty+= item.arrivalQty;
            });
            residueQty = this.rowData.qty -useQty;
            this.tableData.push(JSON.parse(JSON.stringify(this.tableData[0])));
            this.$set(
                this.tableData[this.tableData.length - 1],
                'arrivalTipShow',
                false
            ); //到货提示
            this.$set(
                this.tableData[this.tableData.length - 1],
                'qualifiedTipShow',
                false
            ); //到货提示
            this.$set(
                this.tableData[this.tableData.length - 1],
                'lotNoTipShow',
                false
            ); //批号提示
            this.$set(
                this.tableData[this.tableData.length - 1],
                'arrivalQty',
                residueQty
            ); //到货数
            this.$set(
                this.tableData[this.tableData.length - 1],
                'qualifiedQty',
                residueQty
            ); //合格数
            this.$set(
                this.tableData[this.tableData.length - 1],
                'rejectedQty',
                0
            ); //拒收数
            this.$set(
                this.tableData[this.tableData.length - 1],
                'productionDate',
                ''
            ); //生产日期
            this.$set(
                this.tableData[this.tableData.length - 1],
                'expireDate',
                ''
            ); //有效期
            this.$set(this.tableData[this.tableData.length - 1], 'lotNo', ''); //批号
            this.$set(
                this.tableData[this.tableData.length - 1],
                'sampleQty',
                1
            ); //抽样数

            this.$set(
                this.tableData[this.tableData.length - 1],
                'rejectedReason',
                ''
            ); //拒收原因
        },
        saveBatch() {
            let bacthNoFlag = true;
            let arrivalTotalQty = 0;
            for (let i = 0; i < this.tableData.length; i++) {
                arrivalTotalQty += this.tableData[i].arrivalQty;
                if (
                    !this.formData.warehouseId ||
                    !this.tableData[i].arrivalQty ||
                    !this.tableData[i].qualifiedQty ||
                    !this.tableData[i].lotNo ||
                    !this.tableData[i].productionDate ||
                    !this.tableData[i].expireDate
                ) {
                    bacthNoFlag = false;
                    this.$message({
                        message:
                            '所有数据批号、到货数量、合格数量、生产日期、有效期、仓库为必填项！',
                        type: 'error'
                    });
                    return;
                }
                if (
                    this.tableData[i].rejectedQty &&
                    !this.tableData[i].rejectedReason
                ) {
                    this.$message({
                        message: '有数据存在拒收数量，必须填写拒收原因！',
                        type: 'error'
                    });
                    return;
                }
            }
            if (arrivalTotalQty > this.formData.qty) {
                bacthNoFlag = false;
                this.$message({
                    message: `合计到货数量总和不能大于大于待入库数量${this.formData.qty}！`,
                    type: 'error'
                });
                return;
            }

            if (bacthNoFlag) {
                this.tableData.forEach((item) => {
                    item.productQty = this.formData.productQty;
                    item.warehouseName = this.formData.warehouseName;
                    item.warehouseId = this.formData.warehouseId;
                    item.acceptanceConclusion = this.formData.acceptanceConclusion;
                });
                this.$emit('success', this.tableData, this.ridIndex);
            }
        },
        remove(row,index) {
            this.tableData.splice(index, 1);
        },
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
        }
    }
};
</script>
<style lang="scss" scoped>
.increase-batch {
    >>> .el-dialog__body {
        padding: 20px 20px 0;
    }
    .custom-form {
        display: inline-block;
    }
    .form-bold {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
    }
}
</style>
