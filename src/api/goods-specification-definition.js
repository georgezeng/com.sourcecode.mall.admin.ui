import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/goods/specification/definition/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/goods/specification/definition/load/params/' + id)
  },
  loadGroups: (id) => {
    return axios.get('/goods/specification/definition/groups/params/' + id)
  },
  save: (obj) => {
    return axios.post('/goods/specification/definition/save', obj)
  },
  delete: (ids) => {
    return axios.post('/goods/specification/definition/delete', { ids })
  }
}
