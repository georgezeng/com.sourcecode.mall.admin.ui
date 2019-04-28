<template>
  <Select @on-change="change">
    <Option value="0,0">无上级</Option>
    <Option v-for="parent in parents" :value="parent.value" :key="parent.id"><span
      :style="{marginLeft: (parent.level-1)*10+'px'}">{{parent.name}}</span></Option>
  </Select>
</template>

<script>
  import API from '@/api/goods-category'
  import {Message} from 'iview'

  export default {
    name: 'GoodsCategoryParents',
    props: [
      'parents',
    ],
    methods: {
      change(option) {
        this.$emit("change", option)
      }
    }
  }
</script>
