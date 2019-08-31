<style scoped lang="less">
</style>
<template>
  <div>
    <Card>
      <p slot="title">
        {{action}}会员等级
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right"
                :loading="loading">保存
        </Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="120">
        <FormItem label="等级" prop="level">
          <InputNumber v-model="form.level" :min="0" style="width: 300px;" precision="0"></InputNumber>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="消费累计" prop="upToAmount">
          <InputNumber v-model="form.upToAmount" :min="0" style="width: 300px;"></InputNumber>
        </FormItem>
        <FormItem label="折扣权益" prop="discount">
          <InputNumber v-model="form.discount" :min="0" style="width: 300px;" :max="100" precision="0"></InputNumber>
          %
        </FormItem>
        <FormItem label="活动日折扣权益" prop="discountInActivity">
          <InputNumber v-model="form.discountInActivity" :min="0" style="width: 300px;" :max="100"
                       precision="0"></InputNumber>
          %
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/client-level'
  import {Message} from 'iview'
  import config from '@/config/index'

  export default {
    name: 'ClientUserEdit',
    components: {},
    data() {
      const numCheck = (rule, value, callback) => {
        if (value == null) {
          callback(new Error('必须是有效数字'));
        } else {
          callback();
        }
      }
      return {
        loading: false,
        form: {
          id: null,
          level: null,
          name: null,
          upToAmount: null,
          discount: null,
          discountInActivity: null,
        },
        rules: {
          level: [
            {required: true, validator: numCheck, trigger: 'change'}
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'change'},
            {max: 50, message: '名称不能多于50位', trigger: 'change'}
          ],
          upToAmount: [
            {required: true, validator: numCheck, trigger: 'change'}
          ],
          discount: [
            {required: true, validator: numCheck, trigger: 'change'}
          ],
          discountInActivity: [
            {required: true, validator: numCheck, trigger: 'change'}
          ],
        }
      }
    },
    methods: {
      load() {
        if (this.form.id > 0) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.save(this.form).then(res => {
              Message.success('保存成功')
              this.goList()
              this.loading = false
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      goList() {
        this.$router.push({
          name: 'ClientLevelSettingList'
        })
      },
    },
    computed: {
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
      isEdit() {
        return this.form.id > 0
      },
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      this.form.id = this.form.id != 0 ? this.form.id : null;
      this.load()
    }
  }
</script>
