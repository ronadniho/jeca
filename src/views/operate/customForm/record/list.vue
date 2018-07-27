<template>
     <section v-loading="loading" class="cms-body">
     <!-- 返回组件 -->
        <cms-back></cms-back>
        <div class="cms-list-header">
            <label class="cms-label">查询状态:</label>
            <el-select v-model="params.status" @change="query">
                <el-option label="所有" value=""></el-option>
                <el-option label="未审核" value="0"></el-option>
                <el-option label="审核中" value="1"></el-option>
                <el-option label="已终核" value="2"></el-option>
            </el-select>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
  
            <el-table-column v-for="(item,index) in keys" :key="index" :label="index" align="center">
                <div slot-scope="scope">
                    <span>
                        {{scope.row[item]}}                        
                    </span>                
                </div>
            </el-table-column>
             <el-table-column prop="status" label="提交状态" align="center">
                    <div slot-scope="scope">
                        <span v-if="scope.row.status==0">
                            未审核                        
                        </span>
                        <span v-if="scope.row.status==1">
                            审核中                       
                        </span>
                         <span v-if="scope.row.status==2">
                            已终核                        
                        </span>
                    </div>
             </el-table-column>

            <el-table-column prop="createTime" label="提交时间" align="center">
                 <div slot-scope="scope">
                        {{scope.row.createTime.split('.')[0]}}
                 </div>
            </el-table-column>
  
    
            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope"> 
                     <cms-button  type='view' title="记录详情"  @click.native="routerLink('/customForm/record/view','view',scope.row.id)"
                            v-perms="'/customForm/record/view'"
                     ></cms-button>  
                     <cms-button type="delete" @click.native="deleteBatch($api.customRecordDelete,scope.row.id)"                                 
                            v-perms="'/customForm/record/delete'"
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.customRecordDelete,ids)"          
                        v-perms="'/customForm/record/delete'"
                  >批量删除</el-button>
                    <el-button :disabled="disabled" @click="batch($api.customRecordCheck)"
                        v-perms="'/customForm/record/check'"   
                    >审核</el-button>
                </div>
               <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
            
          </div> 
     </section> 
</template>

<script>
import listMixin from '@/mixins/form';
import listMixins from '@/mixins/list';
import axios from "axios";
export default {
    mixins:[listMixins,listMixin],
  data() {
    return {
      params: {//只需要业务参数
        status:'',
        formId:'',
        pageNo:'',
        pageSize:'',
      },
      keys:''
    };
  },
  methods:{
       getTableData(url,params) {//获取表格数据   
            this.loading = true;
            this.state = false;
            axios.post(url, params)
                .then(res => {
                    this.loading = false;
                    if(res.code=='200'){
                        if (res.totalCount!=undefined) {
                            this.total = res.totalCount;
                        }
                        this.tableData = res.body;
                        this.state=true;
                        this.keys=res.keys;
                    }else{
                        this.tableData=[];
                        this.state = true;
                    }
                   
                   
                })
                .catch(error => {
                    this.loading = false;
                    this.state = false;
                });
        },
        query(){
             this.getTableData(this.$api.customRecordPage,this.params);
        },
         deleteBatch(url,ids) { //删除
            this.$confirm('是否确定删除？', '警告', { type: "error" })
                .then(mes => {
                    this.$http.post(url, { ids: ids }).then(res => {
                        if (res.code == "200") {
                            this.successMessage('删除成功');
                             this.getTableData(this.$api.customRecordPage,this.params);
                        }
                    });
                })
                .catch(error => { });
        },
          getPages(pageNo, pageSize) {
            //获取翻页数据
            this.params.pageNo = pageNo;
            this.params.pageSize = pageSize;
            this.getTableData(this.$api.customRecordPage,this.params);
        },
      batch(url) {
      //只需要ids参数的批量操作
      this.loading = true;
      axios
        .post(url, { ids: this.ids })
        .then(res => {
          this.loading = false;
          if (res.code == "200") {
            this.successMessage("操作成功");
            this.getTableData(this.$api.customRecordPage,this.params);
          }
        })
        .catch(error => {
          this.loading = false;
        });
     },
  },
  created(){
     this.params.formId=this.id;
     this.getTableData(this.$api.customRecordPage,this.params);
  }
};
</script>
    
<style>

</style>