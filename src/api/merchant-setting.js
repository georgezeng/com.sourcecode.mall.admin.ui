import axios from '@/libs/api.request'

export default {
  load: (code) => {
    return axios.get('/merchant/setting/load/params/' + code)
  },
  save: (code, value) => {
    return axios.post('/merchant/setting/save', {
      code,
      value: JSON.stringify(value)
    })
  }
}
