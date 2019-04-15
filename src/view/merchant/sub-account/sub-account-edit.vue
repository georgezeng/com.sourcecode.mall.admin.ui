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
        <FormItem label="用户名" prop="username">
          <Input v-model="form.username" :readonly="isEdit"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="form.email" placeholder="输入邮箱"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="form.password" @on-change="setConfirmPasswordStatus"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="confirmPassword">
          <Input type="password" v-model="form.confirmPassword"></Input>
        </FormItem>
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
        <FormItem label="权限">
          <MultiSelectors :leftList="authLeftList" :rightList="authRightList" :originLeftList="originAuthLeftList"
                          :originRightList="originAuthRightList" @set-multi-selectors-data="setAuthLists"/>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-sub-account'
  import MultiSelectors from '@/components/multi-selectors/multi-selectors'
  import {Message} from 'iview'
  import config from '@/config/index'
  import avatar from '@/assets/images/avatar.png'

  export default {
    name: 'MerchantSubAccountEdit',
    components: {
      MultiSelectors
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
        loading: false,
        upload: {
          format: ['png'],
          errorText: ''
        },
        form: {
          id: null,
          username: '',
          email: '',
          password: '',
          enabled: true,
          header: null,
          authorities: []
        },
        authorities: [],
        authLeftList: [],
        authRightList: [],
        originAuthLeftList: [],
        originAuthRightList: [],
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'change'},
            {min: 3, message: '用户名不能少于3位', trigger: 'change'},
            {max: 15, message: '用户名不能多于15位', trigger: 'change'}
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
            },
            {max: 20, message: '密码不能多于20位', trigger: 'change'}
          ],
          confirmPassword: [
            {required: !isEdit, message: '确认密码不能为空', trigger: 'change'},
            {required: !isEdit, validator: confirmPwdCheck, trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            let arr = []
            for (let i in data.authorities) {
              let item = data.authorities[i]
              arr.push({
                key: item.id,
                text: item.name,
                selected: false
              })
            }
            this.authRightList = arr
            this.originAuthRightList = arr.concat()
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      loadAuthorities() {
        this.loading = true
        API.authorities({
          data: null,
          page: {
            num: 1,
            size: 99999999,
            property: 'name',
            order: 'ASC'
          }
        }).then(result => {
          if (result.total > 0) {
            let arr = []
            for (let i in result.list) {
              let item = result.list[i]
              arr.push({
                key: item.id,
                text: item.name,
                selected: false
              })
            }
            this.authLeftList = arr
            this.originAuthLeftList = arr.concat()
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
            API.save(this.form).then(res => {
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
      setAuthLists(leftList, rightList, reload) {
        this.authLeftList = leftList
        this.authRightList = rightList
        if (reload) {
          this.originAuthLeftList = leftList.concat()
          this.originAuthRightList = rightList.concat()

          this.form.authorities = []
          for (let i in rightList) {
            let item = rightList[i]
            this.form.authorities.push({
              id: item.key,
              name: item.text,
              selected: item.selected
            })
          }

          this.authorities = []
          for (let i in leftList) {
            let item = leftList[i]
            this.authorities.push({
              id: item.key,
              name: item.text,
              selected: item.selected
            })
          }
        }
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
        return config.baseUrl + '/user/upload/header/params/' + (this.isEdit ? this.form.id : '0')
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
      this.form.id = this.$router.currentRoute.params.id
      let isEdit = this.form.id != 0
      this.form.id = isEdit ? this.form.id : null;
      this.rules.password[0].required = !isEdit
      this.load()
      this.loadAuthorities()
    }
  }
</script>
