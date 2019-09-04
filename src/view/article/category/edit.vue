<style scoped lang="less">
</style>
<template>
  <div>
    <Card>
      <p slot="title">
        {{action}}文章分类
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right"
                :loading="loading">保存
        </Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form :model="form" ref="form" :rules="rules" :label-width="80">
        <FormItem label="栏目名称" prop="type">
          <Select v-model="form.type">
            <Option v-for="type in typeList" :value="type.value" :key="type.value">{{ type.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="分类名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="排序" prop="orderNum">
          <InputNumber v-model="form.orderNum" :min="1" style="width: 300px;" :precision="0"></InputNumber>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/article-category'
  import {Message} from 'iview'
  import config from '@/config/index'

  export default {
    name: 'ClientUserEdit',
    components: {},
    data() {
      const numCheck = (rule, value, callback) => {
        if (!this.form.orderNum || isNaN(this.form.orderNum)) {
          callback(new Error('排序必须大于1'));
        } else {
          callback();
        }
      }
      return {
        loading: false,
        typeList: [
          {
            value: 'Site',
            text: '站点文章'
          },
          {
            value: 'Life',
            text: '多呗生活'
          }
        ],
        form: {
          id: null,
          type: null,
          name: null,
          orderNum: null,
        },
        rules: {
          type: [
            {required: true, message: '栏目名称不能为空', trigger: 'change'}
          ],
          name: [
            {required: true, message: '分类名称不能为空', trigger: 'change'},
            {max: 50, message: '分类名称不能大于50字', trigger: 'change'}
          ],
          orderNum: [
            {required: true, validator: numCheck, trigger: 'change'},
          ]
        }
      }
    },
    methods: {
      load() {
        if (this.form.id > 0) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.form.type = data.type.name
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
          name: 'ArticleCategoryList'
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
      this.form.id = this.form.id > 0 ? this.form.id : null;
      this.load()
    }
  }
</script>
