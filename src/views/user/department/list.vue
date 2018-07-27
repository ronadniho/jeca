<template>
  <section v-loading="loading" >
      <!-- 手动查询表单 -->
      <div class="cms-list-header">
          <el-button type="primary" icon="el-icon-plus" v-perms="'/departmentList/add'"  @click="routerLink('/department/add','save',0,{pid:0})">添加</el-button> 
      </div> 
      <!-- 数据表格显示区域 -->
      <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
          <el-table-column type="selection" width="65" align="right"></el-table-column>
          <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
          <el-table-column prop="name" label="名称"  align="left">
          </el-table-column>
          <el-table-column  label="排序"  align="center" width="100">
              <template slot-scope="scope">
                  <el-input v-model="scope.row.priority" type="number"></el-input>
              </template>
          </el-table-column>
          <el-table-column prop="name" label="操作"  align="center">
                <div slot-scope="scope">
                     <button class="btn list" @click="routerLink('/departmentMember/list','lsit',scope.row.id)" title="查看部门成员列表" v-perms="'/department/memberList'" ><i class="iconfont icon-gengduo"></i></button>
                    <button class="btn edit" @click="routerLink('/department/edit','update',scope.row.id)" title="修改" v-perms="'/department/update'" ><i class="iconfont icon-weibiaoti101"></i></button>
                    <button class="btn delete" @click="deleteBatch($api.departmentDelete,scope.row.id)" title="删除" v-perms="'/department/delete'" ><i class="iconfont icon-shanchu1"></i></button>
                </div>
            </el-table-column>
      </el-table>
      <!-- 表格底部 -->
      <div class="cms-list-footer">
        <div class="cms-left">
              <el-button :disabled="disabled" @click="deleteBatch($api.departmentDelete,ids)" v-perms="'/department/delete'"
            >批量删除</el-button>
            <el-button :disabled="disabled" @click="priorityBatch($api.departmentPriority,ids,getPriority())" v-perms="'/department/priority'"
            >保存排列顺序</el-button>
        </div>  
      </div> 
    </section>
</template>
<script>
import listMixins from '@/mixins/list'
import axios from "axios";
export default {
  mixins:[listMixins],
  data() {
    return {
      //过滤参数
      params: {
        queryStatus: "",   //内容状态
        queryTypeId: "",   //内容类型
        queryTopLevel: "", //固定
        queryRecommend:"", //推荐
        queryUsername:"",  //发布者
        queryTitle:"",     //标题
        queryOrderBy:"",   //排序
        querySiteId:'',    //站点
        pageNo: "",        //当前页码
        pageSize: "",      //每页显示条数
      },
      types:[],
      labelDialogTitle:'', //栏目dialog标题文本
      dialogVisible:false, //栏目dialog显示标识
      operateType:'',      //触发dialog的方式 copy：复制 cite：引用
      currentCheckChannelId:'',//当前操作选择的栏目ID
      props: {
        label: "name",
        children:"zones",
        isLeaf: "isChild",
        id: "id"
      }
    };
  },methods:{
    //获取表格数据
    getTableData(params) {
       this.loading = true;
       axios.post(this.$api.departmentList,params).then(res=>{
            this.tableData = res.body;
            this.total=pages.body.totalCount;
            this.loading = false;
      }).catch(error=>{
          this.loading = false;
      })
    },
     getPriority(){
      let Prioritys=[];
      for (let item of this.checkedList) {
          Prioritys.push(item.priority);
      }
      return Prioritys.join(",");
    },
    handleClose(done) {
      done();
    },
    //异步加载栏目树形结构  
    ansyTree(node, resolve){
      if (node.level === 0) {
        return resolve([
          {
            name: '根目录',
            id: '',
            isChild:true,
          }
        ]);
      }
      if (node.level > 0) {
        axios.post(this.$api.channelList,{parentId:node.data.id}).then(res => {
          const data = [];
          for (let i in res.body) {
            let obj = {};
            obj.id = res.body[i].id;
            obj.isChild = res.body[i].childCount > 0  ? false : true;
            obj.name = res.body[i].name;
            data.push(obj);
          }
          return resolve(data);
        });
      }
    },
    //复制及引用打开dialog触发事件
    operate(type){
      this.dialogVisible = true;
      this.operateType = type;
      this.labelDialogTitle = (type == 'copy'?'复制' :'引用' )+this.$getSiteName();
    }, 
    //栏目dialog节点选中事件，处理checkbox 只能选择一个
    checkChange(node,checkStatus,childStatus){
      if(checkStatus){
        this.currentCheckChannelId = node.id;
        this.$refs['channelTree'].setCheckedKeys([node.id],true);
      }
    },
    //栏目dialog确认按钮操作
    confirm(){
      let url = '';
      let map = {};  //请求api参数对象
      map.channelId = this.currentCheckChannelId;
      map.ids = this.ids; 
      if(this.operateType == 'copy'){
        url = this.$api.contentCopy;
        map.siteId = this.$getSiteId();
      }else if(this.operateType == 'cite'){
        url = this.$api.contentRefer;
      }else{
        return false;
      }
      this.loading = true;
      axios.post(url,map).then(res => {
        if (res.code == "200") {
            this.loading = false;
            this.dialogVisible = false;
            this.successMessage(this.operateType == 'copy'?'复制成功' :'引用成功');
        }
      }).catch(err => {
        this.loading = false;
      });
    }, 
  },
  created(){
     this.getTableData(this.params);
  },
  watch:{
    $route: function(to, from) {
      let id = this.$route.query.id;
       if(id > 0){
           this.params.root = id;
      }else{
          this.params.root = '';
      }
      this.getTableData(this.params);
    }
  }

};
</script>
  
<style scoped>
  .tree-left{
    width: 200px;
    float: left;
  }
  .tree-right{
    margin-left: 200px;
  }
  .cms-body table .btn {
    margin-top: 5px;
    display: inline-block;
    height: 24px;
    width: 24px;
    min-width: 0px;
    line-height: 24px;
    padding: 0px;
    font-size: 14px;
    color: #ffffff;
    margin-left: 2px;
    border: 0px;
    border-radius: 4px;
    box-sizing: border-box;
    line-height: 1;
}
.cms-body table .btn .iconfont{
  font-size: 14px;
  font-weight: 100;
  color: #ffffff;
}
.list{
 background-color: #409EFF;
}
.edit{
  background-color: #17D57E
}
.delete{
  background-color: #FF8B53;
}
.list:hover,
.delete:hover,
.edit:hover{
  cursor: pointer;
}
</style>
