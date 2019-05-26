import axios from '@/libs/api.request'
import qs from 'qs'

export default {
  sendCode (mobile) {
    return axios.request({
      url: 'merchant/register/code/' + mobile,
      method: 'get'
    })
  },
  save (user) {
    return axios.post('/merchant/register/' + user.verifyCode, user)
  },
  exists (mobile) {
    return axios.get('/merchant/register/exists/' + mobile)
  }
}
