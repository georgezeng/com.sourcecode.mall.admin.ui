<style lang="less" scoped>
  table {
    width: 100%;
    border-top: 1px solid #DCDEE2;
    border-left: 1px solid #DCDEE2;
  }

  table td {
    border-bottom: 1px solid #DCDEE2;
    border-right: 1px solid #DCDEE2;
    padding: 5px;
  }
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        订单详情
      </p>
      <div slot="extra">
        <!--<Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>-->
        <Button @click="back" type="success">返回</Button>
      </div>
      <div style="text-align: center; margin: 30px 0 10px;">基本信息</div>
      <table cellspacing="0" cellpadding="0">
        <tr>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">订单编号</td>
          <td>{{data.orderId}}</td>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">订单状态</td>
          <td>{{data.status.merchantText}}</td>
        </tr>
        <tr>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">购买用户</td>
          <td>{{data.buyer}}</td>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">下单时间</td>
          <td>{{data.createTime}}</td>
        </tr>
        <tr>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">支付方式</td>
          <td>{{data.payment.text}}</td>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">支付时间</td>
          <td>{{data.payTime}}</td>
        </tr>
        <tr>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">交易号</td>
          <td>{{data.transactionId}}</td>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">支付金额</td>
          <td>{{data.totalPrice}}</td>
        </tr>
        <tr>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">买家留言</td>
          <td colspan="3">{{data.remark}}</td>
        </tr>
      </table>

      <div style="text-align: center; margin: 30px 0 10px;">
        物流信息
        <Button @click="goUpdateExpress" v-if="data.status.name == 'Paid' || data.status.name == 'Shipped'"
                type="primary" size="small"
                style="margin-left: 10px;">
          编辑
        </Button>
      </div>
      <table cellspacing="0" cellpadding="0">
        <tbody v-for="express in data.expressList" :key="express.id">
        <tr>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">发货单号</td>
          <td>{{express.number}}</td>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">发货时间</td>
          <td>{{express.expressTime}}</td>
        </tr>
        <tr>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">物流公司</td>
          <td>{{express.company}}</td>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">物流商品</td>
          <td>
            <img style="margin-left: 10px;" v-for="sub in express.subList" :key="sub.id"
                 :src="config.publicBucketDomain + sub.thumbnail"
                 width="40" height="40"/>
          </td>
        </tr>
        </tbody>
      </table>

      <div style="text-align: center; margin: 30px 0 10px;">收货信息</div>
      <table cellspacing="0" cellpadding="0">
        <tr>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">收件人</td>
          <td>{{data.address.name}}</td>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">联系电话</td>
          <td>{{data.address.phone}}</td>
        </tr>
        <tr>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">收货地址</td>
          <td colspan="3">{{data.address ? data.address.province+data.address.city.replace('市辖区',
            '')+data.address.district+data.address.location : ''}}
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin: 30px 0 10px;">商品信息</div>
      <Table :loading="loading" :data="data.subList" :columns="columns"></Table>

      <div style="text-align: center; margin: 30px 0 10px;">费用信息</div>
      <table cellspacing="0" cellpadding="0">
        <tr>
          <td style="text-align: right;">RMB订单应付总额: 商品总额 ￥{{data.totalPrice}} + 物流费用 ￥0.00 + 税票费用 ￥0.00 =
            ￥{{data.totalPrice}}
          </td>
        </tr>
        <tr>
          <td style="text-align: right;">扣除优惠: - (满减优惠 ￥0.00 + 优惠券抵扣 ￥0.00) = ￥-0.00</td>
        </tr>
        <tr>
          <td style="text-align: right;">订单实付金额: ￥{{data.totalPrice}}</td>
        </tr>
      </table>

      <div style="text-align: center; margin: 30px 0 10px;">发票信息</div>
      <table cellspacing="0" cellpadding="0">
        <tr>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">发票类型</td>
          <td>{{data.invoice ? data.invoice.type.name : ''}}</td>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">纳税编号</td>
          <td>{{data.invoice ? data.invoice.code : ''}}</td>
        </tr>
        <tr>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">发票抬头</td>
          <td>{{data.invoice ? data.invoice.title : ''}}</td>
          <td width="100" style="background-color: #c3c3c3; text-align: center;">发票内容</td>
          <td>{{data.invoice ? data.invoice.content : ''}}</td>
        </tr>
      </table>

      <div class="clearfix" style="margin-bottom: 200px;"></div>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/order'
  import {Message} from 'iview'
  import config from '@/config/index'

  export default {
    name: 'OrderEdit',
    components: {},
    data() {
      return {
        loading: false,
        config,
        data: {
          id: null,
          orderId: null,
          address: {
            name: '',
            city: '',
            province: '',
            location: '',
            district: ''
          },
          buyer: null,
          status: {
            name: null,
            merchantText: null
          },
          payment: {
            name: null,
            text: null
          },
          payTime: null,
          transactionId: null,
          totalPrice: null,
          invoice: null,
          expressList: [],
          subList: []
        },
        columns: [
          {
            title: '商品图片',
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
          {title: '商品名称', key: 'itemName'},
          {title: '规格', key: 'specificationValues'},
          {title: '购买数量', key: 'nums'},
          {title: '商品单价', key: 'unitPrice'},
          {title: '商品金额', key: 'dealPrice'},
          {title: '库存数量', key: 'inventory'},
        ]
      }
    },
    methods: {
      goUpdateExpress() {
        this.$router.push({
          name: 'OrderExpress',
          id: this.data.id
        })
      },
      back() {
        this.$router.push({
          name: 'OrderList'
        })
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
      }
    },
    computed: {},
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'OrderExpress' &&
        item.name !== 'OrderList'
      )
      this.$store.commit('setTagNavList', res)
      this.data.id = this.$router.currentRoute.params.id
      this.load()
    }
  }
</script>
