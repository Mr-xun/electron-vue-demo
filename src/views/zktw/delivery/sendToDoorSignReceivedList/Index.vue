<template>
    <div class="app-container">
        <div class="center-container door-signin-container">
            <el-row :gutter="10" v-if="haveData">
                <el-col
                    :xs="24"
                    :sm="12"
                    :md="8"
                    :lg="6"
                    v-for="item in list"
                    :key="item.id"
                >
                    <el-card class="box-card">
                        <div class="order-card">
                            <div class="lt-info">
                                <h6 class="orderno f16">
                                    <span class="order-icon">
                                        <i class="el-icon-s-order f14"></i>
                                    </span>
                                    {{ item.invoiceOrderNo }}
                                </h6>
                                <p class="info-p">
                                    <span class="patient-name">{{
                                        item.receiver
                                    }}</span>
                                    <span class="tel">{{ item.tel }}</span>
                                </p>
                                <p class="info-p">
                                    <span class="adress">{{
                                        item.address
                                    }}</span>
                                </p>
                                <p class="info-p">
                                    <span class="time">{{
                                        item.postTime
                                    }}</span>
                                </p>
                            </div>
                            <div class="rt-opt">
                                <div class="patient">
                                    <span class="name f18 fbold">{{
                                        item.patientName
                                    }}</span>
                                    <span class="technology">{{
                                        item.technologyName
                                    }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="opt-btn">
                            <el-button
                                size="mini"
                                icon="el-icon-truck"
                                class="cus-btn"
                                @click="confirmDelivery(item)"
                                v-has-permission="['confirmDelivery:delivery']"
                                >送达</el-button
                            >
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <NoData v-else />
        </div>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import NoData from '@/components/NoData/Index.vue';
import { mapGetters } from 'vuex';
export default {
    name: 'SendToDoorSignReceivedList',
    components: { Pagination, NoData },
    data() {
        return {
            loading: false,
            haveData: true,
            list: [],
            queryParams: {},
            pagination: {
                size: 50,
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
        confirmDelivery(row) {
            let params = {
                prescriptionOrderNo: row.orderNo
            };
            this.$api
                .delivery_deliveryOrder_confirmDelivery(params)
                .then((res) => {
                    this.$message({
                        message: '确认送达',
                        type: 'success'
                    });
                    this.fetch();
                });
        },
        fetch() {
            let params = {
                ...this.queryParams,
                pageSize: this.pagination.size,
                pageNum: this.pagination.num
            };
            this.loading = true;
            this.$api
                .delivery_deliveryOrder_sendToDoorSignReceivedList(params)
                .then((r) => {
                    let { result } = r.data;
                    if (result && result.length) {
                        this.haveData = true;
                        this.list = result;
                    } else {
                        this.haveData = false;
                    }
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.loading = false;
                    this.haveData = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.door-signin-container {
    padding: 10px;
    .box-card {
        margin-bottom: 10px;
        /deep/ .el-card__body {
            padding: 14px 12px 14px 10px;
        }
    }
    .order-card {
        display: flex;
        justify-content: space-between;
        .lt-info {
            .orderno {
                margin: 0 0 10px;
                .order-icon {
                    background: #41a9f1;
                    color: #fff;
                    border-radius: 50%;
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                }
            }
            .info-p {
                padding-left: 25px;
                color: #666;
                margin-top: 0px;
                margin-bottom: 10px;
                .patient-name {
                    margin-right: 15px;
                }
            }
        }
        .rt-opt {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .patient {
                text-align: right;
                .name {
                    display: block;
                    margin-bottom: 5px;
                }
                .technology {
                    display: block;
                }
            }
        }
    }
    .opt-btn {
        text-align: right;
        margin-top: 15px;
        .cus-btn {
            margin-right: 0;
        }
    }
}
</style>
