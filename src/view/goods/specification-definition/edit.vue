<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}规格
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
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
  import config from '@/config/index'
  import ValueLine from './value-line'

  export default {
    name: 'GoodsSpecificationDefinitionEdit',
    components: {
      ValueLine
    },
    data() {
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
      return {
        loading: false,
        form: {
          id: null,
          name: '',
          attrs: [],
        },
        rules: {
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
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        } else {
          this.addValue()
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
          name: 'GoodsSpecificationDefinitionList'
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
