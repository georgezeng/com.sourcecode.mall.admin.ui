<template>
  <div>
    <CommonTable
      :title="title"
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
      initSortProperty="receivedTime"
      initSortOrder="DESC"
      :queryData="data"
      :listHandler="listHandler"
      @setLoading="setLoading"
      :useParent="true"
      :topPageName="parentPageName"
      :parentPageName="parentPageName"
      :filteredPageNames="filteredPageNames"
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
        parentPageName: null,
        filteredPageNames: [],
        statusList: [
          {
            value: 'UnUse',
            label: '已领取'
          },
          {
            value: 'Used',
            label: '已使用'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        data: {
          id: null
        },
        title: null,
        loading: false,
        columns: [
          // {type: 'selection', width: 60, align: 'center'},
          {title: '领取时间', key: 'receivedTime', sortable: true, sortType: 'desc', width: 150},
          {
            title: '领券用户', key: 'client.name', sortable: true,
            render: (h, params) => {
              return h('span', params.row.clientName)
            }
          },
          {title: '编号', key: 'couponId', sortable: true},
          {title: '使用时间', key: 'usedTime', sortable: true},
          {
            title: '消费订单', key: 'order.id', sortable: true,
            render: (h, params) => {
              return h('span', params.row.orderId)
            }
          },
          {
            title: '状态', key: 'status', sortable: true,
            render: (h, params) => {
              return h('span', params.row.status.text)
            }
          },
        ]
      }
    },
    methods: {
      listHandler: API.listClient,
      setLoading(loading) {
        this.loading = loading
      },
    },
    created() {
      this.data.id = this.$router.currentRoute.params.id
      const type = this.$router.currentRoute.params.type
      this.topPageName = type + 'CouponSettingList'
      this.parentPageName = type + 'CouponSettingList'
      this.filteredPageNames.push(type + 'CouponSettingList')
      this.filteredPageNames.push(type + 'CouponSettingEdit')
      API.load(this.data.id).then(data => {
        this.title = data.name
      })
    }
  }
</script>
