<template>
  <section v-loading="loading" >
        <!-- 返回组件 -->
      <cms-back></cms-back>       
        <div class="cms-list-header">
            <label>&nbsp;</label>
        </div>  
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名" align="center"></el-table-column>
            <el-table-column prop="" label="角色" align="center">
                <template slot-scope="scope">
                      {{getRoles(scope.row.roleNames)}}
                </template>
            </el-table-column>
           <el-table-column label="所属部门"  align="center">
                <template slot-scope="scope">
                      {{getDepartment(scope.row.departmentNames)}}
                </template>
           </el-table-column>
            <el-table-column prop="groupName" label="  等级"  align="center"></el-table-column>
            <el-table-column prop="lastLoginTime" label="最后登录" align="center"></el-table-column>  
            <el-table-column prop="loginCount" label="登录" align="center"></el-table-column>
            <el-table-column prop="" label="禁用" align="center">
                <template slot-scope="scope">
                      <span v-if="scope.row.disabled">是</span>
                      <span v-else>否</span>
                </template>
            </el-table-column>
         </el-table> 
          <!-- 表格底部 -->
        <div class="cms-list-footer ">
            <div class="cms-left">
            </div>
                <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div>   
    </section>
</template>

<script>
import listMixins from '@/mixins/list'
export default {
    mixins:[listMixins],
  data() {
    return {
      params: {
        departId: this.$route.query.id,
      }
    };
  },
  methods:{
      getDepartment(names){
         if(names.length > 0){
             return names[names.length-1];
          }else{
              return '';
          }
          return names.join('>');
      },
      getRoles(roles){
          if(roles.length > 0){
             return roles.join(',');
          }else{
              return '';
          }
      }
  },
  created(){
     this.initTableData(this.$api.departmentMemberList,this.params);
  }
};
</script>

</style>
