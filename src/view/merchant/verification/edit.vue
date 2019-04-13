<template>
  <div>
    <Card>
      <p slot="title">
        商家认证-编辑 (已认证)
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="商家名称" prop="name">
          <Input v-model="form.name" readonly></Input>
        </FormItem>
        <FormItem label="证件类型" prop="type">
          <Input v-model="form.type" readonly></Input>
        </FormItem>
        <FormItem label="证件号码" prop="number">
          <Input v-model="form.number" readonly></Input>
        </FormItem>
        <FormItem label="证件照" prop="photo">
          <img :src="imgPreviewUrl" readonly/>
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
          number: '',
          photo: '',
          contact: '',
          phone: '',
          address: '',
          description: ''
        }
      }
    },
    methods: {
      load() {
        this.loading = true
        API.load().then(res => {
          this.loading = false
          if (res.id) {
            if (res.status !== 'Passed') {
              this.goVerify()
              return
            }
            this.form = res
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
        return config.publicBucketDomain + this.form.photo
      }
    },
    mounted: function () {
      this.load()
    }
  }
</script>
