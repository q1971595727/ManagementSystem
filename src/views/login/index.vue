<template>
  <div class="login-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
      <h2 class="login-title">大白管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {login,getUserInfo} from '../../api/login'
export default {
  data() {
    return {
      form: {
        username:'',
        password:''
      },
      rules:{
          username:[
              { required: true, message: '账号不能为空', trigger: 'blur' },
          ],
          password:[
              { required: true, message: '密码不能为空', trigger: 'blur' },
          ]
      }

    };
  },
  methods: {
   
    submitForm(formName) {
      this.$refs[formName].validate(valid=>{
          //console.log(vlid)
          if(valid){
              // 提交表单给后台进行验证和是否正确
            login(this.form.username,this.form.password).then(res=>{
              const resp=res.data
              console.log(resp,resp.flag,resp.data.token)
              if(resp.data.token==this.form.username||resp.data.mima==this.form.password){
                //验证成功，通过token 去获取用户信息
                getUserInfo(resp.data.token).then(res=>{
                  const respUser=res.data
                  if(respUser.flag){
                  //获取到用户信息
                  console.log('userInfo',respUser.data)
                  //保存token,用户信息
                  //setItem设置
                  localStorage.setItem('db-msm-user',JSON.stringify(respUser.data))
                   localStorage.setItem('db-msm-token',resp.data.token)
                   this.$message({
                   message: resp.message,
                   type: 'success'
                   });
                   //前往首页
                   this.$router.push('/')
                  }else{
                        this.$message({
                     message: '用户信息获取失败',
                     type: 'warning'
                     })
                  }
                })
              }else{
               
               this.$message({
                     message: '账号或者密码错误',
                     type: 'warning'
                     })
      
                this.form.username="";
                this.form.password="";
              }
            })
          }else{
              console.log("验证失败")
              return false
          }
      }) 
  }
 }
};
</script>
<style spoced>
.login-form {
  width: 350px;
  /* 上下160px 左右居中 */
  margin: 160px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 28px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/1.jpg");
}
.login-title {
  color: #303133;
  text-align: center;
}
</style>