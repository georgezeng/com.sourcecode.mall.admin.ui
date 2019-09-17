<template>
  <CommonTable
    :columns="columns"
    :loading="loading"
    :statusList="statusList"
    :useDateRange="true"
    :disableAddBtn="true"
    :useStatus="true"
    :disableStatusBtns="true"
    initSortProperty="createTime"
    initSortOrder="DESC"
    :disableDelete="true"
    :useParent="true"
    :filteredPageNames="['ClientPointsList']"
    :listHandler="listHandler"
    @setLoading="setLoading"
    topPageName="ClientPointsList"
    :queryData="data"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/client-points'
  import CommonTable from '@/components/tables/common-table'

  export default {
    components: {
      CommonTable
    },
    data() {
      return {
        statusList: [
          {
            value: 'In',
            label: '收入'
          },
          {
            value: 'Out',
            label: '支出'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        data: {
          id: null,
          ids: []
        },
        loading: false,
        columns: [
          {title: '创建时间', key: 'createTime', sortable: true, sortType: 'desc'},
          {
            title: '收支名称',
            key: 'type',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.type.text)
            }
          },
          {
            title: '收支类型',
            key: 'balanceType',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.balanceType.text)
            }
          },
          {title: '数量', key: 'bonusAmount', sortable: true},
          {
            title: '订单号',
            key: 'orderId',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.type.name != 'Invite' ? params.row.orderId : '')
            }
          },
          {title: '消费金额', key: 'amount', sortable: true},
          {
            title: '备注',
            key: 'remark',
            render: (h, params) => {

              return h('Poptip', {
                props: {
                  confirm: false,
                  title: params.row.remark
                }
              }, [
                h('a', {
                  attrs: {
                    href: 'javascript:;'
                  }
                }, params.row.remark ? (params.row.remark.length > 20 ? params.row.remark.substring(0, 15) + '...' : params.row.remark) : '')
              ])

            }


          },
        ]
      }
    },
    methods: {
      listHandler: API.journals,
      setLoading(loading) {
        this.loading = loading
      },
    },
    created() {
      this.data.ids = this.$router.currentRoute.params.ids.split(',')
      this.data.id = this.data.ids[0]
    }
  }
</script>
