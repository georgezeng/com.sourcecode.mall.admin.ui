<template>
  <Card>
    <p slot="title">
      编辑赠送条件
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
      <FormItem v-if="form.eventType == 'Consume'" label="消费关联" prop="type">
        <RadioGroup v-model="form.consumeSetting.type">
          <Radio label="All">全部</Radio>
          <Radio label="Category">分类</Radio>
          <Radio label="Item">商品</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="form.eventType == 'Consume' && form.consumeSetting.type == 'Category'" label="关联分类" prop="categoryIds">
        <CategorySelector :value="selectedCategories" :parents="categories" @change="changeCategory"/>
      </FormItem>
      <FormItem v-if="form.eventType == 'Consume' && form.consumeSetting.type == 'Item'" label="关联商品" prop="itemIds">
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
  import API from '@/api/coupon'
  import CategorySelector from '../common/category-selector'
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
          eventType: null,
          consumeSetting: {
            type: null,
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
        rules: {}
      }
    },
    computed: {
      loadId() {
        this.load()
        return this.id
      },
      isEdit() {
        return this.form.id != null && this.form.id > 0
      },
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
                if (data.consumeSetting.type) {
                  this.form.consumeSetting.type = data.consumeSetting.type.name
                  switch (this.form.consumeSetting.type) {
                    case "Category": {
                      this.selectedCategories = this.form.consumeSetting.categories.map(it => it.id)
                    }
                      break
                    case 'Item': {
                      this.itemList = this.form.consumeSetting.items
                    }
                      break
                  }
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
      save() {
        this.loading = true
        switch (this.form.eventType) {
          case 'Consume': {
            switch (this.form.consumeSetting.type) {
              case 'Item': {
                this.form.consumeSetting.itemIds = this.itemList.map(it => it.id)
                this.form.consumeSetting.categoryIds = []
                this.form.consumeSetting.categories = []
                this.form.consumeSetting.items = []
              }
                break
              case 'Category': {
                this.form.consumeSetting.itemIds = []
                this.form.consumeSetting.items = []
                this.form.consumeSetting.categories = []
              }
                break
              case 'All': {
                this.form.consumeSetting.categoryIds = []
                this.form.consumeSetting.itemIds = []
                this.form.consumeSetting.items = []
                this.form.consumeSetting.categories = []
              }
                break
            }
          }
        }
        API.saveZsCondition(this.form).then(res => {
          Message.success('保存成功')
          this.$emit('saveSuccess', {id: this.form.id, to: 'hx'})
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
