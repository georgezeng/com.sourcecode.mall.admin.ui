<template>
    <Card>
      <p slot="title">
        站点配置
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" :loading="loading">保存</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem label="页面标题" prop="title">
          <Input v-model="form.title"></Input>
        </FormItem>
        <FormItem label="首页顶部logo" prop="headerLogo">
          <Upload
            :uploadUrl="uploadUrl"
            :previewUri="form.headerLogo"
            btnText="上传图片"
            :imgPrefix="imgPrefix"
            @setPreviewUrl="setHeaderLogoUrl"
          />
        </FormItem>
        <FormItem label="登录页logo" prop="loginLogo">
          <Upload
            :uploadUrl="uploadUrl"
            :previewUri="form.loginLogo"
            btnText="上传图片"
            :imgPrefix="imgPrefix"
            @setPreviewUrl="setLoginLogoUrl"
          />
        </FormItem>
        <FormItem label="微信客服账号" prop="wechatServiceAccount">
          <Input v-model="form.wechatServiceAccount"></Input>
        </FormItem>
      </Form>
    </Card>
</template>

<script>
  import config from '@/config'
  import API from '@/api/site-setting'
  import {Message} from 'iview'
  import Upload from '@/components/upload/img-single-upload'

  export default {
    components: {
      Upload
    },
    data() {
      return {
        config,
        uploadUrl: config.baseUrl + '/setting/site/upload',
        imgPrefix: config.publicBucketDomain,
        loading: false,
        form: {
          title: null,
          headerLogo: null,
          loginLogo: null,
          wechatServiceAccount: null,
        },
        rules: {
          title: [
            {required: true, message: '页面标题不能为空', trigger: 'change'},
          ],
          headerLogo: [
            {required: true, message: '首页顶部logo不能为空', trigger: 'change'},
          ],
          loginLogo: [
            {required: true, message: '登录页logo不能为空', trigger: 'change'},
          ],
        }
      }
    },
    methods: {
      setHeaderLogoUrl(url) {
        this.form.headerLogo = url
      },
      setLoginLogoUrl(url) {
        this.form.loginLogo = url
      },
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
