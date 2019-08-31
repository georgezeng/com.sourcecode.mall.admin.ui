import axios from '@/libs/api.request'

export default {
  list: () => {
    return axios.post('/client/level/setting/list')
  },
  load: (id) => {
    return axios.get('/client/level/setting/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/client/level/setting/save', obj)
  },
  clear: (id) => {
    return axios.get('/client/level/setting/clear/params/' + id)
  }
}
