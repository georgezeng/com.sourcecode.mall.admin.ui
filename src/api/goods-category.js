import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/goods/category/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/goods/category/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/goods/category/save', obj)
  },
  delete: (ids) => {
    return axios.post('/goods/category/delete', { ids })
  }
}
