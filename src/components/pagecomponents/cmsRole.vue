<template>
    <div class="cms-role">
         <ul id="treeDemo" class="ztree"></ul>
    </div>
</template>

<script>
import "@/plugs/jquery.ztree.all.min";
import roles from "@/router/roles";
export default {
  name: "cms-role",
  props: {
    perms: {
     
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      treeObj: {},
      zNodes: roles,
      setting: {
        //配置
        check: {
          enable: true
        },
        data: {},
        callback: {
          onClick: this.onShow,
          onCheck: this.creatRoles //获取点击的name
        },
        view: {
          dblClickExpand: false //屏蔽掉双击事件
        }
      }
    };
  },
  methods: {
    onShow(e, treeId, treeNode) {
      //单击显示
      this.treeObj.expandNode(treeNode);
    },
    setDefaultCheck() {
      //数据回填 
      for (let i in this.perms) {
        let tmpNode = this.treeObj.getNodesByParam("role", this.perms[i]);
        if (tmpNode.length > 0) {
          this.treeObj.checkNode(tmpNode[0], true, false, true);
        }
      }
     let indexRole = this.treeObj.getNodesByParam("role", '/index');  
      this.treeObj.checkNode(indexRole[0],true, false, true);
    },
    creatRoles(event, treeId, treeNode) {
      //构造权限
      let role = [];
      let nodes = this.treeObj.getCheckedNodes(true);
      for (let i in nodes) {
        role.push(nodes[i].role);
        if (nodes[i].api != undefined) {
          for (let j in nodes[i].api) {
            let rep_str = nodes[i].api[j];
            role.push(rep_str);
          }
        }
      }
      this.$emit("change", role.join(","));
    }
  },
  watch: {
    perms: {
      handler(curVal, oldVal) {
        this.setDefaultCheck();
      },
      deep: true
    }
  },
  mounted() {
    this.setting.check.chkboxType = { Y: "ps", N: "ps" };
    this.treeObj = $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
  }
};
</script>

<style scoped lang="scss">

</style>
