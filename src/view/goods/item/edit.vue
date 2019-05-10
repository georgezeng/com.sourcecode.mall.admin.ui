<template>
  <Tabs v-model="tab">
    <TabPane label="基本信息" name="info">
      <InfoPanel @editComplete="editComplete" @saveSuccess="saveSuccess"/>
    </TabPane>
    <TabPane label="规格信息" name="spec" :disabled="isDisabled">
      <SpecPanel :id="id" @goInfo="goInfo"/>
    </TabPane>
  </Tabs>
</template>

<script>
  import InfoPanel from './edit-info'
  import SpecPanel from './edit-spec'

  export default {
    name: 'GoodsItemEdit',
    components: {
      InfoPanel,
      SpecPanel
    },
    data() {
      return {
        tab: 'info',
        id: null,
        enable: false,
        filteredPageNames: [
          'GoodsItemEdit'
        ]
      }
    },
    methods: {
      saveSuccess(id) {
        this.id = id
      },
      editComplete() {
        this.enable = true
      },
      goInfo() {
        this.tab = 'info'
      }
    },
    computed: {
      isDisabled() {
        return !(this.isEdit || this.enable)
      },
      isEdit() {
        return this.id != null && this.id > 0
      }
    },
    mounted: function () {
      let res = this.$store.state.app.tagNavList.filter(item => {
        if ('GoodsItemEdit' == item.name && this.$router.currentRoute.params.id != item.params.id) {
          return false
        }
        return true
      })
      this.$store.commit('setTagNavList', res)
      this.id = this.$router.currentRoute.params.id
      let isEdit = this.id != 0
      this.id = isEdit ? this.id : null;
    }
  }
</script>
