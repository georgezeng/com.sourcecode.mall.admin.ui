<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}子账户
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="账号" prop="username">
          <Input v-model="form.username" placeholder="请输入手机号" :readonly="isEdit"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="form.email" placeholder="请输入邮箱"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="form.password" @on-change="setConfirmPasswordStatus"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="confirmPassword">
          <Input type="password" v-model="form.confirmPassword"></Input>
        </FormItem>
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
        <FormItem label="权限">
          <Transfer
            :data="authLeftList"
            :target-keys="authRightList"
            filterable
            :list-style="{width: '300px', height: '400px'}"
            :filter-method="filterAuth"
            @on-change="changeTargetAuth"></Transfer>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-sub-account'
  import {Message} from 'iview'
  import config from '@/config/index'
  import avatar from '@/assets/images/avatar.png'
  import Upload from '@/components/upload/img-one-line-upload'

  const FAKE_PASSWORD = 'FakePwd123'

  export default {
    name: 'MerchantSubAccountEdit',
    components: {
      Upload
    },
    data() {
      let isEdit = this.$router.currentRoute.params.id != 0
      const confirmPwdCheck = (rule, value, callback) => {
        if (this.form.password !== '' && this.form.password !== value) {
          callback(new Error('确认密码与密码不相同'));
        } else {
          callback();
        }
      }
      return {
        avatar,
        loading: false,
        form: {
          id: null,
          username: '',
          email: '',
          password: '',
          enabled: true,
          avatar: null,
          authorities: []
        },
        authLeftList: [],
        authRightList: [],
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'change'},
            {max: 50, message: '用户名长度不能大于50', trigger: 'change'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'change'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'change'},
            {max: 50, message: '邮箱不能多于50位', trigger: 'change'}
          ],
          password: [
            {required: !isEdit, message: '密码不能为空', trigger: 'change'},
            {
              type: 'string',
              pattern: /^(?=.*[0-9].*)(?=.*[A-Za-z].*).{8,}$/,
              message: '密码必须数字+字母（区分大小写）并且不少于8位',
              trigger: 'change'
            }
          ],
          confirmPassword: [
            {required: !isEdit, message: '确认密码不能为空', trigger: 'change'},
            {required: !isEdit, validator: confirmPwdCheck, trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      filterAuth(data, query) {
        return data.label.indexOf(query) > -1;
      },
      changeTargetAuth (newTargetKeys) {
        this.authRightList = newTargetKeys;
        this.form.authorities = []
        for (let i in this.authRightList) {
          const key = this.authRightList[i]
          for (let j in this.authLeftList) {
            const item = this.authLeftList[j]
            if (item.key == key) {
              this.form.authorities.push({
                id: key
              })
              break
            }
          }
        }
      },
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.form.password = FAKE_PASSWORD
            this.form.confirmPassword = FAKE_PASSWORD
            let arr = []
            for (let i in data.authorities) {
              let item = data.authorities[i]
              arr.push(item.id)
            }
            this.authRightList = arr
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      loadAuthorities() {
        this.loading = true
        API.authorities().then(result => {
          if (result) {
            let arr = []
            for (let i in result) {
              let item = result[i]
              arr.push({
                key: item.id,
                label: item.name
              })
            }
            this.authLeftList = arr
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            let data = {...this.form}
            if(data.password === FAKE_PASSWORD) {
              data.password = null
              data.confirmPassword = null
            }
            API.save(data).then(res => {
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
          name: 'MerchantSubAccountList'
        })
      },
      setPreviewUrl(url) {
        this.form.avatar = url
      },
      setConfirmPasswordStatus() {
        let required = this.form.password !== ''
        this.rules.confirmPassword[0].required = required
        this.rules.confirmPassword[1].required = required
      }
    },
    computed: {
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
      isEdit() {
        return this.form.id != null && this.form.id != 0
      },
      uploadUrl() {
        return config.baseUrl + '/merchant/subAccount/file/upload/params/' + (this.form.id ? this.form.id : 0)
      },
      imgPrefix() {
        return config.baseUrl + '/merchant/subAccount/file/load/params/' + (this.form.id ? this.form.id : 0) + '?filePath='
      }
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      let isEdit = this.form.id != 0
      this.form.id = isEdit ? this.form.id : null;
      this.rules.password[0].required = !isEdit
      this.load()
      this.loadAuthorities()
    }
  }
</script>
