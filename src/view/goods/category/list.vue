<template>
  <CommonTable
    :columns="columns"
    :loading="loading"
    deleteItemName="name"
    editPageName="GoodsCategoryEdit"
    :filteredPageNames="[
      'GoodsCategoryEdit',
      'GoodsSpecificationDefinitionList',
      'GoodsSpecificationDefinitionEdit',
      'GoodsSpecificationGroupList',
      'GoodsSpecificationGroupEdit',
    ]"
    :listHandler="listHandler"
    :deleteHandler="deleteHandler"
    subPageName="GoodsSpecificationGroupList"
    :hidePage="true"
    :initPageSize="999999999"
    initSortProperty="order"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
    @setDeleteData="setDeleteData"
    @setGoSubList="setGoSubList"
    @setPageResult="setPageResult"
    @setPageList="setPageList"
  >
  </CommonTable>
</template>
<script>
import API from '@/api/goods-category'
import { Message } from 'iview'
import CommonTable from '@/components/tables/common-table'
import config from '@/config/index'

export default {
  name: 'GoodsCategoryList',
  components: {
    CommonTable
  },
  data () {
    return {
      list: [],
      originalList: [],
      loading: false,
      columns: [
        { type: 'selection', width: 60, align: 'center' },
        {
          title: '名称',
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: params.row.collapsed ? 'md-add' : 'md-remove'
                },
                style: {
                  visibility: params.row.level == 3 ? 'hidden' : '',
                  marginLeft: ((params.row.level - 1) * 20) + 'px',
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.collapse(params.row)
                  }
                }
              }),

              h('span', null, params.row.name)

            ])
          }
        },
        { title: '排序', key: 'order' },
        {
          title: '图标',
          key: 'icon',
          render: (h, params) => {
            return h('Poptip', null, [
              h('img', {
                attrs: {
                  src: config.baseUrl + '/goods/category/file/load?filePath=' + params.row.icon
                },
                style: {
                  marginRight: '8px',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer'
                }
              }),
              h('img', {
                slot: 'content',
                attrs: {
                  src: config.baseUrl + '/goods/category/file/load?filePath=' + params.row.icon
                },
                style: {
                  width: '100%',
                  height: '100%'
                }
              })
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            if (params.row.level == 3) {
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
                }, '类型列表'),

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
            } else if (params.row.level === 2) {
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
                ]),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginLeft: '5px'
                  },
                  on: {
                    click: () => {
                      this.goRecommend(params.row.id)
                    }
                  }
                }, '推荐')
              ])
            }
          }
        }
      ]
    }
  },
  methods: {
    goRecommend (id) {
      this.$router.push({ name: 'GoodsRecommendList', params: { id } })
    },
    setPageResult (list) {
      this.originalList = list
    },
    collapse (item) {
      let list = this.originalList
      for (let i in list) {
        let current = list[i]
        if (current.id == item.id) {
          current.collapsed = !current.collapsed
          if (current.collapsed) {
            this.list.push(current)
          } else {
            let arr = []
            for (let j in this.list) {
              let parent = this.list[j]
              if (current.id != parent.id) {
                arr.push(parent)
              }
            }
            this.list = arr
          }
          break
        }
      }
      let oldList = list
      list = []
      for (let i in oldList) {
        let current = oldList[i]
        if (!isSub(current, this.list)) {
          list.push(current)
        }
      }
      this.setPageList(list)

      function isSub (current, parents) {
        for (let i in parents) {
          if (current.parent && parents[i].id == current.parent.id) {
            return true
          } else if (current.parent && current.parent.parent && current.parent.parent.id == parents[i].id) {
            return true
          }
        }
        return false
      }
    },
    listHandler: API.list,
    deleteHandler: API.delete,
    setLoading (loading) {
      this.loading = loading
    },
    setDeleteData (callback) {
      this.deleteData = callback
    },
    setGoEdit (callback) {
      this.goEdit = callback
    },
    setGoSubList (callback) {
      this.goSubList = callback
    },
    setPageList (callback) {
      this.setPageList = callback
    }
  }
}
</script>
