
import axios from "axios";
import api from "@/api/api"

 function checkTagName(id) {
    return {
        validator: (rule, value, callback) => {
            axios.post(api.wordTagCheckName,{id:id,name:value}).then(res=>{
                if(res.code=='200'){
                    if (res.body.result){
                        callback()
                    }else{
                        callback(new Error('名字已存在'));      
                    } 
                }else{
                    callback(new Error('服务器响应异常'));  
                }      
            })
        }, trigger: 'blur'
  }
}
function required(message) {//必填
    return { required: true, trigger: 'blur', message: '此项必填' }
}
function validateName(message) {//用户名唯一
    return {
        validator: (rule, value, callback) => {
            axios.post(api.validateName,{username:value}).then(res=>{
                if(res.code=='200'){
                    if (res.body.result){
                        callback()
                    }else{
                        callback(new Error('用户名已存在'));      
                    } 
                }else{
                    callback(new Error('服务器响应异常'));  
                }      
            })
        }, trigger: 'blur'
    }
}
function channelPath(message,id) {//栏目路径
    return {
        validator: (rule, value, callback) => {
            axios.post(api.channelCheckPath, { id:id,path: value}).then(res => {
                if (res.code == '200') {
                    if (res.body=='true') {
                        callback()
                    } else {
                        callback(new Error('栏目路径已存在'));
                    }
                } else {
                    callback(new Error('服务器响应异常'));
                }
            })
        }, trigger: 'change'
    }
}
function checkModeId(message,id) {
    return {
        validator: (rule, value, callback) => {
                if(value!==''){
                axios.post(api.modelCheckId, {id:value}).then(res => {
                    if (res.code == '200') {
                        if (res.body.result == false) {
                            callback(new Error('id已存在'))
                        } else {
                            callback();
                        }
                    } else {
                        callback(new Error('验证失败'));
                    }
                })
        }
        }, trigger: 'blur'
    }
}

function email(message) {//email
    return {
        validator: (rule, value, callback) => {
                if(value===''){
                    callback();    
                }
                let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                if (!reg.test(value)) {
                    callback(new Error('请输入正确的邮箱地址'));
                } else {
                    callback();
                }     
        }, trigger: 'blur' }
}
function number(message) {//数字
    return {
        validator: (rule, value, callback) => {
            if(value===''){
                callback();
            }
            let reg = /^[0-9]+$/;
            if (!reg.test(value)) {
                callback(new Error('只能输入数字'));
            } else {
                callback();
            }
        }, trigger: 'blur'
    }
}
function level(val) {//级别  小于等于自身
    return {
        validator: (rule, value, callback) => {
            if (value>val) {
                callback(new Error("只能小于等于自身"));
            } else {
                callback();
            }
        }, trigger: 'blur'
    }
}
function double(message) {//浮点型数字
    return {
        validator: (rule, value, callback) => {
            let reg = /[0-9]+$/;
            if (!reg.test(value)) {
                callback(new Error("只能是数字"));
            } else {
                callback();
            }
        }, trigger: 'blur'
    }
}
function numberLim(message) {//数字限制最大长度
    return {
        validator: (rule, value, callback) => {
            let reg = /^[0-9]{0,5}$/;
            if (!reg.test(value)) {
                callback(new Error("只能输入正整数,并且长度不能超过5"));
            } else {
                callback();
            }
        }, trigger: 'blur'
    }
}
function string(message) {//只能输入英文
    return {
        validator: (rule, value, callback) => {
            let reg = /^[a-zA-Z0-9]+$/;
            if (!reg.test(value)) {
                callback(new Error('只能输入英文或数字'));
            } else {
                callback();
            }
        }, trigger: 'blur'
    }
}
function NumAndStr(message){//只能小写字母或者数字
    return {
        validator: (rule, value, callback) => {
            let reg = /^[a-z0-9]+$/;
            if (!reg.test(value)) {
                callback(new Error('只能是小写字母和数字'));
            } else {
                callback();
            }
        }, trigger: 'blur'
    }

}

function mobile(message) {//移动手机号
    return {
        validator: (rule, value, callback) => {
            if(value===''){
                callback();
            }
            else{
            let reg = /^1\d{10}$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的手机号'));
            } else {
                callback();
            }
        }}, trigger: 'blur'
    }
}

function tel(message) {//固定电话
    return {
        validator: (rule, value, callback) => {
            if (value === '') {
                callback();
            }
            else {
            let reg = /^0\d{2,3}-?\d{7,8}$/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的固定电话'));
            } else {
                callback();
            }
        }}, trigger: 'blur'
    }
}
export default{
    required,
    email,
    number,
    validateName,
    NumAndStr,
    mobile,
    tel,
    string,
    channelPath,
    numberLim,
    double,
    checkModeId,
    level,
    checkTagName,
}
