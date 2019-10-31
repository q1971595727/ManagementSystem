import Vue from "vue";
import Router from "vue-router";
// import Login from "./views/login/index.vue"
//下面请看 默认导入./view/login目录下的index.vue组件
import Login from "./views/login"
import Layout from './components/Layout.vue'
import Home from './views/home/index.vue'
import Member from './views/member'
import Supplier from './views/supplier'
import Goods from './views/goods'
import Staff from './views/staff'
import AppTest from './components/AppTest/index.vue'
Vue.use(Router);

export default new Router({
 // mode: "history",
  routes:[
    {path:'/login',name:'login',component:Login},
    // redirect重新定向 Home
    {path:'/',name:'layout',component:Layout,redirect:'/home',children:[
      {path:'/home',component:Home,meta:{title:'首页'}},
      // {path:'/member',component:Member}
    ]},
    {
      path:'/member',
      component:Layout,
      children:[
        {path:'/',component:Member,meta:{title:'会员管理'}}
      ]
    },
    {
      path:'/supplier',
      component:Layout,
      children:[
        {path:'/',component:Supplier,meta:{title:'供应商管理'}}
      ]
    },{
      path:'/goods',
      component:Layout,
      children:[
        {path:'/',component:Goods,meta:{title:'商品管理'}}
      ]
    },
    {
      path:'/staff',
      component:Layout,
      children:[
        {path:'/',component:Staff,meta:{title:'员工管理'}}
      ]
    },{
      path:'/apptest',
      component:AppTest
    }
    
  ]
});
