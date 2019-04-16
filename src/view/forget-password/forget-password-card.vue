<template>
  <div class="login-bg">
    <Card class="login-bg-con">
      <p slot="title">
        忘记密码
      </p>
      <ForgetPassword :hideBtns="false" />
    </Card>
  </div>
</template>

<script>
  import ForgetPassword from '@/view/forget-password/forget-password'

  export default {
    name: 'ForgetPasswordCard',
    components: {
      ForgetPassword
    }
  }
</script>

