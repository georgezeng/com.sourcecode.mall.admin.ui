<style scoped lang="less">
</style>
<template>
  <div>
    <Card>
      <p slot="title">
        {{action}}活动日配置
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right"
                :loading="loading">保存
        </Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="120">
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="开始时间" prop="startTime">
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择时间" @on-change="changeStartTime"
                      style="width: 300px"></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endTime">
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择时间" @on-change="changeEndTime"
                      style="width: 300px"></DatePicker>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/client-activity'
  import {Message} from 'iview'
  import config from '@/config/index'

  export default {
    name: 'ClientUserEdit',
    components: {},
    data() {
      const timeCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error('时间不能为空'));
        } else {
          callback();
        }
      }
      return {
        loading: false,
        form: {
          id: null,
          name: null,
          startTime: null,
          endTime: null
        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'change'},
            {max: 50, message: '名称不能多于50位', trigger: 'change'}
          ],
          startTime: [
            {required: true, validator: timeCheck, trigger: 'change'}
          ],
          endTime: [
            {required: true, validator: timeCheck, trigger: 'change'}
          ],
        }
      }
    },
    methods: {
      changeStartTime(time) {
        this.form.startTime = time
      },
      changeEndTime(time) {
        this.form.endTime = time
      },
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
            API.save({
              ...this.form,
              startTime: this.form.startTime + ':00',
              endTime: this.form.endTime + ':00',
            }).then(res => {
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
          name: 'ClientActivityEventList'
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
