<template>
    <Card>
      <p slot="title">
        支付宝开发者信息配置
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" :loading="loading">保存</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem label="账号" prop="account">
          <Input v-model="form.account"></Input>
        </FormItem>
        <FormItem label="密钥" prop="secret">
          <Input v-model="form.secret"></Input>
        </FormItem>
        <FormItem label="支付宝公钥" prop="mch">
          <Input v-model="form.mch"></Input>
        </FormItem>
      </Form>
    </Card>
</template>

<script>
  import config from '@/config'
  import API from '@/api/alipay-setting'
  import {Message} from 'iview'

  export default {
    components: {
    },
    data() {
      return {
        config,
        loading: false,
        form: {
          account: null,
          secret: null,
          mch: null
        },
        rules: {
          account: [
            {required: true, message: '账号不能为空', trigger: 'change'},
          ],
          secret: [
            {required: true, message: '密钥不能为空', trigger: 'change'},
          ],
          mch: [
            {required: true, message: '支付宝公钥不能为空', trigger: 'change'},
          ],
        }
      }
    },
    methods: {
      load() {
        this.loading = true
        API.load().then(data => {
          this.form = data
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.save(this.form).then(res => {
              this.loading = false
              Message.success('保存成功')
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
    },
    mounted: function () {
      this.load()
    }
  }
</script>
