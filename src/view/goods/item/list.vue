<template>
  <CommonTable
    enableStatusText="上架"
    disableStatusText="下架"
    :statusList="statusList"
    statusItemName="name"
    :updateStatusHandler="updateStatusHandler"
    @setTriggerStatus="setTriggerStatus"
    :useStatus="true"
    :columns="columns"
    :loading="loading"
    initSortProperty="name"
    deleteItemName="name"
    editPageName="GoodsItemEdit"
    :filteredPageNames="['GoodsItemEdit']"
    :listHandler="listHandler"
    :deleteHandler="deleteHandler"
    :disableAddBtn="true"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
    @setDeleteData="setDeleteData"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/goods-item'
  import config from '@/config/index'
  import {Message} from 'iview'
  import CommonTable from '@/components/tables/common-table'

  export default {
    name: 'GoodsItemList',
    components: {
      CommonTable
    },
    data() {
      return {
        statusList: [
          {
            value: 'true',
            label: '上架中'
          },
          {
            value: 'false',
            label: '已下架'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '名称', key: 'name', sortable: true, sortType: 'asc'},
          {
            title: '编号', key: 'number', sortable: true
          },
          {title: '货号', key: 'code', sortable: true},
          {title: '最低价格', key: 'minPrice', sortable: true},
          {title: '最高价格', key: 'maxPrice', sortable: true},
          {
            title: '缩略图',
            key: 'thumbnail',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: config.publicBucketDomain + params.row.thumbnail,
                },
                style: {
                  width: '40px',
                  height: '40px'
                }
              })
            }
          },
          {
            title: '状态',
            render: (h, params) => {
              return h('span', params.row.enabled ? '上架中' : '已下架')
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              return h('div', [
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

                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '你确定要' + (params.row.enabled ? '下架' : '上架') + '吗?'
                  },
                  on: {
                    'on-ok': () => {
                      this.triggerStatus(params.row)
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, [
                  h('Button', {
                    props: {
                      type: params.row.enabled ? 'warning' : 'success',
                      size: 'small'
                    }
                  }, params.row.enabled ? '下架' : '上架')
                ]),

                h('Poptip', {
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
                ])
              ])
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
      }
    },
  }
</script>
