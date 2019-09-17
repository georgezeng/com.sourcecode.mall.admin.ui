<template>
  <div>
    <CommonTable
      :columns="columns"
      :loading="loading"
      :useDateRange="true"
      :disableStatusBtns="true"
      :useStatus="true"
      :statusList="statusList"
      editPageName="ClientActivityEventEdit"
      :filteredPageNames="['ClientActivityEventEdit']"
      :listHandler="listHandler"
      :deleteHandler="deleteHandler"
      @setLoading="setLoading"
      @setGoEdit="setGoEdit"
      @setLoad="setLoad"
      @setDeleteData="setDeleteData"
    >
    </CommonTable>
  </div>

</template>
<script>
  import API from '@/api/client-activity'
  import CommonTable from '@/components/tables/common-table'
  import {Message} from 'iview'

  export default {
    components: {
      CommonTable
    },
    data() {
      return {
        statusList: [
          {
            value: 'In',
            label: '进行中'
          },
          {
            value: 'Paused',
            label: '暂停中'
          },
          {
            value: 'UnStarted',
            label: '未开始'
          },
          {
            value: 'Stopped',
            label: '已结束'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '活动名称', key: 'name'},
          {title: '开始时间', key: 'startTime'},
          {title: '结束时间', key: 'endTime'},
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              return h('span', params.row.status.text)
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              const arr = []
              if (!params.row.started || params.row.ended) {
                arr.push(h('Button', {
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
                }, '编辑'))
              }
              // if (params.row.started && !params.row.ended) {
                if (params.row.paused) {
                  arr.push(h('Poptip', {
                    props: {
                      confirm: true,
                      title: '你确定要重启吗?'
                    },
                    on: {
                      'on-ok': () => {
                        API.trigger(params.row.id, false).then(res => {
                          Message.success('操作成功')
                          this.load()
                        })
                      }
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'success',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                    }, '重启')
                  ]))
                } else if (params.row.started && !params.row.ended) {
                  arr.push(h('Poptip', {
                    props: {
                      confirm: true,
                      title: '你确定要中止吗?'
                    },
                    on: {
                      'on-ok': () => {
                        API.trigger(params.row.id, true).then(res => {
                          Message.success('操作成功')
                          this.load()
                        })
                      }
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'warning',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                    }, '中止')
                  ]))
                }
              // }
              if (!params.row.started || params.row.ended) {
                arr.push(h('Poptip', {
                  props: {
                    confirm: true,
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                      this.deleteData([params.row])
                    }
                  }
                }, [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    }
                  }, '删除')
                ]))
              }
              return h('div', arr)
            }
          }
        ]
      }
    },
    methods: {
      listHandler: API.list,
      deleteHandler: API.delete,
      setLoading(loading) {
        this.loading = loading
      },
      setGoEdit(callback) {
        this.goEdit = callback
      },
      setLoad(callback) {
        this.load = callback
      },
      setDeleteData(callback) {
        this.deleteData = callback
      }
    },
  }
</script>
