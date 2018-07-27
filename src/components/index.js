import appMain from "@/components/appMain.vue";
import cmsInput from './pagecomponents/cmsInput.vue'//横向标签组件
import cmsButton from './pagecomponents/cmsButton.vue'//cms图标按钮组件
import cmsPagination from './pagecomponents/cmsPagination.vue'//cms分页
import cmsBack from './pagecomponents/cmsBack.vue'//cms返回
import cmsRole from './pagecomponents/cmsRole.vue'//cms角色
import cmsUpload from './pagecomponents/cmsUpload.vue'//cms上传
import cmsTree from './cmscomponents/cmsTree.vue'
import cmsSiteTree from './cmsComponents/cmsSiteTree.vue'//站点树插件
import cmsEditor from './pagecomponents/cmsEditor.vue'
import cmsFileUpload from './pagecomponents/cmsFileUpload.vue'
import cmsAdvertise from '@/views/config/directive/cmsAdvertise.vue'
import cmsChannel from '@/views/config/directive/cmsChannel.vue'
import cmsComment from '@/views/config/directive/cmsComment.vue'
import cmsContent from '@/views/config/directive/cmsContent.vue'
import cmsAttachUpload from './pagecomponents/cmsAttachUpload.vue'
import cmsMultipleUpload from './pagecomponents/cmsMultipleUpload.vue'
import cmsPictrues from './pagecomponents/cmsPictrues.vue'
import cmsExportUpload from './pagecomponents/cmsExportUpload'
import cmsTopic from '@/views/config/directive/cmsTopic.vue'
import cmsTag from '@/views/config/directive/cmsTag.vue'
import cmsSiteDialog from './cmscomponents/cmsSiteDialog.vue'
import cmsDepartment from './cmscomponents/cmsDepartment.vue'
// 这里是重点
const cmsComponents = {
    install: function (Vue) {
        Vue.component('cmsInput', cmsInput);
        Vue.component('cmsButton', cmsButton);
        Vue.component('cmsPagination', cmsPagination);
        Vue.component('cmsBack', cmsBack);
        Vue.component('cmsRole', cmsRole);
        Vue.component('appMain', appMain);
        Vue.component('cmsUpload', cmsUpload);
        Vue.component('cmsSiteTree',cmsSiteTree);
        Vue.component('cmsTree', cmsTree);
        Vue.component('cmsEditor', cmsEditor);
        Vue.component('cmsFileUpload',cmsFileUpload);
        Vue.component('cmsAdvertise', cmsAdvertise);
        Vue.component('cmsChannel', cmsChannel);
        Vue.component('cmsComment', cmsComment);
        Vue.component('cmsContent', cmsContent);
        Vue.component('cmsAttachUpload', cmsAttachUpload);
        Vue.component('cmsMultipleUpload', cmsMultipleUpload);
        Vue.component('cmsPictrues', cmsPictrues);   
        Vue.component('cmsTopic', cmsTopic);  
        Vue.component('cmsTag', cmsTag); 
        Vue.component('cmsSiteDialog', cmsSiteDialog);
        Vue.component('cmsDepartment',cmsDepartment);
        Vue.component('cmsExportUpload', cmsExportUpload);
    }
}

// 导出组件
export default cmsComponents