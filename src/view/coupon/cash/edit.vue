<style scoped lang="less">
</style>
<template>
  <Tabs v-model="tab">
    <TabPane label="基本内容" name="info">
      <InfoPanel @saveSuccess="saveSuccess"/>
    </TabPane>
    <TabPane label="赠送条件" name="zs" :disabled="!isEdit">
      <ZsPanel :id="id" :categories="categories" @saveSuccess="saveSuccess" />
    </TabPane>
    <TabPane label="核销条件" name="hx" :disabled="!isEdit">
      <HxPanel :id="id" :categories="categories" />
    </TabPane>
  </Tabs>
</template>

<script>
  import CategoryAPI from '@/api/goods-category'
  import InfoPanel from './edit-info'
  import ZsPanel from './edit-zs-condition'
  import HxPanel from './edit-hx-condition'

  export default {
    name: 'CashCouponSettingEdit',
    components: {
      InfoPanel,
      ZsPanel,
      HxPanel
    },
    data() {
      return {
        tab: 'info',
        id: null,
        categories: []
      }
    },
    methods: {
      saveSuccess(data) {
        this.id = data.id
        if (data.to) {
          this.tab = data.to
        }
      },
      loadAllCategories() {
        this.loading = true
        CategoryAPI.list({
          data: {},
          page: {
            num: 1,
            size: 999999999
          }
        }).then(data => {
          this.categories = []
          for (let i in data) {
            let item = data[i]
            item.value = item.id
            this.categories.push(item)
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
    },
    computed: {
      isEdit() {
        return this.id > 0
      }
    },
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item => {
        if ('CashCouponSettingEdit' == item.name && this.$router.currentRoute.params.id != item.params.id) {
          return false
        }
        return true
      })
      this.$store.commit('setTagNavList', res)
      this.id = this.$router.currentRoute.params.id
      let isEdit = this.id > 0
      this.id = isEdit ? this.id : null;
      this.loadAllCategories()
    }
  }
</script>
