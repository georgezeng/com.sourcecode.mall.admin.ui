<style scoped lang="less">
</style>
<template>
  <div>
    <Card>
      <p slot="title">
        会员信息
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right"
                :loading="loading">保存
        </Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form :label-width="80">
        <FormItem label="状态">
          <Select v-model="form.enabled">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="用户名">
          <Input v-model="form.username" readonly></Input>
        </FormItem>
        <FormItem label="昵称">
          <Input v-model="form.nickname" readonly></Input>
        </FormItem>
        <FormItem label="性别">
          <Input v-model="form.sexText" readonly></Input>
        </FormItem>
        <FormItem label="生日">
          <Input v-model="form.birthday" readonly></Input>
        </FormItem>
        <FormItem label="头像">
          <img :src="avatarPreviewUrl"/>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/client-user'
  import {Message} from 'iview'
  import config from '@/config/index'
  import avatar from '@/assets/images/avatar.png'

  export default {
    name: 'ClientUserEdit',
    components: {},
    data() {
      return {
        ids: [],
        from: null,
        loading: false,
        statusList: [
          {
            value: 'true',
            text: '启用中'
          },
          {
            value: 'false',
            text: '禁用中'
          }
        ],
        avatar,
        form: {
          id: null,
          username: null,
          nickname: null,
          sex: null,
          sexText: null,
          birthday: null,
          avatar: null,
          enabled: null
        },
      }
    },
    methods: {
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.form.enabled = data.enabled + ''
            this.form.sexText = data.sex ? data.sex.text : '保密'
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      save() {
        this.loading = true
        API.updateStatus([this.form.id], this.form.enabled === 'true').then(res => {
          this.loading = false
          Message.success('保存成功')
          this.goList()
        }).catch(ex => {
          this.loading = false
        })
      },
      goList() {
        this.ids.splice(this.ids.length - 1, 1)
        this.$router.push({
          name: this.from,
          params: {
            ids: this.ids.join(',')
          }
        })
      },
    },
    computed: {
      avatarPreviewUrl() {
        return this.form.avatar ?
          (!this.form.avatar.startsWith('http') ?
              config.baseUrl + '/client/user/file/load/params/' + this.form.id + '?filePath=' + this.form.avatar
              : this.form.avatar
          )
          : avatar
      }
    },
    mounted: function () {
      this.ids = this.$router.currentRoute.params.ids.split(',')
      this.form.id = this.ids[this.ids.length - 1]
      this.from = this.$router.currentRoute.params.from
      this.form.id = this.form.id != 0 ? this.form.id : null;
      this.load()
    }
  }
</script>
