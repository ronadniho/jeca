<template>
  <section v-loading="loading" class="cms-body">
        <div class="cms-list-header flex-between">
            <el-button type="primary"  icon="el-icon-plus" @click="routerLink('/role/save','save',0)"
                v-perms="'/role/save'"
            >添加</el-button>       
        </div>
        <!-- 表格 -->
         <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
             <el-table-column type="selection" width="65" align="right"></el-table-column>
              <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
              <el-table-column prop="name" label="角色名"  align="center"></el-table-column> 
              <el-table-column prop="priority" label="排列顺序"  align="center"></el-table-column> 
              <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                    <cms-button type="edit" @click.native="routerLink('/role/update','update',scope.row.id)"
                        v-perms="'/role/update'"
                    ></cms-button>
                    <cms-button type="delete" @click.native="deleteBatch($api.roleDelete,scope.row.id)"
                        v-perms="'/role/save'"
                    ></cms-button>
                    <cms-button type="user" @click.native="routerLink('/role/members','update',scope.row.id)"
                        v-perms="'/role/roleMembers'"
                    ></cms-button>
                </div>
               </el-table-column>
         </el-table>
         <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.roleDelete,ids)"
                      v-perms="'/role/delete'"
                  >批量删除</el-button>
                </div>                
          </div> 
  </section>
</template>

<script>
import listMixins from '@/mixins/list'
export default {
  mixins:[listMixins],
  methods: {
  },
  created(){
     this.initTableData(this.$api.roleList,this.params);
  }
};
</script>

<style>

</style>
