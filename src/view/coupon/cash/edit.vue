<style scoped lang="less">
</style>
<template>
  <Tabs v-model="tab">
    <TabPane label="基本内容" name="info">
      <InfoPanel @saveSuccess="saveSuccess"/>
    </TabPane>
    <TabPane label="业务属性" name="biz" :disabled="!isEdit">
      <BizPanel :id="id" />
    </TabPane>
  </Tabs>
</template>

<script>
  import InfoPanel from './edit-info'
  import BizPanel from './edit-biz'

  export default {
    name: 'CashCouponSettingEdit',
    components: {
      InfoPanel,
      BizPanel
    },
    data() {
      return {
        tab: 'info',
        id: null
      }
    },
    methods: {
      saveSuccess(data) {
        this.id = data.id
        if (!data.isEdit) {
          this.tab = 'biz'
        }
      }
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
    }
  }
</script>
