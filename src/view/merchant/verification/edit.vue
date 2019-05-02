<style>
  .pass {
    background-image: url('../../../assets/images/img_stamp_pass.png');
    width: 100px;
    height: 100px;
    position: absolute;
    z-index: 100;
    background-repeat: no-repeat;
    top: 10px;
    left: 300px;
  }
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        实名认证 - 编辑
      <div class="pass"></div>
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
      </div>
      <Form ref="form" :model="form" :label-width="80">
        <FormItem label="商家名称" prop="name">
          <Input v-model="form.name" readonly></Input>
        </FormItem>
        <FormItem label="证件类型" prop="type">
          <Input v-model="form.typeText" readonly></Input>
        </FormItem>
        <FormItem label="证件号码" prop="number">
          <Input v-model="form.number" readonly></Input>
        </FormItem>
        <FormItem label="证件照" prop="photo">
          <img :src="imgPreviewUrl"/>
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
  import imPlaceholder from '@/assets/images/upload-placeholder.png'

  export default {
    name: 'RoleList',
    components: {},
    data() {
      return {
        loading: false,
        form: {
          id: null,
          name: '',
          type: '',
          typeText: '',
          number: '',
          photo: '',
          contact: '',
          phone: '',
          address: '',
          description: '',
          status: null
        },
      }
    },
    methods: {
      load() {
        this.loading = true
        API.load().then(res => {
          this.loading = false
          if (res && res.id) {
            if (res.status.name !== 'Passed') {
              this.goVerify()
              return
            }
            let type = res.type
            this.form = res
            this.form.type = type.name
            this.form.typeText = type.text
            this.form.status = res.status.name
          } else {
            this.goVerify()
            return
          }
        }).catch(e => {
          this.loading = false
        })
      },
      save() {
        this.loading = true
        API.update(this.form).then(res => {
          this.loading = false
          Message.success('保存成功')
        }).catch(ex => {
          this.loading = false
        });
      },
      goVerify() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'MerchantVerificationVerify',
        })
      }
    },
    computed: {
      imgPreviewUrl() {
        return this.form.photo ? config.baseUrl + '/merchant/verification/file/load?filePath=' + this.form.photo : imPlaceholder
      }
    },
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'MerchantVerificationUnPassed'
        && item.name !== 'MerchantVerificationCommitSuccess'
        && item.name !== 'MerchantVerificationVerify'
      )
      this.$store.commit('setTagNavList', res)
      this.load()
    }
  }
</script>
