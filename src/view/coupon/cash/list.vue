<template>
  <div>
    <CommonTable
      enableStatusText="上架"
      disableStatusText="下架"
      :columns="columns"
      :loading="loading"
      :disableAddBtn="false"
      :disableDelete="false"
      :statusList="statusList"
      :disableStatusBtns="false"
      :useStatus="true"
      :useStatusQueryOnly="false"
      :useReason="false"
      :useDateRange="true"
      initSortProperty="updateTime"
      initSortOrder="DESC"
      editPageName="CashCouponSettingEdit"
      :filteredPageNames="[
        'CashCouponSettingEdit',
      ]"
      :listHandler="listHandler"
      @setLoading="setLoading"
      @setGoEdit="setGoEdit"
      @setLoad="setLoad"
      :updateStatusHandler="updateStatusHandler"
      :deleteHandler="deleteHandler"
      @setTriggerStatus="setTriggerStatus"
      @setDeleteData="setDeleteData"
      :queryData="queryData"
    >
    </CommonTable>
  </div>
</template>
<script>
  import config from '@/config'
  import API from '@/api/coupon'
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
            value: 'WaitForPut',
            label: '待发放'
          },
          {
            value: 'PutAway',
            label: '上架中'
          },
          {
            value: 'SoldOut',
            label: '已下架'
          },
          {
            value: 'SentOut',
            label: '已领完'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        queryData: {
          type: 'Cash'
        },
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '编辑时间', key: 'updateTime', sortable: true, sortType: 'desc', width: 150},
          {title: '券名称', key: 'name', sortable: true},
          {title: '面额', key: 'amount', sortable: true},
          {title: '生效时间', key: 'startDate', sortable: true},
          {title: '过期时间', key: 'endDate', sortable: true},
          {
            title: '图片',
            key: 'imgPath',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: config.publicBucketDomain + params.row.imgPath
                },
                style: {
                  width: '40px',
                  height: '40px'
                }
              })
            }
          },
          {
            title: '发放数量', key: 'totalNums', sortable: true,
            render: (h, params) => {
              return h('span', params.row.totalNums == 0 ? '不限量' : params.row.totalNums)
            }
          },
          {title: '已领数量', key: 'sentNums', sortable: true},
          {title: '使用数量', key: 'usedNums', sortable: true},
          {
            title: '状态', key: 'status', sortable: true,
            render: (h, params) => {
              return h('span', params.row.status.text)
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              const arr = [
                h('Button', {
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
                }, '编辑'),

                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.goClientList(params.row.id)
                    }
                  }
                }, '用户领券')
              ]
              const status = params.row.status.name
              if (status == 'WaitForPut' || status == 'SoldOut') {
                arr.push(
                  h('Poptip', {
                    props: {
                      confirm: true,
                      title: '你确定要上架吗?'
                    },
                    on: {
                      'on-ok': () => {
                        const item = params.row
                        item.enabled = true
                        this.triggerStatus(item)
                      }
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'success',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                    }, '上架')
                  ])
                )
              } else if (status == 'PutAway') {
                arr.push(
                  h('Poptip', {
                    props: {
                      confirm: true,
                      title: '你确定要下架吗?'
                    },
                    on: {
                      'on-ok': () => {
                        const item = params.row
                        item.enabled = false
                        this.triggerStatus(item)
                      }
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'warning',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                    }, '下架')
                  ])
                )
              }
              arr.push(h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    this.deleteData([params.row])
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  }
                }, '删除')
              ]))
              return arr
            }
          }
        ]
      }
    },
    methods: {
      listHandler: API.list,
      deleteHandler: API.delete,
      updateStatusHandler: API.updateStatus,
      setLoading(loading) {
        this.loading = loading
      },
      setDeleteData(callback) {
        this.deleteData = callback
      },
      setTriggerStatus(callback) {
        this.triggerStatus = callback
      },
      setGoEdit(callback) {
        this.goEdit = callback
      },
      setLoad(callback) {
        this.load = callback
      },
      goClientList(id) {
        this.$router.push({
          name: 'CouponClientList',
          params: {
            id,
            type: 'Cash'
          }
        })
      }
    },
  }
</script>
