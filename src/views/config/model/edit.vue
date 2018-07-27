<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>   
        <el-form  ref="form" :model="dataInfo" :rules="rules" class="cms-form" label-width="162px">
            <el-form-item v-if="id==0" label="模型ID" class="flex-50"  prop="id">
               <el-input  v-model.number="dataInfo.id" class="cms-width"
                type="number" ></el-input> 
            </el-form-item>       
            <el-form-item v-else   label="模型ID" class="flex-50"  >
               <span >{{dataInfo.id}}</span>
            </el-form-item> 
            <el-form-item label="模型名字" class="flex-50"  prop="name">
                <el-input  v-model="dataInfo.name" class="cms-width"></el-input>                 
            </el-form-item>  
            <el-form-item label="模型路径" class="flex-50"  prop="path" >
                <el-input  v-model="dataInfo.path" class="cms-width"></el-input>                 
                <span class="gray">推荐使用模板名字的拼音或英文</span>
            </el-form-item> 
            <el-form-item label="排列顺序" class="flex-50" prop="priority">
               <el-input v-model="dataInfo.priority" class="cms-width"></el-input>                               
            </el-form-item> 
            <el-form-item label="栏目模板前缀" class="flex-50"  prop="tplChannelPrefix">
                <el-input  v-model="dataInfo.tplChannelPrefix" class="cms-width"></el-input>                 
            </el-form-item>  
            <el-form-item label="内容模板前缀" class="flex-50"  prop="tplContentPrefix">
                <el-input  v-model="dataInfo.tplContentPrefix" class="cms-width"></el-input>                 
            </el-form-item>  
            <el-form-item label="栏目标题图" class="flex-50"  prop="titleImg">
                    <el-input class="cms-width-25" type="number" v-model="dataInfo.titleImgWidth"></el-input> ×
                    <el-input class="cms-width-25" type="number" v-model="dataInfo.titleImgHeight"></el-input>
                    <span class="gray">宽 × 高</span>
            </el-form-item> 
            <el-form-item label="栏目内容图" class="flex-50"  prop="contentImg">
                    <el-input class="cms-width-25" type="number" v-model="dataInfo.contentImgWidth"></el-input> ×
                    <el-input class="cms-width-25" type="number" v-model="dataInfo.contentImgHeight"></el-input>
                    <span class="gray">宽 × 高</span>
            </el-form-item> 
            <el-form-item label="是否有内容" class="flex-50"  prop="hasContent">
               <el-radio v-model="dataInfo.hasContent" :label="true">是</el-radio>
               <el-radio v-model="dataInfo.hasContent" :label="false">否</el-radio>                
            </el-form-item>
            <el-form-item label="全站模型" class="flex-50"  prop="global">
                <el-radio-group v-model="dataInfo.global">
                    <el-radio  :label="true">是</el-radio>
               <el-radio  :label="false">否</el-radio>        
                </el-radio-group>
            </el-form-item>      
            <div class="form-footer">
               <el-button v-if="this.id==0" type="warning" @click="add(true)"
                    v-perms="'/model/add'"
                >提交并继续添加</el-button>
                <el-button v-if="this.id==0" type="primary"  @click="add(false)"
                    v-perms="'/model/add'"
                >提交</el-button>
                <el-button v-if="this.id!=0" type="primary"  @click="update()"
                    v-perms="'/model/edit'"
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
export default {
    mixins:[listMixins],
  data() {
    let self = this;
    let required = va.required('此项必填');
    let valModel=va.checkModeId();
    let number = va.number('只能输入数字');
    return {
      params: {//只需要业务参数

      },
      rules: {
        //校验规则
        id:[required,number,valModel],
        global:[required],
        name:[required],
        tplChannelPrefix:[required],
        tplContentPrefix:[required],
        priority:[required],
        hasContent:[required],
        path:[required],
        
      },
      checkRes:false,
    };
  },
     methods:{   
        
      getDataInfo(id){
        let api = this.$api; //API地址
        axios
        .all([
             axios.post(api.modelGet, {id:id}), //axios批量发送请求
        ])
        .then(
            axios.spread((type)=>{
                this.dataInfo=type.body;
                if(this.id===0){
                    this.dataInfo.global=true;
                     this.dataInfo.hasContent=true;
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
            this.updateDataInfo(this.$api.modelUpdate, this.dataInfo, "list");
        },
        add(state) {  
          if(!this.checkRes){              
              this.saveDataInfo(state,this.$api.modelSave, this.dataInfo, "list");
          }        
        }
  },
  created(){
    //初始获取数据
    this.getDataInfo(this.id);
  }
};
</script>

<style>

</style>