import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/evaluation/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/evaluation/load/params/' + id)
  },
  audit: (id, passed) => {
    return axios.post('/evaluation/audit', {
      id,
      passed
    })
  },
  reply: (id, reply) => {
    return axios.post('/evaluation/reply', {
      id,
      reply
    })
  },
  open: (id, open) => {
    return axios.post('/evaluation/open', {
      id,
      open
    })
  }
}
