<template>
  <div>
 <app-header></app-header>
  <app-main></app-main>  
   <app-navber></app-navber> 
  </div>
</template>
<script>
import AppHeader from './APPHeader/index'
import AppMain from './AppMain/index'
import AppNavber from './AppNavbar/index'
export default {
    components:{
        AppHeader,
        AppMain,
        AppNavber
    }
}
</script>
<style scoped>
    /* 头部 */
    .header{
        position: absolute;
        line-height: 51px;
        background-color: black;
        top: 0px;
        left: 0px;
        right: 0px;
    }
    .navbar{
        position: absolute;
        width: 230px;
        background-color: #545c64;
        top: 50px;
        left: 0px;
        bottom: 0px;
        /* 数据太多出现滚动条 */
        overflow-y: auto;
    }
    .main{
        position: absolute;
        top: 50px;
        left: 230px;
        right: 0px;
        bottom: 0px;
        padding: 10px;
        overflow-y:auto;  
    }
    
</style>