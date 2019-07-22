<template>
  <div>
    <Modal v-model="refundPopup" width="500" :mask-closable="false">
      <p slot="header">
        <span>退款操作</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="退款件数" prop="nums">
          <InputNumber :min="1" v-model="form.nums" style="width: 380px;"></InputNumber>
        </FormItem>
        <FormItem label="退款金额" prop="amount">
          <InputNumber
            v-model="form.amount" :min="0.01" style="width: 380px;"></InputNumber>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="form.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="输入备注"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="error" :loading="loading" @click="closePopup">
          取消
        </Button>
        <Button type="primary" :loading="loading" @click="refund">
          确定
        </Button>
      </div>
    </Modal>
    <CommonTable
      :columns="columns"
      :loading="loading"
      :disableAddBtn="true"
      :disableDelete="true"
      :statusList="statusList"
      :disableStatusBtns="true"
      :useStatus="true"
      :useStatusQueryOnly="true"
      :useReason="false"
      :useDateRange="true"
      initSortProperty="postTime"
      initSortOrder="DESC"
      editPageName="AfterSaleRefundOnlyDetail"
      :filteredPageNames="['AfterSaleRefundOnlyDetail']"
      :listHandler="listHandler"
      :queryData="data"
      @setLoading="setLoading"
      @setGoEdit="setGoEdit"
    >
    </CommonTable>
  </div>
</template>
<script>
  import config from '@/config'
  import API from '@/api/aftersale-application'
  import CommonTable from '@/components/tables/common-table'

  export default {
    components: {
      CommonTable
    },
    data() {
      const numsCheck = (rule, value, callback) => {
        if (this.form.nums <= 0) {
          callback(new Error('数量必须大于0'))
          return
        }
        callback()
      }
      const amountCheck = (rule, value, callback) => {
        if (this.form.amount <= 0) {
          callback(new Error('金额必须大于0'))
          return
        }
        callback()
      }
      return {
        refundPopup: false,
        form: {
          id: null,
          nums: 0,
          amount: 0,
          remark: null
        },
        rules: {
          nums: [
            {required: true, validator: numsCheck, trigger: 'change'}
          ],
          amount: [
            {required: true, validator: amountCheck, trigger: 'change'}
          ],
        },
        statusList: [
          {
            value: 'Processing',
            label: '审核中'
          },
          {
            value: 'WaitForRefund',
            label: '待退款'
          },
          {
            value: 'Rejected',
            label: '已拒绝'
          },
          {
            value: 'Finished',
            label: '退款成功'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        loading: false,
        data: {
          type: 'RefundOnly',
        },
        columns: [
          // {type: 'selection', width: 60, align: 'center'},
          {title: '服务编号', key: 'serviceId', sortable: true, width: 180},
          {title: '申请时间', key: 'postTime', sortable: true, sortType: 'desc', width: 150},
          {
            title: '购买用户',
            key: 'client.username',
            sortable: true,
            render: (h, params) => {
              return h('div', params.row.buyer)
            }
          },
          {
            title: '购买商品',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: config.publicBucketDomain + params.row.subOrder.thumbnail
                },
                style: {
                  width: '40px',
                  height: '40px'
                }
              })
            }
          },
          {title: '退款金额', key: 'amount'},
          {
            title: '状态', key: 'status', sortable: true,
            render: (h, params) => {
              return h('div', params.row.status.merchantText)
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              if (params.row.status.name == 'WaitForRefund') {

                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.goEdit(params.row.id)
                      }
                    }
                  }, '查看'),

                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.form.id = params.row.id
                        this.form.nums = params.row.nums
                        this.form.amount = params.row.amount
                        this.form.remakr = null
                        this.refundPopup = true
                      }
                    }
                  }, '退款')
                ])
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.goEdit(params.row.id)
                      }
                    }
                  }, '查看'),

                ])
              }
            }
          }
        ]
      }
    },
    methods: {
      listHandler: API.list,
      refund() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.refund(this.form).then(res => {
              this.loading = false
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      closePopup() {
        this.refundPopup = false
      },
      setLoading(loading) {
        this.loading = loading
      },
      setGoEdit(callback) {
        this.goEdit = callback
      },
    },
  }
</script>