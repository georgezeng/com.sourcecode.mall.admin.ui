
import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/goods/category/recommend/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/goods/category/recommend/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/goods/category/recommend/save', obj)
  },
  delete: (ids) => {
    return axios.post('/goods/category/recommend/delete', { ids })
  }
}
