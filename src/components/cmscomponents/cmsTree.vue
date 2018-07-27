<template>
  <div class="tree-layout">
            <div class="tree">
                <div class="reflash"  >
                  <div @click="reflashClick"><span class="el-icon-refresh" :class="[rotating?'rotating':'']"> </span> 刷新 </div>
                   <div v-if="copy" @click.self="clickEvent" class="copy-channel">复制栏目</div>
                    </div>
                <el-tree :props="props" :load="ansyTree" lazy :indent='16' node-key="id" 
                :default-expanded-keys="['']"
                @node-click="getNodes"
                v-if="refash"
                ></el-tree>
            </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props:{
    copy:{
      type:Boolean,
      default:false
    },
    hasContent:{
      type:Boolean,
      default:false
    }
  },

  data() {
    return {
        props: {
        label: "name",
        children: "zones",
        isLeaf: "isChild",
        id: "id"
      },
      root:'',
      refash:true,
      rotating:true
    };
  },
  methods: {
   clickEvent(){
     this.routerLink('/channel/copy','copy',0);
   }, 
     reflashClick(){
         this.refash=false;
         setTimeout(() => {
             this.refash=true;      
         },100);
     },
     getNodes(data,node){  
      
       this.$emit('change',data,node);
     },
    ansyTree(node, resolve) {
        let api=this.$api;
      //异步加载树形结构
      if (node.level === 0) {
      
        return resolve([
          {
            name: "根目录",
            id: ''
          }
        ]);
         
      }
      if (node.level > 0) {
             this.rotating=true;
        axios.post(api.contentTree,{root:node.data.id,hasContent:this.hasContent}).then(res => {
            this.rotating=false;
            const data = [];
            for (let i in res.body) {
              let obj = {};
              obj.id = res.body[i].id;
              obj.isChild = res.body[i].childCount>0 ? false : true;
              obj.name = res.body[i].name;
              obj.data=res.body;
              data.push(obj);
            }
            return resolve(data);
          }).catch(error=>{ this.rotating=false;});
      }
    }
  }
};
</script>

<style lang='scss' scoped>
   @keyframes rotating{
        from{transform:rotate(0)}
        to{transform:rotate(360deg)}
}
.rotating{
        animation:rotating 1.2s linear infinite
}
.copy-channel{
  color: #4184b7;
}
</style>
