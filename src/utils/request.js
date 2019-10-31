import  axios from 'axios'
import { Loading } from 'element-ui';
import { Message } from 'element-ui';
const loading={
    loadingInstance:null,//Loading实例
    //打开加载
    open(){
        if(this.loadingInstance==null){
     //创建实例，而且会打开加载 窗口
     this.loadingInstance= Loading.service({target:'.main',text:'拼命加载中....',background:'rgba(0,0,0,0.5)'});
        }
        
   


    },
    //关闭加载
    close(){
        
        //不为空的时候则关闭窗口
       if(this.loadingInstance!==null){
           console.log('关闭',this.loadingInstance)
            this.loadingInstance.close()
       }
        this.loadingInstance=null
    }
}
//自定义封装的Axios异步对象
const request= axios.create({
    //db.json 通过axios> /dev-api/db.json > 通过代理转发(vue.config.js)http://localhost:8001/dev-api/db.json
    // baseURL:'/dev-api',
    baseURL:process.env.VUE_APP_BASE_API,
  //  baseURL:'/',前缀路径
    timeout:5000//请求超时5000毫秒
})
// request.get('/db.json').then(res=>{
//      console.log(res.data)
//  })


//请求拦截器
request.interceptors.request.use(config =>{
    //请求拦截
    loading.open()
    return config
},error=>{
    //关闭
    loading.close()
    //出现异常
    return Promise.reject(error)
})
//响应拦截器
request.interceptors.response.use(res=>{
    loading.close()
    const resp=res.data
    
  
    //后台正常响应的状态，如果不是2000说明后台处理有问题
    if(resp.code!==2000){
        Message({
            message:resp.message||'系统异常',
            type:'warning',
            duration:5 * 1000
        })
    }
        return res 
        
},error=>{
    loading.close()
 Message({
     message:error.message,
     type:'error',
     duration:5*1000
 })
    return Promise.reject(error)
})
 export default request //导出自定义创建的 axios对象