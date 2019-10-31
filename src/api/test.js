import request from '@/utils/request'
//const BASE_URI=process.env.VUE_APP_BASE_API
// request.get('/db.json').then(res=>{
//     console.log(res.data)
// })
//测试2 以对象配置的方式进行指定请求方式
request({
    method:'get',
    // url:'/dev-api/db.json'
    url:'/db.json'
}).then(res=>{
    console.log('get2',res.data)
})

//导出默认对象
export default {
    getList(){
       const req= request({
            method:'get',
            url:'/db.json'
        })
        return req
    }
}
