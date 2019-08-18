<template>
  <Select :disabled="disabled" :value="value" filterable multiple @on-change="change">
    <Option :disabled="disableParent && parent.level != 3"
            :style="{paddingLeft: parent.level*10+'px'}"
            v-for="parent in parents"
            :value="parent.value"
            :key="parent.id"
    >
      {{parent.name}}
    </Option>
  </Select>
</template>

<script>
  export default {
    props: [
      'value',
      'disabled',
      'disableParent',
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
