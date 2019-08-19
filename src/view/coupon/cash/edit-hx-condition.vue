<template>
  <Card>
    <p slot="title">
      编辑核销条件
    </p>
    <div slot="extra">
      <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
      <Button @click="goList" type="success">返回</Button>
    </div>
    <input type="hidden" :value="loadId"></input>
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem label="核销关联" prop="type">
        <RadioGroup v-model="form.type">
          <Radio label="All">全部</Radio>
          <Radio label="Category">分类</Radio>
          <Radio label="Item">商品</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="form.type == 'Category'" label="关联分类" prop="categoryIds">
        <CategorySelector :value="selectedCategories" :parents="categories" @change="changeCategory"/>
      </FormItem>
      <FormItem v-if="form.type == 'Item'" label="关联商品" prop="itemIds">
        <Select style="width: 90%; margin-right: 10px; margin-bottom: 10px;"
                v-model="itemIndexes"
                multiple
                filterable
                remote
                :remote-method="searchItems"
                :loading="loading">
          <Option v-for="(option, index) in items" :value="index" :key="index">{{option.name}}</Option>
        </Select>
        <Button type="primary" style="margin-bottom: 10px;" @click="addToItemList">添加</Button>
        <Table :columns="columns" :data="itemList"></Table>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
  import API from '@/api/cash-coupon'
  import CategorySelector from './category-selector'
  import GoodsItemAPI from '@/api/goods-item'
  import config from '@/config/index'
  import {Message} from 'iview'

  export default {
    components: {
      CategorySelector
    },
    props: [
      'id',
      'categories'
    ],
    data() {
      return {
        loading: false,
        items: [],
        itemIndexes: [],
        itemList: [],
        selectedCategories: [],
        form: {
          id: null,
          type: null,
          categoryIds: [],
          itemIds: [],
        },
        columns: [
          {title: '商品名称', key: 'name'},
          {
            title: '缩略图', key: 'thumbmail',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: config.publicBucketDomain + params.row.thumbnail,
                },
                style: {
                  width: '40px',
                  height: '40px',
                  verticalAlign: 'bottom'
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
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.itemList.splice(params.index, 1)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        rules: {}
      }
    },
    computed: {
      loadId() {
        this.load()
        return this.id
      }
    },
    methods: {
      addToItemList() {
        for (let i in this.itemIndexes) {
          let found = false
          let item = this.items[this.itemIndexes[i]]
          for (let j in this.itemList) {
            if (this.itemList[j].id == item.id) {
              found = true
              break
            }
          }
          if (!found) {
            this.itemList.push(item)
          }
        }
        this.items = []
        this.itemIndexes = []
      },
      searchItems(searchText) {
        this.loading = true
        GoodsItemAPI.list({
          data: {
            searchText
          },
          page: {
            num: 1,
            size: 9999
          }
        }).then(data => {
          this.items = data.list
          this.loading = false;
        })
      },
      changeCategory(arr) {
        this.form.categoryIds = arr
      },
      load() {
        if (this.id > 0) {
          this.form.id = this.id
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form.categoryIds = data.categoryIds
            this.form.items = data.items
            if (data.hxType) {
              this.form.type = data.hxType.name
              switch (this.form.type) {
                case 'Category': {
                  this.selectedCategories = this.form.categoryIds
                }
                  break
                case 'Item': {
                  this.itemList = this.form.items
                }
              }
            }
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        }
      },
      save() {
        this.loading = true
        switch (this.form.type) {
          case 'Item': {
            this.form.itemIds = this.itemList.map(it => it.id)
            this.form.categoryIds = []
            this.form.items = []
          }
            break
          case 'Category': {
            this.form.itemIds = []
            this.form.items = []
          }
            break
          case 'All': {
            this.form.categoryIds = []
            this.form.itemIds = []
            this.form.items = []
          }
            break
        }
        API.saveHxCondition(this.form).then(res => {
          Message.success('保存成功')
          this.goList()
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      },
      goList() {
        this.$router.push({
          name: 'CashCouponSettingList',
        })
      },
    },
  }
</script>
