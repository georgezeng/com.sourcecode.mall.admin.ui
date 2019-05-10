import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import goodsItem from './module/goods-item'
import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    goodsItem,
    app
  }
})
