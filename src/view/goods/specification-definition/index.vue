<template>
<div></div>
</template>

<script>

export default {
  name: 'GoodsSpecificationDefinitionIndex',
  mounted () {
    this.$store.commit('closeTag', this.$router.currentRoute)
    this.$router.push({
      name: 'GoodsSpecificationDefinitionList',
      params: {
        ids: '0'
      }
    })
  }
}
</script>
