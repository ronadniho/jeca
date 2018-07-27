<template>
    <section v-loading="loading" class="cms-body">
           <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form v-show="next" ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item label="菜单名称" class="flex-50"  prop="name">
               <el-input v-model="dataInfo.name" class="cms-width"></el-input>
            </el-form-item>
            <el-form-item label="排列顺序" class="flex-50"  prop="priority">
               <el-input v-model="dataInfo.priority" class="cms-width" type="number"></el-input>
            </el-form-item>
            <el-form-item label="启用" class="flex-50" prop="enable">
                <el-radio-group v-model="dataInfo.enable">
                     <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="工作流" class="flex-50"  prop="workflowId">
                <el-select  class="cms-width" v-model="dataInfo.workflowId">
                        <el-option label="默认" value=""></el-option> 
                        <el-option v-for="item in workflowList" :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>    
                </el-select>
            </el-form-item>
            <el-form-item label="提交表单展示模板" class="flex-50"  prop="submitUrl">
               <el-select  class="cms-width" v-model="dataInfo.submitUrl">
                        <el-option v-for="item in tplList" :key="item.id"
                            :label="item.name"
                            :value="item.name"
                        ></el-option>    
                </el-select>
            </el-form-item>
             <el-form-item label="提交列表展示模板" class="flex-50"  prop="viewUrl">
                <el-select  class="cms-width" v-model="dataInfo.viewUrl">
                        <el-option v-for="item in recordTplList" :key="item.id"
                            :label="item.name"
                            :value="item.name"
                        ></el-option>    
                </el-select>
            </el-form-item>
            <el-form-item label="是否会员菜单" class="flex-50" prop="memberMeun">
                <el-radio-group v-model="dataInfo.memberMeun">
                     <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否全站" class="flex-50" prop="allSite">
                <el-radio-group v-model="dataInfo.allSite">
                     <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
             <el-form-item label="每日限制提交数" class="flex-50"  prop="dayLimit">
               <el-input v-model="dataInfo.dayLimit" type="number" class="cms-width"></el-input>
                <span class="gray"> 默认为0,为0不限制</span>
            </el-form-item>
             <el-form-item label="发起时间范围" class="flex-50" >
            <el-date-picker
                v-model="dateRange"
                type="daterange"
                :editable="false"
                align="right"
                value-format = "yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="changeTime()"
                :picker-options="pickerOptions2" class="cms-width">
                </el-date-picker>
            </el-form-item>     
            <div class="form-footer">
               <el-button type="primary"  @click="nextUpdate()"
                >修改</el-button>
               <el-button type="warning" @click="nextStep()"              
                >下一步</el-button>            
           </div>
        </el-form>
         <div v-show="!next" class="com-box">
            <div class="com-left">
                <h1 class="com-h1">基础组件</h1>
                <ul class="com-ul"> 
                    <li @click="component(1)"> <img src="static/images/form_input.png" alt=""></li>
                    <li @click="component(4)"><img src="static/images/form_area.png" alt=""></li>
                     <li @click="component(6)"><img src="static/images/form_select.png" alt=""></li>
                     <li @click="component(8)"> <img src="static/images/form_radio.png" alt=""></li>
                    <li @click="component(7)"> <img src="static/images/form_checkbox.png" alt=""></li>
                     <li @click="component(5)"> <img src="static/images/form_date.png" alt=""></li>
                    <li @click="component(10)"> <img src="static/images/form_upload.png" alt=""></li>
                    <li @click="component(9)"> <img src="static/images/form_file.png" alt=""></li>      
                </ul> 
            </div>
            <div class="com-right">
                <h1 class="com-view">{{dataInfo.name}} <span>(可上下拖动组件调整显示顺序,双击修改表单信息)</span> </h1>
                  
                  <el-form  ref="form1" class="cms-form" label-width="162px" style="margin:0">                
                  <ul style="width:100%">
                   <li v-for="(item,index) in filedsArray"  class="drag-items" v-on:dblclick="edit(item.id,index)" v-dragging="{ item: item, list: filedsArray, group: 'item'}" :key="index">
                   
                         <div class="com-delete"  @click="deleteIndex(index,item.id)">
                          <cms-button type="delete" ></cms-button>
                          <span>删除</span> 
                      </div>
                      <el-form-item :key='index' :label="item.name" class="flex-100">
                         <!-- 文本框 --> 
                         <el-input v-if="item.type==1" :readonly='true' v-model="item.value" class="cms-width"></el-input>
                          <!-- 电话 --> 
                         <el-input v-if="item.type==11" :readonly='true' v-model="item.value" class="cms-width"></el-input>
                          <!-- 邮箱 --> 
                         <el-input v-if="item.type==12" :readonly='true' v-model="item.value" class="cms-width"></el-input>
                         <!-- 数字 -->
                         <el-input v-if="item.type==2" :readonly='true' v-model="item.value" class="cms-width" type="number"></el-input>     
                         <!-- 浮点形文本 -->
                         <el-input class="cms-width" :readonly='true' v-model="item.value"
                                 v-if="item.type==3"
                         ></el-input>   
                         <!-- 文本 -->
                         <el-input
                          v-if="item.type==4"
                          :readonly='true'
                          type="textarea"
                          :rows="3"
                          placeholder="请输入内容"
                          v-model="item.value">
                        </el-input>   
                        <!-- 复选框 -->  
                        <el-checkbox-group :readonly='true' v-model="item.value"  
                            v-if="item.type==7">
                                <el-checkbox 
                                v-for="(opt,optIndex) in item.optValue" :key="optIndex"                
                                :label="opt"></el-checkbox> 
                        </el-checkbox-group>        
                        <!-- 单选框 -->
                        <el-radio-group :readonly='true'  v-model="item.value"  
                            v-if="item.type==8">
                                <el-radio :label="opt"  v-for="(opt,optIndex) in item.optValue" :key="optIndex" >                   
                           </el-radio>    
                        </el-radio-group > 
                         <!-- 日期 -->
                        <el-date-picker :readonly='true' class="cms-width" v-model="item.value" 
                                type="date" value-format="yyyy-MM-dd"
                                v-if="item.type==5"
                        ></el-date-picker>    
                         <!-- 自定义图片-->
                        <el-button type="primary" v-if="item.type==10">上传图片</el-button>
                         <!-- 下拉列表 -->
                        <el-select :disabled='true' class="cms-width" v-model="item.value" 
                                    v-if="item.type==6">
                            <el-option v-for="(opt,optIndex) in item.optValue" :key="optIndex"
                                    :label="opt" :value="opt">
                            </el-option>
                        </el-select>     
                        <el-button type="primary" v-if="item.type==9">上传附件</el-button>
                      </el-form-item>
                    </li> 
                    </ul>  
                  </el-form>
                  <div class="form-footer">
                           <el-button type="primary" @click="publish()" >发布</el-button>
                  </div>
            </div>
        </div>
       <!-- 选择字段弹窗 -->
      <el-dialog
        title="请添加字段"
        :visible.sync="dialogVisible"
        width="30%"
        >
       <el-form ref='formSave' :model='saveForm' :rules="rules" label-width="80px"  >
           <el-form-item label="字段"  prop="field">
                <el-input v-model="saveForm.field"></el-input>
            </el-form-item>
            <el-form-item label="名称"  prop="label">
                <el-input  v-model="saveForm.label" ></el-input>
            </el-form-item>
             <el-form-item label="数据类型:" prop="dataType">
               <el-select v-model="saveForm.dataType"  :disabled="isCheck" style="width:100%">
                  <el-option label="字符串文本" :value="1"></el-option>
                  <el-option label="整形文本" :value="2"></el-option>
                  <el-option label="浮点形文本" :value="3"></el-option>
                   <el-option label="电话" :value="11"></el-option>     
                  <el-option label="邮箱" :value="12"></el-option>
                  <el-option label="文本区" :value="4"  :disabled="true"></el-option>
                  <el-option label="日期" :value="5"  :disabled="true"></el-option>
                  <el-option label="下拉列表" :value="6"   :disabled="true"></el-option>
                  <el-option label="复选框" :value="7"  :disabled="true"></el-option>
                  <el-option label="单选框" :value="8"  :disabled="true"></el-option>
                  <el-option label="附件" :value="9"  :disabled="true"></el-option>
                  <el-option label="图片" :value="10"  :disabled="true"></el-option>                                    
               </el-select>
            </el-form-item>  
            <el-form-item label="默认值"  prop="defValue">
                <el-input  v-model="saveForm.defValue" ></el-input>
            </el-form-item>
             <el-form-item label="可选项:" class="flex-100"  prop="optValue" >
               <el-input  v-model="saveForm.optValue" class="cms-width"></el-input> 
                <span class="gray">多个值用","分开</span> 
            </el-form-item> 
            <el-form-item label="描述"  prop="description">
                <el-input  v-model="saveForm.description" ></el-input>
            </el-form-item>
             <el-form-item v-show="saveForm.dataType!=4&&saveForm.dataType!=7&&saveForm.dataType!=9&&saveForm.dataType!=10" label="列表展示"  prop="displayInList">
                <el-radio v-model="saveForm.displayInList" :label="true">是</el-radio>
                <el-radio v-model="saveForm.displayInList" :label="false">否</el-radio>
                <span class="gray">选是会在提交记录列表中展示</span> 
            </el-form-item> 
            <el-form-item label="是否必填"  prop="required">
                <el-radio v-model="saveForm.required" :label="true">是</el-radio>
                <el-radio v-model="saveForm.required" :label="false">否</el-radio>
            </el-form-item>     
       </el-form>  
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ok()">确 定</el-button>
        </span>
      </el-dialog>

       <!-- 修改字段弹窗 -->
      <el-dialog
        title="修改字段"
        :visible.sync="dialogEdit"
        width="30%"
        >
         <el-form ref='formEdit' :model='editObj' :rules="rules" label-width="80px"  >
            <el-form-item label="字段">
                <el-input :readonly='true' v-model="editObj.field" ></el-input>
            </el-form-item>
            <el-form-item label="名称"  prop="label">
                <el-input  v-model="editObj.label" ></el-input>
            </el-form-item>
            <el-form-item label="默认值"  prop="defValue">
                <el-input  v-model="editObj.defValue" ></el-input>
            </el-form-item>
            <el-form-item label="可选项:" class="flex-100"  prop="optValue" >
               <el-input  v-model="editObj.optValue" class="cms-width"></el-input> 
                <span class="gray">多个值用","分开</span> 
            </el-form-item> 
            <el-form-item label="描述"  prop="description">
                <el-input  v-model="editObj.description" ></el-input>
            </el-form-item>
             <el-form-item v-show="editObj.dataType!=4&&editObj.dataType!=7&&editObj.dataType!=9&&editObj.dataType!=10" label="列表展示"  prop="displayInList">
                <el-radio v-model="editObj.displayInList" :label="true">是</el-radio>
                <el-radio v-model="editObj.displayInList" :label="false">否</el-radio>
                <span class="gray">选是会在提交记录列表中展示</span> 
            </el-form-item> 
             <el-form-item label="是否必填"  prop="required">
                <el-radio v-model="editObj.required" :label="true">是</el-radio>
                <el-radio v-model="editObj.required" :label="false">否</el-radio>
            </el-form-item>
           
        </el-form>  

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogEdit = false">取 消</el-button>
          <el-button type="primary" @click="update()">确 定</el-button>
        </span>
      </el-dialog>
    </section> 
</template>

<script>
import listMixins from '@/mixins/form';
import axios from "axios";
import api from "@/api/api";
import VueDND from 'awe-dnd';
import va from "@/rules";
export default {
    mixins:[listMixins],
  data() {  
    let required = va.required();
    let string=va.string('只能输入字母');
    return {
      params: {//只需要业务参数
          modelId: 88,
          isChannel: false, //是否为栏目模型
          modelName:'',
      },
      tplParams:{//模板参数
        pageNo: 1,
        pageSize: 20,
        root: "/WEB-INF/t/cms/www/default/custom_form"
      },
      recordTplParams:{//记录模板参数
        pageNo: 1,
        pageSize: 20,  
        root: "/WEB-INF/t/cms/www/default/custom_record"
      },
      customId:'',
      rules: {
           name:[required],
           label:[required],
           viewUrl:[required],
           submitUrl:[required],
           priority:[required],
           field:[required,string],
           dayLimit:[required],
      },
      dialogVisible:false,
      dialogEdit:false,
      next:true,
      dateRange:[],
      filedsArray:[],
      fileds:[],
      tplList:[],//模板列表
      recordTplList:[],//记录模板列表
      editObj:'',
      saveForm:{},
      workflowList:[],
      editIndex:'',
      value:'',
       isCheck:false,
       pickerOptions2: {
        shortcuts: [{
          text: "最近一周",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: "最近一个月",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text:"最近三个月",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  methods:{
    getDataInfo(id){
        let api = this.$api; //API地址  
         axios
        .all([
            axios.post(api.customFormGet, {id:id}), //axios批量发送请求
            axios.post(api.workflowList, { pageSize: 0, pageNo: 10 }),
            axios.post(api.customFiledList,{formId:this.id}),
            axios.post(api.templateList,this.tplParams), //模板
            axios.post(api.templateList,this.recordTplParams), //记录模板
        ])
        .then(
            axios.spread((res,workflows,fileds,tplAll,recordTpl)=>{
                this.dataInfo=res.body;
                if(res.body.endTime!=''){
                    this.dateRange.push(res.body.startTime)
                    this.dateRange.push(res.body.endTime)
                }
                this.workflowList = workflows.body; //工作流
                this.tplList= tplAll.body; //自定义表模板
                this.recordTplList= recordTpl.body; //自定义表记录列表模板
                this.filedsArray=[];
                for(let x in fileds.body){
                    let obj={field:'',value:'',name:'',type:'',priority:'',required:'',optValue:'',id:'',displayInList:''}; 
                    obj.field=fileds.body[x].field;   
                    obj.name=fileds.body[x].label;
                    obj.type=fileds.body[x].dataType; 
                    obj.priority=fileds.body[x].priority;
                    obj.required=fileds.body[x].required; 
                    obj.displayInList=fileds.body[x].displayInList; 
                    obj.id=fileds.body[x].id;  
                    if(fileds.body[x].dataType==7){
                        obj.value=fileds.body[x].defValue.split(',');                        
                    }else{
                        obj.value=fileds.body[x].defValue;  
                    }  
                    obj.optValue=fileds.body[x].optValue;       
                    this.filedsArray.push(obj);    
                }
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
       
    },
    component(val){
       //dataType:1 字符串文本  2 整形文本 3 浮点形文本
       // 4 文本区 5 日期 6 下拉列表 7 复选框
       // 8 单选框 9 附件 10 图片 11 电话 12 邮箱
      this.loading = true; 
       if(val==1){
        this.isCheck=false
    }else{
        this.isCheck=true
    }  
      axios.post(this.$api.customFiledGet,{id:0}).then(res=>{
          res.body.dataType=val;
          this.saveForm=res.body;
          this.loading = false;
      }).catch(err=>{
          this.loading = false;
      })    
      this.dialogVisible=true;
      
    },
    ok(){ 
        let form = this.$refs['formSave'];
        form.validate((valid) => {//验证方法
            if (valid) {
                this.loading = true;
                this.saveForm.formId=this.customId;
                axios.post(this.$api.customFiledSave,this.saveForm).then(res=>{
                    if (res.code == "200") {
                        let obj={field:'',value:'',name:'',type:'',priority:'',required:'',optValue:'',id:'',displayInList:''}; 
                        obj.field=this.saveForm.field;   
                        obj.name=this.saveForm.label;
                        obj.type=this.saveForm.dataType; 
                        obj.priority=this.saveForm.priority;
                        obj.required=this.saveForm.required;  
                        obj.displayInList=this.saveForm.displayInList;
                        obj.id=res.body.id; 
                        if(this.saveForm.dataType==7||this.saveForm.dataType==8||this.saveForm.dataType==6){
                            if(this.saveForm.dataType==7){
                                obj.value=this.saveForm.defValue.split(',');  
                            }else{
                                obj.value=this.saveForm.defValue;  
                            }
                            obj.optValue=this.saveForm.optValue.split(','); 
                        }else{
                            obj.value=this.saveForm.defValue;  
                            obj.optValue=this.saveForm.optValue;    
                        }       
                        this.filedsArray.push(obj);              
                    }
                    this.loading = false;
                    this.dialogVisible=false;
                }).catch(err=>{
                    this.loading = false;
                })      
            } else {
                return false
            }
        })   

    },
    deleteIndex(index,id){
        this.loading = true;
        axios.post(this.$api.customFiledDelete,{ids:id}).then(res=>{  
            if (res.code == "200") {
                this.filedsArray.splice(index,1)
                this.loading = false;
            }    
        }).catch(err=>{
            this.loading = false;
        })      
    },
    nextStep(){
            if(this.dateRange==null){
                this.dataInfo.startTime='';
                this.dataInfo.endTime='';
            }
            this.loading = true;
            let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
              if (valid) {
                axios.post(this.$api.customFormUpdate,this.dataInfo).then(res=>{               
                    this.next=false 
                    this.loading = false;
                }).catch(err=>{
                    this.loading = false;
                })
                  
              }else {
                    this.loading = false;
                    return false
              }   
            })  
    },
    nextUpdate(){//修改返回列表页
             if(this.dateRange==null){
                this.dataInfo.startTime='';
                this.dataInfo.endTime='';
            }
            this.loading = true;
            let form = this.$refs['form'];
            form.validate((valid) => {//验证方法
              if (valid) {
                axios.post(this.$api.customFormUpdate,this.dataInfo).then(res=>{               
                   if (res.code == "200") {
                        this.successMessage('修改成功');
                        setTimeout(() => {
                            this.routerLink("list");
                        }, 1000)                    
                    }
                }).catch(err=>{
                    this.loading = false;
                })       
              }else {
                    this.loading = false;
                    return false
              }   
            })  
    },
    publish(){
        let ids=[];
        let prioritys=[];
        let backUrl='list';
        for(let x in this.filedsArray){
            ids.push(this.filedsArray[x].id)
            prioritys.push(parseInt(x)+1)
        }
        ids=ids.join(',');
        prioritys=prioritys.join(',');
        this.loading = true;
        if(ids.length>0){
            axios.post(this.$api.customFiledPriority, {ids:ids,priorities:prioritys}).then(res => {
                    this.loading = false;
                    if (res.code == "200") {
                        this.successMessage('修改成功');
                        if(backUrl==''){
                            return false;
                        }else{
                            setTimeout(() => {
                                this.routerLink(backUrl);
                            }, 1000);
                        }
                        
                    }
            }).catch(error => { this.loading = false; })
        }else{
            this.routerLink("list");
        }    

    },
    changeTime(){
        this.dataInfo.startTime=this.dateRange[0];
        this.dataInfo.endTime=this.dateRange[1]
    },
    edit(val,index){
        this.loading = true;
        this.editObj='';
        axios.post(this.$api.customFiledGet, { id: val }).then(res=>{
            this.editObj=res.body; 
            this.editIndex=index; 
            this.dialogEdit=true;  
            this.loading = false;
        }).catch(err=>{
            this.loading = false;
        })
    },
    update(){
        let form = this.$refs['formEdit'];
            form.validate((valid) => {//验证方法
                if (valid) {
                    this.loading = true;
                    this.editObj.formId=this.customId;
                    axios.post(this.$api.customFiledUpdate, this.editObj)
                        .then(res => {
                            this.loading = false;
                            if (res.code == "200") {
                                this.dialogEdit=false;  
                                this.filedsArray[this.editIndex].name=this.editObj.label;                              
                                this.filedsArray[this.editIndex].required=this.editObj.required;
                                this.filedsArray[this.editIndex].description=this.editObj.description;
                                this.filedsArray[this.editIndex].displayInList=this.editObj.displayInList; 
                                if(this.editObj.dataType==7||this.editObj.dataType==8||this.editObj.dataType==6){
                                    if(this.editObj.dataType==7){
                                        this.filedsArray[this.editIndex].value=this.editObj.defValue.split(',');  
                                    }else{
                                        this.filedsArray[this.editIndex].value=this.editObj.defValue;  
                                    }
                                        this.filedsArray[this.editIndex].optValue=this.editObj.optValue.split(','); 
                                }else{
                                    this.filedsArray[this.editIndex].value=this.editObj.defValue;  
                                    this.filedsArray[this.editIndex].optValue=this.editObj.optValue;    
                                }                             
                            }
                    }).catch(error => { this.loading = false; })
                } else {
                    return false
                }
        })
    },
   



  },
  created(){
       this.customId=this.id;
       this.getDataInfo(this.id);
  },
   mounted(){
        let clientHeight=document.body.clientHeight;
          $('.com-left').css('minHeight',(clientHeight-110)+'px');
   }
};
</script>
    
   
<style scoped>
.com-box{
 min-height: 100%;
 overflow: hidden;
}

.com-left {
  width: 280px;
  float: left;
    height: 100%;
  border-right: 1px solid lightGray;
}
.com-right {
margin-left: 280px;
 padding: 0 20px;
}
.com-right .cms-form .el-form-item{
 border: none;
}
.com-h1 {
    width: 100%;
    background: #f7f7f7;
    font-size: 14px;
    color: #656565;
   text-align: center;
   font-weight:500;
   height: 46px;
   line-height: 46px;
}
.com-view{
    font-weight:500;
    width: 100%;
    height: 46px;
    color: #656565;
    font-size:14px;
    line-height: 46px;
    border-bottom: 1px dashed #e7ecf3;
}
.com-view span{
  font-size: 12px;
  color: #999;
}
.com-ul {
  text-align: center;  
  border-left: 1px solid #d9dfe2;
}
.drag-items{
    cursor: pointer;
    position: relative;
    border: 1px dashed transparent;
}
.drag-items:hover{
    background: #f6fbfd;
    border: 1px dashed #e4f0f6;
}
.com-delete {
   position: absolute;
    right:25px;
    top: 19px;
    z-index: 666;
}
.com-delete >span{
    font-size: 12px;
    color: #656565;
    position: relative;
    top: 2px;
}
.com-width {
  
}
.com-left li {
  float: left;
  width: 70px;
  height: 70px;
  margin: 10px 5px 10px 10px;
  box-sizing: border-box;
  cursor: pointer;
}
.com-ul li:hover {
  border: 1px solid #cde3ed;
  background: #f6fbfd;
}
</style>