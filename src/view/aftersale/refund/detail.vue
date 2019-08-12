<style scoped lang="less">
</style>
<template>
  <div>
    <Modal v-model="show" :footer-hide="true">
      <div style="margin: 20px;"></div>
      <Carousel v-if="show" loop>
        <CarouselItem v-for="(photo, index) in data.photos" :key="index">
          <img style="position: relative;" :src="config.publicBucketDomain + photo" width="500" height="500">
        </CarouselItem>
      </Carousel>
    </Modal>

    <Card>
      <p slot="title">
        申请信息 (仅退款)
      </p>
      <div slot="extra">
        <Button v-if="data.status.name == 'Processing'" @click="save" type="primary" class="margin-right"
                :loading="loading">保存
        </Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <div>
        <div style="display: inline-block; width: 30%;">
          <span style="margin-right: 10px;">申请时间:</span>
          {{data.postTime}}
        </div>
        <div style="display: inline-block; width: 30%;">
          <span style="margin-right: 10px;">申请人:</span>
          {{data.buyer}}
        </div>
        <div style="display: inline-block; width: 30%;">
          <span style="margin-right: 10px;">状态:</span>
          {{data.status.merchantText}}
        </div>
      </div>
      <div style="margin-top: 10px;">
        <div style="display: inline-block; width: 30%;">
          <span style="margin-right: 10px;">服务号:</span>
          {{data.serviceId}}
        </div>
        <div style="display: inline-block; width: 30%;">
          <span style="margin-right: 10px;">原订单号:</span>
          {{data.order.orderId}}
        </div>
        <div style="display: inline-block; width: 30%;"></div>
      </div>
      <div style="margin-top: 10px;">
        申请原因: {{data.reason}}
      </div>
      <div style="margin-top: 10px;">
        描述说明: {{data.description}}
      </div>
      <div style="margin-top: 10px;">
        图片凭证: <img @click="showImage" v-for="(path, index) in data.photos" :key="index"
                   :src="config.publicBucketDomain + path" style="cursor: pointer; margin-right: 5px;" width="42"
                   height="42"/>
      </div>
    </Card>

    <Card style="margin-top: 20px;">
      <p slot="title">
        商品信息
      </p>
      <Table :columns="columns" :data="[data.subOrder]"></Table>
    </Card>

    <Card style="margin-top: 20px;">
      <p slot="title">
        审核信息
      </p>
      <div>
        <span style="margin-right: 10px;">审核结果:</span>
        <RadioGroup v-model="data.agree + ''">
          <Radio label="true" :disabled="data.status.name != 'Processing'">
            <span style="position: relative; left: -3px;">同意</span>
          </Radio>
          <Radio label="false" :disabled="data.status.name != 'Processing'">
            <span style="position: relative; left: -3px;">拒绝</span>
          </Radio>
        </RadioGroup>
        <div v-if="data.agree == false" style="margin-top: 10px;">
          <span style="margin-right: 10px;">拒绝原因:</span>
          <Input v-if="data.status.name == 'Processing'" style="display: inline-block; width: 90%;"
                 v-model="data.rejectReason"/>
          <span v-else>{{data.rejectReason}}</span>
        </div>
      </div>

      <div v-if="data.status.name == 'Finished'"
           style="margin-top: 10px;">
        <p>
          处理结果: 已退款
        </p>
      </div>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/aftersale-application'
  import config from '@/config/index'
  import {Message} from 'iview'


  export default {
    components: {},
    data() {
      return {
        config,
        show: false,
        loading: false,
        data: {
          id: null,
          agree: null,
          rejectReason: null,
          postTime: null,
          buyer: null,
          status: {},
          serviceId: null,
          order: {},
          photos: null,
          reason: null,
          description: null,
          subOrder: {},
        },
        columns: [
          {
            title: '编号',
            key: 'itemNumber'
          },
          {
            title: '名称',
            key: 'itemName'
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: config.publicBucketDomain + params.row.thumbnail
                },
                style: {
                  width: '40px',
                  height: '40px'
                }
              })
            }
          },
          {
            title: '规格',
            key: 'specificationValues'
          },
          {
            title: '数量',
            key: 'nums'
          },
          {
            title: '单价',
            key: 'unitPrice'
          },
          {
            title: '金额',
            key: 'dealPrice'
          },
        ]
      }
    },
    methods: {
      showImage() {
        this.show = true
      },
      load() {
        if (this.data.id > 0) {
          this.loading = true
          API.load(this.data.id).then(data => {
            this.data = data
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        }
      },
      save() {
        this.loading = true
        API.audit(this.data).then(res => {
          this.loading = false
          Message.success('保存成功')
          this.goList()
        }).catch(e => {
          this.loading = false
        })
      },
      goList() {
        this.$router.push({
          name: 'AfterSaleRefundOnlyList'
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
