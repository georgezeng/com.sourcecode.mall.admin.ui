<template>
  <div>
    <CommonTable
      :columns="columns"
      :loading="loading"
      :disableAddBtn="true"
      :disableDelete="true"
      :statusList="statusList"
      :disableStatusBtns="true"
      :useStatus="true"
      :useStatusQueryOnly="true"
      :useReason="false"
      :useDateRange="true"
      initSortProperty="createTime"
      initSortOrder="DESC"
      editPageName="OrderEdit"
      :filteredPageNames="['OrderEdit']"
      :listHandler="listHandler"
      @setLoading="setLoading"
      @setGoEdit="setGoEdit"
    >
    </CommonTable>
  </div>
</template>
<script>
  import config from '@/config'
  import API from '@/api/order'
  import CommonTable from '@/components/tables/common-table'

  export default {
    components: {
      CommonTable
    },
    data() {
      return {
        statusList: [
          {
            value: 'UnPay',
            label: '待付款'
          },
          {
            value: 'Paid',
            label: '已付款'
          },
          {
            value: 'Shipped',
            label: '已发货'
          },
          {
            value: 'Canceled',
            label: '已取消'
          },
          {
            value: 'Closed',
            label: '已关闭'
          },
          {
            value: 'Finished',
            label: '交易成功'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        loading: false,
        columns: [
          // {type: 'selection', width: 60, align: 'center'},
          {title: '编号', key: 'orderId', sortable: true, width: 180},
          {title: '下单时间', key: 'createTime', sortable: true, sortType: 'desc', width: 150},
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
          {title: '实付金额', key: 'totalPrice'},
          {
            title: '订单状态',
            key: 'status',
            sortable: true,
            render: (h, params) => {
              return h('div', params.row.status.merchantText)
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              if (params.row.status.name == 'Paid') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$router.push({
                          name: 'OrderExpress',
                          params: {
                            id: params.row.id
                          }
                        })
                      }
                    }
                  }, '发货'),

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
                  }, '编辑'),
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
                  }, '编辑'),
                ])
              }
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
    },
    mounted() {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'OrderExpress' &&
        item.name !== 'OrderEdit'
      )
      this.$store.commit('setTagNavList', res)
    }
  }
</script>
