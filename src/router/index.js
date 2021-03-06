import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'

Vue.use(Router)
const { homeName } = config
const LOGIN_PAGE_NAME = 'Login'
const accessPages = [LOGIN_PAGE_NAME, 'Register', 'ForgetPassword']
const PAGE_404_NAME = 'error_404'
const PAGE_401_NAME = 'error_401'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: PAGE_401_NAME }) // 无权限，重定向到401页面
}

const router = new Router({
  routes,
  // mode: 'history'
  mode: 'hash'
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token) {
    let found = false
    for (let i in accessPages) {
      let name = accessPages[i]
      if (name === to.name) {
        found = true
        break
      }
    }
    if (found) {
      next()
    } else {
      // 未登录且要跳转的页面不是登录页
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
    }
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (to.name === PAGE_401_NAME) {
      next()
      return
    }
    if (to.name === PAGE_404_NAME) {
      next()
      return
    }
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        turnTo(to, user.authorities, next)
      }).catch(ex => {
        setToken('')
        next({
          name: LOGIN_PAGE_NAME
        })
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
