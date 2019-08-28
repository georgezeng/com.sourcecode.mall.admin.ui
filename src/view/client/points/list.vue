<template>
  <div>
    <Modal v-model="popup" width="500" :mask-closable="false">
      <p slot="header">
        <span>手工增减积分</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="增减" prop="balanceType">
          <Select placeholder="选择增减" v-model="form.balanceType">
            <Option v-for="type in balanceTypeList" :value="type.name" :key="type.name">
              {{ type.text }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="数量" prop="bonusAmount">
          <InputNumber v-model="form.bonusAmount" :min="1" style="width: 380px;"></InputNumber>
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
        <Button type="primary" :loading="loading" @click="create">
          确定
        </Button>
      </div>
    </Modal>
    <CommonTable
      :columns="columns"
      :loading="loading"
      :useDateRange="false"
      :disableAddBtn="true"
      :useStatus="false"
      initSortProperty="createTime"
      initSortOrder="DESC"
      :disableDelete="true"
      :filteredPageNames="['ClientPointsJournalList']"
      :listHandler="listHandler"
      @setLoading="setLoading"
      subPageName="ClientPointsJournalList"
      @setGoSubList="setGoSubList"
    >
    </CommonTable>
  </div>

</template>
<script>
  import API from '@/api/client-points'
  import CommonTable from '@/components/tables/common-table'
  import {Message} from 'iview'

  export default {
    components: {
      CommonTable
    },
    data() {
      const balanceTypeCheck = (rule, value, callback) => {
        if (!this.form.balanceType) {
          callback(new Error('必须选择增减类型'))
          return
        }
        callback()
      }
      const bonusAmountCheck = (rule, value, callback) => {
        if (this.form.bonusAmount <= 0) {
          callback(new Error('数量必须大于0'))
          return
        }
        callback()
      }
      const remarkCheck = (rule, value, callback) => {
        if (!this.form.remark) {
          callback(new Error('备注必填'))
          return
        }
        callback()
      }
      return {
        popup: false,
        balanceTypeList: [
          {
            name: 'In',
            text: '增加'
          },
          {
            name: 'Out',
            text: '减少'
          }
        ],
        form: {
          clientId: null,
          balanceType: null,
          bonusAmount: 0,
          remark: null
        },
        rules: {
          balanceType: [
            {required: true, validator: balanceTypeCheck, trigger: 'change'}
          ],
          bonusAmount: [
            {required: true, validator: bonusAmountCheck, trigger: 'change'}
          ],
          remark: [
            {required: true, validator: remarkCheck, trigger: 'change'}
          ],
        },
        loading: false,
        columns: [
          {title: '用户名', key: 'clientName', sortable: true},
          {title: '累积收入', key: 'accInAmount', sortable: true},
          {title: '累积支出', key: 'accOutAmount', sortable: true},
          {title: '当前余额', key: 'currentAmount', sortable: true},
          {title: '创建时间', key: 'createTime', sortable: true, sortType: 'desc'},
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
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
                      this.form = {
                        clientId: params.row.id,
                        balanceType: null,
                        bonusAmount: 0,
                        remark: null
                      }
                      this.popup = true
                    }
                  }
                }, '新增'),

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
                      this.goSubList(params.row.id)
                    }
                  }
                }, '明细')
              ])
            }
          }
        ]
      }
    },
    methods: {
      listHandler: API.list,
      setLoading(loading) {
        this.loading = loading
      },
      setGoSubList(callback) {
        this.goSubList = callback
      },
      create() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.save(this.form).then(res => {
              Message.success('新增成功')
              this.closePopup()
              this.loading = false
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      closePopup() {
        this.popup = false
      },
    },
  }
</script>
