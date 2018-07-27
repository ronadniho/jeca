<template>
  <section v-loading="loading" class="cms-body">
    <!-- 手动查询表单 -->
    <div class="cms-list-header">
      <cms-input v-model="params.title" label="标题"></cms-input>
      <el-radio-group v-model="params.status">
        <el-radio :label="-1">全部</el-radio>
        <el-radio :label="0">待审</el-radio>
        <el-radio :label="1">通过</el-radio>
        <el-radio :label="2">推送</el-radio>
      </el-radio-group>
      <el-cascader
        :props="{'value':'id','label':'name','children':'child'}"
        :options="sites"
        change-on-select
        filterable
        v-model="siteIds" class="cms-width">
      </el-cascader>
      <el-cascader
        :props="{'value':'id','label':'name','children':'child'}"
        :options="targetSites"
        change-on-select
        filterable
        v-model="targetSiteIds" class="cms-width">
      </el-cascader>
      <el-button @click="query">查询</el-button> 
    </div> 
    <!-- 数据表格显示区域 -->
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
      <el-table-column type="selection" width="65" align="right"></el-table-column>
      <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
      <el-table-column  label="标题" width="500" align="left">
        <div slot-scope="scope" class="overflow-text">
          <span v-if="scope.row.shared && $getSiteId() == scope.row.contentSiteId" title="共享给其他站点的内容" 
            class="red-color">[源]
          </span>
          <span class="cms-channel-name font-bold">[{{scope.row.contentChannelName}}]</span>
          <a class="link" :href="scope.row.url" :title="scope.row.title" target="_blank">{{scope.row.title}}</a>
        </div>
      </el-table-column>
      <el-table-column prop="username" label="源栏目"  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.contentSiteName}}->{{scope.row.contentChannelName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="目标栏目"  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.channelSiteName}}->{{scope.row.channelName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" width=""  label="发布者"  align="center"></el-table-column>
      <el-table-column prop="releaseDate"  label="发布时间"  align="center"></el-table-column>
      <el-table-column prop="checkStatus" label="状态" width="50px"  align="center">
        <template slot-scope="scope" >
          <span v-if="scope.row.checkStatus==0">待审</span>
          <span v-if="scope.row.checkStatus==1">通过</span>
          <span v-if="scope.row.checkStatus==2">推送</span>
        </template>
      </el-table-column>
       <el-table-column  label="操作"   align="center">
        <div slot-scope="scope">
            <cms-button type="view" @click.native="routerLink('/contentShare/view','update',scope.row.contentId)"v-perms="'/contentShare/view'">
            </cms-button>
            <cms-button type="delete" @click.native="deleteBatch($api.contentShareDelete,scope.row.id)" v-perms="'/contentShare/delete'">
            </cms-button>
        </div>
      </el-table-column>
    </el-table>
    <!-- 表格底部 -->
    <div class="cms-list-footer">
      <div class="cms-left">
        <el-button :disabled="disabled" v-perms="'/contentShare/delete'" @click="deleteBatch($api.contentShareDelete,ids)" >删除共享
        </el-button>
        <el-button :disabled="disabled" v-perms="'/contentShare/aduit'" @click="aduit(ids)">审核
        </el-button>
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
  data() {
    return {
      //过滤参数
      params: {
        title: "",   //标题
        status: "",   //状态
        siteId: "", //共享源站点ID
        targetSiteId:"", //共享目标站点ID
      },
      sites:[],//站点数组
      targetSites:[],//源站点数组
      targetSiteIds:[''],//当前选中目标站点ID数组
      siteIds:[''],//当前选中源站点ID数组
    };
  },methods:{
    aduit(ids){
      this.loading = true;
      axios.post(this.$api.contentShareAduit,{ids,ids}).then(res=>{
        this.loading = false;
        if(res.code == '200'){
          this.successMessage('审核成功');
        }
      }).catch(error => { 
        this.loading = false;
      });
    },
    query(){
      this.params.siteId = this.siteIds[this.siteIds.length-1];
      this.params.targetSiteId = this.targetSiteIds[this.targetSiteIds.length-1];
      this.getTableData(this.params);
    },
    getSite(){
      axios.post(this.$api.siteTree).then(res=>{
        if(res.code == '200'){
          this.sites = [{"name":"共享源站点","id": '',}];
          this.targetSites = [{"name":"共享目标站点","id":'',}];
          this.sites = this.sites.concat(res.body);
          this.targetSites = this.targetSites.concat(res.body);
        }
      })  
    }
  },
  created(){
     this.initTableData(this.$api.contentShareList,this.params);
     this.getSite();
  }
};
</script>

<style scoped>
  .red-color{
    color: red;
  }
  .font-bold{
    font-weight: bold;
  }
</style>