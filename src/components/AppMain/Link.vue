<template>
   <el-breadcrumb separator="/" v-show="$route.path!=='/home'">
    <!--获取当前路由地址 -->
      <el-breadcrumb-item class="elt" :to="{ path: $route.path }">{{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<style scoped>
   .el-breadcrumb{
      height: 10px;
      padding: 20px;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
   }
   .elt{
      border-left: 3px solid green;
      padding-left:10px;
   }
</style>