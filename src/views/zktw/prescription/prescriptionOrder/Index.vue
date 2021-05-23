<template>
	<div class="app-container">
		<div class="filter-container">
			<el-form :inline="true" :model="queryParams" label-width="70px">
				<el-form-item label="流水号">
					<el-input
						v-model="queryParams.orderNo"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						placeholder="流水号"
						class="filter-item search-item"
					/>
				</el-form-item>
				<el-form-item label="患者">
					<el-input
						v-model="queryParams.patientName"
						clearable
						@clear="search"
						placeholder="患者"
						class="filter-item search-item"
						@keyup.enter.native="search"
					/>
				</el-form-item>
				<el-form-item label="处方号">
					<el-input
						v-model="queryParams.prescriptionNumber"
						placeholder="处方号"
						class="filter-item search-item"
						clearable
						@clear="search"
						@keyup.enter.native="search"
					/>
				</el-form-item>
				<el-form-item label="患者编号" v-show="moreQuery">
					<el-input
						v-model="queryParams.medicalRecordNumber"
						placeholder="病历号/患者卡号"
						class="filter-item search-item"
						clearable
						@clear="search"
						@keyup.enter.native="search"
					/>
				</el-form-item>

				<el-form-item
					label="处方状态"
					placeholder="请选择"
					v-show="moreQuery"
				>
					<el-select
						v-model="queryParams.orderStatus"
						clearable
						filterable
						autocomplete="on"
						default-first-option
						@change="search"
						class="filter-item search-item"
					>
						<el-option label="全部" value></el-option>
						<el-option label="待收费" :value="10"></el-option>
						<el-option label="待审方" :value="11"></el-option>
						<el-option label="待调剂" :value="12"></el-option>
						<el-option label="调剂中" :value="13"></el-option>
						<el-option label="待复核" :value="14"></el-option>
						<el-option label="待称重" :value="15"></el-option>
						<el-option label="包装称重完成" :value="17"></el-option>
						<el-option label="待煎药" :value="18"></el-option>
						<el-option label="煎药开始" :value="181"></el-option>
						<el-option label="煎药完成" :value="182"></el-option>
						<el-option label="待加工" :value="19"></el-option>
						<el-option label="加工开始" :value="191"></el-option>
						<el-option label="加工完成" :value="192"></el-option>
						<el-option label="送货中" :value="20"></el-option>
						<el-option label="待发药" :value="21"></el-option>
						<el-option label="发药完成" :value="22"></el-option>
						<el-option label="取消申请" :value="90"></el-option>
						<el-option label="取消确认" :value="91"></el-option>
						<el-option label="销毁申请" :value="92"></el-option>
						<el-option label="销毁确认" :value="93"></el-option>
						<el-option label="重发申请" :value="94"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="医保报销"
					placeholder="请选择"
					v-show="moreQuery"
				>
					<el-select
						v-model="queryParams.isMedicalInsurance"
						clearable
						filterable
						autocomplete="on"
						default-first-option
						@change="search"
						class="filter-item search-item"
					>
						<el-option label="全部" value></el-option>
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="2"></el-option>
					</el-select>
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
			<el-divider class="more-filter">
				<i
					:class="
						moreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
					"
					@click="togglehMoreQuery"
				></i>
			</el-divider>
		</div>

		<div class="center-container prescription-order-container">
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
			>
				<el-table-column
					label="序号"
					type="index"
					width="50"
					align="center"
				></el-table-column>
				<el-table-column
					label="流水号"
					prop="orderNo"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
				></el-table-column>
				<el-table-column
					label="处方号"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="prescriptionNumber"
				></el-table-column>
				<el-table-column
					label="患者"
					min-width="100px"
					:show-overflow-tooltip="true"
					align="center"
					prop="patientName"
				></el-table-column>
				<el-table-column
					label="订单状态"
					:show-overflow-tooltip="true"
					min-width="120px"
					align="center"
					prop="orderStatus"
				>
					<template slot-scope="{ row }">
						<span>{{ row.orderStatus | flOrderStatusName }}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="付数"
					:show-overflow-tooltip="true"
					align="center"
					min-width="60px"
					prop="doseNum"
				></el-table-column>
				<el-table-column
					label="工艺"
					:show-overflow-tooltip="true"
					min-width="100px"
					align="center"
					prop="technologyName"
				></el-table-column>
				<el-table-column
					label="科室"
					:show-overflow-tooltip="true"
					min-width="120px"
					align="center"
					prop="departmentName"
				></el-table-column>
				<el-table-column
					label="医师"
					:show-overflow-tooltip="true"
					min-width="120px"
					align="center"
					prop="physician"
				></el-table-column>
				<el-table-column
					label="处方备注"
					:show-overflow-tooltip="true"
					align="center"
					min-width="120px"
					prop="prescriptionRemarkName"
				></el-table-column>

				<el-table-column
					label="总金额"
					:show-overflow-tooltip="true"
					align="center"
					prop="totalAmount"
					min-width="90px"
				>
					<template slot-scope="{ row }">
						{{ row.totalAmount | formatMoney }}
					</template>
				</el-table-column>
				<el-table-column
					label="煎药费"
					:show-overflow-tooltip="true"
					align="center"
					prop="totalDecoctFee"
					min-width="90px"
				>
					<template slot-scope="{ row }">
						{{ row.totalDecoctFee | formatMoney }}
					</template>
				</el-table-column>
				<el-table-column
					label="药费"
					:show-overflow-tooltip="true"
					align="center"
					prop="totalMedicineAmount"
					min-width="90px"
				>
					<template slot-scope="{ row }">
						{{ row.totalMedicineAmount | formatMoney }}
					</template></el-table-column
				>
				<el-table-column
					label="录入时间"
					:show-overflow-tooltip="true"
					min-width="160px"
					align="center"
					prop="createTime"
				></el-table-column>
				<el-table-column
					label="发货时间"
					:show-overflow-tooltip="true"
					min-width="160px"
					align="center"
					prop="postTime"
				></el-table-column>
				<el-table-column
					label="操作"
					align="center"
					min-width="140px"
					fixed="right"
					class-name="small-padding fixed-width"
				>
					<template slot-scope="{ row }">
						<el-button
							type="text"
							@click="view(row)"
							v-has-permission="['prescription:detail']"
							>详情</el-button
						>
						<el-button
							type="text"
							v-has-permission="['prescription:cancel']"
							@click="changeApplyFor(row, 'cancelApplyFor')"
							v-if="row.orderStatus == 11 || row.orderStatus == 12"
							>取消申请</el-button
						>
						<el-button
							type="text"
							v-has-permission="['prescription:destruction']"
							@click="changeApplyFor(row, 'destructionApplyFor')"
							v-if="row.orderStatus == 21"
							>销毁申请</el-button
						>
						<el-button
							type="text"
							v-has-permission="['prescription:resend']"
							@click="changeApplyFor(row, 'resendApplyFor')"
							v-if="row.orderStatus == 22"
							>重发申请</el-button
						>
						<el-link
							v-has-no-permission="[
								'prescription:detail',
								'prescription:cancel',
								'prescription:destruction',
								'prescription:resend',
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
			<prescription-details
				ref="details"
				:dialog-visible="dialog.isVisible"
				@close="close"
				:detailData="dialog.detailData"
			/>
		</div>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination';
import ExpandCollapse from '@/components/ExpandCollapse';
import PrescriptionDetails from './components/Details';
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'PrescriptionOrder',
    components: { Pagination, ExpandCollapse, PrescriptionDetails },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: '',
                detailData: {}
            },
			 headImgSrc: require('@/assets/logo.png'),
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
            moreQuery: false
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),
        ...mapState({
            unitOptions: (state) => state.enum.units
        })
    },

    activated() {
        this.fetch();
    },
    methods: {
		  // 调用摄像头 下方代码  需要自行去掉  个人只作为着色效果加上
        callCamera () {
            // H5调用电脑摄像头API
            navigator.mediaDevices.getUserMedia({
                video: true
            }).then(success => {
                // 摄像头开启成功
                this.$refs['video'].srcObject = success;
                // 实时拍照效果
                this.$refs['video'].play();
            }).catch(error => {
                console.error('摄像头开启失败，请检查摄像头是否可用！');
            });
        },
        // 拍照
        photograph () {
            let ctx = this.$refs['canvas'].getContext('2d');
            // 把当前视频帧内容渲染到canvas上
            ctx.drawImage(this.$refs['video'], 0, 0, 640, 480);
            // 转base64格式、图片格式转换、图片质量压缩
            let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7);

            // 由字节转换为KB 判断大小
            let str = imgBase64.replace('data:image/jpeg;base64,', '');
            let strLength = str.length;
            let fileLength = parseInt(strLength - (strLength / 8) * 2);
            // 图片尺寸  用于判断
            let size = (fileLength / 1024).toFixed(2);
            console.log(size);

            // 上传拍照信息  调用接口上传图片 .........

            // 保存到本地
            this.dialogCamera = false;
            let ADOM = document.createElement('a');
            ADOM.href = this.headImgSrc;
            ADOM.download = new Date().getTime() + '.jpeg';
            ADOM.click();
        },
        // 关闭摄像头
        closeCamera () {
            if (!this.$refs['video'].srcObject) {
                this.dialogCamera = false;
                return;
            }
            let stream = this.$refs['video'].srcObject;
            let tracks = stream.getTracks();
            tracks.forEach(track => {
                track.stop();
            });
            this.$refs['video'].srcObject = null;
        },
        //改变申请
        changeApplyFor(row, type) {
            let applyForMap = {
                cancelApplyFor: {
                    api: 'prescription_prescriptionOrder_cancelApplyFor',
                    name: '取消申请'
                },
                resendApplyFor: {
                    api: 'prescription_prescriptionOrder_resendApplyFor',
                    name: '重发申请'
                },
                destructionApplyFor: {
                    api: 'prescription_prescriptionOrder_destructionApplyFor',
                    name: '销毁申请'
                }
            };
            this.$prompt(`请输入${applyForMap[type].name}原因`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.+$/,
                inputErrorMessage: '原因不能为空'
            })
                .then(({ value }) => {
                    console.log(value);
                    let params = {
                        prescriptionOrderId: row.id,
                        reasons: value
                    };
                    this.$api[applyForMap[type].api](params)
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: `你已${applyForMap[type].name}`
                            });
                            this.fetch();
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
        },
        //更多筛选条件
        togglehMoreQuery() {
            this.moreQuery = !this.moreQuery;
        },
        close() {
            this.dialog.isVisible = false;
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
        view(row) {
            this.dialog.detailData = row;
            this.dialog.isVisible = true;
        },
        fetch() {
            let params = this.queryParams;
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.loading = true;
            this.$api
                .prescription_prescriptionOrder_list(params)
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
.prescription-order-container {
	/deep/ .el-table__expand-icon {
		color: transparent;
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
.handle-icon {
	cursor: pointer;
}
</style>
