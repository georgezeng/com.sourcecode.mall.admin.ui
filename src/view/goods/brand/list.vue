<template>
  <CommonTable
    :columns="columns"
    :loading="loading"
    initSortProperty="name"
    deleteItemName="name"
    editPageName="GoodsBrandEdit"
    :filteredPageNames="['GoodsBrandEdit']"
    :listHandler="listHandler"
    :deleteHandler="deleteHandler"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
    @setDeleteData="setDeleteData"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/goods-brand'
  import config from '@/config/index'
  import {Message} from 'iview'
  import CommonTable from '@/components/tables/common-table'

  export default {
    name: 'GoodsBrandList',
    components: {
      CommonTable
    },
    data() {
      return {
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '排序', key: 'order', sortable: true, sortType: 'asc'},
          {title: '名称', key: 'name', sortable: true},
          {
            title: 'logo',
            key: 'logo',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: config.baseUrl + '/goods/brand/file/load?filePath=' + params.row.logo,
                },
                style: {
                  width: '40px',
                  height: '40px'
                }
              })
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
