<template>
  <section v-loading="loading" class="cms-body">
    <div class="cms-list-header flex-between">
        <el-button type="primary"  icon="el-icon-plus" @click="routerLink('/workflow/save','save',0)" v-perms="'/workflow/save'"
        >添加</el-button>       
    </div>
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="名称"  align="center"></el-table-column>
         <el-table-column width="100" label="排列顺序" align="center">
                <div slot-scope="scope">
                    <el-input v-model="scope.row.priority" type="number"></el-input>
                </div>        
            </el-table-column>
        <el-table-column width="300" label="操作"   align="center">
          <div slot-scope="scope">
              <cms-button type="edit" @click.native="routerLink('/workflow/update','update',scope.row.id)"v-perms="'/workflow/get'">
              </cms-button>
              <cms-button type="delete" @click.native="deleteBatch($api.workflowDelete,scope.row.id)" v-perms="'/workflow/save'">
              </cms-button>
          </div>
        </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" @click="deleteBatch($api.workflowDelete,ids)" v-perms="'/workflow/delete'"
        >批量删除</el-button>
        <el-button :disabled="disabled" @click="priorityBatch($api.workflowPriority,ids,getPriority())" v-perms="'/workflow/priority'"
        >保存排序</el-button>
      </div>    
      <!-- cms分页组件 -->
      <cms-pagination :total="total" @change="getPages"></cms-pagination>
    </div> 
  </section>
</template>
<script>
import listMixins from '@/mixins/list'
import axios from "axios";
export default {
  mixins:[listMixins],
  methods:{
    getPriority(){
      let Prioritys=[];
      for (let item of this.checkedList) {
          Prioritys.push(item.priority);
      }
      return Prioritys.join(",");
    },
  },
  created(){
      this.initTableData(this.$api.workflowList,this.params);
  }
};
</script>
