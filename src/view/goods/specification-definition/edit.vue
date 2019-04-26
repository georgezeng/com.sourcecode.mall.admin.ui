<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}商品规格
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="排序" prop="order">
          <InputNumber :min="1" v-model="form.order"></InputNumber>
        </FormItem>
        <FormItem label="商品类型" prop="parent">
          <Select v-model="form.parentId" style="width:200px">
            <Option v-for="group in groups" :value="group.id" :key="group.id">{{ group.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="值" prop="values">
          <ValueLine v-for="(value, index) in form.attrs" :index="index" :name="value.name"
                     @change="changeValueName"
                     @add="addValue"
                     @remove="removeValue"/>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/goods-specification-definition'
  import {Message} from 'iview'
  import ValueLine from './value-line'

  export default {
    name: 'GoodsSpecificationDefinitionEdit',
    components: {
      ValueLine
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
      const valuesCheck = (rule, value, callback) => {
        let values = []
        for (let i in this.form.attrs) {
          let value = this.form.attrs[i]
          if (value.name != '') {
            values.push(value)
          }
        }
        if (values.length == 0) {
          callback(new Error('至少需要编辑一个值属性'));
        } else {
          callback();
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
        groups: [],
        form: {
          id: null,
          parentId: null,
          parent: null,
          order: null,
          name: '',
          attrs: [],
        },
        rules: {
          order: [
            {required: true, validator: orderCheck, trigger: 'change'},
          ],
          parent: [
            {required: true, validator: parentCheck, trigger: 'change'},
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'change'},
            {min: 1, message: '名称不能少于1位', trigger: 'change'},
            {max: 50, message: '名称不能多于50位', trigger: 'change'}
          ],
          values: [
            {required: true, validator: valuesCheck, trigger: 'change'},
          ]
        }
      }
    },
    methods: {
      changeValueName(index, name) {
        this.form.attrs[index].name = name
      },
      removeValue(index) {
        this.form.attrs.splice(index, 1)
        if (this.form.attrs.length == 0) {
          this.addValue()
        }
      },
      addValue(index) {
        this.form.attrs.splice(index + 1, 0, {
          id: null,
          name: ''
        })
      },
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.form.parentId = data.parent.id
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        } else {
          this.addValue()
        }
      },
      loadGroups() {
        this.loading = true
        API.loadGroups().then(data => {
          this.groups = data
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
          name: 'GoodsSpecificationDefinitionList',
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
      this.form.id = this.ids[this.ids.length-1]
      let isEdit = this.form.id != 0
      this.form.id = isEdit ? this.form.id : null;
      this.load()
      this.loadGroups()
    }
  }
</script>
