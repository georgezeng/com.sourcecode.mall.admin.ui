<template>
  <Select @on-change="change">
    <Option value="0,0" v-if="noneValue">无上级</Option>
    <Option v-for="parent in parents" :value="parent.value" :key="parent.id"><span
      :style="{marginLeft: (parent.level-1)*10+'px'}">{{parent.name}}</span></Option>
  </Select>
</template>

<script>
  export default {
    name: 'GoodsCategoryParents',
    props: [
      'noneValue',
      'parents',
    ],
    methods: {
      change(option) {
        this.$emit("change", option)
      }
    }
  }
</script>
