<template>
  <section v-loading="loading" class="cms-body">
    <section class="tree-left">
      <!-- cms站点tree组件引用 -->
      <cmsSiteTree @node-click="nodeClik"></cmsSiteTree>
    </section>
    <section class="tree-right">
      <!-- 手动查询表单 -->
      <div class="cms-list-header">
          <cms-input v-model="params.queryTitle" label="标题"></cms-input>
          <cms-input v-model="params.queryUsername" label="发布者"></cms-input>
          <el-button @click="query">查询</el-button> 
      </div> 
      <!-- 快捷查询表单 -->
      <div class="cms-list-header">
        <el-select v-model="params.queryTypeId" @change="query">
            <el-option v-for="(item,index) in types" :key="index" :label="types[index].name" :value="types[index].id"></el-option>
        </el-select>
        <el-select v-model="params.queryOrderBy" @change="query" >
          <el-option label="ID降序" value="0"></el-option>
          <el-option label="ID升序" value="1"></el-option>
          <el-option label="发布时间降" value="2"></el-option>
          <el-option label="发布时间升" value="3"></el-option>
          <el-option label="固定降,发布降" value="4"></el-option>
          <el-option label="固定降,发布升" value="5"></el-option>
          <el-option label="日点击降" value="6"></el-option>
          <el-option label="周点击降" value="7"></el-option>
          <el-option label="月点击降" value="8"></el-option>
          <el-option label="总点击降" value="9"></el-option>
          <el-option label="日评论降" value="10"></el-option>
          <el-option label="周评论降" value="11"></el-option>
          <el-option label="月评论降" value="12"></el-option>
          <el-option label="总评论降" value="13"></el-option>
          <el-option label="日下载降" value="14"></el-option>
          <el-option label="周下载降" value="15"></el-option>
          <el-option label="月下载降" value="16"></el-option>
          <el-option label="总下载降" value="17"></el-option>
          <el-option label="日顶降" value="18"></el-option>
          <el-option label="周顶降" value="19"></el-option>
          <el-option label="月顶降" value="20"></el-option>
          <el-option label="总顶降" value="21"></el-option>
        </el-select>
        <el-checkbox v-model="params.queryTopLevel"  @change="query" true-label="1" false-label="" >固定</el-checkbox>
        <el-checkbox v-model="params.queryRecommend" @change="query" true-label="1" false-label="" >推荐</el-checkbox>
        <div style="margin-top: 16px">
            <el-radio-group v-model="params.queryStatus" @change="query">
              <el-radio label="all">本站内容</el-radio>
              <el-radio label="draft">草稿</el-radio>
              <el-radio label="prepared">待审</el-radio>
              <el-radio label="passed">已审</el-radio>
              <el-radio label="checked">终审</el-radio>
              <el-radio label="rejected">退回</el-radio>
            </el-radio-group>
        </div>
      </div> 
      <!-- 数据表格显示区域 -->
      <el-table :data="tableData" stripe style="width: 100%" @selection-change="checkIds">
          <el-table-column type="selection" width="65" align="right"></el-table-column>
          <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
          <el-table-column prop="title" label="标题" width="400"  align="left">
            <div slot-scope="scope" class="overflow-text">
              
              <span v-if="scope.row.shared && $getSiteId() == scope.row.siteId" title="从其他站点共享到本站的内容" 
                class="red-color">源
              </span>
              <span v-if="scope.row.shared && $getSiteId() != scope.row.siteId" title="从其他站点共享到本站的内容" 
                class="red-color">享
              </span>
              <span class="font-bold">[{{scope.row.channelName}}]&nbsp;</span>
              <a class="link" :title="scope.row.title" :href="scope.row.siteUrl" target="_blank"><span>{{scope.row.title}}</span></a>
            </div>
          </el-table-column>
         
          <el-table-column prop="userName" label="发布者"  align="center"></el-table-column>
          <el-table-column prop="releaseDate" label="发布时间"  align="center"></el-table-column>
          <el-table-column prop="status" label="状态"  align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status==-1">退回</span>
              <span v-if="scope.row.status==0">草稿</span>
              <span v-if="scope.row.status==1">审核中 </span>
              <span v-if="scope.row.status==2">审核通过</span>
              <span v-if="scope.row.status==3">回收站</span>
              <span v-if="scope.row.status==4">投稿</span>
              <span v-if="scope.row.status==5">归档</span>
            </template>
          </el-table-column>
      </el-table>
      <!-- 表格底部 -->
      <div class="cms-list-footer">
        <div class="cms-left">
          <el-button :disabled="disabled" v-perms="'/contentReuse/copy'" @click="operate('copy')">复制
          </el-button>
          <el-button :disabled="disabled" v-perms="'/contentReuse/refer'" @click="operate('cite')" >引用
          </el-button>
        </div>  
          <!-- cms分页组件 -->
        <cms-pagination :total="total" @change="getPages"></cms-pagination>
      </div> 
    </section>
    <!-- 选择栏目dialog -->
    <el-dialog class="dialog" :title="labelDialogTitle":visible.sync="dialogVisible" width="25%":before-close="handleClose">
        <div class="tree-layout">
          <div class="tree">
            <el-tree :load="ansyTree" lazy ref="channelTree" :props="props"
              @check-change="checkChange" :default-expanded-keys="['']" show-checkbox :indent="16" node-key="id">
            </el-tree>
          </div>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </el-dialog>
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
      axios.all([
        axios.post(this.$api.contentRenuseList,params),
        axios.post(this.$api.contentRenusePage,params),
      ]).then(
          axios.spread((res,pages)=>{
              this.tableData = res.body;
              this.total=pages.body.totalCount;
              this.loading = false;
          })
      ).catch(err => {
        this.loading = false;
      });
    },
    //节点树节点触发触发函数
    nodeClik(data){
      this.params.querySiteId = data.id;
      this.getTableData(this.params);
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
      getTypeList(val){
        axios.post(this.$api.typeList,{hasContentOnly:true}).then(res => {
          if(res.code == '200'){
               this.types = res.body; 
          }
        }).catch(err => {
        });
    },
  },
  created(){
     this.getTableData(this.params);
     this.getTypeList();
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
  .font-bold{
    font-weight: bold;
  }
  .iconfont{
    color: #409EFF;
  }
  .dialog .tree-layout{
    min-height: 400px;
    width: 90%;
  }
  .dialog .tree-layout .tree{
    width: 100%;
    height: 100%;
    overflow: auto;
    position: absolute;
    border-right: 0px solid #d4dde2;

  }
  .el-dialog__body{
    min-height: 450px;
    overflow: auto;
  }
  .red-color{
    color: red;
  }
    
</style> 
