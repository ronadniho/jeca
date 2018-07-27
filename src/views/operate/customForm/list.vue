<template>
     <section v-loading="loading" class="cms-body">
         <div class="cms-list-header">
             <el-button type="primary" 
             icon="el-icon-plus"
             @click="routerLink('/customForm/add','save',0)"      
             v-perms="'/customForm/add'"
              >添加</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
            <el-table-column type="selection" width="65" align="right"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="菜单名称" align="center">
                <div slot-scope="scope">
                    <a class="link" :href="scope.row.url" :title="scope.row.name" target="_blank">{{scope.row.name}}</a>
                </div>
            </el-table-column>
            <el-table-column prop="priority" label="排列顺序" align="center">
                <div slot-scope="scope">
                    <el-input v-model.number="scope.row.priority" type="number"></el-input>
                </div>
            </el-table-column>
            <el-table-column prop="enable" label="启用" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.enable">是</span>
                    <span v-else>否</span>
                </div>
            </el-table-column>     
            <el-table-column prop="memberMeun" label="会员菜单" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.memberMeun">是</span>
                    <span v-else>否</span>
                </div>
            </el-table-column>
            <el-table-column prop="allSite" label="是否全站" align="center">
                <div slot-scope="scope">
                    <span v-if="scope.row.allSite">是</span>
                    <span v-else>否</span>
                </div>
            </el-table-column>

            <el-table-column  label="操作"   align="center">
                <div slot-scope="scope"> 
                     <cms-button  type='view' title="表单记录"  @click.native="routerLink('/customForm/record/list','1',scope.row.id)"></cms-button>  
                     <cms-button  type='formList' title="表单代码调用" @click.native="user(scope.row.url,false)"></cms-button> 
                      <cms-button  type='formList'  title="记录列表代码调用" @click.native="user(scope.row.listUrl,true)" style="background:#d573ea;"></cms-button>                      
                     <cms-button  type='edit' @click.native="routerLink('/customForm/edit','update',scope.row.id)" title="修改"
                            v-perms="'/customForm/edit'"
                     ></cms-button>
                     <cms-button  type='delete' @click.native="deleteBatch($api.customFormDelete,scope.row.id)" title="删除"
                            v-perms="'/customForm/delete'"
                     ></cms-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- 表格底部 -->
        <div class="cms-list-footer">
                <div class="cms-left">
                  <el-button :disabled="disabled" @click="deleteBatch($api.customFormDelete,ids)"  
                        v-perms="'/customForm/delete'"
                  >批量删除</el-button>
                  <el-button :disabled="disabled" @click.native="prioritysBatch($api.customFormPriority,ids,getPriority(checkedList))"
                  >保存排列顺序</el-button> 
                </div>
                 
             <!-- cms分页组件 -->
              <cms-pagination :total="total" @change="getPages"></cms-pagination>
          </div> 

         <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="30%"
          >
            <span>  
                <el-radio v-model="radio" @change="what(radio)" :label="1">Script代码（推荐）</el-radio>
                <el-radio v-model="radio" @change="what(radio)" :label="2">iframe代码</el-radio>
            </span>
            <span>
                <el-input
                    type="textarea"
                    :rows="20"
                    placeholder="请输入内容"
                    v-model="jsUrl">
                </el-input>   
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>   



     </section> 
</template>

<script>
import listMixins from '@/mixins/list'
export default {
    mixins:[listMixins],
  data() {
    return {
      params: {//只需要业务参数
        pageNo:'',
        pageSize:'',
  
      },
      url:'',
      jsUrl:'',
      dialogVisible: false,
      radio:1,
      isList:true,//是否为表单列表
      title:''
    };
  },
  methods:{
      getPriority(checkedList){
        let Prioritys=[];
        for (let i in checkedList) {
            Prioritys.push(checkedList[i].priority);
        }
        return Prioritys.join(",");
      },
      user(url,state){
          this.jsUrl='';
          this.radio=1;
          this.url=url;
          this.what(1);
          
               if(state){
                 this.title='表单结果列表代码调用方式'   
               }else{
                   this.title='表单提交代码调用方式'  
               } 

          this.dialogVisible=true;
      },
      what(value){
          if(value==1){
            this.jsUrl="<script charset='UTF-8' defer>(function(h){function n(a){return null===a?null:a.scrollHeight>a.clientHeight?a:n(a.parentNode)}"
            this.jsUrl+="function t(b){if(b.data){var f=JSON.parse(b.data);!f.height||p||q||(d.style.height=+f.height+'px');"
            this.jsUrl +="if(f.getter){b={};var f=[].concat(f.getter),k,h=f.length,m,c,g,e;for(k=0;k<h;k++){m=k;c=f[k]||{};"
            this.jsUrl +="c.n&&(m=c.n);g=null;try{switch(c.t){case 'window':e=window;break;case 'scrollParent':e=n(a)||window;"
            this.jsUrl +="break;default:e=a}if(c.e)if('rect'===c.v){g={};var l=e.getBoundingClientRect();"
            this.jsUrl +="g={top:l.top,left:l.left,width:l.width,height:l.height}}else g=e[c.v].apply(e,[].concat(c.e))||!0;"
            this.jsUrl +="else c.s?(e[c.v]=c.s,g=!0):g=e[c.v]||!1}catch(u){}b[m]=g}b.innerState=!p&&!q;a.contentWindow.postMessage(JSON.stringify({queryRes:b}),'*')}}}"
            this.jsUrl +="for(var r=h.document,b=r.documentElement;b.childNodes.length&&1==b.lastChild.nodeType;)b=b.lastChild;"
            this.jsUrl +="var d=b.parentNode,a=r.createElement('iframe');d.style.overflowY='auto';d.style.overflowX='hidden';"
            this.jsUrl +="var p=d.style.height&&'auto'!==d.style.height,q='absolute'===d.style.position||window.getComputedStyle&&'absolute'===window.getComputedStyle(d,null).getPropertyValue('position')||d.currentStyle&&'absolute'===d.currentStyle.position;"
            this.jsUrl +="h.addEventListener&&h.addEventListener('message',t,!1);"
            this.jsUrl +="a.src='"+this.url+"';a.onload=function(){a.contentWindow.postMessage(JSON.stringify({cif:1}),'*')};"
            this.jsUrl +="a.frameBorder=0;a.scrolling='no';a.style.display='block';a.style.minWidth='100%';"
            this.jsUrl +="a.style.width='100px';a.style.height='800px';a.style.border='none';a.style.overflow='auto';"
            this.jsUrl +="d.insertBefore(a,b)})(window);"
            this.jsUrl +='</'
            this.jsUrl +='script>'
          }else{
            this.jsUrl="<iframe height='800' allowTransparency='true' style='width:100%;border:none;overflow:auto;' frameborder='0' src='"+this.url+"'></iframe>";
          }
      }



  },
  created(){
     this.initTableData(this.$api.customFormList,this.params);
  }
};
</script>
    
<style>
 
</style>