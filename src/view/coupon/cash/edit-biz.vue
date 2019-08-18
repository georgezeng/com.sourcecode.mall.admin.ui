<template>
  <Card>
    <p slot="title">
      编辑业务属性
    </p>
    <div slot="extra">
      <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
      <Button @click="goList" type="success">返回</Button>
    </div>
    <input type="hidden" :value="loadId"></input>
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem label="用户行为" prop="eventType">
        <Select v-model="form.eventType">
          <Option v-for="(type,index) in types" :value="type.name" :key="index">{{ type.text }}</Option>
        </Select>
      </FormItem>
      <FormItem v-if="form.eventType == 'Invite'" label="邀请人数" prop="memberNums">
        <InputNumber :min="0" v-model="form.inviteSetting.memberNums" style="width: 300px;"
                     :precision="0"></InputNumber>
      </FormItem>
      <FormItem v-if="form.eventType == 'Consume'" label="满额条件" prop="upToAmount">
        <InputNumber :min="0" v-model="form.consumeSetting.upToAmount" style="width: 300px;"
                     :precision="0"></InputNumber>
      </FormItem>
      <FormItem v-if="form.eventType == 'Consume'" label="消费关联" prop="eventType">
        <RadioGroup v-model="relateTo">
          <Radio label="all">全部</Radio>
          <Radio label="category">分类</Radio>
          <Radio label="item">商品</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="form.eventType == 'Consume' && relateTo == 'category'" label="关联分类" prop="categoryIds">
        <CategorySelector :value="selectedCategories" :parents="categories" @change="changeCategory"/>
      </FormItem>
      <FormItem v-if="form.eventType == 'Consume' && relateTo == 'item'" label="关联商品" prop="itemIds">
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
  import CategoryAPI from '@/api/goods-category'
  import GoodsItemAPI from '@/api/goods-item'
  import config from '@/config/index'
  import {Message} from 'iview'

  export default {
    components: {
      CategorySelector
    },
    props: [
      'id'
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
          eventType: null,
          consumeSetting: {
            applyToAll: null,
            upToAmount: 0,
            categories: [],
            categoryIds: [],
            items: [],
            itemIds: [],
          },
          inviteSetting: {
            memberNums: 0
          }
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
        types: [
          {
            name: 'Consume',
            text: '购物消费'
          },
          {
            name: 'Invite',
            text: '邀请好友'
          },
          {
            name: 'Registration',
            text: '用户注册'
          }
        ],
        relateTo: 'all',
        categories: [],
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
        this.form.consumeSetting.categoryIds = arr
      },

      load() {
        if (this.id > 0) {
          this.form.id = this.id
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form.eventType = data.eventType.name
            switch (this.form.eventType) {
              case 'Consume': {
                this.form.consumeSetting = data.consumeSetting
                if (this.form.consumeSetting.applyToAll) {
                  this.relateTo = 'all'
                } else if (this.form.consumeSetting.categories != null && this.form.consumeSetting.categories.length > 0) {
                  this.relateTo = 'category'
                  this.selectedCategories = this.form.consumeSetting.categories.map(it => it.id)
                } else if (this.form.consumeSetting.items != null && this.form.consumeSetting.items.length > 0) {
                  this.itemList = this.form.consumeSetting.items
                  this.relateTo = 'item'
                }
              }
                break
              case 'Invite': {
                this.form.inviteSetting = data.inviteSetting
              }
                break
            }
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        }
      },

      loadAllCategories() {
        this.loading = true
        CategoryAPI.list({
          data: {},
          page: {
            num: 1,
            size: 999999999
          }
        }).then(data => {
          this.categories = []
          for (let i in data) {
            let item = data[i]
            item.value = item.id
            this.categories.push(item)
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },

      save() {
        this.loading = true
        switch (this.form.eventType) {
          case 'Consume': {
            switch (this.relateTo) {
              case 'item': {
                this.form.applyToAll = false
                this.form.consumeSetting.itemIds = this.itemList.map(it => it.id)
                this.form.consumeSetting.categoryIds = []
                this.form.consumeSetting.categories = []
                this.form.consumeSetting.items = []
              }
                break
              case 'category': {
                this.form.applyToAll = false
                this.form.consumeSetting.itemIds = []
                this.form.consumeSetting.items = []
                this.form.consumeSetting.categories = []
              }
                break
              case 'all': {
                this.form.applyToAll = true
                this.form.consumeSetting.categoryIds = []
                this.form.consumeSetting.itemIds = []
                this.form.consumeSetting.items = []
                this.form.consumeSetting.categories = []
              } break
            }
          }
        }
        API.saveBizInfo(this.form).then(res => {
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

    mounted() {
      this.loadAllCategories()
    }
  }
</script>
