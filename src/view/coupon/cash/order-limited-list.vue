<template>
  <div>
    <CommonTable
      :columns="columns"
      :loading="loading"
      :disableSearch="true"
      :disableAddBtn="false"
      :disableDelete="false"
      :disableStatusBtns="true"
      :useStatus="false"
      :useReason="false"
      :useDateRange="false"
      initSortProperty="createTime"
      initSortOrder="DESC"
      editPageName="CashCouponOrderLimitedSettingEdit"
      :filteredPageNames="[
        'CashCouponOrderLimitedSettingEdit',
      ]"
      :listHandler="listHandler"
      @setLoading="setLoading"
      @setGoEdit="setGoEdit"
      :deleteHandler="deleteHandler"
      @setDeleteData="setDeleteData"
    >
    </CommonTable>
  </div>
</template>
<script>
  import config from '@/config'
  import API from '@/api/cash-coupon-order-limited'
  import CommonTable from '@/components/tables/common-table'
  import {Message} from 'iview'

  export default {
    components: {
      CommonTable
    },
    data() {
      return {
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '创建时间', key: 'createTime', sortable: true, sortType: 'desc', width: 150},
          {title: '订单总额', key: 'orderAmount', sortable: true},
          {title: '限额', key: 'limitedAmount', sortable: true},
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
              ]
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
