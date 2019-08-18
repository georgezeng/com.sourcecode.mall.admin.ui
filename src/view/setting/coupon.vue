<style scoped lang="less">
</style>
<template>
  <Card>
    <p slot="title">
      优惠券配置
    </p>
    <div slot="extra">
      <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
    </div>
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem label="现金券限额" prop="limitedAmount">
        <InputNumber :min="0" v-model="form.limitedAmount" style="width: 300px;" :precision="0"></InputNumber>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
  import API from '@/api/coupon-setting'
  import {Message} from 'iview'

  export default {
    components: {},
    data() {
      const amountCheck = (rule, value, callback) => {
        if (!this.form.limitedAmount) {
          callback(new Error('现金券限额不能为空'));
        } else {
          callback();
        }
      }
      return {
        loading: false,
        form: {
          limitedAmount: 0
        },
        rules: {
          limitedAmount: [
            {required: true, validator: amountCheck, trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.save(this.form).then(res => {
              Message.success('保存成功')
              this.loading = false
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      load() {
        this.loading = true
        API.load().then(data => {
          this.form = data
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      }
    },
    computed: {},
    mounted() {
      this.load()
    }
  }
</script>
