<template>
  <section class="cms-body cms-chart-box">
            <div class="cms-list-header" style="padding-left:0">
                   <h5 class="data-header-title">搜索词({{time}})</h5>
                    <div class="flex-date">
                        <label class="cms-label" style="margin-left:0">日期：</label>
                        <el-radio-group size="small" style="margin-right:10px;" v-model="params.flag" @change="query">
                             <el-radio-button  :label="4">今日</el-radio-button>
                            <el-radio-button  :label="1">本月</el-radio-button>
                            <el-radio-button  :label="2">今年</el-radio-button>
                        </el-radio-group>
                            <el-date-picker
                                v-model="dateArr"
                                value-format="yyyy-MM-dd"
                                :editable='false'
                                @change="rangeTime"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                     </div>  
                       
            </div>
                  <table class="data-table">
                              <tr>
                                <th >搜索词</th>
                                <th >浏览量(pv)</th>
                                <th >占比</th> 
                              </tr>
                              <tr>
                                <th >合计</th>
                                <th >{{page.sum}}</th>
                                <th ></th> 
                              </tr>
                                <tr  v-for="(item,index) in tableData" :key="index">
                                <td >{{index}}</td>
                                <td >{{item}}</td>
                                <td >{{((item/page.sumkey)*100).toFixed(1)}}%</td>
                              </tr>      
                            </table>
  </section>
</template>

<script>
import axios from "axios";
import listMixins from '@/mixins/list'
export default {
    mixins:[listMixins],
  data() {
    return {
      dateArr:'',
      params: {
        type: "keyword",
        target: "",
        flag: 4,
        begin: "",
        statisDay: "",
        end: ""
      },
      time:'',
      date:{
          year:'',
          month:'',
          day:''
      },
      page:{
        sumkey:0,
        sum:0,
      },
    };
  },
  methods:{
      rangeTime(val) {
      //格式化时间
      if(val!=null){
        this.params.begin = val[0];
        this.params.end = val[1];
        this.params.flag = 3;
        if(val[0]===val[1]){
          this.time=val[0];   
      }else{
          this.time=val[0]+'-'+val[1];   
      }  
      }else{
        this.params.begin = '';
        this.params.end = '';
        this.params.flag = 4;
        this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
      }  
       this.getDataInfo();
    },
    query(val) {
       if(val===4){
            this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
        }
        if(val===1){
            this.time=this.date.year+'-'+this.date.month
        }
        if(val===2){
            this.time=this.date.year
        }
      this.getDataInfo();
    },
    getDataInfo() {
        axios.post(this.$api.flowSourceList, this.params).then(res => {
                this.tableData=res.body.totalMap;  
                let sumkey=0;
                for(let i in res.body.totalMap){
                    sumkey+=res.body.totalMap[i];                    
                }  
                this.page.sum=sumkey;    
                if(sumkey===0){
                   sumkey=1;
                }
                this.page.sumkey=sumkey;        
        })
        .catch(err => {
            this.loading = false;
        }); 
    },
     
  },
  created() {
     let now = new Date();
    let Y = now.getFullYear();
    let m = now.getMonth() + 1;
    let d = now.getDate();
    this.date.year=Y;
    this.date.month=m;
    this.date.day=d;
    this.year=Y;
    this.month=m;
    this.time=Y+'-'+m+'-'+d
     this.getDataInfo();
  }
};
</script>

<style scoped lang='scss'>
.data-item {
  float: left;
  min-width: 170px;
  margin-top: 30px;
  .data-title {
    font-size: 12px;
    color: #878d99;
    margin-bottom: 17px;
  }
  .data-num {
    color: #353535;
    font-size: 24px;
  }
}
.chart-style {
  width: 100%;
  height: 380px;
  border-bottom: 1px dashed #eee;
  margin-bottom: 15px;
}
</style>
