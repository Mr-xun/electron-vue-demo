<template>
	<div class="prescribe-record-container">
		<div class="history-title">查询条件</div>
		<div class="record-search-container">
			<el-form
				label-position="right"
				:inline="true"
				label-width
				:model="queryParams"
				class="lt-search-form"
			>
				<el-form-item label class="lt-form-item">
					<el-date-picker
						size="mini"
						v-model="queryParams.chooseDate"
						value-format="yyyy-MM-dd"
						type="date"
						placeholder="选择日期"
						@change="search"
						class="filter-item search-item lt-item"
					></el-date-picker>
				</el-form-item>
				<el-form-item label class="lt-form-item">
					<el-input
						size="mini"
						v-model="queryParams.patientName"
						@clear="search"
						@keyup.enter.native="search"
						clearable
						placeholder="患者名"
						class="filter-item search-item lt-item"
					/>
				</el-form-item>
				<el-form-item label class="lt-form-item">
					<el-input
						size="mini"
						v-model="queryParams.orderNo"
						placeholder="流水号"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						class="filter-item search-item lt-item"
					/>
				</el-form-item>
				<el-form-item label class="lt-form-item">
					<el-input
						size="mini"
						v-model="queryParams.medicalRecordNumber"
						placeholder="患者编号"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						class="filter-item search-item lt-item"
					/>
				</el-form-item>
				<el-form-item label class="lt-form-item">
					<el-input
						size="mini"
						v-model="queryParams.prescriptionNumber"
						placeholder="处方号"
						clearable
						@clear="search"
						@keyup.enter.native="search"
						class="filter-item search-item lt-item"
					/>
				</el-form-item>
				<el-form-item label class="lt-form-item opt-form-item">
					<el-checkbox v-model="checkedStatus">所有状态</el-checkbox>
					<el-button
						class="filter-item opt-btn"
						size="mini"
						type="primary"
						plain
						@click="search"
						>查询</el-button
					>
				</el-form-item>
			</el-form>
		</div>
		<div class="hsy-record-container">
			<ul class="record-wrapper">
				<div class="record-wrapper__header">
					<li class="head-tr">
						<div class="cell">流水号</div>
						<div class="cell">患者</div>
						<div class="cell">录入时间</div>
					</li>
				</div>
				<div
					class="record-wrapper__body"
					:style="{ maxHeight: recordListHeight + 'px' }"
					v-loading="loading"
					v-infinite-scroll="loadMore"
					:infinite-scroll-disabled="disabled"
				>
					<li
						class="record-tr"
						:class="
							item.orderStatus > 10
								? 'confiremd-status'
								: 'wait-confirm-status'
						"
						v-for="(item, index) in list"
						:key="index"
						@click="chooseOrder(item)"
					>
						<div class="cell fellip" :title="item.orderNo">
							{{ item.orderNo | sliceNo }}
						</div>
						<div class="cell fellip" :title="item.patientName">
							{{ item.patientName }}
						</div>
						<div class="cell fellip">
							{{ $moment(item.createTime).format("LT") }}
						</div>
					</li>
					<p v-if="loading" class="record-tip">
						<i class="el-icon-loading"></i> 加载中
					</p>
					<p v-if="noMore" class="record-tip">没有更多了</p>
					<p v-if="!list.length && !loading" class="record-tip">
						暂无记录
					</p>
				</div>
			</ul>
		</div>
	</div>
</template>
<script>
import splitPane from 'vue-splitpane';
import { debounce } from '@/utils';
import { parseTime } from '@/utils';
export default {
    name: 'PrescriptionEnter',
    components: {
        splitPane
    },
    data() {
        return {
            recordListHeight: 10,
            checkedStatus: false,
            queryParams: {
                chooseDate: parseTime(new Date(), '{y}-{m}-{d}'),
                orderNo: '',
                medicalRecordNumber: '',
                prescriptionNumber: ''
            },
            list: [],
            pagination: {
                size: 20,
                num: 1
            },
            noMore: false,
            loading: false
        };
    },
    filters: {
        sliceNo(val) {
            if (val) {
                return val.substring(val.length - 7);
            } else {
                return '---';
            }
        }
    },
    computed: {
        disabled() {
            return this.loading || this.noMore;
        }
    },
    created() {
        this.setRecordListHeight();
    },
    mounted() {
        this.__resizeHandler = debounce(() => {
            console.log(111);
            this.setRecordListHeight();
        }, 100);
        window.addEventListener('resize', this.__resizeHandler);
        this.fetch();
    },
    methods: {
        chooseOrder(item) {
            this.$emit('chooseOrder', item);
        },
        setRecordListHeight() {
            this.$nextTick(() => {
                let titleHeight = 20;
                let filterHeight = 200;
                let prescribeHeight = 850;
                if (
                    document.getElementsByClassName('record-search-container')
                        .length
                ) {
                    filterHeight = document.getElementsByClassName(
                        'record-search-container'
                    )[0].offsetHeight;
                }
                if (
                    document.getElementsByClassName(
                        'prescribe-record-container'
                    ).length
                ) {
                    prescribeHeight = document.getElementsByClassName(
                        'prescribe-record-container'
                    )[0].offsetHeight;
                }
                let maringHeight = 90;
                this.recordListHeight =
					prescribeHeight - titleHeight - filterHeight - maringHeight;
            });
        },
        search() {
            this.noMore = false;
            this.pagination.num = 1;
            this.list = [];
            this.fetch();
        },
        loadMore() {
            if (this.noMore) {
                return;
            }
            this.pagination.num += 1;
            this.fetch();
        },
        fetch() {
            let params = JSON.parse(JSON.stringify(this.queryParams));
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            params.orderStatus = this.checkedStatus ? '' : 10;
            if (this.queryParams.chooseDate) {
                params.startTime = this.queryParams.chooseDate + ' 00:00:00';
                params.endTime = this.queryParams.chooseDate + ' 23:59:59';
            } else {
                delete params.startTime;
                delete params.endTime;
            }
            delete params.chooseDate;
            this.loading = true;
            this.$api
                .prescription_prescriptionOrder_list(params)
                .then(r => {
                    let { rows, total } = r.data.result;
                    this.noMore = rows.length ? false : true;
                    this.total = total;
                    this.list = this.list.concat(rows);
                    this.loading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                    this.noMore = true;
                });
        }
    }
};
</script>
<style lang="scss"   scoped>
.prescribe-record-container {
	background-color: #fff;
	height: 100%;
	text-align: center;
	min-width: 160px;
	.history-title {
		line-height: 24px;
		padding: 8px;
		font-size: 16px;
		font-size: 14px;
		border-bottom: 1px solid #ccc;
	}
	.lt-search-form {
		padding-top: 5px;
		margin: auto;
		display: flex;
		flex-wrap: wrap;
		/deep/ .el-form-item {
			margin-bottom: 0 !important;
			.el-form-item__label {
				font-size: 12px;
				line-height: 32px;
			}
			.el-form-item__content {
				width: 140px;
				line-height: 32px;
			}
		}
		.lt-form-item {
			width: 140px;
			margin: auto;
		}
		.opt-form-item {
			/deep/ .el-form-item__content {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.opt-btn {
				padding: 6px 8px;
				margin-right: 0;
				height: 26px;
			}
			/deep/ .el-form-item__content::after {
				content: none;
			}
		}
		.lt-item {
			width: 140px;
		}
	}
	.hsy-record-container {
		.record-wrapper {
			padding: 0;
			margin: 5px 0 5px 5px;
			border: 1px solid #dfe6ec;
			font-size: 0;
			li {
				list-style: none;
				margin: 0;
				padding: 0;
			}
			.cell {
				display: inline-block;
				background: #eef1f6;
				width: 33.3333%;
				font-size: 12px;
				line-height: 22px;
				padding: 8px 0;
				border-bottom: 1px solid #dfe6ec;
			}
			.record-wrapper__header {
				.head-tr {
					.gutter {
						height: 38px;
						width: 17px;
					}
				}
			}
			.record-wrapper__body {
				overflow: auto;
				.record-tr {
					cursor: pointer;
					display: flex;
				}
				.cell {
					background: #fff;
				}
				.wait-confirm-status .cell {
					background: #faecd8;
				}
				.confiremd-status .cell {
					background: #e1f3d8;
				}
				.record-tip {
					font-size: 12px;
					margin: 8px;
				}
			}
		}
	}
}
.right-container {
	background-color: #fff;
	height: 100%;
}
</style>
