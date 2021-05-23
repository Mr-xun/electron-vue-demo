<template >
	<div class="app-container">
		<el-tabs
			class="tabs-container"
			v-model="activeName"
			@tab-click="handleClick"
			:before-leave="switchJudge"
		>
			<el-tab-pane label="待复核" name="toReview">
				<to-review-container ref="toReview" @toRecheck="toRecheck" />
			</el-tab-pane>
			<el-tab-pane label="复核" name="recheck">
				<recheck-container ref="recheck" @initList="initList" />
			</el-tab-pane>
			<el-tab-pane label="已复核" name="checked">
				<checked-container ref="checked" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import ToReviewContainer from './ToReview';
import RecheckContainer from './Recheck';
import CheckedContainer from './Checked';
export default {
    name:'StockInventoryCheck',
    components: {
        ToReviewContainer,
        RecheckContainer,
        CheckedContainer
    },
    data() {
        return {
            activeName: 'toReview'
        };
    },
    activated() {
        this.activeName = 'toReview';
    },
    beforeRouteLeave(to, from, next) {
        if (this.activeName === 'recheck') {
            if (this.$refs.recheck.objectValueAllEmpty()) {
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
                        this.$refs.recheck.resetForm();
                    })
                    .catch(() => {
                        next(false);
                    });
            }
        } else {
            next();
        }
    },
    methods: {
        handleClick(val) {
            switch (this.activeName) {
            case 'checked':
                this.$refs.checked.fetch();
                break;
            case 'toReview':
                this.$refs.toReview.fetch();
                break;
            default:
                break;
            }
        },
        switchJudge(activeName, oldActiveName) {
            if (oldActiveName === 'recheck') {
                if (this.$refs.recheck.objectValueAllEmpty()) {
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
                                this.$refs.recheck.resetForm();
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

        //去复核
        toRecheck() {
            this.activeName = 'recheck';
        },
        initList() {
            this.activeName = 'checked';
            this.$refs.checked.fetch();
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
	}
	>>> .custom-form .el-range-editor--mini .el-range-separator {
		width: 30px;
	}
}
</style>