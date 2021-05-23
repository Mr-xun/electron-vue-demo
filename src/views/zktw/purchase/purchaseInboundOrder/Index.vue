<template >
    <div class="app-container">
        <el-tabs
            class="tabs-container"
            v-model="activeName"
            @tab-click="handleClick"
            :before-leave="switchJudge"
        >
            <el-tab-pane label="待入库" name="pending">
                <pending-container ref="pending" @toAcceptance="toAcceptance" />
            </el-tab-pane>
            <el-tab-pane label="入库验收" name="acceptance">
                <acceptance-container ref="acceptance" @initList="initList" />
            </el-tab-pane>
            <el-tab-pane label="已入库" name="list">
                <list-container ref="inboundOrder" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import PendingContainer from './Pending';
import ListContainer from './List';
import AcceptanceContainer from './Acceptance';
export default {
    name:'PurchaseInboundOrder',
    components: {
        PendingContainer,
        AcceptanceContainer,
        ListContainer
    },
    data() {
        return {
            activeName: 'pending'
        };
    },
    beforeRouteLeave(to, from, next) {
        if (this.activeName === 'acceptance') {
            if (this.$refs.acceptance.objectValueAllEmpty()) {
                next();
            } else {
                this.$confirm(
                    '检查到您当前页有内容更改，离开数据将被重置，确定离开吗？',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                    .then(() => {
                        next();
                        this.$refs.acceptance.resetForm();
                    })
                    .catch(() => {
                        next(false);
                    });
            }
        } else {
            next();
        }
    },
    activated() {
        this.activeName = 'pending';
    },
    mounted() {},
    methods: {
        switchJudge(activeName, oldActiveName) {

            if (oldActiveName === 'acceptance') {
                if (this.$refs.acceptance.objectValueAllEmpty()) {
                    return true;
                } else {
                    return new Promise((resolve, reject) => {
                        this.$confirm(
                            '检查到您当前页有内容更改，切换数据将被重置，确定切换吗？',
                            '提示',
                            {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }
                        )
                            .then(() => {
                                this.$refs.acceptance.resetForm();
                                resolve();
                            })
                            .catch(() => {
                                reject();
                            });
                    });
                }
            } else {
                return true;
            }
        },
        handleClick(val) {
            switch (this.activeName) {
            case 'list':
                this.$refs.inboundOrder.fetch();
                break;
            case 'pending':
                this.$refs.pending.fetch();
                break;
            default:
                break;
            }
        },
        toAcceptance() {
            this.activeName = 'acceptance';
        },
        initList() {
            this.activeName = 'list';
            this.$refs.inboundOrder.fetch();
        }
    }
};
</script>
<style lang="scss" scoped>
.tabs-container {
    padding: 0 20px 10px;
    background: #fff;
    >>> .el-divider--horizontal {
        margin: 15px 0;
    }
    >>> .el-table__body tr.current-row > td {
        background: #f7cd024f;
    }
    >>> .pagination-container {
        padding: 16px 16px 16px 0;
    }
    >>> .custom-form {
        display: flex;
        flex-wrap: wrap;
    }

    >>> .custom-form .el-form-item {
        margin-bottom: 0px !important;
    }
    >>> .custom-form .el-form-item__error {
        padding-top: 0px;
    }
    >>> .custom-form .el-form-item__label {
        font-size: 12px;
    }
    >>> .custom-form .el-input--mini {
        font-size: 12px !important;
        .el-input__suffix {
            height: 28px;
        }
    }
    >>> .custom-form .el-range-editor--mini .el-range-separator {
        width: 30px;
    }
}
</style>