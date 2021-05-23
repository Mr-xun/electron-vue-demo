<template>
	<div class="app-container">
		<div class="workforce-container">
			<el-radio-group v-model="staffStatus">
				<div class="small-group">
					<el-radio :label="10" border class="custom-radio"
						>签到</el-radio
					>
					<el-radio :label="20" border class="custom-radio"
						>签退</el-radio
					>
				</div>
				<div class="small-group">
					<el-radio :label="11" border class="custom-radio"
						>送药返回</el-radio
					>
					<el-radio :label="22" border class="custom-radio"
						>解除排队</el-radio
					>
					<el-radio :label="12" border class="custom-radio"
						>解除脱岗</el-radio
					>
				</div>
			</el-radio-group>
		</div>
		<div class="center-container">
			<p class="staff-info f16 fbold" v-if="showInfo">
				{{ showInfo }}
			</p>
			<el-input
				ref="consigner"
				style="width: 260px"
				clearable
				v-model.trim="consigner"
				placeholder="请输入员工编号、姓名或者手机号"
				@keyup.enter.native="getConsigner(consigner)"
			/>
			<el-button
				class="submit-btn"
				type="success"
				icon="el-icon-check"
				@click="submit"
				v-has-permission="['deliverymanSignIn:signIn']"
				>提交</el-button
			>
		</div>
	</div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { mapGetters } from 'vuex';
export default {
    name: 'DeliverymanSignIn',
    components: { Pagination },
    data() {
        return {
            staffStatus: null, //员工状态
            staffInfo: {},
            showInfo: '',
            consigner: '' //物流人员
        };
    },
    computed: {
        ...mapGetters(['tableHeight'])
    },
    activated() {
        this.showInfo = '';
        this.consigner = '';
        this.staffInfo = {};
        this.staffStatus = null;
    },
    methods: {
        fiStatus(status) {
            switch (status) {
            case 10:
                return '签到';
            case 20:
                return '签退';
            case 11:
                return '送药返回';
            case 22:
                return '解除排队';
            case 12:
                return '解除脱岗';
            default:
                break;
            }
        },
        //获取物流人员
        getConsigner(val) {
            if (!val) {
                this.$message({
                    message: '不能为空!',
                    type: 'error'
                });
                this.staffInfo = {};
                this.showInfo = '';
                return;
            }
            let params = {
                multiCondition: this.consigner
            };
            this.$api
                .delivery_deliveryman_getDeliveryman(params)
                .then((r) => {
                    this.staffInfo = r.data.result;
                    this.showInfo = `${this.staffInfo.name}:${this.staffInfo.mobileNo}`;
                })
                .catch((err) => {
                    console.log(err);
                    this.staffInfo = {};
                    this.showInfo = '';
                });
        },
        //提交
        async submit() {
            if (!this.consigner) {
                this.$message({
                    message: '员工不能为空!',
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

            if (!this.staffInfo.userCode) {
                let params = {
                    multiCondition: this.consigner
                };
                let res = await this.$api.delivery_deliveryman_getDeliveryman(
                    params
                );
                this.staffInfo = res.data.result;
                this.showInfo = `${this.staffInfo.name}:${this.staffInfo.mobileNo}`;
            }
            let params = {
                status: this.staffStatus,
                mobileNo: this.staffInfo.mobileNo,
                userCode: this.staffInfo.userCode,
                userName: this.staffInfo.name
            };
            this.$api
                .delivery_deliveryman_signIn(params)
                .then((res) => {
                    this.$message({
                        message: '更新成功',
                        type: 'success'
                    });
                    this.consigner = '';
                    this.showInfo = `${this.staffInfo.name}${this.fiStatus(
                        this.staffStatus
                    )}成功   ${this.$options.filters.parseTime(new Date(),'{y}-{m}-{d} {h}:{i}:{s}')}`;
                    this.staffStatus = null;
                })
                .catch((err) => {
                    this.staffInfo = {};
                    this.showInfo = '';
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.workforce-container {
	padding: 20px 20px 10px;
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
}
.center-container {
	text-align: center;
	.staff-info {
		font-size: 16px;
	}
	.submit-btn {
		margin-top: 10px !important;
	}
}
</style>
