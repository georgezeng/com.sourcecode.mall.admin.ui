<template>
  <Card>
    <p slot="title">
      编辑物流信息
    </p>
    <div slot="extra">
      <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
      <Button @click="back" type="success">返回</Button>
    </div>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="发货单号" prop="number">
        <Input v-model="form.number"></Input>
      </FormItem>
      <FormItem label="物流公司" prop="company">
        <Input v-model="form.company"></Input>
      </FormItem>
      <FormItem label="物流商品" prop="subIdList">
        <Select @on-change="updateSub" multiple v-model="form.subIdList">
          <Option v-for="(sub, index) in order.subList" :value="sub.id" :key="sub.id">{{ sub.itemName }}</Option>
        </Select>
      </FormItem>
    </Form>
    <div style="position: relative; left: 80px; top: -10px;">
      <img style="margin-right: 10px;" v-for="sub in form.subList" :src="config.publicBucketDomain + sub.thumbnail"
           width="40" height="40"/>
    </div>
    <Button style="position: relative; left: 80px;" type="primary" @click="updateExpress">{{updateBtnText}}</Button>
    <Table style="margin-top: 20px;" :loading="loading" :data="order.expressList"
           :columns="columns"/>
  </Card>

</template>

<script>
  import API from '@/api/order'
  import {Message} from 'iview'
  import config from '@/config/index'
  import moment from 'moment'

  export default {
    components: {},
    data() {
      const subListCheck = (rule, value, callback) => {
        if (!this.reset && this.form.subList.length == 0) {
          callback(new Error('物流商品不能为空'));
        } else {
          callback();
        }
      }
      return {
        config,
        loading: false,
        updateBtnText: '添加',
        add: true,
        reset: true,
        form: {
          id: null,
          company: null,
          number: null,
          subIdList: [],
          subList: [],
          expressTime: null
        },
        order: {
          id: null,
          expressList: [],
          subList: []
        },
        rules: {
          company: [
            {required: true, message: '物流公司不能为空', trigger: 'change'},
          ],
          number: [
            {required: true, message: '发货单号不能为空', trigger: 'change'},
          ],
          subIdList: [
            {required: true, validator: subListCheck, trigger: 'change'},
          ],
        },
        columns: [
          {title: '发货单号', key: 'number'},
          {title: '物流公司', key: 'company'},
          {
            title: '物流商品',
            render: (h, params) => {
              let arr = null
              if (params.row.subList) {
                arr = params.row.subList.map(item => {
                  return h('img', {
                    attrs: {
                      src: config.publicBucketDomain + item.thumbnail
                    },
                    style: {
                      marginRight: '8px',
                      width: '40px',
                      height: '40px'
                    }
                  });
                })
                // const maxLength = 10
                // if (arr.length > maxLength) {
                //   arr = arr.slice(0, maxLength)
                //   arr.push(h('span', '...'))
                // }
              }

              return h('div', arr)
            }
          },
          {
            title: '发货时间',
            render: (h, params) => {
              return h('div', params.row.expressTime)
            }
          },
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
                  on: {
                    click: () => {
                      this.form = params.row
                      this.form.subIdList = []
                      for (let i in this.order.subList) {
                        for (let j in this.form.subList) {
                          if (this.form.subList[j].id == this.order.subList[i].id) {
                            this.form.subIdList.push(this.form.subList[j].id)
                            break
                          }
                        }
                      }
                      this.updateBtnText = '修改'
                      this.add = false
                    }
                  }
                }, '修改'),

                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginLeft: '5px'
                  },
                  on: {
                    click: () => {
                      const arr = this.order.expressList
                      let index = -1
                      for (let i in arr) {
                        if (params.row.company == arr[i].company && params.row.number == arr[i].number) {
                          index = i
                          break
                        }
                      }
                      if (index > -1) {
                        arr.splice(index, 1)
                      }
                    }
                  }
                }, '删除'),
              ])
            }
          }
        ]
      }
    },
    computed: {},
    methods: {
      updateExpress() {
        this.reset = false
        this.$refs.form.validate().then(valid => {
          if (valid) {
            if (this.add) {
              if (!this.order.expressList) {
                this.order.expressList = []
              }
              this.order.expressList.push({
                ...this.form,
                expressTime: moment().format('YYYY-MM-DD HH:mm:ss')
              })
            } else {
              for (let i in this.order.expressList) {
                let express = this.order.expressList[i]
                if (express.id == this.form.id) {
                  express.company = this.form.company
                  express.number = this.form.number
                  express.subList = this.form.subList
                  express.expressTime = moment().format('YYYY-MM-DD HH:mm:ss')
                  break;
                }
              }
              this.add = true
              this.updateBtnText = '添加'
            }
            this.reset = true
            this.$refs.form.resetFields()
          }
        })
      },
      updateSub(arr) {
        this.form.subList = []
        for (let i in arr) {
          for (let j in this.order.subList) {
            if (this.order.subList[j].id == arr[i]) {
              this.form.subList.push(this.order.subList[j])
              break;
            }
          }
        }
      },
      back() {
        window.history.back()
      },
      load() {
        this.loading = true
        API.load(this.order.id).then(data => {
          this.order = data
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      },
      save() {
        if (this.order.expressList == null || this.order.expressList.length == 0) {
          Message.error('请添加至少一个物流信息')
          return
        }
        this.loading = true
        API.updateExpress({
          id: this.order.id,
          expressList: this.order.expressList
        }).then(res => {
          this.loading = false
          Message.success('保存成功')
          this.back()
        }).catch(e => {
          this.loading = false
        })
      }
    },
    mounted() {
      let res = this.$store.state.app.tagNavList.filter(item =>
        item.name !== 'OrderList' &&
        item.name !== 'OrderEdit'
      )
      this.$store.commit('setTagNavList', res)
      this.order.id = this.$router.currentRoute.params.id
      this.load()
    }
  }
</script>
