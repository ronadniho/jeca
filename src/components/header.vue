<template>
 
    <header class="bbs-header">
        <div class="header-left">
            <img src="static/images/header-logo.png" alt="Jeecms" class="header-logo">
            <a href="javascript:void(0)" class="cms-slide-menu" @click="collapseMenu"></a>
        </div>
         <div class="header-right">
             <div class="header-user-group">
                <img src="./../assets/images/userlogo.png" alt="" class="user-logo">
                 <span class="username">{{userName}}</span>
                 </div>
                 <span title="修改密码" class="iconfont icon-bianji-copy" @click="showPwd"></span>
                 <span title="查看首页"  class="iconfont icon-wangzhan-copy" @click="getIndex"></span> 
                 <span title="退出"  class="iconfont icon-out-copy" @click="logout"></span> 
                <el-dropdown style="margin-left:22px;" class="cur" @command="setSiteId">
                  <span class="el-dropdown-link">
                    {{siteName}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in siteItems" :key="index" 
                    :command="item.id"
                    >
                      {{item.name}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

         </div>
    </header>

</template>

<script>
import i18n from "@/i18n";
export default {
  name: "cms-header",
  data() {
    return {
      userName:localStorage.getItem('userName'),
      siteItems:this.$store.state.perms.siteItems,//站点id
      siteId: localStorage.getItem('_site_id_param'),
    };
  },
  computed:{
       siteName(){
          for(let i in this.siteItems){
              if(this.siteItems[i].id==this.siteId){
                return this.siteItems[i].name;
                break;
              }
          }
       }
  },
  methods: {
    setSiteId(val){
      localStorage.setItem('_site_id_param',val);
       window.location.reload();//重新处理请求   
    },
    collapseMenu() {//侧边栏收缩 
    this.$store.dispatch("setCollapse");
    },
    showPwd(){
      if(this.$store.state.sys.pwdCollapse){
          this.$store.dispatch('setPwd',false);
      }else{
        this.$store.dispatch('setPwd',true);
      }
    
    },
    toggleLocal(){
      
    },
    logout() {//退出登录
      this.$confirm('确定退出吗？','提示', {type: "warning"})
        .then(mes => {
          this.$store.dispatch("loginOut").then(res => {
              if(res.code=='200'){
                   this.$router.push("/login");
              }else{
                  this.errorMessage()
              }
          });
        })
        .catch(error => {});
    },
    getIndex(){//查看首页
         window.open(this.$store.state.sys.baseUrl);
    }
  }
};
</script>

 <style lang="scss" scoped>
$header-height: 60px;
.bbs-header {
  width: 100%;
  height: $header-height;
  background: #fff;
  border-bottom: 1px solid #e0e4e9;
  box-shadow: 10px 1px 15px rgba(0, 0, 0, 0.17);
  padding: 0 24px;
  position: fixed;
   position: fixed;
   top:0;
   z-index:999;
   -webkit-transform: translateZ(0);

}
.header-left {
  float: left;
  display: flex;
  align-items: center;
  height: $header-height;
  width: 220-24px;
}
.header-right {
  float: right;
  display: flex;
  align-items: center;
  height: $header-height;
  .iconfont {
    cursor: pointer;
    font-size: 20px;
    color: #777777;
    margin-left: 25px;
    &:hover{
        color: #188ae2;
    }
  }
}

@media screen and(max-width:700px) {
  .header-right {
    display: none;
  }
  .header-left {
    width: 100%;
    .header-logo {
      text-align: center;
      margin: 0 auto;
    }
  }
}
.header-user-group {
  display: flex;
  height: $header-height;
  line-height: $header-height;
  align-items: center;
}
.user-logo {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.header-logo {
  margin-left: 26px;
}
.cms-slide-menu {
  height: 16px;
  width: 18px;
  background: url("./../assets/images/collapse.png") no-repeat;
  margin-left: 73-26px;
}
.cur{
  cursor: pointer;
}

</style>
