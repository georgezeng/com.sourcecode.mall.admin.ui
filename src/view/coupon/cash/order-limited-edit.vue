<template>
  <Card>
    <p slot="title">
      {{ action }}限额
    </p>
    <div slot="extra">
      <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
      <Button @click="goList" type="success">返回</Button>
    </div>
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem label="订单总额" prop="orderAmount">
        <InputNumber :min="0" v-model="form.orderAmount" style="width: 300px;" :precision="0"></InputNumber>
      </FormItem>
      <FormItem label="限额" prop="limitedAmount">
        <InputNumber :min="0" v-model="form.limitedAmount" style="width: 300px;" :precision="0"></InputNumber>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
  import API from '@/api/cash-coupon-order-limited'
  import {Message} from 'iview'
  import config from '@/config/index'


  export default {
    components: {},
    data() {
      const orderAmountCheck = (rule, value, callback) => {
        if (!this.form.orderAmount) {
          callback(new Error('订单总额必须大于0'));
        } else {
          callback();
        }
      }
      const limitedAmountCheck = (rule, value, callback) => {
        if (!this.form.limitedAmount) {
          callback(new Error('限额必须大于0'));
        } else {
          callback();
        }
      }
      return {
        loading: false,
        form: {
          id: null,
          orderAmount: 0,
          limitedAmount: 0,
        },
        rules: {
          orderAmount: [
            {required: true, validator: orderAmountCheck, trigger: 'change'},
          ],
          limitedAmount: [
            {required: true, validator: limitedAmountCheck, trigger: 'change'},
          ],
        }
      }
    },
    methods: {
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
          name: 'CashCouponOrderLimitedSettingList',
        })
      },
      load() {
        if (this.form.id > 0) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        }
      }
    },
    computed: {
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
    },
    created: function () {
      this.form.id = this.$router.currentRoute.params.id
      let isEdit = this.form.id > 0
      this.form.id = isEdit ? this.form.id : null;
    },
    mounted() {
      this.load()
    }
  }
</script>
