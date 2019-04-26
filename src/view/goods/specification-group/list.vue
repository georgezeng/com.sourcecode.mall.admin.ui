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
      <span class="float-right" :class="{hidden: hideBackBtn}">
        <Button @click="goParentList" type="success">返回</Button>
      </span>
      <Button @click="bulkDeleteModal=true" :disabled="deleteBtnDisabled" class="float-right margin-right" type="error">
        批量删除
      </Button>
      <Button @click="goAdd" class="float-right margin-right" type="primary">新增</Button>
      <div class="clearfix"></div>
      <Table class="margin-top-bottom" :loading="loading" :data="list" :columns="columns"
             @on-select-all="enableDeleteBtn"
             @on-select="enableDeleteBtn" @on-sort-change="sortChange"
             @on-select-all-cancel="disableDeleteBtn" @on-select-cancel="disableDeleteBtn"/>
      <Page :total="total"
            :page-size="queryInfo.page.size"
            :current="queryInfo.page.num"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            show-elevator show-sizer class="float-right"/>
      <div class="clearfix"></div>
    </Card>
  </div>
</template>
<script>
  import API from '@/api/goods-specification-group'
  import {Message} from 'iview'

  export default {
    name: 'GoodsSpecificationGroupList',
    components: {},
    data() {
      return {
        ids: [],
        queryInfo: {
          data: {
            parent: {
              id: 0
            },
            searchText: ''
          },
          page: {
            num: 1,
            size: 10,
            property: 'order',
            order: 'ASC'
          }
        },
        total: 0,
        list: [],
        selection: [],
        loading: false,
        bulkDeleteModal: false,
        deleteBtnDisabled: true,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '排序', key: 'order', sortable: true, sortType: 'asc'},
          {title: '名称', key: 'name', sortable: true},
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
    computed: {
      hideBackBtn() {
        return this.ids.length == 1 && this.ids[0] == 0
      }
    },
    methods: {
      goSubList(id) {
        this.ids.push(id)
        this.$store.commit('setQueryInfo', {queryInfo: this.queryInfo, routeName: this.$router.currentRoute.name})
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'GoodsSpecificationDefinitionList',
          params: {
            ids: this.ids.join(',')
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
          this.list = res.list
          this.total = res.total
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
        this.ids.push(id)
        this.$store.commit('setQueryInfo', {queryInfo: this.queryInfo, routeName: this.$router.currentRoute.name})
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'GoodsSpecificationGroupEdit',
          params: {
            ids: this.ids.join(',')
          }
        })
      },
      goParentList() {
        this.ids.splice(this.ids.length - 1, 1)
        this.$store.commit('setQueryInfo', {queryInfo: null, routeName: this.$router.currentRoute.name})
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'GoodsCategoryList',
          params: {
            ids: this.ids.join(',')
          }
        })
      }
    },
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'GoodsCategoryEdit'
        && item.name !== 'GoodsCategoryList'
        && item.name !== 'GoodsSpecificationDefinitionList'
        && item.name !== 'GoodsSpecificationDefinitionEdit'
        && item.name !== 'GoodsSpecificationGroupEdit'
      )
      this.$store.commit('setTagNavList', res)
      this.ids = (this.$router.currentRoute.params.ids + '').split(',')
      console.log(this.ids[0])
      this.queryInfo.data.parent.id = this.ids[this.ids.length - 1]
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
