<style>
  .num {
    background-image: url("../../../assets/images/numbers-circle.png");
    background-position: 85px 123px;
    background-size: 140px 130px;
    display: inline-block;
    height: 30px;
    width: 30px;
  }

  .tip {
    color: #28A69A;
    position: absolute;
  }

  .grayTip {
    color: gray;
    position: absolute;
  }
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        实名认证 - 提交成功
      </p>
      <div align="center">
        <div>
          <img :src="stepSuccess" />
        </div>

        <div style="position: relative; top: -40px;">
          提交成功, <span style="color: #28A69A;">24小时内</span>审核完成
        </div>

        <div style="position: relative; width: 350px;">
          <img :src="stepFinished" style="margin-right: 5px;"/>
          <div class="float-left tip" style="top: 40px; left: 10px;">提交成功</div>
          <img :src="rightArrow" width="100" height="30" style="margin-right: 5px;"/>
          <div class="float-left tip" style="top: 40px; left:142px;">系统审核中</div>
          <div class="num" style="margin-right: 5px;"></div>
          <img :src="rightArrow" width="100" height="30" style="margin-right: 5px;"/>
          <img :src="stepThree" width="30" height="30"/>
          <div class="float-left grayTip" style="top: 40px; left: 290px;">审核结果</div>
          <div style="height: 100px;"></div>
        </div>
      </div>

    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-verification'
  import {Message} from 'iview'
  import config from '@/config/index'
  import stepSuccess from '@/assets/images/bg_state_success@2x.png'
  import stepFinished from '@/assets/images/bg_step_done.png'
  import rightArrow from '@/assets/images/right-arrow.png'
  import stepThree from '@/assets/images/num3-circle.png'

  export default {
    name: 'MerchantVerificationCommitSuccess',
    components: {},
    data() {
      return {
        stepSuccess,
        stepFinished,
        rightArrow,
        stepThree
      }
    },
    methods: {
      load() {
        API.load().then(res => {
          if (res && res.id) {
            switch (res.status.name) {
              case 'UnPassed': {
                this.goUnPassed(res.reason)
                return
              }
              case 'Passed': {
                this.goEdit()
                return
              }
            }
            setTimeout(this.load, 1000)
          } else {
            this.goVerify()
          }
        })
      },
      goEdit() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantVerificationEdit'
        })
      },
      goUnPassed(reason) {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantVerificationUnPassed',
          params: {
            reason
          }
        })
      },
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
    mounted() {
      let res = this.$store.state.app.tagNavList.filter(item => item.name !== 'MerchantVerificationUnPassed'
        && item.name !== 'MerchantVerificationEdit' && item.name !== 'MerchantVerificationVerify')
      this.$store.commit('setTagNavList', res)
      this.load()
    }
  }
</script>
