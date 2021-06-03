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
    component: () =>
      import('@/views/login/login.vue'),
    meta: { keepalive: false, title: '登录', noMenu: true },
  },

  {
    path: '/',
    name: 'home',
    redirect: { path: '/system/user' },
    meta: { keepalive: false, noMenu: true },
  },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    redirect: { path: '/system/user' },
    meta: { keepalive: false, title: '系统设置', icon: 'el-icon-menu' },
    children: [
      {
        path: '/system/user',
        name: 'user',
        component: () => import('@/views/system/user/list.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: '/system/config',
        name: 'config',
        component: () => import('@/views/system/config/list.vue'),
        meta: { title: '通用配置' }
      }
    ]
  },
  {
    path: '/basic',
    name: 'basic',
    component: Layout,
    meta: { keepalive: false, title: '系统管理', icon: 'el-icon-location' },
  },

  {
    path: '*',
    name: 'notfound',
    component: () =>
      import('@/views/404.vue'),
    meta: { keepalive: true, noMenu: true }
  }
]
})

router.beforeEach((to, from, next) => {
  //   //获取token
  const hasToken = localStorage.getItem("gone_token")
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
