<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}商品类型
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="商品分类" prop="parentId">
          <CategoryList :value="form.parentId" :disableParent="true" :parents="categories"
                        @change="setCategory"/>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="排序" prop="order">
          <InputNumber :min="1" v-model="form.order"></InputNumber>
        </FormItem>
        <FormItem label="规格列表" prop="definitions" v-if="this.form.id">
          <Button type="primary" @click="goSubList">查看规格</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/goods-specification-group'
  import CategoryAPI from '@/api/goods-category'
  import {Message} from 'iview'
  import ApplicationAPI from '@/api/merchant-shop-application'
  import CategoryList from '../components/parents-category'

  export default {
    name: 'GoodsSpecificationGroupEdit',
    components: {
      CategoryList
    },
    data() {
      const orderCheck = (rule, value, callback) => {
        if (!this.form.order) {
          callback(new Error('排序不能为空'));
        } else if (this.form.order < 1) {
          callback(new Error('排序必须大于0'));
        } else {
          callback()
        }
      }
      const parentCheck = (rule, value, callback) => {
        if (!this.form.parentId) {
          callback(new Error('商品分类不能为空'));
        } else {
          callback()
        }
      }
      return {
        ids: [],
        loading: false,
        categories: [],
        form: {
          id: null,
          parentId: null,
          parent: null,
          order: null,
          name: '',
        },
        rules: {
          order: [
            {required: true, validator: orderCheck, trigger: 'change'},
          ],
          parentId: [
            {required: true, validator: parentCheck, trigger: 'change'},
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'change'},
            {max: 50, message: '名称不能多于50位', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      loadApplication() {
        // this.loading = true
        // ApplicationAPI.load().then(res => {
        //   this.loading = false
        //   if (res && res.id) {
        //     switch (res.status.name) {
        //       case 'Passed': {
        //         this.load()
        //         this.loadCategories()
        //         return
        //       }
        //     }
        //   }
        //   this.goNoPermit()
        // })
        this.load()
        this.loadCategories()
      },
      goNoPermit() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'GoodsNoPermit',
          params: {
            type: '类型',
            from: 'GoodsCategoryEdit'
          }
        })
      },
      goSubList() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'GoodsSpecificationDefinitionList',
          params: {
            ids: this.ids
          }
        })
      },
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.setCategory(data.parent.id)
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      setCategory(option) {
        this.form.parentId = parseInt(option)
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
          if (this.ids.length > 1) {
            let pid = parseInt(this.ids[this.ids.length - 2])
            if (pid != 0) {
              this.form.parentId = pid
            }
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            let values = []
            for (let i in this.form.values) {
              let value = this.form.values[i]
              if (value.name != '') {
                values.push(value)
              }
            }
            this.form.values = values
            this.form.parent = {
              id: this.form.parentId
            }
            API.save(this.form).then(res => {
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
          name: 'GoodsSpecificationGroupList',
          params: {
            ids: this.ids.join(',')
          }
        })
      },
    },
    computed: {
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
      isEdit() {
        return this.form.id != null && this.form.id != 0
      },
    },
    mounted: function () {
      this.ids = (this.$router.currentRoute.params.ids + '').split(',')
      this.form.id = this.ids[this.ids.length - 1]
      let isEdit = this.form.id != 0
      this.form.id = isEdit ? this.form.id : null;
      this.loadApplication()
    }
  }
</script>
