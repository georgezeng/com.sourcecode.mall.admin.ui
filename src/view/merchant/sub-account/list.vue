<template>
  <CommonTable
    enableStatusText="启用"
    disableStatusText="禁用"
    :statusList="statusList"
    statusItemName="username"
    :updateStatusHandler="updateStatusHandler"
    @setTriggerStatus="setTriggerStatus"
    :useStatus="true"
    :columns="columns"
    :loading="loading"
    initSortProperty="username"
    deleteItemName="username"
    editPageName="MerchantSubAccountEdit"
    :filteredPageNames="['MerchantSubAccountEdit']"
    :listHandler="listHandler"
    :deleteHandler="deleteHandler"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
    @setDeleteData="setDeleteData"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/merchant-sub-account'
  import {Message} from 'iview'
  import CommonTable from '@/components/tables/common-table'

  export default {
    name: 'MerchantSubAccountList',
    components: {
      CommonTable
    },
    data() {
      return {
        statusList: [
          {
            value: 'true',
            label: '启用中'
          },
          {
            value: 'false',
            label: '禁用中'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '账号', key: 'username', sortable: true, sortType: 'asc'},
          {title: '邮箱', key: 'email', sortable: true},
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
                    title: '你确定要' + (params.row.enabled ? '禁用' : '启用') + '吗?'
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
                  }, params.row.enabled ? '禁用' : '启用')
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
      setGoEdit(callback) {
        this.goEdit = callback
      },
      setTriggerStatus(callback) {
        this.triggerStatus = callback
      },
    },
  }
</script>
