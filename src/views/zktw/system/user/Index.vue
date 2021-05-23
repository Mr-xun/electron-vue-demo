<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true" :model="queryParams">
                <el-form-item label="机构" prop="orgId">
                    <el-select
                        v-model="queryParams.orgId"
                        clearable
                        filterable
                        autocomplete="on"
                        default-first-option
                        @change="search"
                        class="filter-item search-item"
                    >
                        <el-option
                            v-for="item in orgArchives"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input
                        v-model="queryParams.fullname"
                        placeholder="姓名"
                        clearable
                        @clear='search'
                        @keyup.enter.native="search"
                        class="filter-item search-item"
                    />
                </el-form-item>
                <el-form-item label="部门">
                    <el-input
                        v-model="queryParams.deptName"
                        placeholder="部门"
                        clearable
                        @clear='search'
                        @keyup.enter.native="search"
                        class="filter-item search-item"
                    />
                </el-form-item>
                <el-form-item label style="margin-left:0.75rem;">
                    <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
                    <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
                    <el-dropdown
                        v-has-any-permission="['user:add','user:delete','user:reset','user:export']"
                        trigger="click"
                        class="filter-item"
                    >
                        <el-button>
                            更多操作
                            <i class="el-icon-arrow-down el-icon--right" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-has-permission="['user:add']" @click.native="add">新增</el-dropdown-item>
                            <el-dropdown-item
                                v-has-permission="['user:delete']"
                                @click.native="batchDelete"
                            >删除</el-dropdown-item>
                            <el-dropdown-item
                                v-has-permission="['user:reset']"
                                @click.native="resetPassword"
                            >密码重置</el-dropdown-item>
                            <el-dropdown-item
                                v-has-permission="['user:export']"
                                @click.native="exportExcel"
                            >导出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
            </el-form>
        </div>
        <div class="center-container">
            <el-table
                ref="table"
                :key="tableKey"
                v-loading="loading"
                :data="list"
                border
                fit
                style="width: 100%;"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                stripe
                @selection-change="onSelectChange"
                @sort-change="sortChange"
                :max-height="tableHeight"
            >
                <el-table-column type="selection" align="center" width="40px" />
                <el-table-column
                    label="机构"
                    prop="orgName"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160px"
                ></el-table-column>
                 <el-table-column
                    label="编码"
                    prop="code"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80px"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.code }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="姓名"
                    prop="fullname"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.fullname }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="用户名"
                    prop="username"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.username }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="性别"
                    :filters="[{ text: '男', value: 1 }, { text: '女', value: 2}, { text: '保密', value:0 }]"
                    :filter-method="filterSex"
                    class-name="status-col"
                >
                    <template slot-scope="{row}">
                        <el-tag :type="row.sex | sexFilter">{{ transSex(row.sex) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="拼音首字母"
                    prop="firstLetter"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100px"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.firstLetter }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="部门" align="center" min-width="110px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.deptName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="邮箱"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="200px"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.email }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="电话"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120px"
                    prop="mobile"
                ></el-table-column>
                <el-table-column label="物流人员" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.isLogisticsPersonnel | flYesOrNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="身份证号" align="center" min-width="160px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.idcard || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="紧急联系人电话" align="center" min-width="140px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.emergencyContactNumber || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="推荐人联系电话" align="center" min-width="140px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.refereesNumber || '--' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    :filters="[{ text: '有效', value: '1' }, { text: '禁用', value:'2' }]"
                    :filter-method="filterStatus"
                    class-name="status-col"
                >
                    <template slot-scope="{row}">
                        <el-tag
                            :type="row.status | statusFilter"
                        >{{ row.status == 1 ? '有效' : '禁用' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间"
                    prop="createTime"
                    align="center"
                    min-width="180px"
                    sortable="custom"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.createTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="150px"
                    class-name="small-padding fixed-width"
                    fixed="right"
                >
                    <template slot-scope="{row}">
                        <i
                            v-has-permission="['user:view']"
                            class="el-icon-view table-operation"
                            style="color: #87d068;"
                            @click="view(row)"
                        />
                        <i
                            v-has-permission="['user:update']"
                            class="el-icon-setting table-operation"
                            style="color: #2db7f5;"
                            @click="edit(row)"
                        />
                        <i
                            v-has-permission="['user:delete']"
                            class="el-icon-delete table-operation"
                            style="color: #f50;"
                            @click="singleDelete(row)"
                        />
                        <el-link
                            v-has-no-permission="['user:view','user:update','user:delete']"
                            class="no-perm"
                        >无权限</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="total>0"
                :total="total"
                :page.sync="pagination.num"
                :limit.sync="pagination.size"
                @pagination="fetch"
            />
            <user-edit
                ref="edit"
                :dialog-visible="dialog.isVisible"
                :title="dialog.title"
                @success="editSuccess"
                @close="editClose"
            />
            <user-view ref="view" :dialog-visible="userViewVisible" @close="viewClose" />
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import UserEdit from './Edit';
import UserView from './View';
import { mapGetters } from 'vuex';
const WEBSIT = process.env.VUE_APP_BASE_WEBSIT || 'trt';
export default {
    name: 'UserManage',
    components: { Pagination, UserEdit, UserView },
    filters: {
        sexFilter(status) {
            const map = {
                1: 'success',
                2: 'danger',
                0: 'info'
            };
            return map[status];
        },
        statusFilter(status) {
            const map = {
                0: 'danger',
                1: 'success'
            };
            return map[status];
        }
    },
    data() {
        return {
            dialog: {
                isVisible: false,
                title: ''
            },
            userViewVisible: false,
            tableKey: 0,
            loading: false,
            list: [],
            total: 0,
            queryParams: {},
            sort: {},
            selection: [],
            pagination: {
                size: 10,
                num: 1
            }
        };
    },
    computed: {
        ...mapGetters(['tableHeight']),

        ...mapGetters('basic', ['orgArchives']),
        currentUser() {
            return this.$store.state.account.user;
        }
    },
    mounted() {
        this.fetch();
    },
    methods: {
        transSex(sex) {
            switch (Number(sex)) {
            case 1:
                return '男性';
            case 2:
                return '女性';
            default:
                return '保密';
            }
        },
        filterStatus(value, row) {
            return row.status === value;
        },
        filterSex(value, row) {
            return row.sex === value;
        },
        viewClose() {
            this.userViewVisible = false;
        },
        editClose() {
            this.dialog.isVisible = false;
        },
        editSuccess() {
            this.fetch();
        },
        onSelectChange(selection) {
            this.selection = selection;
        },
        search() {
            this.pagination.num = 1;
            this.fetch();
        },
        reset() {
            this.pagination.num = 1;

            this.queryParams = {};
            this.sort = {};
            this.$refs.table.clearSort();
            this.$refs.table.clearFilter();
            this.search();
        },
        exportExcel() {
            this.$download(
                'system/user/excel',
                {
                    pageSize: this.pagination.size,
                    pageNum: this.pagination.num,
                    ...this.queryParams
                },
                `用户管理_${new Date().getTime()}.xlsx`
            );
        },
        add() {
            this.dialog.title = '新增';
            this.dialog.isVisible = true;
        },
        resetPassword() {
            if (!this.selection.length) {
                this.$message({
                    message: '请先选择需要操作的数据',
                    type: 'warning'
                });
                return;
            }
            this.$confirm('确定重置所选用户密码？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    const userNames = [];
                    this.selection.forEach((u) => {
                        userNames.push(u.username);
                    });
                    this.$put('system/user/password/reset', {
                        usernames: userNames.join(',')
                    }).then(() => {
                        this.$message({
                            message: `所选用户密码重置已被重置为${WEBSIT =='trt'?'1234qwer':'123456'}`,
                            type: 'success'
                        });
                        this.clearSelections();
                    });
                })
                .catch(() => {
                    this.clearSelections();
                });
        },
        singleDelete(row) {
            this.$refs.table.clearSelection();
            this.$refs.table.toggleRowSelection(row, true);
            this.batchDelete();
        },
        batchDelete() {
            if (!this.selection.length) {
                this.$message({
                    message: '请先选择需要操作的数据',
                    type: 'warning'
                });
                return;
            }
            let contain = false;
            this.$confirm('选中数据将被永久删除, 是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    const userIds = [];
                    this.selection.forEach((u) => {
                        if (u.userId === this.currentUser.userId) {
                            contain = true;
                            return;
                        }
                        userIds.push(u.userId);
                    });
                    if (contain) {
                        this.$message({
                            message: '包含当前登录用户，操作已取消',
                            type: 'warning'
                        });
                        this.clearSelections();
                    } else {
                        this.delete(userIds);
                    }
                })
                .catch(() => {
                    this.clearSelections();
                });
        },
        clearSelections() {
            this.$refs.table.clearSelection();
        },
        delete(userIds) {
            this.$delete(`system/user/${userIds}`).then(() => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.search();
            });
        },
        view(row) {
            this.$refs.view.setUser(row);
            this.userViewVisible = true;
        },
        edit(row) {
            let roleId = [];
            if (row.roleId && typeof row.roleId === 'string') {
                roleId = row.roleId.split(',');
                row.roleId = roleId;
            }
            this.$get(`system/user/${row.userId}`).then((r) => {
                this.$refs.edit.setUser(row);
                this.dialog.title = '修改';
                this.dialog.isVisible = true;
            });
        },
        fetch() {
            let params = this.queryParams;
            if (this.sort) {
                params = Object.assign(params, this.sort);
            }
            params.pageSize = this.pagination.size;
            params.pageNum = this.pagination.num;
            this.loading = true;
            this.$get('system/user', {
                ...params
            })
                .then((r) => {
                    const data = r.data.data;
                    this.total = data.total;
                    this.list = data.rows;
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.loading = false;
                });
        },
        sortChange(val) {
            this.sort.field = val.prop;
            this.sort.order = val.order;
            this.search();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
