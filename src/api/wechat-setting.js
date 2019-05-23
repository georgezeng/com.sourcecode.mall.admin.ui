import axios from '@/libs/api.request'

export default {
  load: () => {
    return axios.get('/setting/wechat/load')
  },
  saveGzh: (obj) => {
    return axios.post('/setting/wechat/gzh/save', obj)
  }
}
