import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/client/activityEvent/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/client/activityEvent/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/client/activityEvent/save', obj)
  },
  delete: (ids) => {
    return axios.post('/client/activityEvent/delete', {ids})
  },
  trigger: (id, enable) => {
    return axios.get('/client/activityEvent/trigger/params/' + id + "/" + enable)
  },
}
