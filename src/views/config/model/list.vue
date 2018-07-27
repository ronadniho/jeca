<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/model/add','save',0)"
              v-perms="'/model/add'"      >添加模型</el-button> 

        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
             <el-table-column type="selection" width="65" align="right"></el-table-column>
             <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
             <el-table-column prop="name" label="模型名字" align="center"></el-table-column>
             <el-table-column prop="tplChannelPrefix" label="栏目模板前缀" align="center"></el-table-column>
             <el-table-column prop="tplContentPrefix" label="内容模板前缀" align="center"></el-table-column>
             <el-table-column prop="priority" label="排列顺序" align="center">
                <div slot-scope="scope">
                    <el-input v-model.number="scope.row.priority" type="number"></el-input>
                </div>
             </el-table-column>
             <el-table-column prop="def" label="默认" align="center">
                <div slot-scope="scope">
                    <el-radio name="radio" v-model="regDefId" :label="scope.row.id">&nbsp;</el-radio>                 
                </div>   
             </el-table-column>
             <el-table-column prop="disabled" label="禁用" align="center">
                <div slot-scope='scope'>
                     <el-checkbox v-model="scope.row.disabled"></el-checkbox> 
                </div> 
             </el-table-column>
            <el-table-column  label="栏目模型操作" align="center">
                <div slot-scope='scope'>
                     <a href="javascript:void(0)" 
                      class="link" 
                      @click="routerLink('/channelModel/list','list',0,{modelId:scope.row.id,isChannel:true,modelName:scope.row.name})" >[栏目模型]</a>
                </div> 
             </el-table-column>    
             <el-table-column  label="内容模型操作" align="center">
                <div slot-scope='scope'>
                     <a href="javascript:void(0)" 
                      class="link" 
                      v-if="scope.row.hasContent"
                      @click="routerLink('/contentModel/list','list',0,{modelId:scope.row.id,isChannel:false,modelName:scope.row.name})" >[内容模型]</a>
                </div> 
             </el-table-column>    


            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope">
                      <cms-button type="edit" @click.native="routerLink('/model/edit','update',scope.row.id)"
                        v-perms="'/model/edit'" 
                     ></cms-button>   
                     <cms-button type="delete" @click.native="deleteBatch($api.modelDelete,scope.row.id)"
                     v-perms="'/model/delete'"                    
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.modelDelete,ids)"
                   v-perms="'/model/delete'"  
                  >批量删除</el-button>

                   <el-button :disabled="disabled" @click.native="prioritysBatchs($api.modelPriority,ids,getPriority(checkedList),getDisableds(checkedList),regDefId)"
                       v-perms="'/model/priority'"
                  >保存排列顺序</el-button> 
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
      params: {//只需要业务参数
        
      },
      regDefId:0,
    };
  },methods:{
       getTableData(params) {//获取表格数据
            this.loading = true;
            this.$http
                .post(this.listUrl, params)
                .then(res => {
                    if(res.totalCount){
                        this.total = res.totalCount;
                    }
                    this.tableData = res.body;
                    this.getRegRefId(res.body)
                    this.loading = false;
                })
                .catch(error => {
                    this.loading = false;
                });
            },
            getPriority(checkedList){
                let Prioritys=[];
                for (let i in checkedList) {
                    Prioritys.push(checkedList[i].priority);
                }
                return Prioritys.join(",");
            },
             getDisableds(checkedList){
                let disableds=[];
                for (let i in checkedList) {
                    disableds.push(checkedList[i].disabled);
                }
                return disableds.join(",");
            },
            getRegRefId(obj){
            for(let a in obj){
                if(obj[a].def){
                    this.regDefId =obj[a].id;
                    break;
                }
            } 
            }


  },
  created(){
     this.initTableData(this.$api.modelList,this.params);
  }
};
</script>
    
<style>

</style>