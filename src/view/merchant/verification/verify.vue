<style>
  .unpass {
    background-image: url('../../../assets/images/img_stamp_unpass.png');
    width: 100px;
    height: 100px;
    position: absolute;
    z-index: 100;
    background-repeat: no-repeat;
    top: 100px;
    left: 300px;
  }
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        实名认证 - 提交认证
      </p>
      <p slot="title" style="font-weight: normal">
        为了让您获得更精准的服务和商业机会，我们建议您立即完善以下信息
        <div class="unpass" v-if="this.form.status === 'UnPassed'"></div>
      </p>
      <div slot="extra">
        <Button @click="verify" type="primary" class="margin-right" :loading="loading">提交认证</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="认证失败" v-if="form.reason" prop="reason">
          <Alert type="error">{{form.reason}}</Alert>
        </FormItem>
        <FormItem label="商家名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="证件类型" prop="type">
          <Select v-model="form.type">
            <Option v-for="type in types" :value="type.value" :key="type.value">{{ type.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="证件号码" prop="number">
          <Input v-model="form.number"></Input>
        </FormItem>
        <FormItem label="证件照" prop="photo">
          <Upload
            :uploadUrl="uploadUrl"
            :previewUri="form.photo"
            btnText="上传证件"
            :imgPrefix="imgPrefix"
            @setPreviewUrl="setPreviewUrl"
          />
        </FormItem>
        <FormItem label="联系人" prop="contact">
          <Input v-model="form.contact"></Input>
        </FormItem>
        <FormItem label="联系电话" prop="phone">
          <Input v-model="form.phone"></Input>
        </FormItem>
        <FormItem label="联系地址" prop="address">
          <Input v-model="form.address"></Input>
        </FormItem>
        <FormItem label="商家介绍" prop="description">
          <Input v-model="form.description" type="textarea" :autosize="{minRows: 2, maxRows: 5}"></Input>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-verification'
  import {Message} from 'iview'
  import config from '@/config/index'
  import Upload from '@/components/upload/img-single-upload'

  export default {
    name: 'MerchantVerificationVerify',
    components: {
      Upload
    },
    data() {
      return {
        stay: false,
        loading: false,
        types: [
          {
            value: 'SaleLicense',
            text: '营业执照'
          },
          {
            value: 'Identity',
            text: '身份证'
          }
        ],
        imgPrefix: config.baseUrl + '/merchant/verification/file/load?filePath=',
        form: {
          id: null,
          name: '',
          type: null,
          number: '',
          photo: null,
          contact: '',
          phone: '',
          address: '',
          description: '',
          reason: '',
          status: 'Checking'
        },
        rules: {
          name: [
            {required: true, message: '商家名称不能为空', trigger: 'change'},
            {max: 50, message: '商家名称不能多于50位', trigger: 'change'}
          ],
          type: [
            {required: true, message: '证件类型不能为空', trigger: 'change'},
          ],
          photo: [
            {required: true, message: '证件照不能为空', trigger: 'change'},
          ],
          number: [
            {required: true, message: '证件号码不能为空', trigger: 'change'},
            {type: 'string', pattern: /^[a-zA-Z0-9]+$/, message: '证件号码必须是字母或数字', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      load() {
        this.loading = true
        API.load().then(res => {
          this.loading = false
          if (res.id) {
            switch (res.status.name) {
              case 'UnPassed': {
                if (!this.stay) {
                  this.goUnPassed(res.reason)
                  return
                }
              }
                break;
              case 'Checking': {
                this.goSuccess()
                return
              }
              case 'Passed': {
                this.goEdit()
                return
              }
            }
            this.form = res
            this.form.type = res.type.name
            this.form.status = res.status.name
          }
        }).catch(e => {
          this.loading = false
        })
      },
      setPreviewUrl(url, index) {
        this.form.photo = url
      },
      verify() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.verify(this.form).then(res => {
              this.loading = false
              Message.success('提交审核成功')
              this.goSuccess()
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
      goSuccess() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantVerificationCommitSuccess'
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
      }
    },
    computed: {
      uploadUrl() {
        return config.baseUrl + '/merchant/verification/file/upload'
      },
    },
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'MerchantVerificationCommitSuccess'
        && item.name !== 'MerchantVerificationEdit'
        && item.name !== 'MerchantVerificationUnPassed'
      )
      this.$store.commit('setTagNavList', res)
      this.stay = this.$router.currentRoute.params.stay ? true : false
      this.load()
    }
  }
</script>
