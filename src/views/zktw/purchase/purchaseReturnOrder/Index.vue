<template >
	<div class="app-container">
		<el-tabs class="tabs-container" v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="新增退货" name="add">
				<add-container @initList="initList" />
			</el-tab-pane>
			<el-tab-pane label="已退货" name="list">
				<list-container ref="orderList" @toEdit="toEdit" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import ListContainer from './List';
import AddContainer from './Add';
export default {
    name:'PurchaseReturnOrder',
    components: {
        AddContainer,
        ListContainer
    },
    data() {
        return {
            activeName: 'add'
        };
    },
    methods: {
        handleClick() {
            switch (this.activeName) {
            case 'list':
                this.$refs.orderList.fetch();
                break;
            default:
                break;
            }
        },
        initList() {
            this.activeName = 'list';
            this.$refs.orderList.fetch();
        },
        toEdit() {
            this.activeName = 'add';
        }
    }
};
</script>
<style lang="scss" scoped>
.tabs-container {
	padding: 0 20px 10px;
	background: #fff;
	/deep/ .el-divider--horizontal {
		margin: 15px 0;
	}
	/deep/ .el-table__body tr.current-row > td {
		background: #f7cd024f;
	}
	/deep/ .pagination-container {
		padding: 16px 16px 16px 0;
	}
	/deep/ .custom-form {
		display: flex;
		flex-wrap: wrap;
	}

	/deep/ .custom-form .el-form-item {
		margin-bottom: 0px !important;
	}
	/deep/ .custom-form .el-form-item__error {
		padding-top: 0px;
	}
	/deep/ .custom-form .el-form-item__label {
		font-size: 12px;
	}
	/deep/ .custom-form .el-input--mini {
		font-size: 12px !important;
		.el-input__suffix {
			height: 28px;
		}
	}
	/deep/ .custom-form .el-range-editor--mini .el-range-separator {
		width: 30px;
	}
}
</style>