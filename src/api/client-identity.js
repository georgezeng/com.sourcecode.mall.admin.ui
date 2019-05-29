import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/client/identity/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/client/identity/load/params/' + id)
  },
  updateStatus: (ids, status, parentId, reason) => {
    return axios.post('/client/identity/updateStatus', {
      ids,
      reason,
      pass: status
    })
  }
}
