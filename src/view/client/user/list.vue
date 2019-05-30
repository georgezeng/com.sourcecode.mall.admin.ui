<template>
  <CommonTable
    :columns="columns"
    :loading="loading"
    :statusList="statusList"
    statusItemName="username"
    :updateStatusHandler="updateStatusHandler"
    :disableAddBtn="true"
    enableStatusText="启用"
    disableStatusText="禁用"
    :useStatus="true"
    initSortProperty="createTime"
    initSortOrder="DESC"
    :disableDelete="true"
    editPageName="ClientUserEdit"
    :filteredPageNames="['ClientUserEdit']"
    :listHandler="listHandler"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
    @setTriggerStatus="setTriggerStatus"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/client-user'
  import CommonTable from '@/components/tables/common-table'

  export default {
    name: 'ClientUserList',
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
          {title: '用户名', key: 'username', sortable: true},
          {title: '昵称', key: 'nickname', sortable: true},
          {
            title: '性别',
            key: 'sex',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.sex.text)
            }
          },
          {
            title: '状态',
            key: 'enabled',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.enabled ? '启用中' : '禁用中')
            }
          },
          {title: '创建时间', key: 'createTime', sortable: true, sortType: 'desc'},
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
                }, '查看'),

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

              ])
            }
          }
        ]
      }
    },
    methods: {
      listHandler: API.list,
      updateStatusHandler: API.updateStatus,
      setLoading(loading) {
        this.loading = loading
      },
      setTriggerStatus(callback) {
        this.triggerStatus = callback
      },
      setGoEdit(callback) {
        this.goEdit = callback
      },
    },
  }
</script>
