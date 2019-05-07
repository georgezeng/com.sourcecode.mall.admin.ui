<template>
  <div>
    <Card>
      <p slot="title">
        关联规格
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="当前类型">
          <Select :disabled="true" multiple :value="form.id">
            <Option v-for="group in groups" :value="group.id" :key="group.id">{{ group.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="商品分类">
          <CategoryList :value="categoryId" :disabled="true" :disableParent="true" :parents="categories"
                        @change="setCategory"/>
        </FormItem>
        <FormItem label="选择规格" prop="definitions">
          <Select multiple v-model="form.subList">
            <Option v-for="definition in definitions" :value="definition.id" :key="definition.id">
              {{ definition.name }}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/goods-specification-definition'
  import CategoryList from '../components/parents-category'
  import {Message} from 'iview'
  import ValueLine from './value-line'
  import ApplicationAPI from '@/api/merchant-shop-application'
  import CategoryAPI from '@/api/goods-category'
  import GroupAPI from '@/api/goods-specification-group'

  export default {
    name: 'GoodsSpecificationDefinitionEdit',
    components: {
      ValueLine,
      CategoryList
    },
    data() {
      const definitionCheck = (rule, value, callback) => {
        if (!this.form.subList || this.form.subList.length == 0) {
          callback(new Error('至少选择一个规格'));
        } else {
          callback()
        }
      }
      return {
        ids: [],
        loading: false,
        categories: [],
        groups: [],
        definitions: [],
        categoryId: null,
        form: {
          id: null,
          subList: [],
        },
        rules: {
          definitions: [
            // {required: true, validator: definitionCheck, trigger: 'change'},
          ]
        }
      }
    },
    methods: {
      setCategory(option) {
        let id = parseInt(option)
        if (!isNaN(id)) {
          this.categoryId = id
          this.loadGroups(id)
          this.loadDefinitions(id)
        }
      },
      loadApplication() {
        this.loading = true
        ApplicationAPI.load().then(res => {
          this.loading = false
          if (res && res.id) {
            switch (res.status.name) {
              case 'Passed': {
                this.load()
                this.loadCategories()
                return
              }
            }
          }
          this.goNoPermit()
        })
      },
      loadCategories() {
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
      goNoPermit() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'GoodsNoPermit',
          params: {
            type: '规格',
            from: 'GoodsCategoryEdit'
          }
        })
      },
      load() {
        if (this.form.id) {
          this.loading = true
          GroupAPI.load(this.form.id).then(data => {
            this.form = data
            if (data.parent && data.parent.id) {
              this.setCategory(data.parent.id)
            }
            if (data.attrs && data.attrs.length > 0) {
              this.form.subList = []
              for (let i in data.attrs) {
                let item = data.attrs[i]
                this.form.subList.push(item.id)
              }
            }
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      loadGroups(id) {
        this.loading = true
        API.loadGroups(id).then(data => {
          this.groups = data
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      loadDefinitions(id) {
        API.loadDefinitions(id).then(data => {
          this.definitions = data
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.relate(this.form.subList, this.form.id).then(res => {
              this.loading = false
              Message.success('保存成功')
              this.goList()
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
      goList() {
        this.ids.splice(this.ids.length - 1, 1)
        this.$router.push({
          name: 'GoodsSpecificationDefinitionList',
          params: {
            ids: this.ids.join(',')
          }
        })
      },
    },
    mounted: function () {
      this.ids = (this.$router.currentRoute.params.ids + '').split(',')
      this.form.id = this.ids[this.ids.length - 2]
      this.loadApplication()
    }
  }
</script>
