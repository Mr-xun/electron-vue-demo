<template>
    <div class="dosage-container">
        <div class="operate-btn">
            <el-button
                class="filter-item"
                type="success"
                size="mini"
                plain
                @click.native="add"
            >新增禁忌商品</el-button>
        </div>
        <el-table
            ref="table"
            :key="tableKey"
            :data="drug2Data"
            border
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            stripe
            fit
            style="width: 100%;"
        >
            <el-table-column label="商品名称" align="center" min-width="150px">
                <template slot-scope="scope">
                    <el-popover placement="bottom-start" :value="scope.row.productVisible">
                        <choose-one-product
                            ref="chooseOneProduct"
                            @sure="sureDrug2($event,scope.row)"
                            :choosedId="scope.row.drug2Id"
                            :filterVal="scope.row.drug2Name"
                        />
                        <el-input
                            slot="reference"
                            @input="changeName(scope.row)"
                            placeholder="请输入选择"
                            v-model="scope.row.drug2Name"
                        />
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="商品编码" align="center" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.drug2Code}}</span>
                </template>
            </el-table-column>
            <el-table-column label="规格" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.drug2Specification}}</span>
                </template>
            </el-table-column>
            <el-table-column label="单位" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.drug2Unit |flUnitName }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
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
import ChooseOneProduct from '@/components/ChooseProduct/ChooseOne';

export default {
    name: 'AddDrug2',
    components: {
        ChooseOneProduct
    },
    props: {
        drug2Data: {
            default: () => {
                return [];
            },
            type: Array
        }
    },
    data() {
        return {
            tableKey: 0,
            loading: false,
            flDrug: {
                drug2Code: '',
                drug2Id: null
            },
            productVisible:false
        };
    },
    methods: {
        changeName(row) {
            row.drug2Code = '';
            row.drug2Id = null;
        },
        sureDrug2(data, row) {
            let flag = this.drug2Data.some((v) => v.drug2Id == data.id);
            if (flag) {
                this.$message({
                    message: '已选过该商品',
                    type: 'warning'
                });
                return;
            }
            row.drug2Name = data.name;
            row.drug2Code = data.code;
            row.drug2Id = data.id;
            row.drug2Specification = data.specification;
            row.drug2Unit = data.unitId;
            row.productVisible = false;

        },
        add() {
            this.drug2Data.push({
                drug2Name: '',
                drug2Code: '',
                specification: '',
                unit: ''
            });
        },
        singleDelete(row, index) {
            this.$confirm('选中数据将被移除，是否继续？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.drug2Data.splice(index, 1);
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
