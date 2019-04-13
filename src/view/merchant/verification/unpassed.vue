<style>
  .tip {
    color: #28A69A;
    position: absolute;
  }
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        商家认证 - 审核未通过
      </p>
      <div align="center">
        <div>
          <img :src="stepWarning" />
        </div>

        <div style="position: relative; top: -40px; font-size: 16px;">
          审核未通过
        </div>
        <div style="position: relative; top: -40px; color: red;">
          {{reason}}
        </div>

        <div style="position: relative; width: 350px;">
          <img :src="stepFinished" style="margin-right: 5px;"/>
          <div class="float-left tip" style="top: 40px; left: 10px;">提交成功</div>
          <img :src="rightArrow" width="100" height="30" style="margin-right: 5px;"/>
          <div class="float-left tip" style="top: 40px; left:142px;">系统审核中</div>
          <img :src="stepFinished" style="margin-right: 5px;"/>
          <img :src="rightArrow" width="100" height="30" style="margin-right: 5px;"/>
          <img :src="stepFinished" />
          <div class="float-left tip" style="top: 40px; left: 290px;">审核结果</div>
        </div>

        <Button style="width: 300px;margin-top: 50px;" long type="warning" @click="goVerify">重新编辑</Button>
      </div>

    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-verification'
  import {Message} from 'iview'
  import config from '@/config/index'
  import stepWarning from '@/assets/images/bg_state_warning@2x.png'
  import stepFinished from '@/assets/images/bg_step_done.png'
  import rightArrow from '@/assets/images/right-arrow.png'

  export default {
    name: 'MerchantVerificationUnPassed',
    components: {},
    data() {
      return {
        stepWarning,
        stepFinished,
        rightArrow,
        reason: ''
      }
    },
    methods: {
      goVerify() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantVerificationVerify',
          params: {
            stay: true
          }
        })
      }
    },
    mounted: function () {
      this.reason = this.$router.currentRoute.params.reason
    }
  }
</script>
