<template>
  <section v-loading="loading" class="cms-body">
        <div class="cms-list-header flex-between">
            <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/user/save','save',0)"
              v-perms="'/user/save'"
               
              >添加</el-button>
            <!-- 右操作 -->
             <div>
                <el-select v-model="params.queryStatus" @change="query">
                     <el-option label="状态" value=""></el-option>
                     <el-option label="已审核" value="0"></el-option>
                     <el-option label="禁用" value="1"></el-option>
                     <el-option label="未审核" value="2"></el-option>
                </el-select>
                 <cms-input  label="用户名" v-model="params.queryUsername"></cms-input>
                <cms-input  label="电子邮箱"  v-model="params.queryEmail"></cms-input>
                <el-button @click="query">查询</el-button>                
            </div>
        </div>
        <!-- 表格 -->
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
             <el-table-column type="selection" width="65" align="right"></el-table-column>
              <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
              <el-table-column prop="username" label="用户名" width="180" align="left"></el-table-column>
              <el-table-column prop="email" label="电子邮箱" align="center"> </el-table-column>
              <el-table-column prop="groupName" label="会员组"  align="center"> </el-table-column>
              <el-table-column prop="lastLoginTime" label="最后登录时间"   align="center"> </el-table-column>
              <el-table-column prop="loginCount" label="登录次数"  align="center"> </el-table-column>
              <el-table-column prop="" label="状态"   align="center">
                <div slot-scope="scope">
                  <span v-if='!scope.row.disabled'>启用</span> 
                  <span v-else class="red">禁用</span> 
                </div>
              </el-table-column>
              <el-table-column prop="name" label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/user/update','update',scope.row.id)"
                        v-perms="'/user/update'"
                    
                    ></cms-button>
                     <cms-button type="delete" @click.native="deleteBatch($api.memberDelete,scope.row.id)"
                       v-perms="'/user/delete'"
                     ></cms-button>
                </div>
               </el-table-column>
         </el-table>
         <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="reviewBatch($api.memberCheck,ids)"
                    v-perms="'/user/check'"
                  >批量审核</el-button>
                  <el-button :disabled="disabled" @click="deleteBatch($api.memberDelete,ids)"
                    v-perms="'/user/delete'"
                  
                  >批量删除</el-button>
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
      params: {//只需要业务参数
        queryUsername: "",
        queryEmail: "",
        queryGroupId: "",
        queryStatus: "",
        pageNo: "",
        pageSize: ""
      }
    };
  },
  created(){
     this.initTableData(this.$api.memberList,this.params);
  }
};
</script>

<style>

</style>
