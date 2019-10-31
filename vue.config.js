//导出
module.exports={
    devServer:{
        port:8888,//端口号，如果端口号被占用会自动提升1
        host:"localhost",//主机名
        https:false,//协议
        open:true,//启动服务时自动打开浏览器访问
        proxy:{//开发环境代理配置
          //  'dev-api':{
              //动态获取
            [process.env.VUE_APP_BASE_API]:{
                //目标服务器地址，代理访问 http://localohost:8001
                target:process.env.VUE_APP_SERVICE_URL,
                changeOrigin:true,//开启代理服务器
                pathRewrite:{
                    ///dev-api/db.json最终会发生http://localohost:8001/db.js
                    //将请求地址前缀 /dev-api替换为空
                    ['^'+process.env.VUE_APP_BASE_API]:''
                }
            }
        }
    },
    lintOnSave:false,//关闭格式检查
    productionSourceMap:false//打包不会生成.map文件加快打包速度
}