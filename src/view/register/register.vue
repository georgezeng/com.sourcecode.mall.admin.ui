<style lang="less">
  .register {
    width: 100%;
    height: 100%;
    background-image: url('../../assets/images/login-bg.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
    &-con {
      position: relative;
      top: 200px;
      margin: auto;
      width: 500px;
    }
  }
</style>

<template>
  <div class="register">
    <Card class="register-con">
      <p slot="title">
        注册用户
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="手机号" prop="username">
          <Input v-model="form.username" placeholder="输入手机号"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="form.email" placeholder="输入邮箱"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="form.password"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="confirmPassword">
          <Input type="password" v-model="form.confirmPassword"></Input>
        </FormItem>
        <FormItem label="验证码" prop="verifyCode">
          <Input v-model="form.verifyCode" @on-search="sendCode" search enter-button="发送验证码"
                 placeholder="输入验证码"></Input>
        </FormItem>
        <FormItem>
          <Button @click="save" type="primary" class="margin-right" :loading="loading">注册</Button>
          <Button @click="back" type="success">返回</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import {Message} from 'iview'
  import config from '@/config/index'
  import API from '@/api/register'
  import {mapActions} from 'vuex'

  let baseUrl = null
  let bucketDomain = null
  switch (process.env.NODE_ENV) {
    case 'development': {
      baseUrl = config.baseUrl.dev
      bucketDomain = config.publicBucketDomain.dev
    }
      break;
    default: {
      baseUrl = config.baseUrl.pro
      bucketDomain = config.publicBucketDomain.pro
    }
  }

  export default {
    name: 'Register',
    components: {},
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
        form: {
          id: null,
          username: '',
          email: '',
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
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'change'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'change'},
            {max: 50, message: '邮箱不能多于50位', trigger: 'change'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'change'},
            {
              type: 'string',
              pattern: /^(?=.*[0-9].*)(?=.*[A-Za-z].*).{8,}$/,
              message: '密码必须数字+字母（区分大小写）并且不少于8位',
              trigger: 'change'
            },
            {max: 20, message: '密码不能多于20位', trigger: 'change'}
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
    computed: {},
    methods: {
      ...mapActions([
        'handleLogin',
        'getUserInfo'
      ]),
      sendCode() {
        if (!this.form.username) {
          let valid = this.$refs.form.validateField('username')
          if (!valid) {
            return
          }
        }
        API.sendCode(this.form.username).then(res => {
          Message.success("发送成功")
        })
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            API.save(this.form).then(res => {
              Message.success("注册成功")
              this.handleLogin({
                userName: this.form.username,
                password: this.form.password
              }).then(res => {
                this.getUserInfo().then(res => {
                  this.$router.push({
                    name: this.$config.homeName
                  })
                })
              })
            })
          }
        })
      },
      back() {
        this.$router.push({
          name: 'login'
        })
      }
    }
  }
</script>

