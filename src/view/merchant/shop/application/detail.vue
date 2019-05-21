<template>
  <div>
    <Card>
      <p slot="title">
        店铺详情
      </p>
      <Form ref="form" :model="form" :label-width="100">
        <FormItem label="店铺名称" prop="name">
          <Input v-model="form.name" readonly></Input>
        </FormItem>
        <FormItem label="店铺域名" prop="username">
          <Input v-model="form.domain" readonly></Input>
        </FormItem>
        <FormItem label="logo" prop="logo">
          <img :src="logoUrl"/>
        </FormItem>
        <FormItem label="店铺类型">
          <Checkbox :value="true" disabled>H5版</Checkbox>
          <Checkbox v-model="form.androidType" disabled>Android版</Checkbox>
          <Checkbox v-model="form.iosType" disabled>IOS版</Checkbox>
        </FormItem>
        <FormItem v-if="form.androidType || form.iosType" prop="types" label="App图标">
          <img :src="androidSmallIconUrl" width="180" height="180" class="float-left"
               style="margin-right: 20px;" v-if="form.androidType"/>
          <img :src="androidBigIconUrl" width="180" height="180" class="float-left" style="margin-right: 20px;"
               v-if="form.androidType"/>
          <img :src="iosSmallIconUrl" width="180" height="180" class="float-left" style="margin-right: 20px;"
               v-if="form.iosType"/>
          <img :src="iosBigIconUrl" width="180" height="180" class="float-left" style="margin-right: 20px;"
               v-if="form.iosType"/>
          <div class="clearfix"></div>
        </FormItem>
        <FormItem v-if="form.androidType || form.iosType" label="App引导页" prop="instructions">
          <Img v-for="item in form.instructions" :url="item" :imgPrefix="imgPrefix"/>
          <div class="clearfix"></div>
        </FormItem>
        <FormItem label="登录背景图" prop="loginBgImg">
          <img :src="loginBgUrl"/>
        </FormItem>
        <FormItem label="店铺说明" prop="description">
          <Input v-model="form.description" type="textarea" readonly :autosize="{minRows: 2, maxRows: 5}"></Input>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-shop-application'
  import {Message} from 'iview'
  import config from '@/config/index'
  import uploadPlaceholder from '@/assets/images/upload-placeholder.png'
  import Img from './img'

  export default {
    name: 'MerchantShopApplicationDetail',
    components: {
      Img
    },
    data() {
      return {
        stay: false,
        imgPrefix: config.baseUrl + '/merchant/shop/application/file/load?filePath=',
        loading: false,
        form: {
          id: null,
          name: '',
          domain: '',
          androidType: false,
          iosType: false,
          logo: null,
          androidBigIcon: null,
          androidSmallIcon: null,
          iosBigIcon: null,
          iosSmallIcon: null,
          instructions: [],
          loginBgImg: null,
          types: null,
          description: null
        },
      }
    },
    methods: {
      load() {
        this.loading = true
        API.load().then(res => {
          this.loading = false
          if (res && res.id) {
            if (!this.stay) {
              switch (res.status.name) {
                case 'UnPay': {
                  this.goUnPay()
                  return
                }
                case 'UnPassed': {
                  this.goUnPassed(res.reason)
                  return
                }
                  break;
                case 'Checking': {
                  this.goSuccess()
                  return
                }
                case 'Passed': {
                  this.goPassed()
                  return
                }
              }
            }
            this.form = res
          } else {
            if(res && res.noPermit) {
              this.goNoPermit()
              return
            }
            this.goApply()
          }
        }).catch(e => {
          this.loading = false
        })
      },
      goNoPermit() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationNoPermit'
        })
      },
      goApply() {
        window.clearTimeout(this.clearId)
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationApply'
        })
      },
      goUnPay() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationUnPay'
        })
      },
      goSuccess() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationCommitSuccess'
        })
      },
      goPassed() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationPassed'
        })
      },
      goUnPassed(reason) {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantShopApplicationUnPassed',
          params: {
            reason
          }
        })
      },
    },
    computed: {
      loginBgUrl() {
        return this.form.loginBgImg ? this.imgPrefix + this.form.loginBgImg : uploadPlaceholder
      },
      logoUrl() {
        return this.form.logo ? this.imgPrefix + this.form.logo : uploadPlaceholder
      },
      androidSmallIconUrl() {
        return this.form.androidSmallIcon ? this.imgPrefix + this.form.androidSmallIcon : uploadPlaceholder
      },
      androidBigIconUrl() {
        return this.form.androidBigIcon ? this.imgPrefix + this.form.androidBigIcon : uploadPlaceholder
      },
      iosSmallIconUrl() {
        return this.form.iosSmallIcon ? this.imgPrefix + this.form.iosSmallIcon : uploadPlaceholder
      },
      iosBigIconUrl() {
        return this.form.iosBigIcon ? this.imgPrefix + this.form.iosBigIcon : uploadPlaceholder
      },
    },
    mounted() {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'MerchantShopApplicationCommitSuccess'
        && item.name !== 'MerchantShopApplicationUnPay'
        && item.name !== 'MerchantShopApplicationEdit'
        && item.name !== 'MerchantShopApplicationApply'
        && item.name !== 'MerchantShopApplicationPassed'
        && item.name !== 'MerchantShopApplicationUnPassed'
        && item.name !== 'MerchantShopApplicationNoPermit'
      )
      this.$store.commit('setTagNavList', res)
      this.stay = this.$router.currentRoute.params.stay ? true : false
      this.load()
    },
  }
</script>
