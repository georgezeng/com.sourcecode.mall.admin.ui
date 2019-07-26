<template>
    <Card>
      <p slot="title">
        微信公众号开发者信息配置
      </p>
      <div slot="extra">
        <Button @click="saveGzh" type="primary" :loading="loading">保存</Button>
      </div>
      <Form ref="gzhForm" :model="gzhForm" :rules="gzhRules" :label-width="100">
        <FormItem label="账号" prop="account">
          <Input v-model="gzhForm.account"></Input>
        </FormItem>
        <FormItem label="密钥" prop="secret">
          <Input v-model="gzhForm.secret"></Input>
        </FormItem>
        <FormItem label="支付商户号" prop="mch">
          <Input v-model="gzhForm.mch"></Input>
        </FormItem>
        <FormItem label="支付API证书" prop="cert">
          <Upload
            :uploadUrl="config.baseUrl + '/setting/wechat/pay/cert/upload'"
            :formats="['p12']"
            btnText="上传证书"
          />
        </FormItem>
      </Form>
    </Card>
</template>

<script>
  import config from '@/config'
  import API from '@/api/wechat-setting'
  import {Message} from 'iview'
  import Upload from '@/components/upload/file-single-upload'

  export default {
    name: 'WechatSetting',
    components: {
      Upload
    },
    data() {
      return {
        config,
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
          mch: [
            {required: true, message: '商户号不能为空', trigger: 'change'},
          ],
        }
      }
    },
    methods: {
      load() {
        this.loading = true
        API.loadGzh().then(data => {
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
