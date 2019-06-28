import Vue from 'vue'
import Router from 'vue-router'

import * as dd from 'dingtalk-jsapi'

import Home from '@/components/Home'

// import Dashboard from '@/components/Dashboard'

import BookList from '@/components/book/list'
import BookCategoryList from '@/components/bookcategory/list'

import UserList from '@/components/user/list'
import UserChangePwd from '@/components/user/changepwd'
import UserProfile from '@/components/user/profile'


// 运维管理
// 排班
import OrderClass from '@/components/mgmt/orderClass'
// 出勤管理
import attenDance from '@/components/mgmt/attendance'
// 运维配置
import tecOper from '@/components/mgmt/tecOper'

// 人员配置
import personalOrder from '@/components/mgmt/personalOrder'

// 行政管理
// 通知
import notice from '@/components/administration/notice'

// 人事管理
import kaohe from '@/components/personal/kaohe'

// 通用配置
// 分组设置
import groupsets from '@/components/purpose/groupsets'
import holidaysets from '@/components/purpose/holidaysets'

// 懒加载方式，当路由被访问的时候才加载对应组件
// const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
// mode: 'history',
  routes: [
    // {
    //   path: '/login',
    //   name: '登录',
    //   component: Login
    // },

    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home,
    //   redirect: '/dashboard',
    //   leaf: true, // 只有一个节点
    //   menuShow: true,
    //   iconCls: 'iconfont icon-home', // 图标样式class
    //   children: [
    //     {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
    //   ]
    // },
    {
      path: '/',
      component: Home,
      name: '用户管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/user/list', component: UserList, name: '用户列表', menuShow: true}
      ]
    },

    {
      path: '/',
      component: Home,
      name: '运维管理',
      menuShow: true,
      iconCls: 'iconfont icon-leaf',
      children: [
        {path: '/mgmt/orderClass', component: OrderClass, name: '排班管理', menuShow: true},
        {path: '/mgmt/attendance', component: attenDance, name: '出勤管理', menuShow: true},
        {path: '/mgmt/tecOper', component: tecOper, name: '运维配置', menuShow: true},
        {path: '/mgmt/personalOrder', component: personalOrder, name: '人员配置', menuShow: true},
      ]
    },

    {
      path: '/',
      component: Home,
      name: '行政管理',
      menuShow: true,
      iconCls: 'iconfont icon-books',
      children: [
        {path: '/administration/notice', component: notice, name: '消息通知', menuShow: true},
      ]
    },

    {
      
      path: '/',
      component: Home,
      name: '人事管理',
      menuShow: true,
      iconCls: 'iconfont icon-books2',
      children: [
        {path: '/personal/kaohe', component: kaohe, name: '绩效考核', menuShow: true},
      ]
    },

    {
      path: '/',
      component: Home,
      name: '通用配置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/purpose/groupsets', component: groupsets, name: '分组设置', menuShow: true},

        {path: '/purpose/holidaysets', component: holidaysets, name: '节假日设置', menuShow: true},
      ]
    },

    {
      path: '/',
      component: Home,
      name: '图书管理',
      menuShow: true,
      iconCls: 'iconfont icon-books',
      children: [
        {path: '/book/list', component: BookList, name: '图书列表', menuShow: true},
        {path: '/book/category', component: BookCategoryList, name: '图书分类', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/user/profile', component: UserProfile, name: '个人信息', menuShow: true},
        {path: '/user/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true}
      ]
    }
  ]
})

// 路由钩子
// router.beforeEach((to, from, next) => {
//   // console.log('to:' + to.path)
//   if (to.path.startsWith('/login')) {
//     window.localStorage.removeItem('access-user')
//     next()
//   } else {
//     let user = JSON.parse(window.localStorage.getItem('access-user'))
//     if (!user) {
//       next({path: '/login'})
//     } else {
//       next()
//     }
//   }
// })



export default router
