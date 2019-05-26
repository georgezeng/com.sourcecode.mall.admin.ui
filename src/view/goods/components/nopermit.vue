<style>
  .tip {
    color: #28A69A;
    position: absolute;
  }
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        商品管理
      </p>
      <div align="center">
        <div>
          <img :src="stepWarning" />
        </div>

        <div style="position: relative; top: -20px; color: red;">
          必须通过店铺申请才能编辑商品{{type}}
        </div>
      </div>

    </Card>
  </div>
</template>

<script>
  import API from '@/api/merchant-shop-application'
  import {Message} from 'iview'
  import config from '@/config/index'
  import stepWarning from '@/assets/images/bg_state_warning@2x.png'

  export default {
    name: 'GoodsNoPermit',
    components: {},
    data() {
      return {
        stepWarning,
        type: '',
        clearId: null
      }
    },
    methods: {
      load() {
        API.load(true).then(res => {
          if(!res || !res.noPermit) {
            this.goEdit()
            return
          }
          this.clearId = setTimeout(this.load, 1000)
        })
      },
      goEdit() {
        clearTimeout(this.clearId)
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: this.$router.currentRoute.params.from
        })
      }
    },
    mounted: function () {
      this.type = this.$router.currentRoute.params.type
      this.load()
    }
  }
</script>
