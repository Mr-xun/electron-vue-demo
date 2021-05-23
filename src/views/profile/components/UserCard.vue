<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>
    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <el-link type="primary" class="change-avatar" @click="dialogVisible = true">更换头像</el-link>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.fullname }}</div>
        <div class="user-role text-center text-muted">
          <span>{{ user.deptName ? user.deptName :'暂无部门' }}</span> · <span>{{ user.roleName ? user.roleName : '暂无角色' }}</span>
        </div>
      </div>
    </div>
    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><el-icon class="el-icon-tickets" /><span>个人描述</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.description ? user.description: '这家伙很懒，什么都没留下'}}
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><el-icon class="el-icon-connection" /><span>第三方账号登录</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            <template v-for="(l, index) in logo">
              <div :key="index" class="logo-wrapper">
                <img v-if="l.bind" :src="resolveLogo(l.img)" :class="{ 'radius': l.radius }" alt="" title="解绑" @click="unbind(l.name)">
                <img v-else :src="resolveLogo(l.img)" :class="{ 'radius': l.radius }" alt="" title="绑定" class="unbind" @click="bind(l.name)">
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <avatar
      :dialog-visible="dialogVisible"
      @close="dialogVisible = false"
      @success="changeSuccess"
    />
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb';
import Avatar from './Avatar';
import { socialLoginUrl } from '@/settings';

export default {
    components: { PanThumb, Avatar },
    props: {
        user: {
            type: Object,
            default: () => {
                return {
                };
            }
        }
    },
    data() {
        return {
            dialogVisible: false,
            socialLoginUrl: socialLoginUrl,
            logo: [
                { img: 'gitee.png', name: 'gitee', bind: false, radius: true },
                { img: 'github.png', name: 'github', bind: false, radius: true },
                { img: 'tencent_cloud.png', name: 'tencent_cloud', bind: false, radius: true },
                { img: 'qq.png', name: 'qq', bind: false, radius: false },
                { img: 'dingtalk.png', name: 'dingtalk', bind: false, radius: true },
                { img: 'microsoft.png', name: 'microsoft', bind: false, radius: false }
            ],
            oauthType: '',
            page: {
                width: window.screen.width * 0.5,
                height: window.screen.height * 0.5
            }
        };
    },
    computed: {
        avatar() {
            return require(`@/assets/avatar/${this.user.avatar}`);
        }
    },
    mounted() {
        this.findUserConnections();
    },
    destroyed() {
        window.removeEventListener('message', this.resolveBindResult);
    },
    methods: {
        changeSuccess(avatar) {
            this.dialogVisible = false;
            this.$message({
                message: '修改成功',
                type: 'success'
            });
            this.user.avatar = avatar;
            this.$store.commit('account/setUser', this.user);
        },
        resolveLogo(logo) {
            return require(`@/assets/logo/${logo}`);
        },
        findUserConnections() {
            this.$get(`auth/social/connections/${this.user.username}`).then((r) => {
                const data = r.data.data;
                data.forEach(d => {
                    this.logo.forEach(l => {
                        if (l.name === d.providerName.toLowerCase()) {
                            l.bind = true;
                        }
                    });
                });
            });
        },
        bind(name) {
            this.oauthType = name;
            const url = `${this.socialLoginUrl}/${name}/bind`;
            window.open(url, 'newWindow', `height=${this.page.height}, width=${this.page.width}, top=10%, left=10%, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no`);
            window.addEventListener('message', this.resolveBindResult, false);
        },
        resolveBindResult(e) {
            const data = e.data.data;
            data.token = null;
            this.$post('auth/social/bind', {
                ...data,
                bindUsername: this.user.username
            }).then((r) => {
                this.logo.forEach(l => {
                    if (l.name === this.oauthType) {
                        l.bind = true;
                    }
                });
                this.$message({
                    message:'绑定成功',
                    type: 'success'
                });
            });
        },
        unbind(name) {
            this.$confirm('确定解绑该第三方账号？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$delete('auth/social/unbind', {
                    bindUsername: this.user.username,
                    oauthType: name
                }).then(() => {
                    this.logo.forEach(l => {
                        if (l.name === name) {
                            l.bind = false;
                        }
                    });
                    this.$message({
                        message: '解绑成功',
                        type: 'success'
                    });
                });
            }).catch(() => {});
        }
    }
};
</script>

<style lang="scss" scoped>
 .box-center {
   margin: 0 auto;
   display: table;
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }

 .user-bio {
   margin-top: 20px;
   color: #606266;

   span {
     padding-left: 4px;
   }
   .logo-wrapper {
     display: inline-block;
     margin: 10px 0;
     img {
       width: 1.4rem;
       display: inline-block;
       margin: 0 .6rem;
       cursor: pointer;
       &.unbind {
         -webkit-filter: grayscale(100%);
         -moz-filter: grayscale(100%);
         -o-filter: grayscale(100%);
         filter: grayscale(100%);
       }
       &.radius {
         border-radius: 50%;
       }
     }
   }
   .user-bio-section {
     font-size: 14px;
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
     }
   }
 }
</style>
