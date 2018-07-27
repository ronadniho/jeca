<template>
  <section v-loading="loading" class="cms-body flex">
    <!-- 树组件 -->
    <cms-tree @change="getChannelId" :copy="true" :hasContent='false'></cms-tree>
    <div class="cms-content-right">
      <!-- 栏目 -->
      <div class="cms-list-header clearfix flex">
        <div class="bread-box cms-left" v-if="breadState">
          <label class="">当前栏目:</label>
          <ul class="type-bread">
            <li class="bread-items" v-for="(item,index) in breadItems" :key="index">
              <a href="javascript:void(0)" @click="clickBread(item.id,index)">{{item.name}}</a>
            </li>
          </ul>
        </div>
        <div class="cms-left channel-group"  >
                <el-dropdown @command="addChannel"   v-perms="'/channel/addSave'"   >
              <el-button type="primary">
               <i class="el-icon-plus "       
               ></i> 栏目添加
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  v-for="item in modelList" :key="item.id" 
                    :command="item.id">
                  {{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
      </div>
      <el-table :data="tableData" stripe @selection-change="checkIds">
        <el-table-column type="selection" width="65" align="right"></el-table-column>
        <el-table-column prop="id" label="id" width="50" align="center"></el-table-column>
        <el-table-column  label="栏目名称"  prop="name"  align="center"></el-table-column>
        <el-table-column label="栏目路径" prop="path" align="center"></el-table-column>
        <el-table-column label="排列顺序" prop="priority" align="center">
                <div slot-scope="scope">
                    <el-input v-model="scope.row.priority" type="number"  class="w50" ></el-input>
                </div>
        </el-table-column>
         <el-table-column label="显示" prop="display" align="center">
                <div slot-scope="scope">        
                     <span v-if="scope.row.display">是</span>
                      <span v-else>否</span>
                </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="scope">
            <cms-button type="edit"  @click.native="routerLink('/channel/update','update',scope.row.id)"
                    v-perms="'/channel/update'" 
            ></cms-button>
            <cms-button type="delete" @click.native="deleteBatch($api.channelDelete,scope.row.id)"
                    v-perms="'/channel/delete'" 
            ></cms-button>
          </div>
        </el-table-column>
      </el-table>
      <!-- 表格底部 -->
      <div class="cms-list-footer" style="padding-bottom:52px;">
        <div class="cms-left">
             <el-button @click="priorityBatch($api.channelPriority)"  :disabled="disabled"
                       v-perms="'/channel/savePriority'"     
             >保存排序</el-button> 
              <el-button @click="deleteBatch($api.channelDelete,ids)" :disabled="disabled"
                      v-perms="'/channel/delete'"     
              >批量删除</el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import listMixins from "@/mixins/list";
import axios from "axios";
export default {
  mixins: [listMixins],
  data() {
    return {
      params: {
        //请求参数
        parentName: "",
        parentId: "",
        modelId: "",
        https: "",
        hasCollect: ""
      },
      breadState:false,
      allTotal: 0, //分页总数
      breadItems: [
        {
          name: "根目录",
          id: ""
        }
      ], //面包屑
      channelInfo: {}, //当前栏目信息
      modelList: [] //模型列表
    };
  },
  methods: {
  
    addChannel(command) {
      //添加栏目
      this.params.modelId = command;
      this.routerLink("/channel/save", "save", 0, this.params);
    },
    checkChange(node, checkStatus, childStatus) {
      //栏目dialog节点选中事件，处理checkbox 只能选择一个
      if (checkStatus) {
        this.currentCheckChannelId = node.id;
        this.$refs["channelTree"].setCheckedKeys([node.id], true);
      }
    },

    getChannelId(data, node) { //获取栏目树点击
      if(data.isChild){
         this.routerLink('/channel/update','update',data.id); 
      }else{
           this.breadState=true;
            this.creatBread(node, []);
            this.params.parentId = data.id; //传递栏目id
            this.params.parentName = data.name;
             this.getTableData(this.params); //获取内容信息
      }
    },
    getModelList() {
      axios.post(this.$api.modelList, {containDisabled: false }).then(res => {
        if (res.code == "200") {
          this.modelList = res.body; //获取模型
        }
      });
    },
    creatBread(node, arr) {
      if (node.parent != null) {
        let params = {
          name: node.data.name,
          id: node.data.id
        };
        arr.push(params);
        this.creatBread(node.parent, arr);
      } else {
        this.breadItems = arr.reverse();
        return false;
      }
    },
    priorityBatch(url) {
      this.$confirm(
       '是否保存排序',
        '提示',
        { type: "warning" }
      )
        .then(mes => {
          let prioritys = [];
          for (let i in this.checkedList) {
            prioritys.push(this.checkedList[i].priority);
          }

          this.$http
            .post(url, { ids: this.ids, prioritys: prioritys.join(",") })
            .then(res => {
              if (res.code == "200") {
                this.successMessage('保存成功');
                this.getTableData(this.params);
              }
            });
        })
        .catch(error => {
        });
    }
  },
  created() {
    this.$store.dispatch("setCollapse", true); //收缩状态栏
    this.loading = false;
     this.breadState=false;
      if(this.$route.query.type=='list'){
        if(this.$route.query.id==0){
           this.params.parentId=''
        }else{
           this.params.parentId=this.$route.query.id;
        }
       
      }
    this.initTableData(this.$api.channelList, this.params); //请求列表
    this.getModelList(); //内容类型
  },
   mounted(){
        let clientHeight=document.body.clientHeight;
          $('.cms-body').css('minHeight',(clientHeight-110)+'px');
   }
};
</script>

<style scoped>
.bread-box {
  display: flex;
  display: -ms-flexbox;
  align-items: center;
}
.bread-box label {
  color: #5a5e66;
  font-size: 14px;
}

.type-bread {
  margin-right: 12px;
}

.bread-items {
  display: inline-block;
}

.bread-items a {
  color: #1276c3;
  font-size: 14px;
}

.bread-items a::after {
  content: "/";
  padding: 0 5px;
  color: #1276c3;
}

.bread-items:last-child a::after {
  content: "";
  padding: 0 5px;
  color: #1276c3;
}
.tree-left {
  width: 200px;
  float: left;
}
.tree-right {
  margin-left: 200px;
}
.font-bold {
  font-weight: bold;
}
/* .iconfont{
    color: #409EFF;
  } */
.dialog .tree-layout {
  min-height: 400px;
  width: 90%;
}
.dialog .tree-layout .tree {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: absolute;
  border-right: 0px solid #d4dde2;
}
.el-dialog__body {
  min-height: 450px;
  overflow: auto;
}
.red-color {
  color: red;
}
</style>
