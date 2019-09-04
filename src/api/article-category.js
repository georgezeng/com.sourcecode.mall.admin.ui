import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/article/category/list', queryInfo)
  },
  delete: (ids) => {
    return axios.post('/article/category/delete', {ids})
  },
  load: (id) => {
    return axios.get('/article/category/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/article/category/save', obj)
  }
}
