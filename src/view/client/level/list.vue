<template>
  <div>
    <CommonTable
      :columns="columns"
      :loading="loading"
      :useDateRange="false"
      :disableAddBtn="false"
      :useStatus="false"
      :disableSearch="true"
      :disableDelete="true"
      :hidePage="true"
      editPageName="ClientLevelSettingEdit"
      :filteredPageNames="['ClientLevelSettingEdit']"
      :listHandler="listHandler"
      @setLoading="setLoading"
      @setGoEdit="setGoEdit"
      @setLoad="setLoad"
    >
    </CommonTable>
  </div>

</template>
<script>
  import API from '@/api/client-level'
  import CommonTable from '@/components/tables/common-table'
  import {Message} from 'iview'
  import config from '@/config/index'

  export default {
    components: {
      CommonTable
    },
    data() {
      return {
        loading: false,
        columns: [
          {title: '会员等级', key: 'level'},
          {title: '等级名称', key: 'name'},
          {
            title: '图标', key: 'imgPath',
            render: (h, params) => {
              return h('Poptip', null, [
                h('img', {
                  attrs: {
                    src: config.publicBucketDomain + params.row.imgPath
                  },
                  style: {
                    marginRight: '8px',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer'
                  }
                }),
                h('img', {
                  slot: "content",
                  attrs: {
                    src: config.publicBucketDomain + params.row.imgPath
                  },
                  style: {
                    width: '100%',
                    height: '100%'
                  }
                })
              ])
            }
          },
          {title: '累计消费', key: 'upToAmount'},
          {title: '累计邀请', key: 'upToMembers'},
          {
            title: '折扣权益', key: 'discount',
            render: (h, params) => {
              return h('span', params.row.discount + '%')
            }
          },
          {
            title: '活动日折扣权益', key: 'discountInActivity',
            render: (h, params) => {
              return h('span', params.row.discountInActivity + '%')
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              const arr = []
              arr.push(h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.goEdit(params.row.id)
                  }
                }
              }, '编辑'))
              if (params.row.top) {
                arr.push(h('Poptip', {
                  props: {
                    confirm: true,
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                      API.clear(params.row.id).then(res => {
                        Message.success('清除成功')
                        this.load()
                      })
                    }
                  }
                }, [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    }
                  }, '清除')
                ]))
              }
              return h('div', arr)
            }
          }
        ]
      }
    },
    methods: {
      listHandler: API.list,
      setLoading(loading) {
        this.loading = loading
      },
      setGoEdit(callback) {
        this.goEdit = callback
      },
      setLoad(callback) {
        this.load = callback
      }
    },
  }
</script>
