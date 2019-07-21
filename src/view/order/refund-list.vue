<template>
  <div>
    <CommonTable
      :columns="columns"
      :loading="loading"
      :disableAddBtn="true"
      :disableDelete="true"
      :useStatus="false"
      :useReason="false"
      :useDateRange="true"
      initSortProperty="createTime"
      initSortOrder="DESC"
      :listHandler="listHandler"
      @setLoading="setLoading"
    >
    </CommonTable>
  </div>
</template>
<script>
  import config from '@/config'
  import API from '@/api/order'
  import CommonTable from '@/components/tables/common-table'

  export default {
    components: {
      CommonTable
    },
    data() {
      return {
        loading: false,
        columns: [
          // {type: 'selection', width: 60, align: 'center'},
          {title: '编号', key: 'orderId', sortable: true, width: 180},
          {title: '取消时间', key: 'refundTime', sortable: true, sortType: 'desc', width: 150},
          {
            title: '购买用户',
            key: 'client.username',
            sortable: true,
            render: (h, params) => {
              return h('div', null, params.row.buyer)
            }
          },
          {
            title: '购买商品',
            render: (h, params) => {
              let arr = null
              if (params.row.subList) {
                arr = params.row.subList.map(item => {
                  return h('img', {
                    attrs: {
                      src: config.publicBucketDomain + item.thumbnail
                    },
                    style: {
                      marginRight: '8px',
                      width: '40px',
                      height: '40px'
                    }
                  });
                })
                const maxLength = 5
                if (arr.length > maxLength) {
                  arr = arr.slice(0, maxLength)
                  arr.push(h('span', '...'))
                }
              }

              return h('div', arr)
            }
          },
          {title: '商品总额', key: 'totalPrice'},
          {title: '实付金额', key: 'totalPrice'},
        ]
      }
    },
    methods: {
      listHandler: API.refundList,
      setLoading(loading) {
        this.loading = loading
      },
    },
  }
</script>
