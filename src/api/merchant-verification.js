import axios from '@/libs/api.request'

export default {
  load: () => {
    return axios.get('/merchant/verification/load')
  },
  verify: (verification) => {
    return axios.post('/merchant/verification/verify', verification)
  },
  update: (verification) => {
    return axios.post('/merchant/verification/update', verification)
  }
}
