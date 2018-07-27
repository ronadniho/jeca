<template>
  <section  class="cms-body flex">
      <!-- cms站点tree组件引用 -->
      <cmsDepartment @node-click="nodeClik"></cmsDepartment>
      <div class="cms-content-right">
          <router-view></router-view>
      </div>
  </section>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
    }
  },
  methods:{
    //节点树节点触发触发函数
    nodeClik(data){
      
      if(data.hasChild){         
            this.routerLink('/department/list','list',data.id);
      }else{
            this.routerLink('/department/edit','update',data.id);
      }
    },
  },
  created(){
  }
};
</script>
