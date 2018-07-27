<template>
  <section v-loading="loading" class="cms-body">
    <section class="tree-left">
      <!-- cms站点tree组件引用 -->
      <cmsSiteTree @node-click="nodeClik"></cmsSiteTree>
    </section>
     <section v-show="dateList" v-loading="loading" class="tree-right">
            <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/site/add','save','0')"
              v-perms="'/globel/site/add'"          
              >添加</el-button>
          </div> 
           <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="domain" label="域名" align="center"></el-table-column>
            <el-table-column prop="accessPath" label="站点访问路径" align="center"></el-table-column>
            <el-table-column prop="name" label="站点名称" align="center"></el-table-column>
            <el-table-column prop="path" label="远程路径" align="center"></el-table-column>
            <el-table-column prop="dynamicSuffix" label="动态页后缀" align="center"></el-table-column>
            <el-table-column prop="staticSuffix" label="动态页前缀" align="center"></el-table-column>
            <el-table-column  label="操作"   align="center">
                  <div slot-scope="scope">
                          <!-- <cms-button type="edit"  ></cms-button>   -->
                          <!-- 可转载站点功能未完成 -->
                          <cms-button type="edit" @click.native="edit(scope.row.id)" v-perms="'/globel/site/edit'"  ></cms-button>   
                         <cms-button type="delete" @click.native="deleteBatch($api.siteDelete,scope.row.id)"  v-perms="'/globel/site/delete'" ></cms-button>
                  </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
            <div class="cms-left">
              <el-button :disabled="disabled" @click="deleteBatch($api.siteDelete,ids)"
                v-perms="'/globel/site/delete'"  
              >批量删除</el-button>
            </div>
            
          </div> 
     </section>

    <section v-show="editTable" class="tree-right">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
              @click="routerLink('/site/add','save','0',{pid:dataInfo.id})"
              v-perms="'/globel/site/add'"          
              >添加</el-button>
          </div> 

         <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="名称" class="flex-50"  prop="name">
               <el-input v-model="dataInfo.name" class="cms-width"></el-input>
            </el-form-item> 
            <el-form-item label="站点简称" class="flex-50"  prop="shortName">
               <el-input v-model="dataInfo.shortName" class="cms-width"></el-input>
            </el-form-item> 
            <el-form-item label="关键字" class="flex-100"  prop="keywords">
               <el-input v-model="dataInfo.keywords" class="cms-width"></el-input>
            </el-form-item> 
            <el-form-item label="描述" class="flex-100"  prop="description">
               <el-input v-model="dataInfo.description" class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="域名" class="flex-50"   prop="domain">
               <el-input v-model="dataInfo.domain" @change="checkDomain" class="cms-width" ></el-input>
               <span class="red" v-show="domainCheck">域名已被其他站点占用</span>
            </el-form-item>
            <el-form-item label="路径" class="flex-50"  prop="path">
               <el-input v-model="dataInfo.path" class="cms-width" ></el-input>
               <span class="gray">各站点资源的存放路径</span>
            </el-form-item>
            <el-form-item label="域名别名" class="flex-50"  >
               <el-input v-model="dataInfo.domainAlias" class="cms-width" ></el-input>
               <span class="gray">多个请用","分开</span>
            </el-form-item>
            <el-form-item label="域名重定向" class="flex-50"  prop="domainRedirect">
               <el-input v-model="dataInfo.domainRedirect" class="cms-width" ></el-input>
               <span class="gray">多个请用","分开</span>
            </el-form-item>
            <el-form-item label="站点访问路径" class="flex-50"  prop="accessPath">
               <el-input v-model="dataInfo.accessPath" @change='checkAccessPath' class="cms-width" ></el-input>
               <span class="red" v-show="accessPathCheck">访问路径已被其他站点占用</span>
               <span class="gray">内网模式下，站点访问路径为必填；反之，非必填</span>
            </el-form-item>
            <el-form-item label="使用相对路径" class="flex-50"  prop="relativePath">
                   <el-radio v-model="dataInfo.relativePath" :label="true">是</el-radio>
                   <el-radio v-model="dataInfo.relativePath" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="访问协议" class="flex-50">
                  <el-select class="cms-width"v-model="dataInfo.protocol">
                      <el-option value="http://" label="http://"></el-option>
                      <el-option value="https://" label="https://"></el-option>
                  </el-select>
            </el-form-item>
             <el-form-item label="动态页后缀" class="flex-50">
                  <el-select class="cms-width"v-model="dataInfo.dynamicSuffix">
                      <el-option value=".jhtml" label=".jhtml"></el-option>
                      <el-option value=".html" label=".html"></el-option>
                  </el-select>
                  <span class="gray">建议使用.Jhtml为后缀，以避免冲突</span>
            </el-form-item>
            <el-form-item label="静态页后缀" class="flex-50">
                  <el-select class="cms-width"v-model="dataInfo.staticSuffix">
                      <el-option value=".html" label=".html"></el-option>
                      <el-option value=".shtml" label=".shtml"></el-option>
                  </el-select>
            </el-form-item>   
            <el-form-item label="静态页目录" class="flex-50"  prop="staticDir">
               <el-input v-model="dataInfo.staticDir" class="cms-width" ></el-input>
               <el-checkbox v-model="dataInfo.indexToRoot" :label="true">使用根目录</el-checkbox>
            </el-form-item>
            <el-form-item label="手机静态页目录" class="flex-50"  prop="staticMobileDir">
               <el-input v-model="dataInfo.staticMobileDir" class="cms-width" ></el-input>
            </el-form-item>
             <el-form-item label="手机静态页同步生成" class="flex-50"  prop="mobileStaticSync">
                   <el-radio v-model="dataInfo.mobileStaticSync" :label="true">是</el-radio>
                   <el-radio v-model="dataInfo.mobileStaticSync" :label="false">否</el-radio>
            </el-form-item>
             <el-form-item label="资源自动同步FTP" class="flex-50"  prop="resouceSync">
                   <el-radio v-model="dataInfo.resouceSync" :label="true">是</el-radio>
                   <el-radio v-model="dataInfo.resouceSync" :label="false">否</el-radio>
            </el-form-item>
             <el-form-item label="静态页自动同步FTP" class="flex-50"  prop="pageSync">
                   <el-radio v-model="dataInfo.pageSync" :label="true">是</el-radio>
                   <el-radio v-model="dataInfo.pageSync" :label="false">否</el-radio>
            </el-form-item>  
            <el-form-item label="静态页同步FTP" class="flex-50">
                   <el-select class="cms-width" v-model="dataInfo.syncPageFtpId">
                        <el-option label="无" value=""></el-option>
                        <el-option v-for="(item,index) in ftpList" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
                   </el-select>
            </el-form-item>  
            <el-form-item label="开启静态首页" class="flex-50"  prop="staticIndex">
                   <el-radio v-model="dataInfo.staticIndex" :label="true">是</el-radio>
                   <el-radio v-model="dataInfo.staticIndex" :label="false">否</el-radio>
            </el-form-item>  
         <!--    <el-form-item label="首页模板" class="flex-50"  prop="tplIndex">
                  <el-select class="cms-width"v-model="dataInfo.tplIndex">
                      <el-option value="">无</el-option>
                      <el-option v-for="(item,index) in tplList" :key="index" :value="item"></el-option>
                  </el-select>
            </el-form-item>  -->
            <el-form-item  label="附件FTP" class="flex-50" >
                   <el-select class="cms-width"v-model="dataInfo.uploadFtpId">
                       <el-option value="" label="无">无</el-option>
                        <el-option v-for="(item,index) in ftpList" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
                   </el-select>
            </el-form-item>                    
            <el-form-item label="开启回收站" class="flex-50"  prop="resycleOn">
                   <el-radio v-model="dataInfo.resycleOn" :label="true">是</el-radio>
                   <el-radio v-model="dataInfo.resycleOn" :label="false">否</el-radio>
            </el-form-item>  
             <el-form-item label="审核后" class="flex-50" prop="afterCheck">
                   <el-select class="cms-width" v-model="dataInfo.afterCheck">
                        <el-option :value="1" label="不能修改删除">不能修改删除</el-option>
                        <el-option :value="2" label="修改后退回">修改后退回</el-option>
                        <el-option :value="3" label="修改后不变">修改后不变</el-option>
                   </el-select>
            </el-form-item> 
            <el-form-item label="是否主站" class="flex-50"  prop="master">
                   <el-radio v-model="dataInfo.master" @change="siteIdCheck" :label="true">是</el-radio>
                   <el-radio v-model="dataInfo.master" @change="siteIdCheck" :label="false">否</el-radio>
                   <span class="red" v-show="siteIdCheckRes">主站点已存在！</span>
            </el-form-item>    
            <el-form-item label="云储存" class="flex-50">
                   <el-select class="cms-width"v-model="dataInfo.ossId">
                        <el-option value="" label="无">无</el-option>
                        <el-option v-for="(item,index) in ossList" :key="index" :value="item.id" :label="item.bucketName"></el-option>                      
                   </el-select>
            </el-form-item> 
             <el-form-item  class="flex-50">
            </el-form-item> 
            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/globel/site/edit'"
                >修改</el-button>
            <el-button type="info" @click="$reset">重置</el-button>
         </div>

         </el-form>   
    </section>
  </section>
</template>
<script>
import listMixin from '@/mixins/form';
import listMixins from '@/mixins/list';
import axios from "axios";
import va from "@/rules";
export default {
  mixins:[listMixins,listMixin],

  data() {
    let self = this;
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    return {
      //过滤参数
      params: {
        querySiteId:'',    //站点
        pageNo: "",        //当前页码
        pageSize: "",      //每页显示条数
        root:'',
      }, 
      ftpList:[],
      ossList:[],
      tplList:[],
      editTable:false,
      dateList:true,
      domainCheck:false,//域名验证
      accessPathCheck:false,//访问路径验证
      siteIdCheckRes:false,//站点验证
      rules: {
        //校验规则
        name: [required],
        shortName: [required],
        path: [required],
        relativePath: [required],
        protocol: [required],
        dynamicSuffix: [required],
        staticSuffix: [required],
        afterCheck: [required],
        master: [required],      
        resycleOn : [required],
        mobileStaticSync:[required],
        resouceSync:[required],
        pageSync:[required],
        staticIndex:[required],
        domain:[required],
        accessPath:[''],

      },
    };
  },
methods:{
      //效验是否存在主站
      siteIdCheck(value){
            if(!value){
                this.siteIdCheckRes=false;
                return false;
            }
            axios.post(this.$api.siteCheckMaster,{siteId:this.params.querySiteId,accessPath:this.dataInfo.accessPath}).then(res =>{
                  if(!res.body.result){
                        this.siteIdCheckRes=true;
                        this.loading = false;
                  }
            }).catch(error => {
                   this.loading = false;
            });
      },
      //效验域名是否重复
      checkDomain(value){
            if(value == ''){
                  this.domainCheck=false;
                  return false;
            }
            axios.post(this.$api.siteCheckDomain,{siteId:this.params.querySiteId,domain:value}).then(res =>{
                      this.loading = false;
                      if(res.body.result){
                           this.domainCheck=false;
                      }else{
                            this.domainCheck=true;
                      }
            }).catch(error => { 
                  this.loading = false;
            });
      },
      //效验访问路径是否重复
      checkAccessPath(value){
            if(value == ''){
                  this.accessPathCheck=false;
                  return false;
            }
            axios.post(this.$api.siteCheckAccessPath,{siteId:this.params.querySiteId,accessPath:value}).then(res =>{
                    if(res.body.result){
                            this.accessPathCheck=false;
                            this.loading = false;
                    }else{
                            this.accessPathCheck=true;
                            this.loading = false;
                    }
            }).catch(error => {
                  this.loading = false;
            });
      },
      update() {    
            if(!(this.domainCheck || this. accessPathCheck || this.siteIdCheckRes)){
                 this.updateDataInfo(this.$api.siteUpdate, this.dataInfo, "");
            }
      },
      //编辑
      edit(updateId){
            this.params.querySiteId=updateId;
            this.getDataInfo();
            this.editTable=true;
            this.dateList=false;
      },
      //获取表格数据
      getTableData(params) {
            this.loading = true;
            this.$http.post(this.listUrl, params).then(res => {
                    if(res.totalCount){
                        this.total = res.totalCount;
                    }
                    this.tableData = res.body;
                    this.loading = false;
                })
            .catch(error => {
                    this.loading = false;
            });
      },
  
       //获取站点信息
       getDataInfo(){
            this.domainCheck=false;
            this.accessPathCheck=false;
            this.siteIdCheckRes=false;
            let api = this.$api; //API地址
            if(this.params.querySiteId===''){
                  this.params.querySiteId=0;
            }
            axios.all([
                  axios.post(api.configGet), //请求全局配置信息
                  axios.post(api.siteGet,{id:this.params.querySiteId,root:''}),
                  axios.post(api.ftpList),   //请求ftp信息
                  axios.post(api.ossList),  //请求oss信息
                  axios.post(api.tplList),   //请求模板信息
            ]).then(
                  axios.spread((config,site,ftps,ossList,tplList)=>{
                         if(config.body.insideSite){
                                this.rules['accessPath']  =  [va.required('此项必填')];
                          }
                          this.dataInfo=site.body;
                          this.ftpList=ftps.body;
                          this.ossList=ossList.body;
                          this.tplList=tplList.body;
                          this.$refs["form"].resetFields();
                          this.loading = false;
                  })
            ) .catch(err => {
                   this.loading = false;
            });
        },
      //节点树节点触发触发函数
      nodeClik(data){
        console.log(data);
        this.params.querySiteId = data.id;
        if(data.hasChild || data.id == ''){
              this.editTable=false;
              this.dateList=true;
              this.params.root = data.id;
              this.getTableData(this.params);
        }else{
               this.editTable=true;
               this.dateList=false;
               this.getDataInfo();
        }    
      },
},
created(){   
      this.initTableData(this.$api.siteList,this.params);
}
};
</script>
<style>
  .tree-left{
    width: 200px;
    float: left;
  }
  .tree-right{
    margin-left: 200px;
  }
  .font-bold{
    font-weight: bold;
  }
  .iconfont{
    color: #409EFF;
  }
  .red-color{
    color: red;
  }
    
</style> 
