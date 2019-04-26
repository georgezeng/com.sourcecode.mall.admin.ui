<template>
</template>

<script>

  export default {
    name: 'GoodsSpecificationGroupIndex',
    mounted() {
      this.$store.commit('closeTag', this.$router.currentRoute)
      this.$router.push({
        name: 'GoodsSpecificationGroupList',
        params: {
          ids: '0'
        }
      })
    },
  }
</script>
