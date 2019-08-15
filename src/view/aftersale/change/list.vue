<template>
  <div>
    <Modal v-model="sendPopup" width="500" :mask-closable="false">
      <p slot="header">
        <span>发货操作</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="100">
        <FormItem label="物流单号" prop="merchantExpressNumber">
          <Input v-model="form.merchantExpressNumber" />
        </FormItem>
        <FormItem label="物流公司" prop="merchantExpressCompany">
          <Input v-model="form.merchantExpressCompany" />
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
        <Button type="primary" :loading="loading" @click="sent">
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
      editPageName="AfterSaleChangeDetail"
      :filteredPageNames="['AfterSaleChangeDetail']"
      :listHandler="listHandler"
      :queryData="data"
      @setLoading="setLoading"
      @setGoEdit="setGoEdit"
      @setLoad="setLoad"
    >
    </CommonTable>
  </div>
</template>
<script>
  import config from '@/config'
  import API from '@/api/aftersale-application'
  import CommonTable from '@/components/tables/common-table'
  import {Message} from 'iview'

  export default {
    components: {
      CommonTable
    },
    data() {
      return {
        sendPopup: false,
        form: {
          id: null,
          merchantExpressCompany: null,
          merchantExpressNumber: null,
          remark: null
        },
        rules: {
          merchantExpressCompany: [
            {required: true, message: '物流公司不能为空', trigger: 'change'}
          ],
          merchantExpressNumber: [
            {required: true, message: '物流单号不能为空', trigger: 'change'}
          ],
        },
        statusList: [
          {
            value: 'Processing',
            label: '审核中'
          },
          {
            value: 'WaitForReturn',
            label: '待发货(用户)'
          },
          {
            value: 'WaitForPickup',
            label: '待收货(用户)'
          },
          {
            value: 'WaitForSend',
            label: '待发货(商城)'
          },
          {
            value: 'WaitForReceive',
            label: '待收货(商城)'
          },
          {
            value: 'WaitForPickup',
            label: '待收货(用户)'
          },
          {
            value: 'Rejected',
            label: '已拒绝'
          },
          {
            value: 'Finished',
            label: '换货成功'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        loading: false,
        data: {
          type: 'Change',
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
              const arr = [
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
                }, '查看')
              ]
              if (params.row.status.name == 'WaitForReceive') {
                arr.push(
                  h('Poptip', {
                    props: {
                      confirm: true,
                      title: '你确定要确认收货吗?'
                    },
                    on: {
                      'on-ok': () => {
                        API.receive(params.row.id).then(res => {
                          Message.success('确认收货成功')
                          this.load()
                        })
                      }
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                    }, '确认收货')
                  ])
                )
              }
              if (params.row.status.name == 'WaitForSend') {
                arr.push(
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
                        this.form.merchantExpressCompany = null
                        this.form.merchantExpressNumber = null
                        this.form.remark = null
                        this.sendPopup = true
                      }
                    }
                  }, '发货')
                )
              }
              return arr
            }
          }
        ]
      }
    },
    methods: {
      listHandler: API.list,
      sent() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.sent(this.form).then(res => {
              Message.success('发货成功')
              this.closePopup()
              this.load()
              this.loading = false
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      closePopup() {
        this.sendPopup = false
      },
      setLoading(loading) {
        this.loading = loading
      },
      setGoEdit(callback) {
        this.goEdit = callback
      },
      setLoad(callback) {
        this.load = callback
      }
    },
  }
</script>
