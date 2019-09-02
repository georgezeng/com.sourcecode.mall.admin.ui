import axios from '@/libs/api.request'

export default {
  load: () => {
    return axios.get('/setting/site/load')
  },
  save: (obj) => {
    return axios.post('/setting/site/save', obj)
  }
}
