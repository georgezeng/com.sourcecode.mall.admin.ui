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
        <FormItem label="头像" prop="avatar">
          <Upload
            :uploadUrl="uploadUrl"
            :previewUri="form.avatar"
            btnText="上传头像"
            :imgPrefix="imgPrefix"
            :uploadPlaceholder="avatar"
            width="32"
            height="32"
            @setPreviewUrl="setPreviewUrl"
          />
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
  import Upload from '@/components/upload/img-one-line-upload'

  export default {
    name: 'MerchantUserProfile',
    components: {
      ModifyPassword,
      Upload
    },
    data() {
      return {
        loading: false,
        modifyPasswordModal: false,
        avatar,
        imgPrefix: config.baseUrl + '/user/current/file/load?filePath=',
        form: {
          id: null,
          username: '',
          email: '',
          avatar: null,
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
            API.saveCurrent(this.form).then(res => {
              this.loading = false
              Message.success('保存成功')
              this.$store.commit('setAvator', this.form.avatar)
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
      setPreviewUrl(url, index) {
        this.form.avatar = url
      },
    },
    computed: {
      uploadUrl() {
        return config.baseUrl + '/user/current/file/upload'
      },
    },
    mounted: function () {
      this.load()
    }
  }
</script>
