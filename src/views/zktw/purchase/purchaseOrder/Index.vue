<template >
	<div class="app-container">
		<el-tabs class="tabs-container" v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="订单新增" name="add">
				<add-container @initList="initList" />
			</el-tab-pane>
			<el-tab-pane label="订单列表" name="list">
				<list-container ref="orderList" @toEdit="toEdit" />
			</el-tab-pane>

			<el-tab-pane label="订单取消" name="cancle">
				<cancle-container ref="cancle" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import ListContainer from './List';
import AddContainer from './Add';
import CancleContainer from './Cancle';
export default {
    name:'PurchaseOrder',
    components: {
        AddContainer,
        ListContainer,
        CancleContainer
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
            case 'cancle':
                this.$refs.cancle.fetch();
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