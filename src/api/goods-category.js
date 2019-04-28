import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/goods/category/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/goods/category/load/params/' + id)
  },
  loadAllParents: () => {
    return axios.get('/goods/category/load/allParents')
  },
  save: (obj) => {
    return axios.post('/goods/category/save', obj)
  },
  delete: (ids) => {
    return axios.post('/goods/category/delete', { ids })
  }
}
