<template>
    <Card>
      <p slot="title">
        积分奖励
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" :loading="loading">保存</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem label="注册奖励" prop="rookie">
          <InputNumber :min="0" :precision="0" v-model="form.rookie" style="width: 300px;"></InputNumber>
        </FormItem>
        <FormItem label="邀请奖励" prop="invite">
          <InputNumber :min="0" :precision="0" v-model="form.invite" style="width: 300px;"></InputNumber>
        </FormItem>
      </Form>
    </Card>
</template>

<script>
  import config from '@/config'
  import API from '@/api/client-points-setting'
  import {Message} from 'iview'

  export default {
    components: {
    },
    data() {
      const numCheck = (rule, value, callback) => {
        if (value == null || value == '') {
          callback(new Error('积分不能为空'));
        } else {
          callback();
        }
      }
      return {
        config,
        loading: false,
        form: {
          rookie: null,
          invite: null,
        },
        rules: {
          rookie: [
            {required: true, validator: numCheck, trigger: 'change'},
          ],
          invite: [
            {required: true, validator: numCheck, trigger: 'change'},
          ]
        }
      }
    },
    methods: {
      load() {
        this.loading = true
        API.load().then(data => {
          this.form = data
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.save(this.form).then(res => {
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
