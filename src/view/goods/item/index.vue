<template>
</template>

<script>

  export default {
    name: 'GoodsItemIndex',
    mounted() {
      this.$store.commit('closeTag', this.$router.currentRoute)
      this.$router.push({
        name: 'GoodsItemEdit',
        params: {
          id: 0
        }
      })
    },
  }
</script>
