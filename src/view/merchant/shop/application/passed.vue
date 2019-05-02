<template>
  <div>
    <Card>
      <p slot="title">
        店铺申请 - 审核通过
      </p>
      <div slot="extra">
        <Button @click="goEdit" type="primary" class="margin-right">编辑店铺</Button>
      </div>
      <div align="center">
        <div style="margin-top: 20px; margin-bottom: 10px;">
          <img :src="stepFinished"/>
        </div>
        <div style="margin-bottom: 20px;">
          恭喜你，你的店铺审核通过
          <p v-if="!form.deployed">
            应用部署中...
          </p>
        </div>
        <Form style="width: 250px; text-align: left;" :label-width="100" :model="form" v-if="form.deployed">
          <FormItem label="店铺主页" prop="domain">
            https://{{form.domain}}.sourcecode.com
          </FormItem>
          <FormItem label="Android版" prop="androidLink" v-if="form.androidUrl">
            <Button icon="logo-android" type="primary" :to="androidLink" target="_blank">安卓下载</Button>
          </FormItem>
          <FormItem label="IOS版" prop="iosLink" v-if="form.iosUrl">
            <Button icon="logo-apple" type="primary" :to="iosLink" target="_blank">苹果下载</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-shop-application'
  import stepFinished from '@/assets/images/bg_step_done@2x.png'
  import config from '@/config/index'

  export default {
    name: 'MerchantShopApplicationCommitSuccess',
    components: {},
    data() {
      return {
        clearId: null,
        stepFinished,
        form: {
          domain: '',
          iosUrl: '',
          androidUrl: '',
          deployed: false
        }
      }
    },
    methods: {
      load() {
        API.load().then(res => {
          if (res && res.id) {
            switch (res.status.name) {
              case 'UnPay': {
                this.goUnPay()
                return
              }
              case 'UnPassed': {
                this.goUnPassed(res.reason)
                return
              }
              case 'Checking': {
                this.goSuccess()
                return
              }
            }
            if (!res.deployed) {
              this.clearId = setTimeout(this.load, 1000)
              return
            }
            this.form = res
          } else {
            if(res && res.noPermit) {
              this.goNoPermit()
              return
            }
            this.goApply()
          }
        })
      },
      goNoPermit() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationNoPermit'
        })
      },
      goUnPay() {
        window.clearTimeout(this.clearId)
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationUnPay'
        })
      },
      goSuccess() {
        window.clearTimeout(this.clearId)
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationCommitSuccess'
        })
      },
      goUnPassed(reason) {
        window.clearTimeout(this.clearId)
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationUnPassed',
          params: {
            reason
          }
        })
      },
      goEdit() {
        window.clearTimeout(this.clearId)
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationEdit',
          params: {
            stay: true
          }
        })
      },
      goApply() {
        window.clearTimeout(this.clearId)
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationApply'
        })
      }
    },
    computed: {
      androidLink() {
        return config.publicBucketDomain + this.form.androidUrl
      },
      iosLink() {
        return config.publicBucketDomain + this.form.iosUrl
      }
    },
    mounted() {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'MerchantShopApplicationDetail'
        && item.name !== 'MerchantShopApplicationUnPay'
        && item.name !== 'MerchantShopApplicationEdit'
        && item.name !== 'MerchantShopApplicationApply'
        && item.name !== 'MerchantShopApplicationCommitSuccess'
        && item.name !== 'MerchantShopApplicationUnPassed'
        && item.name !== 'MerchantShopApplicationNoPermit'
      )
      this.$store.commit('setTagNavList', res)
      this.load()
    }
  }
</script>
