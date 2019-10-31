<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="../../assets/logo.png" width="25px" alt />
      <span class="company">大白管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        
       {{user.name}} <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-plus" command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!--修改密码 -->
    <el-dialog title="修改密码"  :visible.sync="dialogFormVisible" width="400px">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      style="width:300px"
    >
      <el-form-item label="原密码" prop="oldPass">
        <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
       <el-form-item label="确定密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { logout } from "../../api/login";
import passwordApi from '../../api/password'
export default {
  data(){
    //在return上生成自定义校验器   参考element 
    const validateOldPass=(rule, value, callback)=>{
      passwordApi.checkPwd(this.user.id,value).then(res=>{
        const resp=res.data
        if(resp.flag){
          //验证通过
          callback()
        }else{
          callback(new Error(resp.message))
        }
      })
    }
    //检验确认密码是否一致
    const validatePass=(rule, value, callback)=>{
      //value 代表checkPass
      if(value!==this.ruleForm.pass){
        callback(new Error('两次密码输入不一致'))
      }
    }
    return{
      user:JSON.parse(localStorage.getItem('db-msm-user')),//字符串转成对象
      dialogFormVisible:false,
      ruleForm:{
        oldPass:'',
        pass:'',
        checkPass:""
      },
      rules:{
        oldPass:[{required:true,message:'原密码不能为空',trigger:"blur"},
         { validator: validateOldPass, trigger: 'blur' }],
        pass:[{required:true,message:'新密码不能为空',trigger:"blur"}],
        checkPass:[{required:true,message:'确认密码不能为空',trigger:"blur"},
         { validator: validatePass, trigger: 'change' }],
        
      },

    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          //打开修改密码
      this.handlePwd()
          break;
        case "b":
          this.handleLogout();
          break;

        default:
          break;
      }
    },
    handleLogout() {
      //退出系统

      //  const token= localStorage.setItem('db-msm-token')
      //getItem获取
      logout(localStorage.getItem("db-msm-token")).then(res => {
        const resp = res.data;
        if (resp.flag) {
          //      退出成功
          //清楚本地数据
          localStorage.removeItem("db-msm-token");
          localStorage.removeItem("db-msm-user");
          //回到登录页面
          this.$router.push("/login");
        } else {
          this.$message({
            message: resp.message,
            type: "warning",
            duration: 500
          });
        }
      });
    },
    handlePwd(){
      this.dialogFormVisible=true
      this.$nextTick(()=>{
        this.$refs['ruleForm'].resetFields()
      })
    },
    submitForm(formNmae){
        this.$refs[formNmae].validate(val=>{
          if(val){
            console.log('校验成功')
            passwordApi.updatePwd(this.user.id,this.checkPwd).then(res=>{
              const resp=res.data
              this.$message({
                message:resp.message,
                typer:resp.flag ? 'success':'warning'
              })
              if(resp.flag){
                //退出系统
                this.handleLogout()
                //关闭窗口
                this.dialogFormVisible=false
              }
            })
          }else{
            return false
          }
        })
    }
  }
};
</script>
      <style>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0 40px;
}
.company {
  color: white;
  position: absolute;
}
/* 下拉菜单 */
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  color: white;
  cursor: pointer;
}
.header {
}
</style>