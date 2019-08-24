import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/order/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/order/load/params/' + id)
  },
  updateExpress: (obj) => {
    return axios.post('/order/updateExpress', obj)
  },
  refundList: (queryInfo) => {
    return axios.post('/order/refund/list', queryInfo)
  },
  approveRefund: (id) => {
    return axios.get('/order/refund/approve/params/' + id)
  }
}
