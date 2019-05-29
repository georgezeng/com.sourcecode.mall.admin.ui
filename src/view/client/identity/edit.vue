<style scoped lang="less">
  .unpass {
    background-image: url('../../../assets/images/img_stamp_unpass.png');
    width: 100px;
    height: 100px;
    position: absolute;
    z-index: 100;
    background-repeat: no-repeat;
    top: 10px;
    left: 300px;
  }

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
        会员认证审核 ({{form.statusText}})
        <div class="unpass" v-if="!(isChecking || !isUnPassed)"></div>
        <div class="pass" v-if="!(isChecking || isUnPassed)"></div>
      </p>
      <div slot="extra" v-if="isChecking">
        <Button @click="save" type="primary" class="margin-right"
                :loading="loading">保存
        </Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <div slot="extra" v-else>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="审核状态" v-if="!isChecking" prop="status">
          <Input v-model="form.statusText" readonly></Input>
        </FormItem>
        <FormItem label="审核状态" v-else prop="statusType">
          <Select v-model="form.status" style="width:200px">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="失败原因" v-if="isUnPassed" prop="reason">
          <Input v-model="form.reason" :readonly="!isChecking && isUnPassed" type="textarea"
                 :autosize="{minRows: 2, maxRows: 5}"></Input>
        </FormItem>
        <FormItem label="真实姓名" prop="name">
          <Input v-model="form.name" readonly></Input>
        </FormItem>
        <FormItem label="身份证号" prop="number">
          <Input v-model="form.number" readonly></Input>
        </FormItem>
        <FormItem label="正面照">
          <img :src="facePreviewUrl"/>
        </FormItem>
        <FormItem label="国徽照">
          <img :src="badgePreviewUrl"/>
        </FormItem>
        <FormItem label="持卡照">
          <img :src="peoplePreviewUrl"/>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/client-identity'
  import {Message} from 'iview'
  import config from '@/config/index'
  import uploadPlaceholder from '@/assets/images/upload-placeholder.png'


  export default {
    name: 'ClientIdentityEdit',
    components: {
    },
    data() {
      return {
        loading: false,
        statusList: [
          {
            value: 'Passed',
            text: '已通过'
          },
          {
            value: 'UnPassed',
            text: '未通过'
          }
        ],
        form: {
          id: null,
          name: null,
          number: null,
          reason: null,
          facePhoto: null,
          badgePhoto: null,
          peoplePhoto: null,
          status: null,
          statusText: null
        },
        status: null,
        rules: {
          statusType: [
            {required: false, message: '审核状态不能为空', trigger: 'change'}
          ],
          reason: [
            {required: false, message: '失败原因不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            let status = data.status
            data.status = status.name
            data.statusText = status.text
            this.form = data
            this.status = status.name
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
            API.updateStatus([this.form.id], this.form.status === 'Passed', null, this.reason).then(res => {
              this.loading = false
              Message.success('保存成功')
              this.goList()
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
      goList() {
        this.$router.push({
          name: 'ClientIdentityList'
        })
      },
    },
    computed: {
      isChecking() {
        let isChecking = this.status === 'Checking'
        // this.rules.statusType[0].required = isChecking
        return isChecking
      },
      isUnPassed() {
        let isUnPassed = this.form.status === 'UnPassed'
        this.rules.reason[0].required = isUnPassed
        this.rules.statusType[0].required = this.form.status === 'Checking'
        return isUnPassed
      },
      facePreviewUrl() {
        return this.form.facePhoto ? config.baseUrl + '/client/identity/file/load/params/' + this.form.id + '?filePath=' + this.form.facePhoto : uploadPlaceholder
      },
      badgePreviewUrl() {
        return this.form.badgePhoto ? config.baseUrl + '/client/identity/file/load/params/' + this.form.id + '?filePath=' + this.form.badgePhoto : uploadPlaceholder
      },
      peoplePreviewUrl() {
        return this.form.peoplePhoto ? config.baseUrl + '/client/identity/file/load/params/' + this.form.id + '?filePath=' + this.form.peoplePhoto : uploadPlaceholder
      }
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      this.form.id = this.form.id != 0 ? this.form.id : null;
      this.load()
    }
  }
</script>
