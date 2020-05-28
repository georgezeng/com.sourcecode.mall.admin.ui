<template>
    <div>
        <Card>
            <div slot="title" class="header">
                <i-button type="success" @click="back">返回</i-button>
                <i-button type="error" :disabled="delDisabled" @click="dels">批量删除</i-button>
                <i-button type="primary" @click="toAdd">新增</i-button>
            </div>
            <i-table :columns="columns" :data="data" @on-sort-change="sort" @on-selection-change="select" :loading="loading"></i-table>
            <div class="page">
                <Page :total="total" show-elevator :current="queryInfo.page.num" :page-size="queryInfo.page.size" @on-change="numChange" @on-page-size-change="sizeChange" show-sizer></Page>
            </div>
        </Card>
    </div>
</template>
<script>
import RecommendAPI from '@/api/goods-recommend'
// import API from '@/api/goods-specification-group'
import { Message } from 'iview'
// import CommonTable from '@/components/tables/common-table'

export default {
  name: 'GoodsRecommendList',
  data () {
    return {
      title: null,
      loading: false,
      columns: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '排序', key: 'order', sortable: true, sortType: 'asc' },
        { title: '名称', key: 'name', sortable: true },
        { title: '链接', key: 'link', sortable: true },
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
      ],
      data: [],
      queryInfo: {
        data: {
          categoryId: this.$route.params.id
        },
        page: {
          num: 1,
          size: 10,
          property: '',
          order: ''
        }
      },
      total: 0,
      selection: [],
      delDisabled: true
    }
  },
  methods: {
    toAdd () {
      this.$router.push({ name: 'GoodsRecommendAdd', query: { recommendId: this.$route.params.id } })
    },
    sort ({ column, key, order }) {
      console.log(column)
      this.queryInfo.page.property = key
      this.queryInfo.page.order = order.toUpperCase()
      this.getList()
    },
    async getList () {
      this.loading = true
      try {
        const { list, total } = await RecommendAPI.list(this.queryInfo)
        this.total = total
        this.data = list
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    numChange (num) {
      this.queryInfo.page.num = num
      this.getList()
    },
    sizeChange (size) {
      this.queryInfo.page.size = size
      this.getList()
    },
    select (selection) {
      this.selection = selection
      if (selection.length > 0) {
        this.delDisabled = false
      } else {
        this.delDisabled = true
      }
    },
    goEdit (id) {
      this.$router.push({ name: 'GoodsRecommendEdit', query: { recommendId: this.$route.params.id }, params: { id } })
    },
    async deleteData (ids) {
      await RecommendAPI.delete(ids.map(item => item.id))
      Message.success('删除成功')
      this.getList()
    },
    dels () {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>你确定要删除吗</p>',
        onOk: async () => {
          await RecommendAPI.delete(this.selection.map(item => item.id))
          this.getList()
          Message.success('删除成功')
        }
      })
    },
    back () {
      this.$router.replace({ name: 'GoodsCategoryList' })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style scoped>
.header {
    display: flex;
    flex-direction: row-reverse;
}
.header button {
    margin-left: 10px;
}
.page {
    text-align: right;
    margin-top: 20px;
}
</style>
