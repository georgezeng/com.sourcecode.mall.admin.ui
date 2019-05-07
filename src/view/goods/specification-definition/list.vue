<template>
  <CommonTable
    :columns="columns"
    :loading="loading"
    initSortProperty="name"
    deleteItemName="name"
    :editPageName="editPageName"
    :filteredPageNames="[
      'GoodsCategoryEdit',
      'GoodsCategoryList',
      'GoodsSpecificationDefinitionEdit',
      'GoodsSpecificationGroupList',
      'GoodsSpecificationGroupEdit',
    ]"
    :deleteText="deleteText"
    :listHandler="listHandler"
    :deleteHandler="deleteHandler"
    :useParent="true"
    :addBtnText="addBtnText"
    parentPageName="GoodsSpecificationGroupList"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
    @setDeleteData="setDeleteData"
    @initForParentId="initForParentId"
  >
  </CommonTable>

</template>
<script>
  import API from '@/api/goods-specification-definition'
  import {Message} from 'iview'
  import CommonTable from '@/components/tables/common-table'

  export default {
    name: 'GoodsSpecificationDefinitionList',
    components: {
      CommonTable
    },
    data() {
      return {
        parentId: 0,
        editPageName: 'GoodsSpecificationDefinitionEdit',
        deleteText: '删除',
        deleteLineText: '删除',
        addBtnText: '新增',
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '排序', key: 'order', sortable: true, sortType: 'asc'},
          {title: '名称', key: 'name', sortable: true},
          {
            title: '值',
            key: 'values',
            render: (h, params) => {
              let values = []
              for (let i in params.row.attrs) {
                values.push(params.row.attrs[i].name)
              }
              return h('span', null, values.join(', '))
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              if (this.parentId > 0) {
                return h('div', [
                  h('Poptip', {
                    props: {
                      confirm: true,
                      title: '你确定要' + this.deleteLineText + '吗?'
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
                    }, '取消')
                  ])
                ])
              } else {
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
                      title: '你确定要' + this.deleteLineText + '吗?'
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
          }
        ]
      }
    },
    methods: {
      listHandler: API.list,
      deleteHandler: API.delete,
      initForParentId(id) {
        if (id > 0) {
          this.parentId = parseInt(id)
          this.addBtnText = '关联'
          this.editPageName = 'GoodsSpecificationDefinitionRelated'
          this.deleteText = '取消'
          this.deleteLineText = '取消关联'
        }
      },
      setLoading(loading) {
        this.loading = loading
      },
      setDeleteData(callback) {
        this.deleteData = callback
      },
      setGoEdit(callback) {
        this.goEdit = callback
      },
    }
  }
</script>
