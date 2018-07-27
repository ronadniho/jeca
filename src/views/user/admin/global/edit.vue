<template>
   <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back> 
        <el-form ref="form" class="cms-form" label-width="162px" :model="dataInfo"  :rules="rules">
            <el-form-item label="用户名" class="flex-50"  prop="username">
                 {{dataInfo.username}}       
            </el-form-item> 
            <el-form-item label="电子邮箱" class="flex-50"  prop="email">
                  <el-input v-model="dataInfo.email" class="cms-width"></el-input>
            </el-form-item>     
            <el-form-item label="密码" class="flex-50" prop="password">
                <el-input v-model="dataInfo.password" class="cms-width" type="password"></el-input>              
                <span class="gray">不修改请留空</span>
            </el-form-item>
            <el-form-item label="确认密码" class="flex-50"  prop="confirmPassword">
                <el-input v-model="dataInfo.confirmPassword" class="cms-width" type="password"></el-input>
                <span class="gray">不修改请留空</span>
            </el-form-item>
             <el-form-item label="会员组" class="flex-50" prop="groupId">
                <el-select v-model="dataInfo.groupId" class="cms-width">
                <el-option 
                v-for="(item,index) in memberGroup" 
                :key="index"
                :label="item.name"
                :value="item.id"
                ></el-option>
                </el-select>
            </el-form-item>  
            <el-form-item label="等级" class="flex-50"  prop="rank">
                <el-input v-model="dataInfo.rank" class="cms-width" type="number"></el-input>
                <span class="gray">越大等级越高</span> 
            </el-form-item>
            <el-form-item label="禁用" class="flex-50" prop="disabled">
                <el-radio-group v-model="dataInfo.disabled">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="登录次数" class="flex-50"  prop="loginCount">
                {{dataInfo.loginCount}} 
            </el-form-item>
            <el-form-item label="注册" class="flex-50"  prop="loginCount">
                {{dataInfo.registerTime}} {{dataInfo.registerIp}} 
            </el-form-item>
            <el-form-item label="最后登录" class="flex-50"  prop="lastLoginTime">
                {{dataInfo.lastLoginTime}} 
            </el-form-item>
            <el-form-item label="真实姓名" class="flex-50"  prop="realname">
                <el-input v-model="dataInfo.realname" class="cms-width" type="username"></el-input> 
            </el-form-item>
            <el-form-item label="	性别" class="flex-50"  prop="gender">
                <el-radio-group v-model="dataInfo.gender">
                    <el-radio :label="true">男</el-radio>
                    <el-radio :label="false">女</el-radio>
                </el-radio-group> 
            </el-form-item>
            <el-form-item label="受限管理员" class="flex-100"  prop="selfAdmin">
                <el-radio-group v-model="dataInfo.selfAdmin">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group> 
                <span class="gray">只能管理自己的数据</span> 
            </el-form-item>
            <el-form-item label="角色" class="flex-100"  prop="roleIds">
                <el-checkbox-group v-model="dataInfo.roleIds" @change="getRoleIds">
                    <el-checkbox v-for="(item,index) in roles" :key="index" :label="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <span class="gray">功能权限的控制在角色中</span> 
            </el-form-item>
          <el-form-item label="部门" class="flex-50" >      
                  <!-- 部门选择 -->
                 <el-cascader
                :options="departmentList"
                 v-model="parents"
                  :props="defaultProps"
                  :change-on-select="true"
                 class="cms-width"></el-cascader>
                <span class="gray">内容管理和栏目管理权限集中控制在部门管理中</span> 
            </el-form-item>
     <el-form-item  class="flex-50" ></el-form-item>   
            <el-form-item label="站群权限" class="flex-100" >      
                  <!-- 部门选择 -->           
        <el-button @click="dialogVisible=true">站群权限</el-button>
            <!-- 展区权限弹窗 -->
          <el-dialog title="站群权限设置"  :visible.sync="dialogVisible" >
            <div class="channels-box" >
                <el-checkbox-group v-model="siteIds" class="pull-left check-vertical" >
                    <el-checkbox v-for="(item,index) in siteList" :key="index" :label="item.id" 
                    @change="getSiteIds(item.id,index)"
                   
                    >{{item.name}}</el-checkbox>
                  </el-checkbox-group>                  
                  <div class="pull-left">
                    <div class="cms-channels" v-for="(item,index) in siteList" :key="index">
                       <el-checkbox v-model="allChannels[index]" :disabled="siteIds.indexOf(item.id)=='-1'">所有栏目内容权限</el-checkbox>
                       <el-checkbox v-model="allControlChannels[index]" :disabled="siteIds.indexOf(item.id)=='-1'">所有栏目控制权限</el-checkbox> 
                    </div>
                  </div>
              </div>     
              <div class="form-footer">               
                 <el-button @click='dialogVisible=false'>确定</el-button>  
              </div>  
            </el-dialog>
                <span class="gray"></span> 
   </el-form-item> 


            <div class="form-footer">
                <el-button type="primary"  @click="update()"
                    v-perms="'/adminGlobal/edit'"
                >修改</el-button>
                <el-button type="info" @click="$reset">重置</el-button>
         </div>
    </el-form>
      

   </section>
</template>

<script>
import listMixins from '@/mixins/form';
import axios from "axios";
import va from "@/rules";
import api from "@/api/api";
export default {
    mixins:[listMixins],
  data() {
       function password() {
      return {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback();
          } else {
            if (self.dataInfo.confirmPassword !== "") {
              self.$refs.form.validateField("confirmPassword");
            }
            callback();
          }
        },
        trigger: "blur"
      };
    }
    function confirmPassword() {
      return {
        validator: (rule, value, callback) => {
          if (value === "") {
            callback();
          } else if (value !== self.dataInfo.password) {
            callback(new Error('前后密码不一致'));
          } else {
            callback();
          }
        },
        trigger: "blur"
      };
    }
      function rank() {//用户名验证
    return {
        validator: (rule, value, callback) => {
                if(value!=''){
                         axios.post(api.adminValRank,{id:'',rank:value}).then(res=>{
                if(value==''){
                     callback();    
                }else{
                    if(res.code=='200'){
                    if (!res.body.result){
                        callback(new Error('不能大于自身级别'))
                    }else{
                        callback();      
                    } 
                }else{
                    callback(new Error('服务器响应异常'));  
                }
                }
                      
            })
         }   
        }, trigger: 'blur'
      }
   }
    let self = this;
    let required = va.required('此项必填');
    let number = va.number('只能输入数字');
    let email = va.email('请输入正确的邮箱地址');
    let validateName = va.validateName('用户名已存在');
    let tel = va.tel('请输入正确的固定电话');
    let mobile = va.mobile('请输入正确的手机号');
    let level = va.level(this.$route.query.type); //级别验证需要当前用户级别参数
    return {
      params: {//只需要业务参数
        queryUsername: "",
        https:""
      },
      rules: {
        //校验规则
        username: [required],
        email: [email],
        password: [password()],
        confirmPassword: [confirmPassword()],
        groupId: [required, number],
        grain: [required, number],
        phone: [tel],
        mobile: [mobile],
        disabled:[required],
        rank:[rank()]
      },
      memberGroup: [], //业务变量会员组
      roles: [],
      dialogDepartments: false, //部门触发按钮
      parents:[],//层级选择器
      departmentList: [],//部门列表
      siteList:[],//站点列表
      roleIds:[],//角色id
      siteIds:[],//选中的站点id
      allChannels:[],//
      allControlChannels:[], 
       defaultProps: {
        label: "name",
        value: "id",
        children: "child"
      },
      dialogVisible:false
    };
  },
     methods:{
         getRoleIds(value){
            console.log(value)    
         },
          getSiteIds(id,index){//通过点击索引判断是否取消选择
         let state=this.siteIds.indexOf(id)
         if(state>=0){
              this.allChannels[index]= true;
             this.allControlChannels[index]= true;
         }else{
            this.allChannels[index]= false;
             this.allControlChannels[index]= false;
         }    
    },
      getDataInfo(id,https){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.adminGlobleGet, {id:id,https:https}), //axios批量发送请求
             axios.post(api.groupList),
             axios.post(api.roleList),
             axios.post(api.departmentList),
          axios.post(api.siteList)
        ])
        .then(
            axios.spread((userGloble,groups,roles, departmentList,siteList)=>{
            this.dataInfo=userGloble.body;
            this.memberGroup=groups.body;
            this.roles = roles.body;
            this.departmentList =this.departmentList.concat({name: '无', pid: '', id: '', priority: '', weights: ''});
            this.departmentList = this.departmentList.concat(departmentList.body);   
            this.siteList = siteList.body;//站点列表
             if(this.dataInfo.departmentIds===''){
                    this.parents=[''];
                }else{
                    this.parents=this.dataInfo.departmentIds;//级联选择器回填
                }   
            for(let i in this.dataInfo.sites){
              this.siteIds[i]=this.dataInfo.sites[i].id;
              this.allChannels[i]=this.dataInfo.allChannels[i];//数据回填
              this.allControlChannels[i]=this.dataInfo.allControlChannels[i];//数据回填
            }
                this.$refs["form"].resetFields();
                this.loading = false;
            })
        )
        .catch(err => {
          this.loading = false;
        });
      },
        update() {
            let res={};              
            res=this.dataInfo;
            for(let i in this.dataInfo){
                res[i]=this.dataInfo[i]
            }
            res.roleIds = res.roleIds.join(",");
           
            res['departmentId']=this.parents[this.parents.length-1];
         //   res['allChannels']=this.allChannels.join(',');
         //   res['allControlChannels']=this.allControlChannels.join(','); 
            for(let i in res){
                if((typeof res[i])=='object'){
                    delete res[i]
                }
            }    
             let source=[];
             for(let x in this.siteIds){
                for(let y in this.siteList){
                    if(this.siteList[y].id===this.siteIds[x]){
                        let obj={siteIds:this.siteIds[x],steps:this.siteIds[x],allChannels:this.allChannels[y],allControlChannels:this.allControlChannels[y]}
                        source.push(obj);
                    }
                }
            }
           res['source']=JSON.stringify(source);           
           this.updateDataInfo(this.$api.adminGlobleUpdate, res, "list");
        }
        
  },
  created(){
    //初始获取数据
    this.getDataInfo(this.$route.query.id);
  }
};
</script>

<style>

</style>
