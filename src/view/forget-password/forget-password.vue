<template>
  <Form ref="form" :model="form" :rules="rules" :label-width="80">
    <FormItem label="手机号" prop="username">
      <Input :value="mobileNum" placeholder="输入手机号" :readonly="hideBtns"></Input>
    </FormItem>
    <FormItem label="验证码" prop="verifyCode">
      <Input v-model="form.verifyCode" @on-change="setForm" @on-search="sendCode" search
             :enter-button="codeBtnText"
             placeholder="输入验证码"></Input>
    </FormItem>
    <FormItem label="密码" prop="password">
      <Input type="password" @on-change="setForm" v-model="form.password"></Input>
    </FormItem>
    <FormItem label="确认密码" prop="confirmPassword">
      <Input type="password" @on-change="setForm" v-model="form.confirmPassword"></Input>
    </FormItem>
    <FormItem v-if="!hideBtns">
      <Button @click="save" type="primary" class="margin-right" :loading="loading">确认重置</Button>
      <Button @click="back" type="success">返回</Button>
    </FormItem>
  </Form>
</template>

<script>
  import {Message} from 'iview'
  import config from '@/config/index'
  import API from '@/api/forget-password'
  import {mapActions} from 'vuex'

  export default {
    name: 'ForgetPassword',
    components: {},
    props: [
      'hideBtns',
      'mobile'
    ],
    data() {
      const confirmPwdCheck = (rule, value, callback) => {
        if (this.form.password != value) {
          callback(new Error('确认密码与密码不相同'));
        } else {
          callback();
        }
      }
      return {
        loading: false,
        codeLoading: false,
        codeBtnText: '获取验证码',
        form: {
          id: null,
          verifyCode: '',
          username: '',
          password: '',
          confirmPassword: '',
        },
        rules: {
          username: [
            {required: true, message: '手机号不能为空', trigger: 'change'},
            {
              type: 'string',
              pattern: /^\d{11}$/,
              message: '手机号必须是11位数字',
              trigger: 'change'
            },
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'change'},
            {
              type: 'string',
              pattern: /^(?=.*[0-9].*)(?=.*[A-Za-z].*).{8,}$/,
              message: '密码必须数字+字母（区分大小写）并且不少于8位',
              trigger: 'change'
            }
          ],
          confirmPassword: [
            {required: true, message: '确认密码不能为空', trigger: 'change'},
            {required: true, validator: confirmPwdCheck, trigger: 'change'}
          ],
          verifyCode: [
            {required: true, message: '验证码不能为空', trigger: 'change'}
          ]
        }
      }
    },
    computed: {
      mobileNum() {
        this.form.username = this.mobile
        return this.mobile
      }
    },
    methods: {
      setForm() {
        this.$store.commit('setForgetPasswordForm', {
          forgetPasswordForm: this.$refs.form,
          forgetPasswordObj: this.form
        })
      },
      sendCode() {
        if (!this.form.username) {
          this.$refs.form.validateField('username')
          return
        }
        if (this.codeLoading) {
          return
        }
        this.disableVerifyCodeBtn(30)
        API.sendCode(this.form.username).then(res => {
          Message.success("发送成功")
        }).catch(ex => {
        })
      },
      disableVerifyCodeBtn(second) {
        if (second > 0) {
          this.codeLoading = true
          this.codeBtnText = second + '秒后重试'
          let self = this
          setTimeout(function () {
            self.disableVerifyCodeBtn(second - 1)
          }, 1000)
          return
        }
        this.codeLoading = false
        this.codeBtnText = '获取验证码'
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.save(this.form).then(res => {
              this.loading = false
              Message.success("重置成功")
              this.back()
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
      back() {
        this.$router.push({
          name: 'Login'
        })
      }
    },
  }
</script>

