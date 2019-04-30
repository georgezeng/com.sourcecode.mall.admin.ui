<style>
  .unpass {
    background-image: url('../../../../assets/images/img_stamp_unpass.png');
    width: 100px;
    height: 100px;
    position: absolute;
    z-index: 100;
    background-repeat: no-repeat;
    top: 20px;
    left: 300px;
  }
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        店铺申请
      <div class="unpass" v-if="this.form.status === 'UnPassed'"></div>
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">提交申请</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem label="审核失败" v-if="form.reason" prop="reason">
          <Alert type="error">{{form.reason}}</Alert>
        </FormItem>
        <FormItem label="店铺名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="店铺二级域名" prop="domain">
          <Input v-model="form.domain"></Input>
        </FormItem>
        <FormItem label="logo" prop="logo">
          <Upload
            :uploadUrl="uploadLogoUrl"
            :previewUri="form.logo"
            btnText="上传Logo"
            :imgPrefix="imgPrefix"
            @setPreviewUrl="setLogoPreviewUrl"
          />
        </FormItem>
        <FormItem label="店铺类型">
          <Checkbox :value="true" disabled>H5版</Checkbox>
          <Checkbox v-model="form.androidType">Android版</Checkbox>
          <Checkbox v-model="form.iosType">IOS版</Checkbox>
        </FormItem>
        <FormItem v-if="form.androidType || form.iosType" prop="types" label="店铺图标">
          <MultiUpload v-if="form.androidType"
                       :uploadUrl="uploadAndroidSmallIconUrl"
                       :previewUri="form.androidSmallIcon"
                       btnText="上传Android (192*192) 图标"
                       :imgPrefix="imgPrefix"
                       width="180"
                       height="180"
                       @setPreviewUrl="setAndroidSmallIconPreviewUrl"
          />
          <MultiUpload v-if="form.androidType"
                       :uploadUrl="uploadAndroidBigIconUrl"
                       :previewUri="form.androidBigIcon"
                       btnText="上传Android (512*512) 图标"
                       :imgPrefix="imgPrefix"
                       width="180"
                       height="180"
                       @setPreviewUrl="setAndroidBigIconPreviewUrl"
          />
          <MultiUpload v-if="form.iosType"
                       :uploadUrl="uploadIosSmallIconUrl"
                       :previewUri="form.iosSmallIcon"
                       btnText="上传IOS (192*192) 图标"
                       :imgPrefix="imgPrefix"
                       width="180"
                       height="180"
                       @setPreviewUrl="setIosSmallIconPreviewUrl"
          />
          <MultiUpload v-if="form.iosType"
                       :uploadUrl="uploadIosBigIconUrl"
                       :previewUri="form.iosBigIcon"
                       btnText="上传IOS (512*512) 图标"
                       :imgPrefix="imgPrefix"
                       width="180"
                       height="180"
                       @setPreviewUrl="setIosBigIconPreviewUrl"
          />
          <div class="clearfix"></div>
        </FormItem>
        <FormItem label="App引导页" prop="instructions">
          <MultiUpload v-for="item in instructions"
                       :index="item.index"
                       :uploadUrl="item.uploadUrl()"
                       :previewUri="form.instructions[item.index]"
                       :btnText="('上传App引导图' + (item.index + 1))"
                       :imgPrefix="imgPrefix"
                       width="180"
                       height="180"
                       :removeable="true"
                       @remove="removeInstruction"
                       @setPreviewUrl="setInstructionPreviewUrl"
          />

          <div class="clearfix"></div>
        </FormItem>
        <FormItem label="登录背景图" prop="loginBgImg">
          <Upload
            :uploadUrl="uploadLoginBgUrl"
            :previewUri="form.loginBgImg"
            btnText="上传登录背景图"
            :imgPrefix="imgPrefix"
            @setPreviewUrl="setLoginBgPreviewUrl"
          />
        </FormItem>
        <FormItem label="店铺说明" prop="description">
          <Input v-model="form.description" type="textarea" :autosize="{minRows: 2, maxRows: 5}"></Input>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-shop-application'
  import {Message} from 'iview'
  import config from '@/config/index'
  import MultiUpload from '@/components/upload/img-multi-upload'
  import Upload from '@/components/upload/img-single-upload'

  export default {
    name: 'MerchantShopApplicationApply',
    components: {
      Upload,
      MultiUpload
    },
    data() {
      const instructionCheck = (rule, value, callback) => {
        if (this.form.instructions.length == 0) {
          callback(new Error('至少需要一张App引导页'));
        } else {
          callback();
        }
      }
      const typesCheck = (rule, value, callback) => {
        if (this.form.androidType || this.form.iosType) {
          if (this.form.androidType) {
            if (this.form.androidBigIcon == null || this.form.androidSmallIcon == null) {
              callback(new Error('请上传店铺图标'));
              return
            }
          }
          if (this.form.iosType) {
            if (this.form.iosBigIcon == null || this.form.iosSmallIcon == null) {
              callback(new Error('请上传店铺图标'));
              return
            }
          }
        }
        callback();
      }
      return {
        imgPrefix: config.baseUrl + '/merchant/shop/application/img/preview?filePath=',
        loading: false,
        stay: false,
        instructions: [],
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
          description: null,
          reason: null,
          status: null
        },
        rules: {
          name: [
            {required: true, message: '店铺名称不能为空', trigger: 'change'},
            {max: 50, min: 2, message: '店铺名称长度必须在2-50之间', trigger: 'change'}
          ],
          domain: [
            {required: true, message: '店铺域名不能为空', trigger: 'change'},
            {max: 50, min: 2, message: '店铺域名必须在2-50之间', trigger: 'change'},
            {type: 'string', pattern: /^[a-zA-Z0-9]+$/, message: '域名必须是字母或数字', trigger: 'change'}
          ],
          logo: [
            {required: true, message: 'logo不能为空', trigger: 'change'},
          ],
          instructions: [
            {required: true, validator: instructionCheck, trigger: 'change'},
          ],
          loginBgImg: [
            {required: true, message: '登录背景图不能为空', trigger: 'change'},
          ],
          types: [
            {required: true, validator: typesCheck, trigger: 'change'},
          ],
          description: [
            {required: true, message: '店铺说明不能为空', trigger: 'change'},
          ],
        }
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
            this.form.status = res.status.name
            for (let i in this.form.instructions) {
              this.addInstruction(i)
            }
          }
        }).catch(e => {
          this.loading = false
        })
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.save(this.form).then(res => {
              this.loading = false
              Message.success('提交成功')
              this.goSuccess()
            }).catch(ex => {
              this.loading = false
            })
          }
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
      setLogoPreviewUrl(url, index) {
        this.form.logo = url
      },
      setLoginBgPreviewUrl(url, index) {
        this.form.loginBgImg = url
      },
      setAndroidSmallIconPreviewUrl(url, index) {
        this.form.androidSmallIcon = url
      },
      setAndroidBigIconPreviewUrl(url, index) {
        this.form.androidBigIcon = url
      },
      setIosSmallIconPreviewUrl(url, index) {
        this.form.iosSmallIcon = url
      },
      setIosBigIconPreviewUrl(url, index) {
        this.form.iosBigIcon = url
      },
      setInstructionPreviewUrl(url, index) {
        this.form.instructions[index] = url
        this.addInstruction(index + 1)
      },
      addInstruction(index) {
        if (this.instructions[index]) {
          let nextIndex = this.instructions.length
          this.instructions.push({
            index: nextIndex,
          })
          this.instructions.splice(nextIndex, 1)
          return
        }
        if (index >= 5) {
          let nextIndex = this.instructions.length
          this.instructions.push({
            index: nextIndex,
          })
          this.instructions.splice(nextIndex, 1)
          return
        }
        this.instructions.push({
          index,
        })
        this.instructions[index].uploadUrl = () => {
          return config.baseUrl + '/merchant/shop/application/upload/params/instruction/false?extendDir=' + index
        }
      },
      removeInstruction(index) {
        if (this.instructions.length > 1) {
          this.form.instructions.splice(index, 1)
          this.instructions.splice(index, 1)
          this.instructions[index].index = index
          this.instructions[index].uploadUrl = () => {
            return config.baseUrl + '/merchant/shop/application/upload/params/instruction/false?extendDir=' + index
          }
        } else {
          this.form.instructions[0] = null
          this.instructions.splice(0, 1)
          this.addInstruction(0)
        }
      }
    },
    computed: {
      uploadLoginBgUrl() {
        return config.baseUrl + '/merchant/shop/application/upload/params/loginBg/false'
      },
      uploadLogoUrl() {
        return config.baseUrl + '/merchant/shop/application/upload/params/logo/false'
      },
      uploadAndroidBigIconUrl() {
        return config.baseUrl + '/merchant/shop/application/upload/params/android/false?extendDir=/bigIcon'
      },
      uploadAndroidSmallIconUrl() {
        return config.baseUrl + '/merchant/shop/application/upload/params/android/false?extendDir=/smallIcon'
      },
      uploadIosBigIconUrl() {
        return config.baseUrl + '/merchant/shop/application/upload/params/ios/false?extendDir=/bigIcon'
      },
      uploadIosSmallIconUrl() {
        return config.baseUrl + '/merchant/shop/application/upload/params/ios/false?extendDir=/smallIcon'
      },
      uploadInstructionUrl() {
        return config.baseUrl + '/merchant/shop/application/upload/params/instruction'
      },
      uploadLoginBgUrl() {
        return config.baseUrl + '/merchant/shop/application/upload/params/loginBg'
      },
    },
    mounted() {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'MerchantShopApplicationCommitSuccess'
        && item.name !== 'MerchantShopApplicationUnPay'
        && item.name !== 'MerchantShopApplicationEdit'
        && item.name !== 'MerchantShopApplicationDetail'
        && item.name !== 'MerchantShopApplicationPassed'
        && item.name !== 'MerchantShopApplicationUnPassed')
      this.$store.commit('setTagNavList', res)
      this.stay = this.$router.currentRoute.params.stay ? true : false
      this.addInstruction(0)
      this.load()
    },
  }
</script>
