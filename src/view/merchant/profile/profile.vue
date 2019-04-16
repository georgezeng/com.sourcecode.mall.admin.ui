<template>
  <div>
    <ModifyPassword @trigger="triggerModal" :mobile="form.username" :show="modifyPasswordModal" />
    <Card>
      <p slot="title">
        商家账户编辑
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="头像" prop="header">
          <Upload class="float-left margin-right-10" :action="uploadUrl" with-credentials :format="upload.format"
                  :show-upload-list="false" :max-size="3000"
                  :on-exceeded-size="showExceededError" :on-format-error="showFormatError"
                  :on-success="showUploadSuccess">
            <Button icon="ios-cloud-upload-outline">上传头像</Button>
          </Upload>
          <img class="float-left margin-right-10" :src="imgPreviewUrl" width="32" height="32"/>
          <Alert class="float-left" :class="{hidden: !upload.errorText}" type="error">{{upload.errorText}}</Alert>
        </FormItem>
        <FormItem label="手机号" prop="username">
          <Input v-model="form.username" readonly></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="form.email" placeholder="输入邮箱"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" value="password" readonly style="width: 300px; margin-right: 10px;"></Input>
          <Button @click="triggerModal(true)">修改密码</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import ModifyPassword from '@/view/modify-password/modify-password'
  import API from '@/api/users'
  import {getUserInfo} from '@/api/user'
  import {Message} from 'iview'
  import config from '@/config/index'
  import avatar from '@/assets/images/avatar.png'
  import {getToken} from '@/libs/util'

  export default {
    name: 'MerchantProfile',
    components: {
      ModifyPassword
    },
    data() {
      return {
        loading: false,
        upload: {
          format: ['png'],
          errorText: ''
        },
        modifyPasswordModal: false,
        form: {
          id: null,
          username: '',
          email: '',
          header: null,
        },
        rules: {
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'change'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'change'},
            {max: 50, message: '邮箱不能多于50位', trigger: 'change'}
          ],
        }
      }
    },
    methods: {
      triggerModal(flag) {
        this.modifyPasswordModal = flag
      },
      load() {
        this.loading = true
        getUserInfo(getToken()).then(res => {
          this.loading = false
          this.form = res
        }).catch(e => {
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
      showFormatError() {
        let formats = ''
        for(let i in this.upload.format) {
          formats += this.upload.format[i]
        }
        this.upload.errorText = '文件类型只能是' + this.upload.format[0]
      },
      showUploadSuccess(response, file, fileList) {
        this.upload.errorText = ''
        this.imgPreviewUrl = response.data
        Message.success('上传成功')
      },
      showExceededError() {
        this.upload.errorText = '文件大小必须在3000KB以内'
      },
    },
    computed: {
      uploadUrl() {
        return config.baseUrl + '/user/upload/header/params/' + this.form.id
      },
      imgPreviewUrl: {
        get() {
          return this.form.header != null ? config.publicBucketDomain + this.form.header : avatar
        },
        set(url) {
          this.form.header = url
        }
      }
    },
    mounted: function () {
      this.load()
    }
  }
</script>
