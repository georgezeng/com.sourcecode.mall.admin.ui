<template>
  <div>
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
      initSortProperty="createTime"
      initSortOrder="DESC"
      editPageName="EvaluationEdit"
      :filteredPageNames="['EvaluationEdit']"
      :listHandler="listHandler"
      @setLoading="setLoading"
      @setGoEdit="setGoEdit"
    >
    </CommonTable>
  </div>
</template>
<script>
  import config from '@/config'
  import API from '@/api/evaluation.js'
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
            value: 'WaitForReply',
            label: '待回复'
          },
          {
            value: 'HadReplied',
            label: '已回复'
          },
          {
            value: 'Neutrality',
            label: '中评'
          },
          {
            value: 'Bad',
            label: '差评'
          },
          {
            value: 'Good',
            label: '好评'
          },
          {
            value: 'HadAudit',
            label: '已审核'
          },
          {
            value: 'UnAudit',
            label: '未审核'
          },
          {
            value: 'Passed',
            label: '已通过'
          },
          {
            value: 'UnPassed',
            label: '未通过'
          },
          {
            value: 'NotAdditional',
            label: '首次评价'
          },
          {
            value: 'IsAdditional',
            label: '追加评价'
          },
          {
            value: 'All',
            label: '全部'
          }
        ],
        loading: false,
        columns: [
          // {type: 'selection', width: 60, align: 'center'},
          {title: '评价时间', key: 'createTime', sortable: true, sortType: 'desc', width: 150},
          {
            title: '用户',
            key: 'client.username',
            sortable: true,
            render: (h, params) => {
              return h('div', params.row.buyer)
            }
          },
          {
            title: '评级',
            key: 'value',
            sortable: true,
            render: (h, params) => {
              return h('div', params.row.value.text)
            }
          },
          {title: '商品名称', key: 'itemName'},
          {
            title: '商品图片',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: config.publicBucketDomain + params.row.itemThumbnail
                },
                style: {
                  width: '40px',
                  height: '40px'
                }
              })
            }
          },
          {
            title: '公开',
            key: 'show',
            render: (h, params) => {
              return h('input', {
                attrs: {
                  type: 'checkbox',
                  checked: params.row.open
                },
                on: {
                  change: (e) => {
                    if (params.row.passed) {
                      API.open(params.row.id, !params.row.open)
                    } else {
                      Message.error('审核未通过，不能公开评价')
                      e.target.checked = false
                    }
                  }
                }
              })
            }
          },
          {
            title: '状态', key: 'replied',
            render: (h, params) => {
              return h('div', !params.row.hasAudit ? '待审核' : (params.row.passed ? (params.row.replied ? '已回复' : '待回复') : '未通过'))
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              return h('Button', {
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
              }, !params.row.hasAudit ? '审核' : (params.row.passed ? (params.row.replied ? '编辑' : '回复') : '查看'))
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
      setGoEdit(callback) {
        this.goEdit = callback
      },
    },
  }
</script>
