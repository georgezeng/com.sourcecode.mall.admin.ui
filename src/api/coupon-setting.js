import axios from '@/libs/api.request'

export default {
  load: () => {
    return axios.get('/setting/coupon/load')
  },
  save: (obj) => {
    return axios.post('/setting/coupon/save', obj)
  }
}
