<template>
  <section v-if="reload" >
     <!-- 返回组件 -->
    <cms-back></cms-back>      
     <div class="cms-list-header">
          <el-button type="primary" icon="el-icon-plus" @click="routerLink('/department/add','save',0,{pid:selectDepartments})">添加</el-button> 
      </div> 
    <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
          <el-form-item label="上级部门" class="flex-50"  prop="selectDepartments">
            <el-cascader
              :props="{'value':'id','label':'name','children':'child'}"
              :options="departments"
              change-on-select
              filterable
              v-model="selectDepartments" class="cms-width">
            </el-cascader>
         </el-form-item>
          <el-form-item label="部门名称" class="flex-50"  prop="name">
                 <el-input v-model="dataInfo.name" class="cms-width" ></el-input>
         </el-form-item>   
          <el-form-item label="排序" class="flex-50"  prop="priority">
                <el-input v-model="dataInfo.priority" class="cms-width" type="number"></el-input>
         </el-form-item> 
         <el-form-item label="留言审核权限" class="flex-50"  prop="ctgs">
            <el-checkbox-group v-if="guessbookTypes.length > 0" v-model="selectCtgs">
                <el-checkbox v-for="(item,index) in guessbookTypes" :label="guessbookTypes[index].id" :key="guessbookTypes[index].id">{{guessbookTypes[index].name}}</el-checkbox>
            </el-checkbox-group>
         </el-form-item> 
         <el-form-item label="栏目权限" class="flex-50"  prop="channelIds">
              <div style="min-height: 400px">
                 <cms-site-dialog v-if="flag" :expandAll="true"  @change="getChannels" ref="channelTree" :checkIds="dataInfo.channelIds" showCheck="channel" :isFilterCurrentSite="false" :isAnsy="false"></cms-site-dialog>
              </div>
         </el-form-item> 
         <el-form-item label="栏目权限控制" class="flex-50" prop="controlChannelIds">
                <div style="min-height: 400px">
                     <cms-site-dialog v-if="flag" :expandAll="true" @change="getControlChannels" :checkIds="dataInfo.controlChannelIds" showCheck="channel" :isFilterCurrentSite="false" :isAnsy="false"></cms-site-dialog>
                </div>
         </el-form-item> 
         <div class="form-footer">
               <el-button type="primary" v-if="isType('update')" @click="update()"
                  v-perms="'/department/update'"
               >修改</el-button>
                <el-button type="info" @click="reset">重置</el-button>
                <span class="gray" v-if="isType('save')">选择“提交并继续添加”按钮会停留在添加页面；选择“提交”按钮后将跳转到对应的列表页</span> 
         </div>
    </el-form>
</section>
</template>
<script>
import axios from "axios";
import va from "@/rules";
import formMixns from "@/mixins/form";
export default {
  mixins: [formMixns], //普通表单变量
  data() {
    let self = this;
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    return {
      rules: {//校验规则
          name:[required],
          priority:[required,number],
          name:[required],
          controlChannelIds:[required],
          channelIds:[required],
      },
      
      departments:[],
      flag:true,
      guessbookTypes:[],
      selectDepartments:[],
      selectCtgs:[],
      reload:true
    };
  },
  methods: {
    getControlChannels(arr){
        this.dataInfo.controlChannelIds = arr;
    },
    getChannels(arr){
      this.dataInfo.channelIds = arr;
    },
    getDataInfo(id) {//重写获取表单数据
      let api = this.$api; //API地址
      axios.post(api.departmentGet, { id: id }).then(res => {
          this.loading = false;
          this.dataInfo = res.body; 
          this.selectDepartments = this.dataInfo.parents;
          if(this.dataInfo.parents.length > 0 ){
              this.selectDepartments.splice(this.selectDepartments.length-1,1) ;  
          }
          if(this.dataInfo.parents.length == 0){
              this.selectDepartments = [''];
          }
          let ctgs = this.dataInfo.ctgs;
          if(ctgs.length > 0){
              for(let obj of ctgs){
                  this.selectCtgs.push(obj.id);
              }
          }
          this.dataInfo.channelIds = this.formateChannelIds(this.dataInfo.channels);
          this.dataInfo.controlChannelIds = this.formateChannelIds(this.dataInfo.controlChannels);
          this.getDepartment();
        }).catch(err => {
          this.loading = false;
        });
    }, 
    formateChannelIds(channels){
      let ids = []
      for(let item of channels){
          ids.push(item.channelId);
      }
      return ids;
    } , 
    formateControllerChannelIds(channels){
      let ids = []
      for(let item of channels){
          ids.push(item.channelId);
      }
      return ids;
    },
    getGuessbookType(){
        axios.post(this.$api.guestbookTypeList).then(res=>{
            if(res.code == '200'){
                this.guessbookTypes = res.body;
            }
        })
    },
    getDepartment(){
        axios.post(this.$api.departmentTree).then(res=>{
            if(res.code == '200'){
                res.body.unshift({id:'',name:"根目录",pid:"",priority:0,weights:1});
                this.departments  =  res.body;
                this.filterDepartment(this.departments);
            }
        })
    },
    getparam(){
      let obj = {};
      obj.id = this.dataInfo.id;
      obj.name = this.dataInfo.name;
      obj.priority = this.dataInfo.priority;
      obj.channelIds = this.dataInfo.channelIds.join(',');
      obj.controlChannelIds = this.dataInfo.controlChannelIds.join(',');
        if(this.selectDepartments.length > 0){
            obj.pid = this.selectDepartments[this.selectDepartments.length-1];
        }
        if(this.selectCtgs.length > 0){
            obj.ctgIds = this.selectCtgs.join(',');
        }
        return obj;
    },
    filterDepartment(departments){
        for (let i in  departments){
            if(departments[i].id == this.dataInfo.id){
                departments.splice(i,1);
            }
        }
    },
    update() {
      this.updateDataInfo(this.$api.departmentUpdate, this.getparam(), "list");
    },
    reset(){
      //初始获取数据
      this.getDataInfo(this.id);
      this.getGuessbookType();
      this.flag=false;
      setTimeout(() => {      
          this.flag=true;
      }, 10);
     
    },
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
    this.getGuessbookType();
  },
  watch:{
    $route: function(to, from) {
      this.reload=false;
      this.flag=false;
      setTimeout(() => {
            this.getDataInfo(this.$route.query.id);
    this.getGuessbookType();
         this.reload=true 
         this.flag=true
        
      }, 5);
    }
  }
};
</script>
<style>
</style>
