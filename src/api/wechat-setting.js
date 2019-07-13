import axios from '@/libs/api.request'

export default {
  loadGzh: () => {
    return axios.get('/setting/wechat/gzh/load')
  },
  saveGzh: (obj) => {
    return axios.post('/setting/wechat/gzh/save', obj)
  }
}
