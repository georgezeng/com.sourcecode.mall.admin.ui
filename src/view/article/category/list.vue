<template>
  <CommonTable
    :columns="columns"
    :loading="loading"
    :statusList="statusList"
    :disableStatusBtns="true"
    :useDateRange="true"
    :disableAddBtn="false"
    :useStatusQueryOnly="true"
    :useStatus="true"
    initSortProperty="createTime"
    initSortOrder="DESC"
    :disableDelete="false"
    editPageName="ArticleCategoryEdit"
    :filteredPageNames="['ArticleCategoryEdit']"
    :listHandler="listHandler"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
    :deleteHandler="deleteHandler"
    @setDeleteData="setDeleteData"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/article-category'
  import CommonTable from '@/components/tables/common-table'

  export default {
    components: {
      CommonTable
    },
    data() {
      return {
        statusList: [
          {
            value: 'Site',
            label: '站点文章'
          },
          {
            value: 'Life',
            label: '多呗生活'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {
            title: '栏目名称',
            key: 'type',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.type.text)
            }
          },
          {title: '分类名称', key: 'name', sortable: true},
          {title: '排序', key: 'orderNum', sortable: true},
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
                      this.goEdit(params.row.id)
                    }
                  }
                }, '编辑'),

                h('Poptip', {
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
                ])
              ])
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
      setDeleteData(callback) {
        this.deleteData = callback
      },
      setGoEdit(callback) {
        this.goEdit = callback
      }
    },
  }
</script>
