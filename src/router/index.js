import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Landing from '@/components/Landing'
import Login from '@/components/Login'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'FinancialVue - Home',
      requiresAuth: true,
      // guest: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: 'FinancialVue - About',
      guest: true,
    },
  },
  {
    path: '/balances',
    name: 'balances',
    component: () => import('../views/Balances.vue'),
    meta: {
      title: 'FinancialVue - Balances',
      requiresAuth: true,
      // guest: true,
    },
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('../views/Transactions.vue'),
    meta: {
      title: 'FinancialVue - Transactions',
      requiresAuth: true,
      guest: true,
    },
  },
  {
    path: '/goals',
    name: 'goals',
    component: () => import('../views/Goals.vue'),
    meta: {
      title: 'FinancialVue - Goals',
      requiresAuth: true,
      guest: true,
    },
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/User.vue'),
    meta: {
      title: 'FinancialVue - User Profile',
      requiresAuth: true,
      // guest: true,
    },
  },
  {
    path: '/landing',
    name: 'landing',
    component: Landing,
    meta: {
      title: 'FinancialVue - Landing',
      guest: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'FinancialVue - Login',
      guest: true,
    },
  },
]

const router = new VueRouter({
  routes,
  // scrollBehavior(to, from, savedPosition) {
  scrollBehavior() {
    // if (savedPosition) {
    //   return savedPosition
    // } else {
    // always navigate to top of pages
    return { x: 0, y: 0 }
  },
  // },
})

// https://www.digitalocean.com/community/tutorials/how-to-set-up-vue-js-authentication-and-route-handling-using-vue-router
router.beforeEach((to, from, next) => {
  // console.log(to)
  // console.log(from)
  // console.log(next)
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // console.log(!store.state.isUserLoggedIn)
    if (!store.state.isUserLoggedIn) {
      next({
        path: '/landing',
        params: { nextUrl: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    // don't allow login page if user is already logged in
    if (store.state.isUserLoggedIn && to.name === 'login') {
      next({
        path: '/',
        params: { nextUrl: to.fullPath },
      })
    }
    next()
  }
})

export default router
