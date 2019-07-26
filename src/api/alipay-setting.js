import axios from '@/libs/api.request'

export default {
  load: () => {
    return axios.get('/setting/alipay/load')
  },
  save: (obj) => {
    return axios.post('/setting/alipay/save', obj)
  }
}
