<template>
  <CommonTable
    :columns="columns"
    :loading="loading"
    initSortProperty="name"
    deleteItemName="name"
    editPageName="GoodsSpecificationGroupEdit"
    :filteredPageNames="[
      'GoodsCategoryEdit',
      'GoodsCategoryList',
      'GoodsSpecificationDefinitionList',
      'GoodsSpecificationDefinitionEdit',
      'GoodsSpecificationGroupEdit',
    ]"
    :listHandler="listHandler"
    :deleteHandler="deleteHandler"
    :useParent="true"
    parentPageName="GoodsCategoryList"
    subPageName="GoodsSpecificationDefinitionList"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
    @setDeleteData="setDeleteData"
    @setGoSubList="setGoSubList"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/goods-specification-group'
  import {Message} from 'iview'
  import CommonTable from '@/components/tables/common-table'

  export default {
    name: 'GoodsSpecificationGroupList',
    components: {
      CommonTable
    },
    data() {
      return {
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '排序', key: 'order', sortable: true},
          {title: '名称', key: 'name', sortable: true, sortType: 'asc'},
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
                      this.goSubList(params.row.id)
                    }
                  }
                }, '规格列表'),

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
      setGoSubList(callback) {
        this.goSubList = callback
      }
    }
  }
</script>
