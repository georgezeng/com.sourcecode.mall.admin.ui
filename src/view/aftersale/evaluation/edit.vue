<style scoped lang="less">
</style>
<template>
  <div>
    <Card>
      <p slot="title">
        评价详情
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存
        </Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <div>
        <div style="display: inline-block; width: 30%;">
          <span style="margin-right: 10px;">评价时间:</span>
          {{data.createTime}}
        </div>
        <div style="display: inline-block; width: 30%;">
          <span style="margin-right: 10px;">用户:</span>
          {{data.buyer}}
        </div>
        <div style="display: inline-block; width: 30%;">
          <span style="margin-right: 10px;">状态:</span>
          {{data.replied ? '已回复' : '待回复'}}
        </div>
      </div>
      <div style="margin-top: 10px;">
        <div style="display: inline-block; width: 30%;">
          <span style="margin-right: 10px;">类型:</span>
          {{data.additional ? '追加评价' : '首次评价'}}
        </div>
        <div style="display: inline-block; width: 30%;">
          <span style="margin-right: 10px;">评价等级:</span>
          {{data.value.text}}
        </div>
        <div style="display: inline-block; width: 30%;">
          <span style="margin-right: 10px;">商品名称:</span>
          {{data.itemName}}
        </div>
      </div>
      <div style="margin-top: 10px;">
        评价内容: {{data.remark}}
      </div>
      <div style="margin-top: 10px;">
        评价晒图: <img v-for="(path, index) in data.photos" :key="index"
                   :src="config.publicBucketDomain + path" style="margin-right: 5px;" width="200"
                   height="200"/>
      </div>
    </Card>

    <Card v-if="!data.hasAudit" style="margin-top: 20px;">
      <p slot="title">
        审核
      </p>
      <span style="margin-right: 10px;">审核处理:</span>
      <RadioGroup v-model="passed">
        <Radio label="true">
          <span style="position: relative; left: -3px;">通过</span>
        </Radio>
        <Radio label="false">
          <span style="position: relative; left: -3px;">不通过</span>
        </Radio>
      </RadioGroup>
    </Card>

    <Card v-else style="margin-top: 20px;">
      <p slot="title">
        回复评价
      </p>
      <div>
        <Form :label-width="100">
          <FormItem label="回复内容" prop="reply">
            <Input v-model="reply" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="限255个字以内"></Input>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/evaluation'
  import config from '@/config/index'
  import {Message} from 'iview'


  export default {
    components: {},
    data() {
      return {
        config,
        loading: false,
        data: {
          id: null,
          hasAudit: false,
          createTime: null,
          buyer: null,
          photos: null,
          value: {
            name: null,
            text: null
          },
          replied: false,
          remark: null,
          additional: false,
        },
        passed: null,
        reply: null
      }
    },
    methods: {
      load() {
        if (this.data.id > 0) {
          this.loading = true
          API.load(this.data.id).then(data => {
            this.data = data
            this.reply = data.reply
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        }
      },
      save() {
        this.loading = true
        if(!this.data.hasAudit) {
          API.audit(this.data.id, this.passed == 'true').then(res => {
            Message.success('保存成功')
            this.loading = false
            this.goList()
          }).catch(e => {
            this.loading = false
          })
        } else {
          API.reply(this.data.id, this.reply).then(res => {
            Message.success('保存成功')
            this.loading = false
            this.goList()
          }).catch(e => {
            this.loading = false
          })
        }

      },
      goList() {
        this.$router.push({
          name: 'EvaluationList'
        })
      },
    },
    computed: {},
    mounted: function () {
      this.data.id = this.$router.currentRoute.params.id
      this.load()
    }
  }
</script>
