import axios from '@/libs/api.request'

export default {
  listCategory: () => {
    return axios.get('/article/category/list/all')
  },
  list: (queryInfo) => {
    return axios.post('/article/list', queryInfo)
  },
  delete: (ids) => {
    return axios.post('/article/delete', {ids})
  },
  load: (id) => {
    return axios.get('/article/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/article/save', obj)
  }
}
