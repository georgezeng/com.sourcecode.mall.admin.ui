<template>
  <div style="margin-bottom: 10px;">
    <Form :label-width="150">
      <FormItem :label="definition.name + ':'">
        <Tag v-for="item in definition.attrs" :color="color" checkable>{{ item.name }}</Tag>
      </FormItem>
      <Table class="margin-top-bottom" :loading="loading" :data="list" :columns="columns"
             @on-select-all="enableBtns"
             @on-select="enableBtns" @on-sort-change="sortChange"
             @on-select-all-cancel="disableBtns" @on-select-cancel="disableBtns"/>
    </Form>
  </div>
</template>

<script>

  export default {
    name: 'GoodsSpecificationValueCombineLine',
    components: {},
    props: [
      'definition'
    ],
    data() {
      return {
        color: 'default'
      }
    },
    methods: {
    },
  }
</script>
