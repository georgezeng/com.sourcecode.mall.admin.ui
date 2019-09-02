import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/advertisement/list', queryInfo)
  },
  delete: (ids) => {
    return axios.post('/advertisement/delete', {ids})
  },
  load: (id) => {
    return axios.get('/advertisement/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/advertisement/save', obj)
  }
}
