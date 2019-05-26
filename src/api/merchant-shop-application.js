import axios from '@/libs/api.request'
import qs from 'qs'

export default {
  load: (fromGoods) => {
    return axios.get('/merchant/shop/application/load?fromGoods=' + (fromGoods ? 'true' : 'false'))
  },
  save: (obj) => {
    return axios.post('/merchant/shop/application/apply', obj)
  },
  update: (obj) => {
    return axios.post('/merchant/shop/application/update', obj)
  }
}
