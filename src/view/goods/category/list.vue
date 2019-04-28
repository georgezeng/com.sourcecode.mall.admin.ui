<template>
  <div>
    <Modal v-model="bulkDeleteModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>操作提示</span>
      </p>
      <div>
        <p>确定要删除选中的记录吗?</p>
        <ul style="list-style: none;">
          <li v-for="item in selection">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="loading" @click="bulkDelete">删除</Button>
      </div>
    </Modal>

    <Card>
      <Input v-model="queryInfo.data.searchText" search enter-button @on-search="load"
             style="float: left; width: 200px; margin-bottom: 5px;"/>
      <Button @click="bulkDeleteModal=true" :disabled="deleteBtnDisabled" class="float-right" type="error">批量删除</Button>
      <Button @click="goAdd" class="float-right margin-right" type="primary">新增</Button>
      <div class="clearfix"></div>
      <Table class="margin-top-bottom" :loading="loading" :data="list" :columns="columns"
             @on-select-all="enableDeleteBtn"
             @on-select="enableDeleteBtn" @on-sort-change="sortChange"
             @on-select-all-cancel="disableDeleteBtn" @on-select-cancel="disableDeleteBtn"/>
    </Card>
  </div>
</template>
<script>
  import API from '@/api/goods-category'
  import {Message} from 'iview'

  export default {
    name: 'GoodsCategoryList',
    components: {},
    data() {
      return {
        queryInfo: {
          data: {
            searchText: ''
          },
          page: {
            num: 1,
            size: 99999999,
            property: 'order',
            order: 'ASC'
          }
        },
        list: [],
        originalList: [],
        selection: [],
        loading: false,
        bulkDeleteModal: false,
        deleteBtnDisabled: true,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
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

                h('span', null, params.row.name),

              ])
            }
          },
          {title: '排序', key: 'order'},
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
    methods: {
      collapse(item) {
        let list = this.originalList
        let parent = null
        for (let i in list) {
          let current = list[i]
          if (current.id == item.id) {
            current.collapsed = !current.collapsed
            if (current.collapsed) {
              parent = current
            }
            break
          }
        }
        if (parent) {
          this.list = []
          for (let i in list) {
            let current = list[i]
            if (!isSub(current, parent.attrs)) {
              this.list.push(current)
            }
          }
        } else {
          this.list = this.originalList
        }

        function isSub(current, list) {
          if (list && list.length > 0) {
            for (let i in list) {
              let item = list[i]
              if (item.id == current.id || isSub(current, item.attrs)) {
                return true
              }
            }
          }
          return false
        }
      },
      goSubList(id) {
        this.$store.commit('setQueryInfo', {queryInfo: this.queryInfo, routeName: this.$router.currentRoute.name})
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'GoodsSpecificationGroupList',
          params: {
            ids: id
          }
        })
      },
      load() {
        this.changePage(1)
      },
      sortChange({key, order}) {
        if (!order) order = 'ASC'
        this.queryInfo.page.property = key
        this.queryInfo.page.order = order.toUpperCase()
        this.load()
      },
      changePage(pageNum) {
        this.loading = true
        this.queryInfo.page.num = pageNum ? pageNum : this.queryInfo.page.num
        API.list(this.queryInfo).then(res => {
          this.list = res
          this.originalList = res
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      changePageSize(pageSize) {
        this.queryInfo.page.size = pageSize ? pageSize : this.queryInfo.page.size
        this.changePage(1)
      },
      bulkDelete() {
        this.deleteData(this.selection)
      },
      deleteData(selection) {
        this.loading = true
        let ids = []
        selection.forEach(item => {
          ids.push(item.id)
        })
        API.delete(ids).then(res => {
          this.bulkDeleteModal = false
          Message.success('删除成功')
          this.load()
        }).catch(ex => {
          this.bulkDeleteModal = false
          this.loading = false
        })
      },
      enableDeleteBtn(selection) {
        this.deleteBtnDisabled = false
        this.recollectIds(selection)
      },
      disableDeleteBtn(selection) {
        this.deleteBtnDisabled = selection.length == 0
        this.recollectIds(selection)
      },
      recollectIds(selection) {
        if (selection) {
          this.selection = selection
        }
      },
      goAdd() {
        this.goEdit(0)
      },
      goEdit(id) {
        this.$store.commit('setQueryInfo', {queryInfo: this.queryInfo, routeName: this.$router.currentRoute.name})
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'GoodsCategoryEdit',
          params: {
            id
          }
        })
      }
    },
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'GoodsCategoryEdit'
        && item.name !== 'GoodsSpecificationDefinitionList'
        && item.name !== 'GoodsSpecificationDefinitionEdit'
        && item.name !== 'GoodsSpecificationGroupList'
        && item.name !== 'GoodsSpecificationGroupEdit'
      )
      this.$store.commit('setTagNavList', res)
      this.load()
    },
    updated: function () {
      let routeName = this.$router.currentRoute.name
      let queryInfo = this.$store.state.app.queryInfo[routeName]
      if (queryInfo) {
        this.$store.commit('setQueryInfo', {queryInfo: null, routeName})
        this.queryInfo = queryInfo
        this.changePage()
      }
    }
  }
</script>
