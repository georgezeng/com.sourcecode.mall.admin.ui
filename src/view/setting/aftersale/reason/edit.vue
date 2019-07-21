<style scoped lang="less">
</style>
<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}退换原因
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right"
                :loading="loading">保存
        </Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="排序" prop="orderNum">
          <InputNumber :min="1" v-model="form.orderNum"></InputNumber>
        </FormItem>
        <FormItem label="类型" prop="type">
          <Select v-model="form.type">
            <Option v-for="type in list" :value="type.value" :key="type.value">{{ type.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="内容" prop="content">
          <Input v-model="form.content"></Input>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/aftersale-reason-setting'
  import {Message} from 'iview'


  export default {
    name: 'AfterSaleReasonSettingEdit',
    components: {
    },
    data() {
      const orderNumCheck = (rule, value, callback) => {
        if (!this.form.orderNum) {
          callback(new Error('排序不能为空'))
          return
        }
        callback()
      }
      const typeCheck = (rule, value, callback) => {
        if (!this.form.type) {
          callback(new Error('类型不能为空'))
          return
        }
        callback()
      }
      return {
        loading: false,
        list: [
          {
            value: 'RefundOnly',
            label: '仅退款'
          },
          {
            value: 'SalesReturn',
            label: '退货退款'
          },
          {
            value: 'Change',
            label: '换货'
          }
        ],
        form: {
          id: null,
          orderNum: null,
          content: null,
          type: null
        },
        rules: {
          orderNum: [
            {required: true, validator: orderNumCheck, trigger: 'change'}
          ],
          type: [
            {required: true, validator: typeCheck, trigger: 'change'}
          ],
          content: [
            {required: true, message: '内容不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      load() {
        if (this.form.id) {
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
          name: 'AfterSaleReasonSettingList'
        })
      },
    },
    computed: {
      action() {
        return this.form.id > 0 ? '编辑' : '新增'
      }
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      this.form.id = this.form.id != 0 ? this.form.id : null;
      this.load()
    }
  }
</script>
