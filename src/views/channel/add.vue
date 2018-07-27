<template>
  <section class="cms-body flex">
    <!-- 返回组件 -->
    <a class="cms-back" href="javascript:void(0)" @click="back"></a>
    <cms-tree @change="getChannelId" :copy="true"></cms-tree>
    <div class="cms-content-right">
      <el-form ref="form" :model="info" :rules="rules" class="cms-form" label-width="162px">
        <el-form-item label="上级栏目" class="flex-50" prop="parentId" v-loading="loading">
          <el-cascader class="cms-width" :props="{'value':'id','label':'name','children':'child'}" :options="channelList" v-model="info.parentId" change-on-select filterable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="栏目模型" class="flex-50" prop="modelId">
          <el-select placeholder="选择模型" v-model.number="info.modelId" class="cms-width" :disabled="true">
            <el-option v-for="item in modelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 动态表单 -->
        <template>
          <!-- 系统字段 -->
          <el-form-item v-for="(item,index) in itemList" :key="index" :label="item.label" 
          :class="[item.single?'flex-100':'flex-50']" 
          :prop="(item.custom?'attr_':'')+item.field" :rules="item.required?fieldRequied:[]">
            <!-- 文本 -->
            <el-input class="cms-width" v-model="info['attr_'+item.field]" v-if="item.dataType==1&&item.custom"></el-input>
            <el-input class="cms-width" v-model="info[item.field]" v-if="item.dataType==1
                &&!item.custom
                &&item.field!='titleImg'
                &&item.field!='contentImg'
                &&item.field!='name'"></el-input>
            <!-- 栏目内容 -->
            <el-input v-if="item.field=='name'" class="cms-width" v-model="info[item.field]" @blur="getPath"></el-input>
            <!-- 标题，内容图片 -->
            <cms-upload :src="info[item.field]" v-if="item.field=='titleImg'" :isMark="false" @change="getTitleImg"> </cms-upload>
            <cms-upload :src="info[item.field]" v-if="item.field=='contentImg'" :isMark="false" @change="getContentImg"> </cms-upload>
            <!-- 整形文本 -->
            <el-input class="cms-width" v-model.number="info['attr_'+item.field]" v-if="item.dataType==2&&item.custom" type="number" min='0'></el-input>
            <el-input class="cms-width" v-model="info[item.field]" v-if="item.dataType==2&&!item.custom"></el-input>
            <!-- 浮点形文本 -->
            <el-input class="cms-width" v-model="info['attr_'+item.field]" v-if="item.dataType==3&&item.custom"></el-input>
            <!-- 文本区 -->
            <el-input class="cms-width" v-model="info['attr_'+item.field]" type="textarea" v-if="item.dataType==4&&item.custom">
            </el-input>
            <el-input class="cms-width" v-model="info[item.field]" type="textarea" v-if="item.dataType==4&&
                    !item.custom&&
                  item.field!='txt'
                  &&item.field!='txt1'
                  &&item.field!='txt2'
                  &&item.field!='txt3'
                  &&item.field!='channelStatic'
                  &&item.field!='contentStatic'
                  "></el-input>
            <!-- 栏目静态化 -->
            <div v-if="item.field=='channelStatic'">
              <el-checkbox v-model="info.staticChannel">开启</el-checkbox>
              <el-checkbox v-model="info.accessByDir">使用目录访问</el-checkbox>
              <el-checkbox v-model="info.listChild">子栏目列表</el-checkbox>
              <label for="">每页记录数</label>
              <el-input v-model.number="info.pageSize" class="w50" type="number"></el-input>
            </div>
            <!-- 内容静态化 -->
            <div v-if="item.field=='contentStatic'">
              <el-checkbox v-model="info.staticContent">开启</el-checkbox>
            </div>
            <!-- 日期 -->
            <el-date-picker class="cms-width" v-model="info['attr_'+item.field]" type="datetime" v-if="item.dataType==5"></el-date-picker>
            <!-- 下拉列表 -->
            <el-select class="cms-width" v-model="info['attr_'+item.field]" v-if="item.dataType==6&&item.custom     
                  ">
              <el-option v-for="(opt,optIndex) in item.optValue" :key="optIndex" :label="opt" :value="opt"></el-option>
            </el-select>
            <!-- 栏目模版 -->
            <el-select class="cms-width" v-model="info[item.field]" v-if="item.field=='tplChannel'">
              <el-option label="默认" value=""></el-option>
              <el-option v-for="(item,index) in tplList.channelTpl" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <!-- 栏目手机模板 -->
            <el-select class="cms-width" v-model="info[item.field]" v-if="item.field=='tplMobileChannel'">
              <el-option label="默认" value=""></el-option>
              <el-option v-for="(item,index) in tplList.channelMobileTpl " :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <!-- 审核后 -->
            <el-select class="cms-width" v-model="info['afterCheck']" v-if="item.field=='afterCheck'">
              <el-option label="默认" value=""></el-option>
              <el-option label="不能修改删除" :value="1"></el-option>
              <el-option label="修改后退回" :value="2"></el-option>
              <el-option label="修改后不变" :value="3"></el-option>
            </el-select>
            <!-- 工作流 -->
            <el-select class="cms-width" v-model="info['workflowId']" v-if="item.field=='workflowId'">
              <el-option label="默认" value=""></el-option>
              <el-option v-for="item in workflowList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <!-- 选择模版模型 -->
            <div v-if="item.field=='tplContent'">
              <el-button type="primary" @click="tplContentVisbile=true">选择模型模板</el-button>
              <span class="gray">
                留空则继承上级栏目设置，顶层为空则所有可用模型
              </span>
            </div>
            <!-- 复选框 -->
            <!-- 自定义字段拼接名称-->
            <el-checkbox-group v-model="info['attr_'+item.field]" v-if="item.dataType==7&&item.custom">
              <el-checkbox v-for="(opt,optIndex) in item.optValue" :key="optIndex" :label="opt"></el-checkbox>
            </el-checkbox-group>
            <!-- 浏览权限 -->
            <el-checkbox-group v-model="info['viewGroupIds']" v-if="item.dataType==7&&!item.custom&&item.field=='viewGroupIds'">
              <el-checkbox v-for="(item,index) in groupList" :key="index" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
            <!--投稿权限-->
            <el-checkbox-group v-model="info['contriGroupIds']" v-if="item.dataType==7&&!item.custom&&item.field=='contriGroupIds'">
              <el-checkbox v-for="(item,index) in groupList" :key="index" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
            <!-- 单选框 -->
            <el-radio-group v-model="info['attr_'+item.field]" v-if="item.dataType==8&&item.custom">
              <el-radio :label="opt" v-for="(opt,optIndex) in item.optValue" :key="optIndex">
              </el-radio>
            </el-radio-group>
            <!-- 显示 -->
            <div v-if="item.dataType==8&&!item.custom
                    &&item.field=='display'">
              <el-radio-group v-model="info[item.field]">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
              <el-checkbox v-model="info.blank">是否打开新窗口</el-checkbox>
            </div>
            <!--是否文档图-->
            <div v-if="item.dataType==8&&!item.custom
                    &&item.field=='docImg'">
              <el-checkbox v-model="info.hasTitleImg">开启文档标题图</el-checkbox>
              <el-checkbox v-model="info.hasContentImg">开启文档内容图</el-checkbox>
            </div>
            <!-- 评论 -->
            <div v-if="item.dataType==8&&!item.custom
                    &&item.field=='commentControl'">
              <el-radio-group v-model="info['commentControl']">
                <el-radio :label="0">游客模式</el-radio>
                <el-radio :label="1">登录评论一次</el-radio>
                <el-radio :label="3">登录评论多次</el-radio>
                <el-radio :label="2">关闭评论</el-radio>
              </el-radio-group>
            </div>
            <!--顶，踩 -->
            <div v-if="item.dataType==8&&!item.custom
                    &&item.field=='allowUpdown'">
              <el-radio-group v-model="info['allowUpdown']">
                <el-radio :label="true">允许</el-radio>
                <el-radio :label="false">不允许</el-radio>
              </el-radio-group>
            </div>
            <!-- 分享 -->
            <el-radio-group v-model="info['allowShare']" v-if="item.dataType==8&&!item.custom
                        &&item.field=='allowShare'">
              <el-radio :label="true">允许</el-radio>
              <el-radio :label="false">不允许</el-radio>
            </el-radio-group>
            <!-- 评分 -->
            <el-radio-group v-model="info['allowScore']" v-if="item.dataType==8&&!item.custom
                    &&item.field=='allowScore'">
              <el-radio :label="true">允许</el-radio>
              <el-radio :label="false">不允许</el-radio>
            </el-radio-group>
            <!-- 附件 -->
            <cms-multiple-upload :src="info['attr_'+item.field]" :multiple="false" :field="'attr_'+item.field" @get="getMediaPath" :propList="info['attr_'+item.field]" btnLabel="上传" v-if="item.dataType==9&&item.custom"></cms-multiple-upload>
            <!-- 图片-->
            <cms-upload :src="info['attr_'+item.field]" :field="'attr_'+item.field" @get="getFieldImg" v-if="item.dataType==10&&item.custom"></cms-upload>
            <!--富文本编辑器-->
            <cms-editor v-if="item.field=='txt'&&dataState" :defaultMsg="info['txt']" :index="0" @ready="getUeditor"></cms-editor>
            <cms-editor v-if="item.field=='txt1'&&dataState" :defaultMsg="info['txt1']" :index="1" @ready="getUeditor"></cms-editor>
            <cms-editor v-if="item.field=='txt2'&&dataState" :defaultMsg="info['txt2']" :index="2" @ready="getUeditor"></cms-editor>
            <cms-editor v-if="item.field=='txt3'&&dataState" :defaultMsg="info['txt3']" :index="3" @ready="getUeditor"></cms-editor>
          </el-form-item>
        </template>
        <!-- 模型弹窗 -->
        <el-dialog title="选择模型模板" :visible.sync="tplContentVisbile" width="60%">
          <div v-for="(item,index) in tplAll" :key="item.id" class="model-select">
            <el-checkbox :true-label="item.id" false-label="" v-model="info.modelIds[index]">{{item.name}}</el-checkbox>
            <el-select v-model="info.tpls[index]">
              <el-option value="" label="默认"></el-option>
              <el-option v-for="tpl in item.contentTpl" :key="tpl" :value="tpl"></el-option>
            </el-select>
            <!-- 手机模版 -->
            <el-select v-model="info.mtpls[index]">
              <el-option value="" label="默认"></el-option>
              <el-option v-for="tpl in item.mobileContentTpl" :key="tpl" :value="tpl"></el-option>
            </el-select>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="tplContentVisbile = false">取 消</el-button>
            <el-button type="primary" @click="tplContentVisbile = false">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 动态表单 -->
        <div class="form-footer">
          <el-button v-if="this.id==0" type="warning" @click="add(true)" v-perms="'/channel/save'">提交并继续添加</el-button>
          <el-button v-if="this.id==0" type="primary" @click="add(false)" v-perms="'/channel/save'">提交</el-button>
          <el-button v-if="this.id!=0" type="primary" @click="update()" v-perms="'/channel/update'">修改</el-button>
          <el-button type="info" @click="$reset">重置</el-button>
        </div>
      </el-form>
    </div>
  </section>
</template>
<script>
import formMixins from "@/mixins/form";
import axios from "axios";
import va from "@/rules";
export default {
  mixins: [formMixins],
  data() {
    let self = this;
    let required = va.required();
    let number = va.number();
    let string = va.string();
    let channelPath = va.channelPath("栏目路径不能重复", "");
    return {
      /**
       * parentId
       * modelId
       * https
       * hasCollect
       */
      params: this.$route.query, //前一个页面带过来的数据
      rules: {
        //校验规则
        name: [required],
        path: [required, channelPath, string],
        parentId: [required],
        modelId: [required, number],
        priority: [required, number],
        display: [required]
      },
      fieldRequied: [
        { required: true, message: "此项必填", trigger: "change" }
      ],
      dataState: false,
      channelList: [{ hasChild: true, id: "", name: "根栏目" }], //栏目列表
      itemList: [], //动态列表
      modelList: [], //模型列表
      tplList: [], //栏目模版列表
      groupList: [], //用户组列表
      workflowList: [], //工作流
      tplAll: [], //所有模型
      info: {
        parentId: "", //上层栏目id
        modelId: "", //模型id
        modelIds: [], //模型
        tpls: [], //内容pc模型
        mtpls: [] //内容pc模型
      },
      tplContentVisbile: false, //选择模型模版弹窗
      ue: []
    };
  },
  methods: {
    back() {
      this.routerLink("/channel/list", "list", this.params.parentId);
    },
    getChannelId(data, node) {
      if (data.isChild) {
        this.params.id = data.id;
        this.routerLink("/channel/update", "update", data.id);
      } else {
        this.routerLink("/channel/list", "list", data.id);
      }
    },
    getPath(event) {
      if (event.target.value != "") {
        axios
          .post(this.$api.channelCreatPath, { name: event.target.value })
          .then(res => {
            this.info.path = res.body;
          });
      }
    },
    getMediaPath(path, field) {
      //动态媒体路径

      this.info[field] = path; //媒体路径
    },
    getUeditor(ue, index) {
      this.ue[index] = ue; //获取ue实例
    },
    getFieldImg(path, field, index, pindex) {
      this.info[field] = path;
    },
    getTitleImg(path) {
      this.info.titleImg = path;
    },
    getContentImg(path) {
      this.info.contentImg = path;
    },
    getDataInfo(id) {
      this.loading = true;
      //先获取模型id
      let modelParams = {
        modelId: this.params.modelId,
        isChannel: true
      };
      axios
        .post(this.$api.itemList, modelParams)
        .then(res => {
          this.loading = false;
          this.$refs["form"].resetFields();
          this.info.titleImg = ""; //滞空处理
          this.info.contentImg = ""; //滞空处理
          let itemList = res.body; //渲染数据字段模型
          for (let i in itemList) {
            if (itemList[i].custom) {
              //判断是否是系统字段
              if (itemList[i].dataType == 7) {
                //判断是否为多选框
                this.$set(
                  this.info,
                  "attr_" + itemList[i].field,
                  itemList[i].defValue.split(",")
                ); //转换为数组
              } else {
                this.$set(
                  this.info,
                  "attr_" + itemList[i].field,
                  itemList[i].defValue
                );
              }
            } else {
              if (itemList[i].dataType == 7) {
                this.$set(
                  this.info,
                  itemList[i].field,
                  itemList[i].defValue.split(",")
                );
              } else {
                this.$set(this.info, itemList[i].field, itemList[i].defValue);
              }
            }
          }

          this.getAllList(); //获取辅助字段列表
          this.getDefaultInfo(this.params.id); //数据回填
          this.itemList = itemList;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getDefaultInfo(id) {
      //数据回填
      if (id == 0) {
        this.info.display = true;
        this.info.allowShare = true;
        this.info.allowScore = true;
        this.info.allowUpdown = true;
        this.info.commentControl = 3;
        this.info.pageSize = 20;
        this.info.priority = 10;
      } else {
      }
    },
    getAllList() {
      //所有辅助请求
      let api = this.$api; //API地址
      if (this.params.parentId != "") {
        //栏目数据回填
        axios.post(api.channelGet, { id: this.params.parentId }).then(res => {
          this.info.parentId = res.body.nodeIds; //层级id[]
        });
      } else {
        this.info.parentId = [""]; //层级id[]
      }
      axios
        .all([
          axios.post(api.fullTextSearchChannelList, { hasContentOnly: false }), //栏目列表
          axios.post(api.modelList, { containDisabled: false }), //模型列表
          axios.post(api.tplModelList, { modelId: this.info.modelId }), //模型列表
          axios.post(api.groupList), //会员组列表
          axios.post(api.workflowList, { pageSize: 0, pageNo: 10 }),
          axios.post(api.tplSelectContentModel)
        ])
        .then(
          axios.spread((channels, models, tpls, groups, workflows, tplAll) => {
            this.channelList = this.channelList.concat(channels.body); //栏目列表
            this.modelList = models.body; //模型列表
            this.tplList = tpls.body; //所有的模版列表
            this.groupList = groups.body; //会员组列表
            this.workflowList = workflows.body; //工作流
            this.tplAll = tplAll.body; //所有模型
            if (this.params.id == 0) {
              //此处处理模型模版 添加时
              for (let i in this.tplAll) {
                this.info.modelIds.push("");
                this.info.tpls.push("");
                this.info.mtpls.push("");
              }
            }
          })
        )
        .catch(err => {
          this.loading = false;
        });
    },
    getEditorContent() {
      //处理一下栏目的富文本内容,固定只有四个
      if (this.info.txt != undefined) {
        this.info.txt = this.ue[0].getContent();
      }
      if (this.info.txt1 != undefined) {
        this.info.txt1 = this.ue[1].getContent();
      }
      if (this.info.txt2 != undefined) {
        this.info.txt2 = this.ue[2].getContent();
      }
      if (this.info.txt3 != undefined) {
        this.info.txt3 = this.ue[3].getContent();
      }
    },
    getParams() {
      //获取到处理完成给后台提交的对象
      let params = {}; //数组对象换成字符串
      let modeArr = [];
      let mtpls = [];
      let tpls = [];
      this.getEditorContent();
      for (let key in this.info) {
        params[key] = this.info[key];
      }
      for (let i in params.modelIds) {
        if (params.modelIds[i] != "") {
          modeArr.push(params.modelIds[i]);
          mtpls.push(params.mtpls[i]);
          tpls.push(params.tpls[i]);
        }
      }
      params.modelIds = modeArr;
      params.mtpls = mtpls;
      params.tpls = tpls;
      for (let key in params) {
        if (params[key] instanceof Array) {
          params[key] = params[key].join(",");
        }
      }
      params.parentId = params.parentId.substring(
        params.parentId.lastIndexOf(",") + 1
      );
      return params;
    },
    add(state) {
      //添加栏目
      let form = this.$refs["form"];
      form.validate(valid => {
        //验证方法
        if (valid) {
          this.loading = true;
          axios
            .post(this.$api.channelSave, this.getParams())
            .then(res => {
              if (res.code == "200") {
                this.successMessage("添加成功");
                if (state) {
                  this.reset();
                } else {
                  setTimeout(() => {
                    this.back();
                  }, 1000);
                }
              }
              this.loading = false;
            })
            .catch(error => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  },
  created() {
    //初始获取数据
    this.info.parentId = [this.params.parentId];
    this.info.modelId = parseInt(this.params.modelId);
    this.getDataInfo(this.id);
  },
  mounted() {
    this.dataState = true;
  }
};
</script>

<style scoped>
.model-select {
  margin-bottom: 12px;
}
</style>