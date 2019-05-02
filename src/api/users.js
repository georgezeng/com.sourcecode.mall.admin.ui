import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/user/list', queryInfo)
  },
  delete: (ids) => {
    return axios.post('/user/delete', {ids})
  },
  load: (id) => {
    return axios.get('/user/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/user/save', obj)
  },
  saveCurrent: (obj) => {
    return axios.post('/user/current/save', obj)
  },
  updatePassword: (obj) => {
    return axios.post('/user/current/modifyPassword', obj)
  },
  updateStatus: (ids, status) => {
    return axios.post('/user/updateStatus/params/' + status, {ids})
  }
}
