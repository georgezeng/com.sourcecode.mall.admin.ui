<template>
  <CommonTable
    :columns="columns"
    :loading="loading"
    :statusList="statusList"
    statusItemName="name"
    enableStatusText="通过"
    disableStatusText="未通过"
    :useStatus="true"
    :useReason="true"
    initSortProperty="createTime"
    initSortOrder="DESC"
    :disableDelete="true"
    editPageName="ClientIdentityEdit"
    :filteredPageNames="['ClientIdentityEdit']"
    :listHandler="listHandler"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/client-identity'
  import config from '@/config/index'
  import {Message} from 'iview'
  import CommonTable from '@/components/tables/common-table'

  export default {
    name: 'ClientIdentityList',
    components: {
      CommonTable
    },
    data() {
      return {
        statusList: [
          {
            value: 'Checking',
            label: '审核中'
          },
          {
            value: 'Passed',
            label: '通过'
          },
          {
            value: 'UnPassed',
            label: '未通过'
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
          {title: '真实姓名', key: 'name', sortable: true},
          {title: '身份证号', key: 'number', sortable: true},
          {
            title: '状态',
            key: 'status',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.status.text)
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
