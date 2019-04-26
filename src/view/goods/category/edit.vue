<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}商品分类
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="排序" prop="order">
          <InputNumber :min="1" v-model="form.order"></InputNumber>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="规格列表" prop="definitions" :class="{hidden: !this.form.id}">
          <Button type="primary" @click="goSubList">查看类型</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/goods-category'
  import {Message} from 'iview'

  export default {
    name: 'GoodsCategoryEdit',
    components: {
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
      return {
        loading: false,
        form: {
          id: null,
          order: null,
          name: '',
        },
        rules: {
          order: [
            {required: true, validator: orderCheck, trigger: 'change'},
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'change'},
            {min: 1, message: '名称不能少于1位', trigger: 'change'},
            {max: 50, message: '名称不能多于50位', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      goSubList() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'GoodsSpecificationGroupList',
          params: {
            ids: [this.form.id, 0]
          }
        })
      },
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.form.parent = data.parent.id
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
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
              id: this.form.parent
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
        this.$router.push({
          name: 'GoodsCategoryList',
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
      this.form.id = this.$router.currentRoute.params.id
      let isEdit = this.form.id != 0
      this.form.id = isEdit ? this.form.id : null;
      this.load()
    }
  }
</script>
