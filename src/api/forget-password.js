import axios from '@/libs/api.request'
import qs from 'qs'

export default {
  sendCode (mobile) {
    return axios.request({
      url: 'merchant/forgetPassword/code/' + mobile,
      method: 'get'
    })
  },
  save (user) {
    return axios.post('/merchant/forgetPassword/' + user.verifyCode, user)
  }
}
