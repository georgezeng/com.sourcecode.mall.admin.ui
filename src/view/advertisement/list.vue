<template>
  <div>
    <CommonTable
      :columns="columns"
      :loading="loading"
      :disableAddBtn="false"
      :disableDelete="false"
      :statusList="statusList"
      :disableStatusBtns="true"
      :useStatus="true"
      :useStatusQueryOnly="true"
      :useReason="false"
      :useDateRange="true"
      initSortProperty="updateTime"
      initSortOrder="DESC"
      editPageName="AdvertisementSettingEdit"
      :filteredPageNames="[
        'AdvertisementSettingEdit',
      ]"
      :listHandler="listHandler"
      @setLoading="setLoading"
      @setGoEdit="setGoEdit"
      @setLoad="setLoad"
      :deleteHandler="deleteHandler"
      @setDeleteData="setDeleteData"
    >
    </CommonTable>
  </div>
</template>
<script>
  import config from '@/config'
  import API from '@/api/advertisement'
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
            value: 'HomeBanner',
            label: '首页轮播图'
          },
          {
            value: 'HomeRecommend',
            label: '首页推荐图'
          },
          {
            value: 'CategoryBanner',
            label: '分类页轮播图'
          },
          {
            value: 'CategoryBrand',
            label: '分类页品牌'
          },
          {
            value: 'all',
            label: '全部'
          }
        ],
        loading: false,
        columns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '编辑时间', key: 'updateTime', sortable: true, sortType: 'desc', width: 150},
          {title: '广告位名称', key: 'name', sortable: true},
          {title: '排序', key: 'orderNum'},
          {title: '链接', key: 'link'},
          {title: '开始时间', key: 'startDate', sortable: true},
          {title: '结束时间', key: 'endDate', sortable: true},
          {
            title: '图片',
            key: 'imgPath',
            render: (h, params) => {
              return h('Poptip', null, [
                h('img', {
                  attrs: {
                    src: config.publicBucketDomain + params.row.path
                  },
                  style: {
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer'
                  }
                }),
                h('img', {
                  slot: "content",
                  attrs: {
                    src: config.publicBucketDomain + params.row.path
                  },
                  style: {
                    width: '100%',
                    height: '100%'
                  }
                })
              ])

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
              ]
              return arr
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
      },
      setLoad(callback) {
        this.load = callback
      },
    },
  }
</script>
