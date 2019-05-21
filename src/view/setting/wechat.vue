<template>
  <div>
    <Card>
      <p slot="title">
        微信开发者信息配置
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" :loading="loading">保存</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="账号" prop="account">
          <Input v-model="form.account"></Input>
        </FormItem>
        <FormItem label="密钥" prop="secret">
          <Input v-model="form.secret"></Input>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/wechat-setting'
  import {Message} from 'iview'


  export default {
    name: 'WechatSetting',
    components: {
    },
    data() {
      return {
        loading: false,
        form: {
          account: null,
          secret: null,
        },
        rules: {
          account: [
            {required: true, message: '账号不能为空', trigger: 'change'},
          ],
          secret: [
            {required: true, message: '密钥不能为空', trigger: 'change'},
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
