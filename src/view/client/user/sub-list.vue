<template>
  <CommonTable
    :columns="columns"
    :loading="loading"
    :useDateRange="true"
    :disableAddBtn="true"
    initSortProperty="createTime"
    initSortOrder="DESC"
    :disableDelete="true"
    editPageName="ClientUserEdit"
    :filteredPageNames="[
      'ClientUserEdit',
      'ClientUserList',
      'ClientUserSubList'
    ]"
    :queryData="data"
    :useParent="true"
    :listHandler="listHandler"
    @setLoading="setLoading"
    @setGoEdit="setGoEdit"
    @setLoad="setLoad"
    from="ClientUserSubList"
    parentPageName="ClientUserSubList"
    topPageName="ClientUserList"
    :needReload="true"
    subPageName="ClientUserSubList"
    @setGoSubList="setGoSubList"
    @prepareLoadParent="prepareLoadParent"
  >
  </CommonTable>
</template>
<script>
  import API from '@/api/client-user'
  import CommonTable from '@/components/tables/common-table'

  export default {
    components: {
      CommonTable
    },
    data() {
      return {
        data: {
          id: null,
          ids: []
        },
        parentPageName: null,
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '用户名', key: 'username', sortable: true},
          {title: '昵称', key: 'nickname', sortable: true},
          {
            title: '性别',
            key: 'sex',
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.sex ? params.row.sex.text : '')
            }
          },
          {title: '邀请者', key: 'invitor'},
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
                      this.goEdit(params.row.id)
                    }
                  }
                }, '查看'),

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
                      this.data.id = params.row.id
                      this.parentPageName = 'ClientUserSubList'
                      this.goSubList(params.row.id, this.parentPageName)
                    }
                  }
                }, '下级')
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
      setGoEdit(callback) {
        this.goEdit = callback
      },
      setLoad(callback) {
        this.load = callback
      },
      setGoSubList(callback) {
        this.goSubList = callback
      },
      prepareLoadParent(id) {
        this.data.id = id
      }
    },
    created() {
      this.data.ids = this.$router.currentRoute.params.ids.split(',')
      this.data.id = this.data.ids[0]
      this.parentPageName = this.$router.currentRoute.params.from
    }
  }
</script>
