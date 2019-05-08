<template>
  <CommonTable
    enableStatusText="关联"
    disableStatusText="取消"
    :statusList="statusList"
    statusItemName="name"
    :updateStatusHandler="updateStatusHandler"
    @setTriggerStatus="setTriggerStatus"
    :useStatus="isFromParent"
    :columns="columns"
    :loading="loading"
    initSortProperty="order"
    initStatusText="true"
    deleteItemName="name"
    editPageName="GoodsSpecificationDefinitionEdit"
    :filteredPageNames="[
      'GoodsCategoryEdit',
      'GoodsCategoryList',
      'GoodsSpecificationDefinitionEdit',
      'GoodsSpecificationGroupList',
      'GoodsSpecificationGroupEdit',
    ]"
    :listHandler="listHandler"
    :deleteHandler="deleteHandler"
    :useParent="true"
    :disableDelete="isFromParent"
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
        statusList: [
          {
            value: 'true',
            label: '已关联'
          },
          {
            value: 'false',
            label: '未关联'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
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
              if (this.isFromParent) {
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
                      title: '你确定要' + (params.row.enabled ? '取消关联' : '关联') + '吗?'
                    },
                    on: {
                      'on-ok': () => {
                        this.triggerStatus(params.row, this.parentId)
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
                    }, params.row.enabled ? '取消' : '关联')
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
          }
        ]
      }
    },
    computed: {
      isFromParent() {
        return this.parentId > 0
      }
    },
    methods: {
      listHandler: API.list,
      deleteHandler: API.delete,
      updateStatusHandler: API.relate,
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
      initForParentId(id) {
        this.parentId = id
      }
    }
  }
</script>
