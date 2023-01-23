import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'
import NProgress from 'nprogress'
NProgress.configure({
  showSpinner: false
})
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息通知' }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '个人中心' }
        }
      ]
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' }
    },
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/ConsultDep.vue'),
      meta: { title: '选择科室' }
    },
    {
      path: '/consult/illness',
      component: () => import('@/views/Consult/ConsultIllness.vue'),
      meta: { title: '病情描述' }
    },
    {
      path: '/consult/pay',
      component: () => import('@/views/Consult/ConsultPay.vue'),
      meta: { title: '问诊支付' }
    }
  ]
})

// 访问权限控制,路由前置守位
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 用户仓库
  const store = useUserStore()
  // 不需要登录的页面，白名单
  const whiteList = ['/login', '/register']
  // 有token
  if (store.userInfo?.token) {
    // 跳转的页面是登录页面
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 没有token
    // 是否位白名单
    // 在白名单中
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
})
// 路由后置守位
router.afterEach((to) => {
  // 修改标题
  document.title = `优医问诊-${to.meta.title || ''}`
  NProgress.done()
})

export default router
