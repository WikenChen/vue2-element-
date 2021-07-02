import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout/index'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/login',
    name: 'login',
    hidden: true, //不在slider显示
    component: () =>
      import('@/views/login/login.vue'),
    meta: { keepAlive: false, title: '登录' },
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    hidden: true, //不在slider显示
    children: [{
        path: "dashboard",
        name: "dashboard",
        meta: {title: "首页"},
        component: () =>
            import("@/views/dashboard/index.vue")
    }]
  },
  {
    path: "/dashboard",
    name: 'Dashboard',
    component: Layout,
    meta: { title: "首页", icon: "el-icon-s-home" }
  },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    redirect: { path: '/system/user' },
    meta: { keepAlive: true, title: '系统设置', icon: 'el-icon-menu' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/system/user/list.vue'),
        meta: { keepAlive: true, title: '用户管理' }
      }
    ]
  },

  {
    path: '*',
    name: 'notfound',
    hidden: true, //不在slider显示
    component: () =>
      import('@/views/404.vue'),
    meta: { keepAlive: true }
  }
]
})

router.beforeEach((to, from, next) => {
  //   //获取token
  const hasToken = localStorage.getItem("projectxx_token")
  if (hasToken) {
  //token存在，如果当前跳转的路由是登录界面
    if (to.path === '/login') {
      router.push({ name: 'admin' });
    }
  } else {
    //token不存在
    if(to.path !== '/login'){
      router.push({name: 'login', replace: true})
    }
  }
  next();
})

export default router
