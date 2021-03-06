import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/afterSale/application/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/afterSale/application/load/params/' + id)
  },
  audit: (data) => {
    return axios.post('/afterSale/application/audit', {
      id: data.id,
      agree: data.agree,
      rejectReason: data.rejectReason,
      returnAddress: data.returnAddress
    })
  },
  refund: (data) => {
    return axios.post('/afterSale/application/refund', data)
  },
  receive: (id) => {
    return axios.get('/afterSale/application/receive/params/' + id)
  },
  sent: (data) => {
    return axios.post('/afterSale/application/sent', data)
  }
}
