<template>
  <div  id="aside">
 <el-menu 
 class="el-menu-vertical-demo"
 background-color="#188ae2"
    text-color="#fff"
    active-text-color="#fff"
   :collapse="$store.state.sys.collapse"
   unique-opened 
   router
   >
     <span class="cms-menu-title" v-show="!$store.state.sys.collapse">系统菜单</span>
     <template v-for="(item,index) in $store.state.perms.routers" v-if="!item.hidden" >
                          <el-submenu :index="item.path" v-if="!item.leaf" :key="index"  >
                              <template slot="title">
                                  <i :class="item.iconCls" class="iconfont iconfont1"></i>
                                  <span class="collapse-font" slot="title">{{item.name}}</span>
                             </template>
                           
                           <template v-for="(child,index2) in item.children" >   
                                <el-menu-item 
                                        v-if="child.isParent"
                                        :index="child.path" 
                                        :key="child.path"
                                         class="parent-padding"
                                        >
                                        {{child.name}}                                      
                                </el-menu-item>
                               <el-submenu v-else :index="child.path" class="child-padding" :key="index2">
                                  <template slot="title">
                                  <span class="collapse-font">{{child.name}}</span>
                             </template>
                                   <el-menu-item 
                                   v-for="child2 in child.children"
                                        v-if="!child2.hidden"
                                        :index="child2.path" 
                                        :key="child2.path">
                                        {{child2.name}}
                                </el-menu-item>
                               </el-submenu>
                         </template>
                           
                        </el-submenu>
                        <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.path" class="first-item" :key="index" >
                            <i :class="item.iconCls" class="iconfont iconfont1"></i>
                            <span class="collapse-font " slot="title">{{item.name}}</span>
                        </el-menu-item>
                    </template>

</el-menu>
  </div>
</template>

<script>
import '@/plugs/slimscroll.min.js'
import VueI18n from 'vue-i18n'
import cmsZhLocale from '@/i18n/lang/zh_CN'
import cmsEnLocale from '@/i18n/lang/en'
export default {
  name: "cms-submenu",
  data() {
    return {
       activeIndex: "/work",
       isCollapse: false
    };
  },
  methods: {
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    }
  },
   watch: {
    $route: function(to, from) {
      this.activeIndex = this.$route.path;
    }
  },
  mounted(){
     this.activeIndex = this.$route.matched[1].path;
       $("#aside").slimScroll({
        height: "100%",
        width: "auto",
        wrapperClass: "asidebar",
        color: "#fff",
        opacity: 0
      });
  }
};
</script>

<style lang="scss" scoped>
.full-height {
  width: 220px;
  height: 100%;
}
.el-menu{
  
  position: relative;
  z-index: 55;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
 
}
.el-menu-vertical-demo{
 
}
.cms-menu-title{
  display: inline-block;
  padding: 20px 24px 15px 24px;
  width: 100%;
  font-size: 14px;
  color: #3caeff;
  transition: 0.5s;
  position: relative;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.collapse-font{
  margin-left: 12px;
}
.el-menu--collapse{
  position: fixed;
  z-index: 500;
}
.el-menu--collapse .iconfont{
  font-size: 24px;
  margin-left: 0;
  position: relative;
  left:-7px;
}
.parent-padding{
  padding-left:56px !important;
}
.el-menu-item.is-active{
  background: #1c6fb3 !important;
}
.iconfont{
  color: #fff;
}
</style>

