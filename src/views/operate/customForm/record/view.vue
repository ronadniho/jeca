<template>
    <section class="cms-body" v-loading="loading">
        <!-- 返回组件 -->
        <cms-back></cms-back>  
       <el-form  ref="form" class="cms-form" label-width="162px">

            <el-form-item v-for="(item,index) in fields" :key="index" :label="item.label" class="flex-100 ">
                <span v-if="item.dataType==9"> <a @click="down(dataInfo['attr_'+item.field])">下载</a> </span>
                <span v-if="item.dataType==10"> <img width="100px" height="100px" :src="baseUrl+dataInfo['attr_'+item.field]" /> </span>
                <span v-if="item.dataType!=10&&item.dataType!=9">{{dataInfo["attr_"+item.field]}} </span>
            </el-form-item>
             <!-- 按钮组 -->
            <div class="form-footer">
                
                <el-button type="warning" @click="del()"  v-perms="'/customForm/record/delete'">
                删除
                </el-button>
                <el-button type="primary" @click="check()"  v-perms="'/customForm/record/check'">
                审核
                </el-button>
                
            </div>
        </el-form>
    </section>
</template>

<script>
import listMixins from "@/mixins/form";
import { setBaseUrl } from '@/config.js';
import axios from "axios";
import va from "@/rules";
export default {
  mixins: [listMixins],
  data() {
    let self = this;
    return {
    dateInfo:{   
    },
    baseUrl:'',
    formId:0,
    fields:[],
    params: { 
    },
      
    };
  },
  methods: {
    getDataInfo(id) {
        let api = this.$api; //API地址  
         axios
        .all([
            axios.post(api.customRecordGet, {id:id}), //axios批量发送请求
        ])
        .then(
              axios.spread((record)=>{
                  this.dataInfo=record.body;
                  this.formId=this.dataInfo.formId;
                  console.log(this.formId)
                  axios.post(api.customFiledList,{formId:this.dataInfo.formId}).then(res=>{
                      this.fields=res.body;
                      this.loading = false;
                  })  .catch(err => {
                         this.loading = false;
                  });     
              })
        ) 
        .catch(err => {
          this.loading = false;
        });     

    },
    down(val){      
       location.href=this.baseUrl+val; 
    },
    del(){
        this.$confirm('是否确定删除？', '警告', { type: "error" })
        .then(mes => {
            this.$http.post(this.$api.customRecordDelete, { ids: this.id}).then(res => {
                if (res.code == "200") {
                    this.successMessage('删除成功');
                    setTimeout(() => {
                        this.routerLink("list","",this.formId);
                    }, 1000) 
                }
            });
        })
        .catch(error => { });     
    },
    check(){
        //只需要ids参数的批量操作
        this.loading = true;
            axios
            .post(this.$api.customRecordCheck, { ids: this.id})
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
    }

  },
  created() {
      this.baseUrl=this.$getUrl();
      this.getDataInfo(this.id);
  }
};
</script>

<style scoped  lang='scss'>

</style>
