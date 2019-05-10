import API from '@/api/goods-item'
import GroupAPI from '@/api/goods-specification-group'
import config from '@/config/index'

export default {
  state: {
    groups: []
  },
  mutations: {
    setGoodsSpecificationGroups(state, groups) {
      state.groups = groups
    }
  },
  getters: {
  },
  actions: {
  }
}
