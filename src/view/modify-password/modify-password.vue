<template>
  <div>
    <Modal :value="show" title="修改密码" @on-cancel="triggerModal">
      <Form ref="form" :model="form" :rules="rules" :label-width="80" v-if="!showForget">
        <FormItem label="旧密码" prop="oldPassword">
          <Input type="password" v-model="form.oldPassword"></Input>
          <a href="javascript:;" @click="showForget=true">忘记密码</a>
        </FormItem>
        <FormItem label="新密码" prop="password">
          <Input type="password" v-model="form.password"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="confirmPassword">
          <Input type="password" v-model="form.confirmPassword"></Input>
        </FormItem>
      </Form>
      <ForgetPassword :mobile="mobile" :hideBtns="true" v-else/>
      <div slot="footer" v-if="!showForget">
        <Button type="warning" @click="triggerModal">取消</Button>
        <Button type="primary" :loading="loading" @click="updatePassword">确定</Button>
      </div>
      <div slot="footer" v-else>
        <Button type="success" @click="back">返回</Button>
        <Button type="primary" :loading="loading" @click="resetPassword">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import API from '@/api/users'
  import ForgetPasswordAPI from '@/api/forget-password'
  import {Message} from 'iview'
  import ForgetPassword from '@/view/forget-password/forget-password'

  export default {
    name: 'ModifyPassword',
    props: [
      'show',
      'mobile'
    ],
    components: {
      ForgetPassword
    },
    data() {
      const confirmPwdCheck = (rule, value, callback) => {
        if (this.form.password !== '' && this.form.password !== value) {
          callback(new Error('确认密码与密码不相同'));
        } else {
          callback();
        }
      }
      return {
        showForget: false,
        loading: false,
        form: {
          oldPassword: '',
          password: '',
          confirmPassword: ''
        },
        rules: {
          oldPassword: [
            {required: true, message: '旧密码不能为空', trigger: 'change'},
          ],
          password: [
            {required: true, message: '新密码不能为空', trigger: 'change'},
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
          ]
        }
      }
    },
    methods: {
      back() {
        this.showForget = false
      },
      resetPassword() {
        this.$store.state.user.forgetPasswordForm.validate().then(valid => {
          if (valid) {
            this.loading = true
            ForgetPasswordAPI.save(this.$store.state.user.forgetPasswordObj).then(res => {
              this.loading = false
              Message.success("重置成功")
              this.triggerModal()
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
      updatePassword() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.updatePassword(this.form).then(res => {
              this.triggerModal()
              Message.success('保存成功')
              this.loading = false
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      triggerModal() {
        if (this.$store.state.user.forgetPasswordForm) {
          this.$store.state.user.forgetPasswordForm.resetFields()
        }
        this.$refs.form.resetFields()
        this.showForget = false
        this.$emit('trigger', !this.show);
      }
    },
  }
</script>
