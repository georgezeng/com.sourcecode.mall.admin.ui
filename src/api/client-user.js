import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/client/user/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/client/user/load/params/' + id)
  },
  updateStatus: (ids, enabled) => {
    return axios.post('/client/user/updateStatus/params/' + enabled, { ids })
  }
}
