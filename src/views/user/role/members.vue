<template>
    <section v-loading="loading" class="cms-body">
        <!-- 返回组件 -->
        <cms-back></cms-back>    
        <!-- 表格 -->
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
                <el-table-column type="selection" width="65" align="right"></el-table-column>
                <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名"  align="center"></el-table-column> 
                <el-table-column label="角色名"  align="center">
                    <div slot-scope="scope">
                        <span v-for="(item,index) in scope.row.roleNames" :key="index">{{item}}<i v-if="index!=scope.row.roleNames.length-1">,</i></span>
                    </div>    
                </el-table-column> 
                <el-table-column prop="rank" label="等级"  align="center"></el-table-column> 
                <el-table-column prop="lastLoginTime" label="最后登录时间"  align="center"></el-table-column> 
                <el-table-column prop="loginCount" label="登录次数"  align="center"></el-table-column> 
                <el-table-column prop="disabled" label="禁用"  align="center">
                    <div slot-scope="scope">
                         <span v-if="scope.row.disabled">是</span> 
                         <span v-else>否</span>   
                    </div>
                </el-table-column> 
                <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="delete" @click.native="removeBatch($api.roleMembersDelete,id,scope.row.id)"
                        v-perms="'/role/roleMembersDelete'"
                    ></cms-button>
                </div>
               </el-table-column>
         </el-table>
         <!-- 表格底部 -->
            <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="removeBatch($api.roleMembersDelete,id,ids)"
                         v-perms="'/role/roleMembersDelete'"
                  >移除成员</el-button>
                </div>                
            </div> 
  </section>
</template>

<script>
import listMixins from '@/mixins/list'
export default {
  mixins:[listMixins],
   data() {
    return {
        id:this.$route.query.id,
        params: {//只需要业务参数
        roleId:this.id,  
        pageNo:'',
        pageSize:'',
      }
    };
  },
  methods: {
  },
  created(){
    this.params.roleId=this.id;
     this.initTableData(this.$api.roleMembers,this.params);
  }
};
</script>

<style>

</style>
