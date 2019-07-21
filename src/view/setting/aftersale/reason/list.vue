<template>
  <CommonTable
    :columns="columns"
    :loading="loading"
    :statusList="statusList"
    :disableStatusBtns="true"
    :useStatus="true"
    :useStatusQueryOnly="true"
    :useReason="false"
    initSortProperty="orderNum"
    initSortOrder="ASC"
    editPageName="AfterSaleReasonSettingEdit"
    deleteItemName="content"
    :filteredPageNames="['AfterSaleReasonSettingEdit']"
    :listHandler="listHandler"
    :deleteHandler="deleteHandler"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
    @setDeleteData="setDeleteData"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/aftersale-reason-setting'
  import CommonTable from '@/components/tables/common-table'

  export default {
    name: 'AfterSaleReasonSettingList',
    components: {
      CommonTable
    },
    data() {
      return {
        loading: false,
        statusList: [
          {
            value: 'RefundOnly',
            label: '仅退款'
          },
          {
            value: 'SalesReturn',
            label: '退货退款'
          },
          {
            value: 'Change',
            label: '换货'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '序号', key: 'orderNum', sortable: true, sortType: 'asc'},
          {
            title: '类型', key: 'type', sortable: true,
            render: (h, params) => {
              return h('div', params.row.type.text)
            }
          },
          {title: '内容', key: 'content', sortable: true},
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
      setLoading(loading) {
        this.loading = loading
      },
      setDeleteData(callback) {
        this.deleteData = callback
      },
      setGoEdit(callback) {
        this.goEdit = callback
      },
    },
  }
</script>
