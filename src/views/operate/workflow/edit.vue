<template>
  <section class="cms-body" v-loading="loading">
    <!-- 返回组件 -->
    <cms-back></cms-back>        
    <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
        <!-- 工作流名称 -->
        <el-form-item label="名称" class="flex-100 "  prop="name">
          <el-input class="cms-width" v-model="dataInfo.name"> </el-input>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="描述" class="flex-100" >
          <el-input v-model="dataInfo.description" class="cms-width" type="textarea" ></el-input>
        </el-form-item>
         <!-- 排序 -->
        <el-form-item label="排序" class="flex-50 "  prop="priority">
          <el-input class="cms-width" v-model="dataInfo.priority" type="number"> </el-input>
        </el-form-item>
        <el-form-item class="flex-50 "  >
        </el-form-item>
        <!-- 是否可以跨级审核 -->
        <el-form-item label="是否可以跨级审核" class="flex-100 "  prop="cross">
          <el-radio-group v-model="dataInfo.cross"  class="cms-width"> 
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>  
        </el-form-item>
        <!-- 工作流步骤 -->
        <el-form-item label="工作流步骤" class="flex-100 ">
          <el-button @click="setpAdd">增加</el-button> 
        </el-form-item>
        <section class="flex-100 ftp-div flex-no-border " v-show="ftp_div_show" >
          <section class="ftp-item cms-col10">
             <div class="cms-col10 ">
              <div class=" cms-col1 ">
                步骤
              </div>
              <div class="cms-col3">
                角色
              </div>
              <div class="cms-col3">
                类型
              </div>
              <div class="cms-col1">
                操作
              </div>
            </div>
            <div class="cms-col10 " v-for="(item,index) in setps" :key="index">
              <div class=" cms-col1 ">
                第
                {{index+1}}
                步
              </div>
              <div class="cms-col3">
                <el-select  v-model="setps[index].roleId" class="cms-col7">
                 <el-option v-for="(item1,index1) in roles" :key="index1" :label="item1.name" :value="item1.id"></el-option>
                </el-select>
              </div>
              <div class="cms-col3">
                <el-radio-group v-model="setps[index].countersign" class="cms-col10" > 
                  <el-radio :label="true">会签</el-radio>
                  <el-radio :label="false">普通流转</el-radio>
                </el-radio-group> 
              </div>
              <div class="cms-col1">
                <cms-button type="delete" @click.native="setpDelete(index)" >
                </cms-button>
              </div>
            </div>
            <div class="cms-col10 gray">
              说明：会签表示需要所选角色中所有用户都审核才能进入下一步，普通流转则只需要其中任意一个用户审核就能进入下一步。
            </div>
          </section>
        </section>
        <!-- 按钮组 -->
        <div class="form-footer">
            <el-button type="warning" v-if="isType('save')"    @click="add(true)" v-perms="'/workflow/save'">
              提交并继续添加
            </el-button>
            <el-button type="primary" v-if="isType('save')" @click="add(false)"v-perms="'/workflow/save'">
              提交
            </el-button>
            <el-button type="primary" v-if="isType('update')" @click="update()"v-perms="'/workflow/update'">
              修改
            </el-button>
            <el-button type="info" @click="$reset">重置</el-button>
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
    let required = va.required('此项必填');
    let number = va.number('必须为数字');
    return {
      dataInfo:{
      },
      setps:[],
      roles:[],
      defaultRole:{},
      ftp_div_show:false,
      rules: {//校验规则
        name:[required],
        priority:[required,number],
        cross:[required],
      }
    };
  },
  methods: {
    getParam(){
      let roleIds = [];
      let countersigns = [];
      if(this.setps.length > 0){
        for(let item of this.setps){
          roleIds.push(item.roleId);
          countersigns.push(item.countersign);
        }
        this.dataInfo.roleIds = roleIds.join(',');
        this.dataInfo.countersigns = countersigns.join(',');
      }
      delete this.dataInfo.events;
      delete this.dataInfo.nodes;
    },
    getDataInfo(id) {//重写获取表单数据
      let api = this.$api; //API地址
      axios.post(this.$api.workflowGet,{id:id})
        .then(res => {
          this.loading = false;
          this.dataInfo = res.body; 
          axios.post(this.$api.roleList).then(res=>{
            if(res.code == '200'){
              this.roles = res.body;
              if(res.body.length > 0 ){
                this.defaultRole =  res.body[0];
              }
            }
          });
          if(res.body.nodes.length > 0 ){
            this.setps =  res.body.nodes;
            this.ftp_div_show = this.setps.length > 0 ?true:false;
          }
        }).catch(err => {
          this.loading = false;
        });
    },
    update(state) {
      this.getParam();
      this.updateDataInfo(this.$api.workflowUpdate, this.dataInfo, "list");
    },
    add(state) {
      this.getParam();
      this.saveDataInfo(state,this.$api.workflowSave, this.dataInfo, "list");
    },
    setpDelete(index){
      this.setps.splice(index,1);
      this.ftp_div_show = this.setps.length > 0 ?true:false;
    },
    setpAdd(){
      this.setps.push({countersign: false, roleId:this.defaultRole.id,roleName:this.defaultRole.name});
      this.ftp_div_show = this.setps.length > 0 ?true:false;
    }
  },
  created() {
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style scoped>
.el-input-group{
  width: 20%;
} 
.cms-body .cms-form .flex-100,.cms-body .cms-form .flex-50{
  border-top: 1px dashed #eee;
}
.cms-body .cms-form .flex-no-border{
 border-top: 0px dashed #eee; 
}
.cms-body .cms-col1{
  width: 10%
}
.cms-body .cms-col2{
  width: 20%
}
.cms-body .cms-col3{
  width: 30%
}
.cms-body .cms-col4{
  width: 40%
}
.cms-body .cms-col5{
  width: 50%
}
.cms-body .cms-col6{
  width: 60%
}
.cms-body .cms-col7{
  width: 70%
}
.cms-body .cms-col8{
  width: 80%
}
.cms-body .cms-col9{
  width: 90%
}
.cms-body .cms-col10{
  width: 100%
}
.ftp-div{
  padding: 15px 0 15px 162px;
  box-sizing: border-box;
  font-size: 14px;
}
.ftp-item{
  background-color: #fbfdff;
  border: 1px #eee dotted;
  padding: 15px 15px ;
}
.ftp-item{
  line-height:50px;
}
.ftp-item > div >div{
  display: inline-block;
}
.gray{
  font-size: 14px;
}
</style>
