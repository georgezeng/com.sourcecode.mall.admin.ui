<template>
  <Card>
    <p slot="title">
      售后回寄地址配置
    </p>
    <div slot="extra">
      <Button @click="save" type="primary" :loading="loading">保存</Button>
    </div>
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem label="收件人" prop="name">
        <Input v-model="form.name"></Input>
      </FormItem>
      <FormItem label="联系电话" prop="phone">
        <Input v-model="form.phone"></Input>
      </FormItem>
      <FormItem label="地址" prop="location">
        <Input v-model="form.location"></Input>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
  import config from '@/config'
  import API from '@/api/merchant-setting'
  import {Message} from 'iview'

  const CODE = 'RETURN_ADDRESS'
  export default {
    components: {},
    data() {
      return {
        config,
        loading: false,
        form: {
          name: null,
          phone: null,
          location: null,
        },
        rules: {
          name: [
            {required: true, message: '收件人不能为空', trigger: 'change'},
          ],
          phone: [
            {required: true, message: '联系电话不能为空', trigger: 'change'},
          ],
          location: [
            {required: true, message: '地址不能为空', trigger: 'change'},
          ],
        }
      }
    },
    methods: {
      load() {
        this.loading = true
        API.load(CODE).then(value => {
          if (value) {
            this.form = JSON.parse(value)
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.save(CODE, this.form).then(res => {
              this.loading = false
              Message.success('保存成功')
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
    },
    mounted: function () {
      this.load()
    }
  }
</script>
