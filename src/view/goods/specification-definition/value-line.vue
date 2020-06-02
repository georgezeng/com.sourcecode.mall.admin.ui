<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2020-05-23 09:50:58
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-06-02 15:04:40
-->
<template>
  <div style="margin-bottom: 10px;">
    <Input class="float-left margin-right-10" style="width: 100px;" :value="name" ref="nameInput" @on-change="change"></Input>
    <Button class="float-left margin-right-10" style="position: relative; top: 3px;" size="small" @click="add" icon="md-add"></Button>
    <Button class="float-left" size="small" style="position: relative; top: 3px;" @click="remove" icon="md-remove"></Button>
    <div class="clearfix"></div>
  </div>
</template>

<script>

export default {
  name: 'GoodsSpecificationValueLine',
  components: {},
  props: [
    'name',
    'index'
  ],
  methods: {
    change () {
      this.$emit('change', this.index, this.$refs.nameInput.$refs.input.value)
    },
    add () {
      this.$emit('add', this.index)
    },
    remove () {
      this.$emit('remove', this.index)
    }
  }
}
</script>
