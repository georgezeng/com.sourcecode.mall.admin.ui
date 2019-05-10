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
  loadDefinitions: (id) => {
    return axios.get('/goods/specification/definition/listInGroup/params/' + id)
  },
  save: (obj) => {
    return axios.post('/goods/specification/definition/save', obj)
  },
  relate: (ids, status, id) => {
    return axios.post('/goods/specification/definition/relate/params/' + id + '/' + status, {ids})
  },
  delete: (ids) => {
    return axios.post('/goods/specification/definition/delete', {ids})
  }
}
