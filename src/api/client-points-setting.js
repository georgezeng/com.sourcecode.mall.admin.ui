import axios from '@/libs/api.request'

export default {
  load: () => {
    return axios.get('/setting/clientPoints/load')
  },
  save: (obj) => {
    return axios.post('/setting/clientPoints/save', obj)
  }
}
