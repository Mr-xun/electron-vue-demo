<template>
    <div class="acceptaance-container">
        <div class="form-container">
            <el-form
                ref="form"
                :model="orderForm"
                :inline="true"
                :rules="rules"
                class="custom-form"
            >
                <el-form-item label="供应商：" prop="supplierId">
                    <el-select
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.supplierId"
                        @change="changeSupplier"
                        disabled
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                    >
                        <el-option
                            v-for="item in supplierOptions"
                            :label="item.name"
                            :key="item.id"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="供应商编码：" prop="supplierCode">
                    <el-input
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.supplierCode"
                        readonly
                    ></el-input>
                </el-form-item>
                <el-form-item label="仓库：" prop="warehouseId">
                    <el-select
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.warehouseId"
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
                <el-form-item label="入库人员：">
                    <el-input
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="userInfo.fullname"
                        readonly
                    ></el-input>
                </el-form-item>
                <el-form-item label="入库日期：" prop="orderDate">
                    <el-date-picker
                        type="date"
                        size="mini"
                        :style="{ width: itemWidth }"
                        placeholder="选择时间"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="orderForm.orderDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="审核人员：" prop="reviewerCode">
                    <el-select
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.reviewerCode"
                        @change="changeReviewer"
                        clearable
                        filterable
                    >
                        <el-option
                            v-for="item in userOptions"
                            :label="item.fullname"
                            :key="item.userId"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="随货同行票号：">
                    <el-input
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.accompanyingOrderNo"
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input
                        size="mini"
                        :style="{ width: itemWidth }"
                        v-model="orderForm.remark"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-divider>待入库列表</el-divider>
        <div class="pending-wrapper">
            <div class="operate-row">
                <div class="opt-btn">
                    <el-button
                        type="success"
                        icon="el-icon-check"
                        size="mini"
                        plain
                        :loading="submitLoading"
                        @click="submitOrder"
                        v-has-permission="['purchaseInboundOrder:add']"
                        >验收提交</el-button
                    >
                    <span class="operate-tips">双击商品行，可以新增批次</span>
                </div>
            </div>
            <div class="goods-table" id="form">
                <ux-grid
                    border
                    show-overflow
                    ref="plxTable"
                    keep-source
                    :data="pendingList"
                    :highlightCurrentRow="false"
                    :edit-config="{ trigger: 'click', mode: 'cell' }"
                    v-loading="pendingLoading"
                    :header-cell-style="{
                        background: '#eef1f6',
                        color: '#606266',
                    }"
                    :row-class-name="tableRowClassName"
                    stripe
                    :max-height="tableHeight / 2"
                    @row-dblclick="openBatchBox"
                    style="width: 100%"
                >
                    <ux-table-column
                        type="index"
                        width="50"
                        align="center"
                        title="序号"
                        fixed="left"
                    ></ux-table-column>
                    <ux-table-column
                        field="itemCode"
                        title="商品编码"
                        fixed="left"
                        align="center"
                        min-width="120"
                    ></ux-table-column>
                    <ux-table-column
                        field="itemName"
                        title="商品名称"
                        fixed="left"
                        align="center"
                        min-width="120"
                    ></ux-table-column>
                    <ux-table-column
                        field="itemShortCode"
                        title="速记码"
                        align="center"
                        min-width="80"
                    ></ux-table-column>
                    <ux-table-column
                        field="specification"
                        title="规格"
                        min-width="80"
                        align="center"
                    ></ux-table-column>
                    <ux-table-column
                        field="unit"
                        title="单位"
                        align="center"
                        min-width="60"
                    ></ux-table-column>
                    <ux-table-column
                        field="placeOrigin"
                        title="产地"
                        align="center"
                        min-width="80"
                    ></ux-table-column>
                    <ux-table-column
                        field="purchasePrice"
                        title="单价"
                        align="center"
                        min-width="100"
                    ></ux-table-column>
                    <ux-table-column
                        field="actualPurchasePrice"
                        title="实际采购价"
                        min-width="100"
                        align="center"
                    >
                        <template v-slot="scope">
                            <!--autofocus绑定的类名就是这个组件的class类名。帮助获取输入框焦点-->
                            <el-input
                                style="width: 85%"
                                size="mini"
                                v-model="scope.row.actualPurchasePrice"
                                v-number-only
                                @change="changeSumPrice(scope.row)"
                            ></el-input>
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        field="retailPrice"
                        title="零售价"
                        min-width="100"
                        align="center"
                    >
                        <template v-slot="scope">
                            <!--autofocus绑定的类名就是这个组件的class类名。帮助获取输入框焦点-->
                            <el-input
                                style="width: 85%"
                                size="mini"
                                v-model="scope.row.retailPrice"
                                v-number-only
                                @change="changeSumPrice(scope.row)"
                            ></el-input>
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        field="qty"
                        title="待入库数量"
                        align="center"
                        min-width="100"
                    ></ux-table-column>
                    <ux-table-column
                        field="arrivalQty"
                        title="到货数量"
                        min-width="120"
                        align="center"
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
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="qualifiedQty"
                        title="合格入库数量"
                        min-width="110px"
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
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="retailAmount"
                        title="零售金额"
                        min-width="100px"
                    >
                        <template slot-scope="{ row }">
                            {{ row.retailAmount | formatMoney }}
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="amount"
                        title="入库金额"
                        min-width="100px"
                    >
                        <template slot-scope="{ row }">
                            {{ row.amount | formatMoney }}
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="lotNo"
                        title="批号"
                        min-width="150px"
                    >
                        <template slot-scope="scope">
                            <el-input
                                style="width: 90%"
                                :class="
                                    !scope.row.lotNo
                                        ? 'acceptance-input__error'
                                        : ''
                                "
                                size="mini"
                                v-model="scope.row.lotNo"
                            ></el-input>
                        </template>
                    </ux-table-column>

                    <ux-table-column
                        align="center"
                        field="productionDate"
                        title="生产日期"
                        min-width="170px"
                    >
                        <template slot-scope="scope">
                            <el-date-picker
                                style="width: 95%"
                                size="mini"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                :class="
                                    !scope.row.productionDate
                                        ? 'acceptance-input__error'
                                        : ''
                                "
                                :picker-options="ltToDay"
                                v-model="scope.row.productionDate"
                                @change="changeProDate(scope.row)"
                                type="date"
                                placeholder="选择日期"
                            ></el-date-picker>
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="expireDate"
                        title="有效期至"
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
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="productionEnterpriseName"
                        title="生产企业"
                        min-width="160px"
                    ></ux-table-column>
                    <ux-table-column
                        align="center"
                        field="productQty"
                        title="产品质量"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.productQty || "外包装无破损"
                            }}</span>
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="warehouseId"
                        title="仓库名称"
                        min-width="150px"
                    >
                        <template slot-scope="scope">
                            <el-select
                                size="mini"
                                style="width: 85%"
                                :class="
                                    !scope.row.warehouseId
                                        ? 'acceptance-input__error'
                                        : ''
                                "
                                v-model="scope.row.warehouseId"
                                @change="
                                    changeTableWarehouse($event, scope.row)
                                "
                                clearable
                                filterable
                            >
                                <el-option
                                    v-for="item in wareHouseOptions"
                                    :label="item.name"
                                    :key="item.id"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="rejectedQty"
                        title="拒收数量"
                        min-width="100px"
                    >
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.rejectedQty
                                    ? scope.row.rejectedQty
                                    : 0
                            }}</span>
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="sampleQty"
                        title="抽样数量"
                        min-width="100px"
                    >
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.sampleQty ? scope.row.sampleQty : 1
                            }}</span>
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="rejectedReason"
                        title="拒收原因"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <el-input
                                :class="
                                    !scope.row.rejectedReason
                                        ? 'acceptance-input__error'
                                        : ''
                                "
                                style="width: 100%"
                                size="mini"
                                v-model="scope.row.rejectedReason"
                            ></el-input>
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="acceptanceConclusion"
                        title="验收结论"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.acceptanceConclusion ||
                                "同意上架/入库"
                            }}</span>
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        align="center"
                        field="detailRemark"
                        title="备注"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <el-input
                                style="width: 85%"
                                size="mini"
                                v-model="scope.row.detailRemark"
                            ></el-input>
                        </template>
                    </ux-table-column>
                    <ux-table-column
                        title="操作"
                        align="center"
                        min-width="120px"
                        fixed="right"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="{ row, $index }">
                            <el-button
                                type="text"
                                @click="checkAccept(row, $index)"
                                >验收</el-button
                            >
                        </template>
                    </ux-table-column>
                </ux-grid>
            </div>
        </div>
        <el-divider>已处理列表</el-divider>
        <div class="processed-wrapper">
            <div class="pirce-info">
                <span
                    >入库总金额(元)：{{
                        actualPurchasePriceTotal | formatMoney
                    }}</span
                >
                <span
                    >零售价总计(元)：{{ retailPriceTotal | formatMoney }}</span
                >
                <span>到货数量总计：{{ arrivalAllQty }}</span>
                <span>合格数量总计：{{ qualifiedAllQty }}</span>
            </div>
            <div class="goods-table" id="form">
                <el-table
                    :data="processedList"
                    :header-cell-style="{
                        background: '#eef1f6',
                        color: '#606266',
                    }"
                    stripe
                    border
                    :max-height="tableHeight / 2"
                    show-summary
                    :summary-method="getPendingSummaries"
                    style="width: 100%"
                >
                    <el-table-column
                        type="index"
                        width="50"
                        align="center"
                        label="序号"
                        fixed
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="itemCode"
                        min-width="100px"
                        fixed
                        label="商品编码"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="itemName"
                        label="商品名称"
                        fixed
                        min-width="120px"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="itemShortCode"
                        label="速记码"
                    ></el-table-column>

                    <el-table-column
                        align="center"
                        prop="specification"
                        label="规格"
                    ></el-table-column>
                    <el-table-column align="center" prop="name" label="单位">
                        <template slot-scope="{ row }">
                            <span>{{ row.unit }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="placeOrigin"
                        min-width="80px"
                        label="产地"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="purchasePrice"
                        label="单价"
                        min-width="120px"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="actualPurchasePrice"
                        label="实际采购价"
                        min-width="100px"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.actualPurchasePrice || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="retailPrice"
                        label="零售价"
                        min-width="100px"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.retailPrice || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="qty"
                        label="待入库数量"
                        min-width="100px"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="arrivalQty"
                        label="到货数量"
                        min-width="100px"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.arrivalQty || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="qualifiedQty"
                        label="合格入库数量"
                        min-width="110px"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.qualifiedQty || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="retailAmount"
                        label="零售金额"
                        min-width="100px"
                    >
                        <template slot-scope="{ row }">
                            {{ row.retailAmount | formatMoney }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="amount"
                        label="入库金额"
                        min-width="100px"
                    >
                        <template slot-scope="{ row }">
                            {{ row.amount | formatMoney }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="lotNo"
                        label="批号"
                        min-width="150px"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.lotNo || "--" }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        align="center"
                        prop="productionDate"
                        label="生产日期"
                        min-width="120px"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.productionDate || "--" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="expireDate"
                        label="有效期至"
                        min-width="120px"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.expireDate || "--" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="productionEnterpriseName"
                        label="生产企业"
                        min-width="160px"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="productQty"
                        label="产品质量"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.productQty || "外包装无破损"
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="warehouseId"
                        label="仓库名称"
                        min-width="150px"
                    >
                        <template slot-scope="{ row }">
                            <span>{{ row.warehouseName || "--" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="rejectedQty"
                        label="拒收数量"
                        min-width="100px"
                    >
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.rejectedQty
                                    ? scope.row.rejectedQty
                                    : 0
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="sampleQty"
                        label="抽样数量"
                        min-width="100px"
                    >
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.sampleQty ? scope.row.sampleQty : 1
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="rejectedReason"
                        label="拒收原因"
                        min-width="100px"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.rejectedReason || "" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="acceptanceConclusion"
                        label="验收结论"
                        min-width="120px"
                    >
                        <template slot-scope="scope">
                            <span>{{
                                scope.row.acceptanceConclusion ||
                                "同意上架/入库"
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="detailRemark"
                        label="备注"
                        min-width="120px"
                    ></el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="120px"
                        fixed="right"
                        class-name="small-padding fixed-width"
                    >
                        <template slot-scope="{ row, $index }">
                            <el-button
                                type="text"
                                @click="removeProcessed(row, $index)"
                                >移除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <increase-batch
            ref="increaseBatch"
            :dialog-visible="dialog.isVisible"
            :tableData="batchProduct.tableData"
            :formData="batchProduct.formData"
            :ridIndex="batchProduct.ridIndex"
            :rowData="batchProduct.rowData"
            @close="batchClose"
            @inBatch="increaseBatch"
            @success="bacthSuccess"
        />
    </div>
</template>
<script>
import { parseTime } from '@/utils';
import IncreaseBatch from './components/IncreaseBatch';
import { mapState, mapGetters } from 'vuex';
import numberOnly from '@/directive/number-only';
import focus from '@/directive/focus';
import enterJump from '@/directive/enter-jump';
export default {
    components: { IncreaseBatch },
    directives: {
        numberOnly,
        focus,
        enterJump
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
            activeName: 'list',
            itemWidth: '160px',
            orderForm: {},
            orderList: [],
            submitLoading: false,
            pendingLoading: false,
            pendingList: [], //待处理
            arrivalAllQty: 0, //到货数量总计
            qualifiedAllQty: 0, //合格数量总计
            actualPurchasePriceTotal: 0, //采购总金额
            retailPriceTotal: 0, //零售总金额
            processedList: [], //已处理
            batchProduct: {
                tableData: [],
                formData: {},
                rowData: {},
                ridIndex: 0 //行位置
            },
            rules: {
                supplierCode: [
                    { required: true, message: ' ', trigger: 'blur' }
                ],
                supplierId: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                warehouseId: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                reviewerCode: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ],
                orderDate: [
                    {
                        required: true,
                        message: ' ',
                        trigger: 'change'
                    }
                ]
            },
            dialog: {
                isVisible: false,
                title: ''
            },
            supplierOptions: [],
            wareHouseOptions: [],
            userOptions: [],
            currentRowIndex: null
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapState({
            userInfo: (state) => state.account.user
        }),
        ...mapGetters('basic', ['orgArchives'])
    },
    watch: {
        processedList: {
            handler: function (data) {
                this.arrivalAllQty = 0;
                this.qualifiedAllQty = 0;
                this.retailPriceTotal = 0;
                this.actualPurchasePriceTotal = 0;
                if (data.length) {
                    data.forEach((item) => {
                        this.arrivalAllQty += Number(item.arrivalQty);
                        this.qualifiedAllQty += Number(item.qualifiedQty);
                        this.retailPriceTotal +=
                            item.qualifiedQty * item.retailPrice;
                        this.actualPurchasePriceTotal +=
                            item.qualifiedQty * item.actualPurchasePrice;
                    });
                }
            },
            deep: true,
            immediate: false
        }
    },
    created() {
        this.getAllSupplier();
        this.getAllwareHouse();
        this.getAllUser();
        this.$bus.$on('acceptance', (data) => {
            this.initCheckData(data);
        });
    },
    methods: {
        initCheckData(data) {
            //初始化验收数据
            this.orderForm = data;
            this.$set(this.orderForm, 'reviewerCode', data.reviewerCode || '');
            this.$set(this.orderForm, 'reviewer', data.reviewer || '');
            this.orderForm.orderDate = new Date();
            this.getPendingList(data);
        },
        getPendingList(row) {
            let params = {
                purchaseOrderCode: row.purchaseOrderCode
            };
            this.pendingLoading = true;
            this.$api
                .order_purchasePending_detailList(params)
                .then((res) => {
                    this.pendingLoading = false;
                    let data = res.data.result;
                    data.forEach((item) => {
                        this.$set(item, 'arrivalTipShow', false); //到货提示
                        this.$set(item, 'qualifiedTipShow', false); //到货提示
                        this.$set(item, 'lotNoTipShow', false); //批号提示
                        this.$set(item, 'arrivalQty', item.qty); //到货数
                        this.$set(item, 'qualifiedQty', item.qty); //合格数
                        this.$set(item, 'rejectedQty', 0); //拒收数
                        this.$set(item, 'productionDate', ''); //生产日期
                        this.$set(item, 'expireDate', ''); //有效期
                        this.$set(item, 'lotNo', ''); //批号
                        this.$set(item, 'sampleQty', 1); //抽样数
                        this.$set(
                            item,
                            'warehouseId',
                            this.orderForm.warehouseId || ''
                        ); //仓库id
                        this.$set(
                            item,
                            'warehouseName',
                            this.orderForm.warehouseName || ''
                        ); //仓库
                        this.$set(item, 'purchasePrice', item.price); //实际价格
                        this.$set(item, 'actualPurchasePrice', item.price); //实际价格

                        this.$set(
                            item,
                            'acceptanceConclusion',
                            '同意上架/入库'
                        ); //结论
                        this.$set(item, 'productQty', '外包装无破损'); //产品质量
                        this.$set(item, 'rejectedReason', ''); //拒收原因
                    });
                    this.pendingList = JSON.parse(JSON.stringify(data));
                })
                .catch((err) => {
                    console.log(err);
                    this.pendingLoading = false;
                    this.pendingList = [];
                });
        },
        changeArrivaQty(row) {
            //修改到货数量
            if (row.arrivalQty > row.qty) {
                row.arrivalTipShow = true;
            } else {
                row.arrivalTipShow = false;
                row.qualifiedQty = row.arrivalQty;
                this.calculateRejectedQty(row);
                this.changeSumPrice(row);
            }
        },
        //修改合格数量
        changeQualifiedQty(row) {
            if (row.qualifiedQty > row.arrivalQty) {
                row.qualifiedTipShow = true;
            } else {
                row.qualifiedTipShow = false;
                this.calculateRejectedQty(row);
                this.changeSumPrice(row);
            }
        },
        //计算拒收数量
        calculateRejectedQty(row) {
            row.rejectedQty = row.arrivalQty - row.qualifiedQty;
        },
        //计算金额
        changeSumPrice(item) {
            this.$set(
                item,
                'amount',
                item.qualifiedQty * item.actualPurchasePrice
            );
            this.$set(
                item,
                'retailAmount',
                item.qualifiedQty * item.retailPrice
            );
        },
        //验收
        checkAccept(row, index) {
            let pushFlag = true;
            if (
                !row.arrivalQty ||
                !row.qualifiedQty ||
                !row.lotNo ||
                !row.productionDate ||
                !row.expireDate ||
                !row.warehouseId
            ) {
                this.$message({
                    message:
                        '批号、到货数量、合格数量、生产日期、有效期至、仓库为必填项！',
                    type: 'error'
                });
                return;
            }
            if (row.rejectedQty && !row.rejectedReason) {
                this.$message({
                    message: '存在拒收数量，必须填写拒收原因！',
                    type: 'error'
                });
                return;
            }
            if (row.qualifiedQty > row.arrivalQty) {
                this.$message({
                    message: '合格数量不可大于到货数量！',
                    type: 'error'
                });
                return;
            }
            if (row.arrivalQty > row.qty) {
                this.$message({
                    message: '到货数量不可大于待入库数量！',
                    type: 'error'
                });
                return;
            }
            if (row.arrivalQty < row.qty) {
                row.qty = row.qty - row.arrivalQty;
            } else {
                this.pendingList.splice(index, 1); //待处理中移除该商品
            }
            this.processedList.forEach((item) => {
                if (item.itemCode == row.itemCode && item.lotNo == row.lotNo) {
                    item.qty = row.qty;
                    item.arrivalQty += row.arrivalQty;
                    item.rejectedQty += row.rejectedQty;
                    item.qualifiedQty += row.qualifiedQty;
                    pushFlag = false;
                    this.changeSumPrice(item);
                }
            });
            if (pushFlag) {
                this.processedList.push(JSON.parse(JSON.stringify(row)));
            }
            this.resetRow(row);
        },
        //重置行内数据
        resetRow(row, type = 'check') {
            row.lotNo = '';
            row.productionDate = '';
            row.expireDate = '';
            row.rejectedReason = '';
            row.detailRemark = '';
            row.acceptanceConclusion = '';
            row.sampleQty = 1;
            row.qty = type == 'remove' ? row.arrivalQty : row.qty;
            row.arrivalQty = type == 'remove' ? row.arrivalQty : row.qty;
            row.qualifiedQty = row.arrivalQty;
            row.rejectedQty = 0;
            row.amount = 0;
            row.retailAmount = 0;
            this.calculateRejectedQty(row);
            this.changeSumPrice(row);
        },
        //移出待处理列表
        removeProcessed(row, index) {
            let unshiftFlag = true;
            this.pendingList.forEach((item) => {
                if (item.itemCode == row.itemCode) {
                    item.qty += row.arrivalQty;
                    unshiftFlag = false;
                    this.$set(item, 'arrivalQty', item.qty);
                    this.$set(item, 'qualifiedQty', item.arrivalQty);
                    this.changeSumPrice(item);
                }
            });
            if (unshiftFlag) {
                this.resetRow(row, 'remove');
                this.pendingList.unshift(JSON.parse(JSON.stringify(row)));
            }
            this.processedList.splice(index, 1);
        },
        //更改审核人员
        changeReviewer(val) {
            this.orderForm.reviewer = '';
            this.userOptions.forEach((v) => {
                if (v.code == val) {
                    this.orderForm.reviewer = v.fullname;
                }
            });
        },
        //更改仓库
        changeWarehouse(val) {
            this.orderForm.warehouseName = '';
            this.wareHouseOptions.forEach((v) => {
                if (v.id == val) {
                    this.orderForm.warehouseName = v.name;
                }
            });
            this.pendingList.forEach((h) => {
                if (!h.warehouseId) {
                    h.warehouseId = this.orderForm.warehouseId;
                    h.warehouseName = this.orderForm.warehouseName;
                }
            });
        },
        //更改明细仓库
        changeTableWarehouse(val, row) {
            let warehouseName = '';
            this.wareHouseOptions.forEach((item) => {
                if (item.id == val) {
                    warehouseName = item.name;
                }
            });
            this.$set(row, 'warehouseName', warehouseName);
        }, //更改生产日期
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
                                this.$set(
                                    row,
                                    'expireDate',
                                    parseTime(addProDate, '{y}-{m}-{d}')
                                );
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
                                this.$set(
                                    row,
                                    'productionDate',
                                    parseTime(minExpireDate, '{y}-{m}-{d}')
                                );
                            }
                        }
                    });
            }
        },
        //更改供应商
        changeSupplier(val) {
            this.supplierOptions.forEach((v) => {
                if (v.id == val) {
                    this.orderForm.supplierCode = v.code;
                }
            });
        },
        //把每一行的索引放进row
        tableRowClassName({ row, rowIndex }) {
            row.ridIndex = rowIndex;
        },
        //单击某一行
        clickRow(row, column, event) {
            this.currentRowIndex = row.ridIndex;
        },
        //添加批次框
        openBatchBox(row, column, event) {
            this.batchProduct.formData = {
                itemName: row.itemName,
                itemCode: row.itemCode,
                specification: row.specification,
                unit: row.unit,
                productQty: row.productQty,
                acceptanceConclusion: row.acceptanceConclusion,
                warehouseId: row.warehouseId,
                warehouseName: row.warehouseName,
                placeOrigin: row.placeOrigin,
                qty: row.qty
            };
            this.batchProduct.rowData = JSON.parse(JSON.stringify(row));
            this.batchProduct.tableData = JSON.parse(JSON.stringify([row]));
            this.batchProduct.ridIndex = row.ridIndex;
            this.dialog.isVisible = true;
        },
        batchClose() {
            this.dialog.isVisible = false;
        },
        //确认批次
        bacthSuccess(data, ridIndex) {
            data.forEach((v) => {
                let flag = true;
                this.pendingList[ridIndex].qty =
                    this.pendingList[ridIndex].qty - v.arrivalQty;
                if (this.pendingList[ridIndex].qty <= 0) {
                    this.pendingList.splice(ridIndex, 1);
                } else {
                    this.resetRow(this.pendingList[ridIndex]);
                }
                this.processedList.forEach((h) => {
                    if (
                        h.itemCode == v.itemCode &&
                        h.lotNo == v.lotNo &&
                        h.productionEnterpriseId == v.productionEnterpriseId
                    ) {
                        h.arrivalQty += v.arrivalQty;
                        h.qualifiedQty += v.qualifiedQty;
                        h.rejectedQty += v.rejectedQty;
                        h.sampleQty += v.sampleQty;
                        flag = false;
                    }
                });

                this.calculateRejectedQty(v);
                this.changeSumPrice(v);
                if (flag) {
                    this.processedList.push(JSON.parse(JSON.stringify(v)));
                }
            });
            this.dialog.isVisible = false;
        },
        increaseBatch(data) {},
        //判断是否录入数据
        objectValueAllEmpty(object = this.orderForm) {
            var isEmpty = true;
            Object.keys(object).forEach(function (x) {
                if (x != 'orderCode' && x != 'orderDate') {
                    if (object[x] != null && object[x] != '') {
                        isEmpty = false;
                    }
                }
            });
            if (this.processedList.length || this.pendingList.length) {
                return false;
            }
            if (isEmpty) {
                return true;
            }
            return false;
        },
        getAllSupplier() {
            this.$api.basic_baseSupplier_all().then((res) => {
                let { result } = res.data;
                this.supplierOptions = result;
            });
        },
        getAllwareHouse() {
            let params = {
                isRetail: 2
            };
            this.$api
                .basic_baseWarehouse_all(params)
                .then((res) => {
                    let { result } = res.data;
                    this.wareHouseOptions = result;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getAllUser() {
            this.$api
                .system_user_all()
                .then((r) => {
                    const { data } = r.data;
                    this.userOptions = data.filter(
                        (item) => item.isLogisticsPersonnel != 1
                    );
                })
                .catch((err) => {
                    this.userOptions = [];
                });
        },
        resetForm() {
            this.orderForm = {};
            this.$set(this.orderForm, 'reviewerCode', '');
            this.$set(this.orderForm, 'reviewer', '');
            this.orderForm.orderDate = new Date();
            this.$refs.form.clearValidate();
            this.$refs.form.resetFields();
            this.pendingList = [];
            this.processedList = [];
        },
        //提交
        submitOrder() {
            let params = {};
            params.accompanyingOrderNo = this.orderForm.accompanyingOrderNo;
            params.reviewerCode = this.orderForm.reviewerCode;
            params.reviewer = this.orderForm.reviewer;
            params.remark = this.orderForm.remark;
            params.supplierCode = this.orderForm.supplierCode;
            params.supplierId = this.orderForm.supplierId;
            params.supplierName = this.orderForm.supplierName;
            params.warehouseId = this.orderForm.warehouseId;
            params.warehouseName = this.orderForm.warehouseName;
            params.purchaseOrderNo = this.orderForm.purchaseOrderCode;
            params.status = 1;
            params.orderDate = this.$moment(this.orderForm.orderDate).format(
                'YYYY-MM-DD'
            );
            params.purchaseInboundOrderDetailList = this.processedList;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.submitLoading = true;
                    this.$api
                        .order_purchaseInboundOrder_add(params)
                        .then((res) => {
                            let { result, code, msg } = res.data;
                            if (code == 200) {
                                this.orderForm.orderNo = result.orderCode;
                                this.$message({
                                    message: '订单已入库',
                                    type: 'success'
                                });
                                const h = this.$createElement;
                                this.$msgbox({
                                    title: '提示',
                                    message: h('div', null, [
                                        h('h4', null, '单据操作完成'),
                                        h('h4', null, [
                                            h(
                                                'span',
                                                null,
                                                `单据编码：${result.orderCode}`
                                            )
                                        ]),
                                        h(
                                            'p',
                                            { 'font-size': '16px' },
                                            '订单入库成功，是否前往查看?'
                                        )
                                    ]),
                                    showCancelButton: true,
                                    confirmButtonText: '前往查看',
                                    cancelButtonText: '停留当前页',
                                    beforeClose: (action, instance, done) => {
                                        if (action === 'confirm') {
                                            done();
                                            this.resetForm();
                                            this.$emit('initList');
                                        } else {
                                            done();
                                            this.resetForm();
                                        }
                                    }
                                }).then((action) => {
                                    console.log(action);
                                });
                            } else {
                                this.$message({
                                    message: msg,
                                    type: 'warning'
                                });
                            }
                            this.submitLoading = false;
                        })
                        .catch((err) => {
                            console.log(err);
                            this.submitLoading = false;
                        });
                } else {
                    this.$message({
                        message:
                            '请填写必要信息（供应商、仓库、入库日期、审核人员）',
                        type: 'error'
                    });
                    return false;
                }
            });
        },
        getPendingSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            const map = {
                0: '合计',
                1: ' ',
                2: ' ',
                3: ' ',
                4: ' ',
                5: ' ',
                6: ' ',
                7: ' ',
                8: ' ',
                9: ' ',
                15: ' ',
                16: ' ',
                17: ' ',
                18: ' ',
                19: ' ',
                20: ' ',
                21: ' ',
                22: ' ',
                23: ' ',
                24: ' ',
                25: ' ',
                26: ' '
            };
            columns.forEach((column, index) => {
                if (map[index]) {
                    sums[index] = map[index];
                    return sums;
                }
                const values = data.map((item) =>
                    Number(item[column.property])
                );
                if (!values.every((value) => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    if (index !== 10 && index !== 11 && index !== 12) {
                        sums[index] = this.$options.filters['formatMoney'](
                            sums[index]
                        );
                    }
                    sums[index] += ' ';
                } else {
                    if (index === 10 || index === 11 || index === 12) {
                        sums[index] = 0;
                    } else {
                        sums[index] = '0.00';
                    }
                }
            });
            return sums;
        }
    }
};
</script>
<style lang="scss" >
.custom-form {
    display: flex;
    flex-wrap: wrap;
}
.my-input-sc {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    -webkit-appearance: none;
    background-color: #ffffff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    font-size: inherit;
    outline: none;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
}
.custom-form /deep/ .el-form-item__error {
    padding-top: 0px;
}

.custom-form /deep/.el-form--inline .el-form-item {
    width: 280px;
}

.acceptaance-container {
    .el-divider {
        background-color: #303133;
    }
    .el-divider__text {
        font-weight: bold;
        font-size: 18px;
    }
}
.acceptance-input__error {
    .el-input__inner {
        border-color: #ff4949;
    }
}
.cancelOrder-tool-tip {
    font-size: 11px;
}
.pending-wrapper {
    padding-bottom: 20px;
    .operate-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        justify-content: space-between;
    }
    .operate-tips {
        color: #ff6c78;
    }
    .pirce-info {
        span {
            margin-left: 15px;
        }
    }
}
.processed-wrapper {
    padding-bottom: 20px;
    .pirce-info {
        margin-bottom: 10px;
        text-align: right;
        span {
            margin-left: 15px;
        }
    }
}
</style>