import axios from '@/libs/api.request'

export default {
  load: () => {
    return axios.get('/setting/wechat/load')
  },
  save: (obj) => {
    return axios.post('/setting/wechat/save', obj)
  }
}
