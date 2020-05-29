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
          <Input v-model="form.totalAmount"></Input>
        </FormItem>
        <FormItem label="运费" prop="fee">
          <Input v-model="form.fee"></Input>
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
    return {
      config,
      loading: false,
      form: {
        totalAmount: null,
        fee: null
      },
      rules: {
        totalAmount: [
          { required: true, message: '低于金额不能为空', trigger: 'change' }
        ],
        fee: [
          { required: true, message: '运费不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    load () {
      this.loading = true
      API.load('EXPRESS_FEE').then(data => {
        this.form = JSON.parse(data)
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
