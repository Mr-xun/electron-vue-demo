<template>
    <div class="cancle-detail-container">
        <el-table
            ref="table"
            :key="tableKey"
            v-loading="loading"
            :data="detail"
            border
            fit
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            stripe
            :max-height="tableHeight"
            style="width: 100%"
        >
            <el-table-column
                label="序号"
                type="index"
                width="50"
                align="center"
            ></el-table-column>
            <el-table-column
                label="商品编码"
                prop="itemCode"
                :show-overflow-tooltip="true"
                min-width="100px"
                align="center"
            ></el-table-column>
            <el-table-column
                label="商品名称"
                :show-overflow-tooltip="true"
                align="center"
                min-width="120px"
                prop="itemName"
            ></el-table-column>
            <el-table-column
                align="center"
                prop="itemShortCode"
                label="速记码"
                :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
                label="单位"
                :show-overflow-tooltip="true"
                align="center"
                prop="unit"
            >
                <template slot-scope="{ row }">
                    <span>{{ row.unit }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="规格"
                :show-overflow-tooltip="true"
                align="center"
                prop="specification"
            ></el-table-column>
            <el-table-column
                label="生产企业"
                :show-overflow-tooltip="true"
                align="center"
                min-width="120px"
                prop="productionEnterpriseName"
            ></el-table-column>
            <el-table-column
                label="待入库数量"
                :show-overflow-tooltip="true"
                min-width="100px"
                align="center"
                prop="qty"
            ></el-table-column>
            <el-table-column
                label="取消数量"
                :show-overflow-tooltip="true"
                align="center"
                prop="cancelQty"
            >
                <template slot-scope="scope">
                    <el-tooltip
                        v-model="scope.row.tipShow"
                        :manual="true"
                        content="不可大于待入库数量"
                        popper-class="cancelOrder-tool-tip"
                        placement="right"
                    >
                        <el-input
                            style="width: 85%"
                            :class="scope.row.tipShow ? 'qty-error' : ''"
                            size="mini"
                            min="0"
                            :max="scope.row.qty"
                            v-has-permission="['purchaseOrder:cancle']"
                            v-number-only
                            v-model.number="scope.row.cancelQty"
                            @input="changeCancelQty(scope.row)"
                        ></el-input>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import numberOnly from '@/directive/number-only';

export default {
    name: 'CancleDetail',
    props: {
        detail: {
            type: Array,
            default() {
                return [];
            }
        },
        tableHeight: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    directives: {
        numberOnly
    },
    data() {
        return {
            tableKey: 0,
            visible: true
        };
    },
    computed: {
        ...mapGetters('basic', ['orgArchives'])
    },
    methods: {
        changeCancelQty(row) {
            if (row.cancelQty > row.qty) {
                row.tipShow = true;
            } else {
                row.tipShow = false;
            }
        }
    }
};
</script>
<style lang="scss" >
.cancelOrder-tool-tip {
    font-size: 11px;
}
.qty-error {
    .el-input__inner {
        border-color: #ff4949;
    }
}
</style>