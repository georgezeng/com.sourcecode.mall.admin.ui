<template>
  <div align="center">
    <Card>
      <img style="margin-top: 100px; margin-bottom: 100px;" :src="Loading" />
    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-verification'
  import {Message} from 'iview'
  import config from '@/config/index'
  import Loading from '@/assets/images/loading.gif'

  export default {
    name: 'MerchantVerificationIndex',
    components: {},
    data() {
      return {
        Loading,
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
              case 'Checking': {
                this.goSuccess()
                return
              }
              case 'Passed': {
                this.goEdit()
                return
              }
            }
          } else {
            this.goVerify()
            return
          }
        })
      },
      goSuccess() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantVerificationCommitSuccess'
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
      goEdit() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantVerificationEdit'
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
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'MerchantVerificationCommitSuccess'
        && item.name !== 'MerchantVerificationEdit'
        && item.name !== 'MerchantVerificationVerify'
        && item.name !== 'MerchantVerificationUnPassed'
      )
      this.$store.commit('setTagNavList', res)
      this.load()
    }
  }
</script>
