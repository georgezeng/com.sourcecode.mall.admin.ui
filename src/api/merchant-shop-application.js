import axios from '@/libs/api.request'
import qs from 'qs'

export default {
  load: () => {
    return axios.get('/merchant/shop/application/load')
  },
  save: (obj) => {
    return axios.post('/merchant/shop/application/apply', obj)
  },
  update: (obj) => {
    return axios.post('/merchant/shop/application/update', obj)
  }
}
