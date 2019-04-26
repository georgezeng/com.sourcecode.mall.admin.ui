import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/goods/specification/group/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/goods/specification/group/load/params/' + id)
  },
  loadCategories: () => {
    return axios.get('/goods/specification/group/categories')
  },
  save: (obj) => {
    return axios.post('/goods/specification/group/save', obj)
  },
  delete: (ids) => {
    return axios.post('/goods/specification/group/delete', { ids })
  }
}
