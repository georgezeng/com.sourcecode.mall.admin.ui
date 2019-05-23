<template>
    <Card>
      <p slot="title">
        微信公众号开发者信息配置
      </p>
      <div slot="extra">
        <Button @click="saveGzh" type="primary" :loading="loading">保存</Button>
      </div>
      <Form ref="gzhForm" :model="gzhForm" :rules="gzhRules" :label-width="80">
        <FormItem label="账号" prop="account">
          <Input v-model="gzhForm.account"></Input>
        </FormItem>
        <FormItem label="密钥" prop="secret">
          <Input v-model="gzhForm.secret"></Input>
        </FormItem>
      </Form>
    </Card>
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
        gzhForm: {
          account: null,
          secret: null,
        },
        gzhRules: {
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
          this.gzhForm = data.gzhInfo
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      saveGzh() {
        this.$refs.gzhForm.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.saveGzh(this.gzhForm).then(res => {
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
