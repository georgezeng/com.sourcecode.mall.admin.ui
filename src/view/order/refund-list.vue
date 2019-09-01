<template>
  <div>
    <CommonTable
      :columns="columns"
      :loading="loading"
      :disableAddBtn="true"
      :disableDelete="true"
      :statusList="statusList"
      :disableStatusBtns="true"
      initStatusText="RefundApplied"
      :useStatus="true"
      :useReason="false"
      :useDateRange="true"
      initSortProperty="createTime"
      initSortOrder="DESC"
      :listHandler="listHandler"
      @setLoading="setLoading"
      @setLoad="setLoad"
      @setGoEdit="setGoEdit"
      editPageName="OrderEdit"
      :filteredPageNames="['OrderEdit']"
      from="OrderRefundList"
    >
    </CommonTable>
  </div>
</template>
<script>
  import config from '@/config'
  import API from '@/api/order'
  import CommonTable from '@/components/tables/common-table'
  import {Message} from 'iview'

  export default {
    components: {
      CommonTable
    },
    data() {
      return {
        statusList: [
          {
            value: 'RefundApplied',
            label: '待退款'
          },
          {
            value: 'Refunded',
            label: '已退款'
          }
        ],
        loading: false,
        columns: [
          // {type: 'selection', width: 60, align: 'center'},
          {title: '编号', key: 'orderId', sortable: true, width: 180},
          {title: '取消时间', key: 'refundTime', sortable: true, sortType: 'desc', width: 150},
          {
            title: '购买用户',
            key: 'client.username',
            sortable: true,
            render: (h, params) => {
              return h('div', null, params.row.buyer)
            }
          },
          {
            title: '购买商品',
            render: (h, params) => {
              let arr = null
              if (params.row.subList) {
                arr = params.row.subList.map(item => {
                  return h('img', {
                    attrs: {
                      src: config.publicBucketDomain + item.thumbnail
                    },
                    style: {
                      marginRight: '8px',
                      width: '40px',
                      height: '40px'
                    }
                  });
                })
                const maxLength = 5
                if (arr.length > maxLength) {
                  arr = arr.slice(0, maxLength)
                  arr.push(h('span', '...'))
                }
              }

              return h('div', arr)
            }
          },
          {title: '商品总额', key: 'totalPrice'},
          {title: '实付金额', key: 'realPrice'},
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              if (params.row.status.name == 'RefundApplied') {
                return h('div', [
                  h('Poptip', {
                    props: {
                      confirm: true,
                      title: '确定同意退款吗?'
                    },
                    on: {
                      'on-ok': () => {
                        API.approveRefund(params.row.id).then(res => {
                          Message.success('退款成功')
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
                    }, '退款')
                  ]),

                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginLeft: '5px'
                    },
                    on: {
                      click: () => {
                        this.goEdit(params.row.id)
                      }
                    }
                  }, '查看'),
                ])
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginLeft: '5px'
                    },
                    on: {
                      click: () => {
                        this.goEdit(params.row.id)
                      }
                    }
                  }, '查看'),
                ])
              }
            }
          }
        ]
      }
    },
    methods: {
      listHandler: API.refundList,
      setLoading(loading) {
        this.loading = loading
      },
      setLoad(callback) {
        this.load = callback
      },
      setGoEdit(callback) {
        this.goEdit = callback
      }
    },
    mounted() {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'OrderEdit'
      )
      this.$store.commit('setTagNavList', res)
    }
  }
</script>
