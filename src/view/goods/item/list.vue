<template>
  <CommonTable
    enableStatusText="上架"
    disableStatusText="下架"
    :statusList="statusList "
    statusItemName="name"
    :useDateRange="true"
    :updateStatusHandler="updateStatusHandler"
    @setTriggerStatus="setTriggerStatus"
    :useStatus="true"
    :columns="columns"
    :loading="loading"
    initSortProperty="number"
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
import { Message } from 'iview'
import CommonTable from '@/components/tables/common-table'

export default {
  name: 'GoodsItemList',
  components: {
    CommonTable
  },
  data () {
    return {
      statusList: [
        {
          value: 'status-true',
          label: '上架中'
        },
        {
          value: 'status-false',
          label: '已下架'
        },
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'special-true',
          label: '特价商品'
        },
        {
          value: 'index-1',
          label: '首页推荐'
        },
        {
          value: 'index-0',
          label: '非首页推荐'
        },
        {
          value: 'special-false',
          label: '非特价商品'
        }
      ],
      loading: false,
      columns: [
        { type: 'selection', width: 60, align: 'center', fixed: 'left' },
        { title: '编号', key: 'number', sortable: true, sortType: 'asc', width: 200 },
        { title: '名称', key: 'name', sortable: true, width: 300 },
        { title: '货号', key: 'code', sortable: true, width: 150 },
        { title: '最低价格', key: 'minPrice', sortable: true, width: 150 },
        { title: '最高价格', key: 'maxPrice', sortable: true, width: 150 },
        { title: '推荐',
          sortable: true,
          width: 150,
          render: (h, params) => {
            return h('span', params.row.indexRecommend ? '是' : '否')
          } },
        { title: '推荐排序', key: 'indexOrder', sortable: true, width: 150 },
        { title: '特价',
          sortable: true,
          width: 150,
          render: (h, params) => {
            return h('span', params.row.specialDiscount ? '是' : '否')
          } },
        {
          title: '缩略图',
          key: 'thumbnail',
          width: 150,
          render: (h, params) => {
            return h('Poptip', null, [
              h('img', {
                attrs: {
                  src: config.publicBucketDomain + params.row.thumbnail
                },
                style: {
                  marginRight: '8px',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer'
                }
              }),
              h('img', {
                slot: 'content',
                attrs: {
                  src: config.publicBucketDomain + params.row.thumbnail
                },
                style: {
                  width: '100%',
                  height: '100%'
                }
              })
            ])
          }
        },
        { title: '上架时间', key: 'putTime', sortable: true, width: 150 },
        {
          title: '状态',
          width: 150,
          render: (h, params) => {
            return h('span', params.row.enabled ? '上架中' : '已下架')
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 150,
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
              ])

            ]

            if (!params.row.enabled) {
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
            }

            return h('div', arr)
          }
        }
      ]
    }
  },
  methods: {
    listHandler: API.list,
    deleteHandler: API.delete,
    updateStatusHandler: API.updateStatus,
    setLoading (loading) {
      this.loading = loading
    },
    setDeleteData (callback) {
      this.deleteData = callback
    },
    setTriggerStatus (callback) {
      this.triggerStatus = callback
    },
    setGoEdit (callback) {
      this.goEdit = callback
    }
  }
}
</script>
