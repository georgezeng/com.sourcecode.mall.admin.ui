import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/client/points/list', queryInfo)
  },
  journals: (queryInfo) => {
    return axios.post('/client/points/journals/list', queryInfo)
  },
  save: (obj) => {
    return axios.post('/client/points/journals/create', obj)
  }
}
