<template>
    <Card>
      <p slot="title">
        运费配置
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" :loading="loading">保存</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem label="低于金额" prop="totalAmount">
          <InputNumber :min="1" :precision="2" v-model="form.totalAmount" style="width: 300px;"></InputNumber>
        </FormItem>
        <FormItem label="运费" prop="fee">
          <InputNumber :min="0" :precision="2" v-model="form.fee" style="width: 300px;"></InputNumber>
        </FormItem>
      </Form>
    </Card>
</template>

<script>
import config from '@/config'
import API from '@/api/merchant-setting'
import { Message } from 'iview'

export default {
  components: {
  },
  data () {
    const numCheck = (rule, value, callback) => {
      if (value == null || value == '') {
        callback(new Error('不能为空'));
      } else {
        callback();
      }
    }
    return {
      config,
      loading: false,
      form: {
        totalAmount: null,
        fee: null
      },
      rules: {
        totalAmount: [
          { required: true, validator: numCheck, trigger: 'change' }
        ],
        fee: [
          { required: true, validator: numCheck, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    load () {
      this.loading = true
      API.load('EXPRESS_FEE').then(data => {
        if (data) {
          this.form = JSON.parse(data)
        }
        this.loading = false
      }).catch(ex => {
        this.loading = false
      })
    },
    save () {
      this.$refs.form.validate().then(valid => {
        if (valid) {
          this.loading = true
          API.save('EXPRESS_FEE', this.form).then(res => {
            this.loading = false
            Message.success('保存成功')
          }).catch(ex => {
            this.loading = false
          })
        }
      })
    }
  },
  mounted: function () {
    this.load()
  }
}
</script>
