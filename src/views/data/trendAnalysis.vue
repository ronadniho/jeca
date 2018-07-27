<template>
  <section class="cms-body cms-chart-box">
            <div class="cms-list-header" style="padding-left:0">
                    <h5 class="data-header-title">趋势分析({{time}})</h5>
                    <div class="flex-date">
                        <label class="cms-label" style="margin-left:0">日期：</label>
                        <el-radio-group size="small" style="margin-right:10px;" v-model="params.flag" @change="query">
                            <el-radio-button  :label="4">今日</el-radio-button>
                            <el-radio-button  :label="6" >昨日</el-radio-button>
                            <el-radio-button  :label="1">本月</el-radio-button>
                            <el-radio-button  :label="2">今年</el-radio-button>
                        </el-radio-group>

                            <el-date-picker
                                v-model="dateArr"
                                value-format="yyyy-MM-dd"
                                @change="rangeTime"
                                :editable='false'
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>  
            </div>
            <!-- 统计数据 -->
            <ul class="clearfix">
                <li class="data-item">
                     <p class="data-title">浏览量(pv)<i class="iconfont icon-kongzhitai-zhushi"></i></p>
                     <p class="data-num">{{dataInfo.pvTotal}}</p>                  
                </li>
                  <li class="data-item">
                       <p class="data-title">独立访客数(UV)<i class="iconfont icon-kongzhitai-zhushi"></i></p>
                       <p class="data-num">{{dataInfo.visitorTotal}}</p>   
                      </li>
                    <li class="data-item"> 
                        <p class="data-title">IP 数<i class="iconfont icon-kongzhitai-zhushi"></i></p>
                        <p class="data-num">{{dataInfo.ipTotal}}</p>  
                       </li>
                </ul> 
                <!-- 图表 -->
            <div class="chart-style" id="chartLine" > </div>    
                  <table class="data-table">
                              <tr>
                                <th >时段</th>
                                <th >浏览量(pv)</th>
                                <th >独立访客数(uv)</th>
                                 <th >IP 数</th>
                              </tr>
                                <tr  v-for="(item,index) in dataInfo.list" :key="index">
                                <td >{{timeFormat(params.flag,item[4])}}</td>
                                <td >{{item[0]}}</td>
                                <td >{{item[2]}}</td>
                                <td >{{item[1]}}</td>
                              </tr>      
                            </table>

  </section>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dateArr:'',
      params: {
        flag:4,
        begin: "",
        statisDay:"",
        end: ""
      },
       time:'',
      date:{
          year:'',
          month:'',
          day:''
      },
      dataInfo: {
        pvTotal: 0,
        visitorTotal: 0,
        ipTotal: 0,
        list: []
      },
      chartLine: null,
      chartPie: null,
      chartLineOptions: {
        //折线图配置
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["浏览量(pv)", "独立访客数(uv)", "ip数"]
        },
        grid: {
          left: "5%",
          right: "2%",
          bottom: "14%"
        },
        xAxis: {
          type: "category",
          splitLine: { show: false },
          boundaryGap: true,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          splitLine: { show: false },
          type: "value"
        },
        series: [
          {
            name: "浏览量(pv)",
            type: "line",
            showSymbol: false,
            smooth: true, //这句就是让曲线变平滑的
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "独立访客数(uv)",
            type: "line",
            showSymbol: false,
            smooth: true, //这句就是让曲线变平滑的

            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "ip数",
            type: "line",
            showSymbol: false,
            smooth: true, //这句就是让曲线变平滑的
            data: [150, 232, 201, 154, 190, 330, 410]
          }
        ]
      }
    };
  },
  methods: {
      rangeTime(val){//格式化时间
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
        this.params.begin='';
        this.params.end='';
        this.params.flag=4; 
        this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
      }  
       this.getDataInfo(); 
      },
     query(val){
        this.dateArr='';
        this.params.begin='';
        this.params.end='';
        if(val===4){
            this.time=this.date.year+'-'+this.date.month+'-'+this.date.day
        }
         if(val===6){
            this.time=this.date.year+'-'+this.date.month+'-'+(this.date.day-1)
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
      axios.post(this.$api.flowPvList,this.params).then(res => {
        this.dataInfo.pvTotal = res.body.pvTotal;
        this.dataInfo.visitorTotal = res.body.visitorTotal;
        this.dataInfo.ipTotal = res.body.ipTotal;
        this.dataInfo.list = res.body.list;
        let xData=[];
        let series=[[],[],[]]; 
        for(let i in res.body.list){
             xData.push(this.timeFormat(this.params.flag,res.body.list[i][4]));
             series[0].push(res.body.list[i][0]);
              series[1].push(res.body.list[i][2]);
               series[2].push(res.body.list[i][1]);
        }
       this.setChartLineOptions(xData,series);
      });
    },
    setChartLineOptions(xdata,series){
        let Options = {
                xAxis: {
                    data: xdata
                },
                series: [
                    {
                    name: "浏览量(pv)",
                    data: series[0]
                    },
                    {
                    name: "独立访客数(uv)",
                    smooth: true, //这句就是让曲线变平滑的
                    data: series[1]
                    },
                    {
                    name: "ip数",
                    data: series[2]
                    }
                ]
                };
           this.chartLine.setOption(Options);   
    },
    timeFormat(flag,timeName){//格式化时间显示
        let formatTime='0';
        if(flag==4||flag==6){//小时转换
            switch (timeName) {
                case 0:
                formatTime="00:00-00:59" 
                    break;
                case 1:
                formatTime="01:00-01:59" 
                    break;
                    case 2:
                formatTime="02:00-02:59" 
                    break;
                    case 3:
                formatTime="03:00-03:59" 
                    break;
                    case 4:
                formatTime="04:00-04:59" 
                    break;
                    case 5:
                formatTime="05:00-05:59" 
                    break;
                    case 6:
                formatTime="06:00-06:59" 
                    break;
                    case 7:
                formatTime="07:00-07:59" 
                    break;
                    case 8:
                formatTime="08:00-08:59" 
                    break;
                    case 9:
                formatTime="09:00-09:59" 
                    break;
                    case 10:
                formatTime="10:00-10:59" 
                    break;
                    case 11:
                formatTime="11:00-11:59" 
                    break;
                    case 12:
                formatTime="12:00-12:59" 
                    break;
                    case 13:
                formatTime="13:00-13:59" 
                    break;
                    case 14:
                formatTime="14:00-14:59" 
                    break;
                    case 15:
                formatTime="15:00-15:59" 
                    break;
                    case 16:
                formatTime="16:00-16:59" 
                    break;
                    case 17:
                formatTime="17:00-17:59" 
                    break;
                    case 18:
                formatTime="18:00-18:59" 
                    break;
                    case 19:
                formatTime="19:00-19:59" 
                    break;
                    case 20:
                formatTime="20:00-20:59" 
                    break;
                    case 21:
                formatTime="21:00-21:59" 
                    break;
                    case 22:
                formatTime="22:00-22:59" 
                    break;
                    case 23:
                formatTime="23:00-23:59" 
                    break;
                default:
                formatTime="99:99:99~99:99:99:99"
                    break;
            }
        }
        if(flag==2){
            let date= new Date();
            switch (timeName) {
                case 1:
                 formatTime=date.getFullYear()+"-01"  
                    break;
                 case 2:
                 formatTime=date.getFullYear()+"-02"  
                    break;
                     case 3:
                 formatTime=date.getFullYear()+"-03"  
                    break;
                     case 4:
                 formatTime=date.getFullYear()+"-04"  
                    break;
                     case 5:
                 formatTime=date.getFullYear()+"-05"  
                    break;
                     case 6:
                 formatTime=date.getFullYear()+"-06"  
                    break;
                     case 7:
                 formatTime=date.getFullYear()+"-07"  
                    break;
                     case 8:
                 formatTime=date.getFullYear()+"-08"  
                    break;
                     case 9:
                 formatTime=date.getFullYear()+"-09"  
                    break;
                      case 10:
                 formatTime=date.getFullYear()+"-10"  
                    break;
                      case 11:
                 formatTime=date.getFullYear()+"-11"  
                    break;
                       case 12:
                 formatTime=date.getFullYear()+"-12"  
                    break;
                default:
                formatTime="9999-99-99"  
                    break;
            }
        }
        if(flag==1||flag==3){
         formatTime=timeName;   
        }
        return formatTime;
    }
    
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
  },
  mounted() {
    this.chartLine = echarts.init(document.getElementById("chartLine"));
    this.chartLine.setOption(this.chartLineOptions);
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
