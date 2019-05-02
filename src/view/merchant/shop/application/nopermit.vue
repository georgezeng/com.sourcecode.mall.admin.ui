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
        店铺申请
      </p>
      <div align="center">
        <div>
          <img :src="stepWarning" />
        </div>

        <div style="position: relative; top: -20px; color: red;">
          必须先通过实名认证才能进行店铺申请
        </div>
      </div>

    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-shop-application'
  import stepWarning from '@/assets/images/bg_state_warning@2x.png'

  export default {
    name: 'MerchantShopApplicationNoPermit',
    components: {},
    data() {
      return {
        stepWarning,
        clearId: null
      }
    },
    methods: {
      load() {
        API.load().then(res => {
          if(!res || !res.noPermit) {
            this.goApply()
            return
          }
          this.clearId = setTimeout(this.load, 1000)
        })
      },
      goApply() {
        clearTimeout(this.clearId)
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationApply',
          params: {
            stay: true
          }
        })
      }
    },
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'MerchantShopApplicationDetail'
        && item.name !== 'MerchantShopApplicationUnPay'
        && item.name !== 'MerchantShopApplicationEdit'
        && item.name !== 'MerchantShopApplicationUnPassed'
        && item.name !== 'MerchantShopApplicationApply'
        && item.name !== 'MerchantShopApplicationCommitSuccess'
        && item.name !== 'MerchantShopApplicationPassed'
      )
      this.$store.commit('setTagNavList', res)
      this.load()
    }
  }
</script>
