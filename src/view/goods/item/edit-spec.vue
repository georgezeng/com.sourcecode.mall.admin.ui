<template>
  <div>
    <Modal
      v-model="addDefinitionModal"
      :mask-closable="false"
      title="新增规格" :closable="false">
      <Form ref="modalForm" :model="modalForm" :rules="modalRules" :label-width="80">
        <FormItem label="名称" prop="name">
          <Input v-model="modalForm.name"></Input>
        </FormItem>
        <FormItem label="排序" prop="order">
          <InputNumber :min="1" v-model="modalForm.order"></InputNumber>
        </FormItem>
        <FormItem label="值" prop="values">
          <ValueLine v-for="(value, index) in modalForm.attrs" :index="index" :name="value.name"
                     @change="changeValueName"
                     @add="addValue"
                     @remove="removeValue"
                     :key="index"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="warning" :loading="loading" @click="closeModal">取消</Button>
        <Button type="primary" :loading="loading" @click="addDefinition">确定</Button>
      </div>
    </Modal>
    <input type="hidden" :value="loadId"></input>
    <Card>
      <p slot="title">
        配置规格
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="商品分类" prop="categoryId">
          <CategoryList :value="form.categoryId" :parents="categories"
                        @change="setCategory"/>
        </FormItem>
        <FormItem label="商品类型" prop="groupId">
          <Select v-model="form.groupId" @on-change="loadDefinitions">
            <Option v-for="group in groups" :value="group.id" :key="group.id">{{ group.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="规格设置" prop="definition">
          <Button type="primary" @click="openModal" style="margin-bottom: 20px;">新增规格</Button>
          <Select placeholder="选择规格" v-model="form.definitions" multiple @on-change="changeDefinition">
            <Option v-for="definition in definitions" :value="definition.id" :key="definition.id">
              {{ definition.name }}
            </Option>
          </Select>
          <Table class="margin-top-bottom" :data="filterDefinitions" :columns="definitionColumns"/>
          <Table class="margin-top-bottom" :data="filterValues" :columns="valueColumns"
                 @on-select-all="selected"
                 @on-select="selected"
                 @on-select-all-cancel="selected"
                 @on-select-cancel="selected"/>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import API from '@/api/goods-item'
import { Message, Upload, Icon } from 'iview'
import config from '@/config/index'
import ValueLine from '@/view/goods/specification-definition/value-line'
import DefinitionAPI from '@/api/goods-specification-definition'
import { multiDecartesian } from '@/libs/util'
import GroupAPI from '@/api/goods-specification-group'
import CategoryAPI from '@/api/goods-category'
import CategoryList from '../components/parents-category'

export default {
  name: 'GoodsItemSpecEdit',
  components: {
    ValueLine,
    CategoryList
  },
  props: [
    'id'
  ],
  data () {
    const groupCheck = (rule, value, callback) => {
      if (!this.form.groupId) {
        callback(new Error('请先选择一个类型'))
      } else {
        callback()
      }
    }
    const orderCheck = (rule, value, callback) => {
      if (!this.modalForm.order) {
        callback(new Error('排序不能为空'))
      } else if (this.modalForm.order < 1) {
        callback(new Error('排序必须大于0'))
      } else {
        callback()
      }
    }
    const valuesCheck = (rule, value, callback) => {
      let values = []
      for (let i in this.modalForm.attrs) {
        let value = this.modalForm.attrs[i]
        if (value.name != '') {
          values.push(value)
        }
      }
      if (values.length == 0) {
        callback(new Error('至少需要编辑一个值属性'))
      } else {
        callback()
      }
    }
    return {
      addDefinitionModal: false,
      loading: false,
      definitions: [],
      selectedDefinitions: [],
      selectedValues: {},
      values: [],
      properties: [],
      groups: [],
      categories: [],
      data: {
        id: null,
        properties: []
      },
      selections: [],
      modalForm: {
        parent: {
          id: null
        },
        name: '',
        order: 1,
        attrs: []
      },
      form: {
        categoryId: null,
        groupId: null,
        definitions: []
      },
      rules: {
        groupId: [
          { required: false, validator: groupCheck, trigger: 'change' }
        ]
      },
      modalRules: {
        order: [
          { required: true, validator: orderCheck, trigger: 'change' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'change' },
          { max: 50, message: '名称不能多于50位', trigger: 'change' }
        ],
        values: [
          { required: true, validator: valuesCheck, trigger: 'change' }
        ]
      },
      definitionColumns: [
        { title: '规格', key: 'name', width: 200 },
        {
          title: '值',
          key: 'attrs',
          render: (h, params) => {
            let values = []
            for (let i in params.row.attrs) {
              let item = params.row.attrs[i]
              let isSelected = false
              out: for (let j in this.selectedValues) {
                let arr = this.selectedValues[j]
                if (arr && arr.length > 0 && arr[0].parent && arr[0].parent.id == params.row.id) {
                  for (let k in arr) {
                    if (arr[k].id == item.id) {
                      isSelected = true
                      break out
                    }
                  }
                }
              }
              let attributes = {
                props: {
                  color: 'primary',
                  checkable: true,
                  checked: isSelected
                },
                on: {
                  'on-change': (checked) => {
                    let row = params.row
                    let values = {}
                    for (let i in this.selectedValues) {
                      if (this.selectedValues[i] && this.selectedValues[i].length > 0) {
                        values[i] = this.selectedValues[i]
                      }
                    }
                    let attr = 'def_' + row.id
                    let arr = values[attr]
                    if (!arr) {
                      arr = []
                    }
                    if (checked) {
                      item.parent = {
                        id: row.id
                      }
                      arr.push(item)
                    } else {
                      let newArr = []
                      for (let i in arr) {
                        let currentItem = arr[i]
                        if (currentItem.id != item.id) {
                          newArr.push(currentItem)
                        }
                      }
                      arr = newArr
                    }
                    let properties = this.data.properties
                    for (let i in properties) {
                      let property = properties[i]
                      property.price = 0
                      property.inventory = 0
                      property.path = null
                    }
                    if (arr.length > 0) {
                      values[attr] = arr
                    } else {
                      values[attr] = null
                    }
                    this.selectedValues = values
                  }
                },
                style: {
                  border: '1px solid gray'
                }
              }
              values.push(h('Tag', attributes, item.name))
            }
            return h('div', values)
          }
        }
      ],
      valueColumns: [
        { type: 'selection', width: 60, align: 'center' },
        {
          title: '规格值组',
          key: 'values',
          render: (h, params) => {
            let values = []
            for (let i in params.row.values) {
              let value = params.row.values[i]
              let attributes = {
                props: {
                  color: 'primary'
                }
              }
              values.push(h('Tag', attributes, value.name))
            }
            return h('div', values)
          }
        },
        {
          title: '价格',
          key: 'price',
          render: (h, params) => {
            let attributes = {
              props: {
                min: 0,
                value: params.row.price
              },
              style: {
                width: '150px'
              },
              on: {
                'on-change': (value) => {
                  params.row.price = value
                  this.properties[params.index] = params.row
                }
              }
            }
            return h('InputNumber', attributes)
          }
        },
        {
          title: '库存',
          key: 'inventory',
          render: (h, params) => {
            let attributes = {
              props: {
                min: 0,
                value: params.row.inventory
              },
              style: {
                width: '150px'
              },
              on: {
                'on-change': (value) => {
                  params.row.inventory = value
                  this.properties[params.index] = params.row
                }
              }
            }
            return h('InputNumber', attributes)
          }
        }, {
          title: '缩略图',
          key: 'path',
          render: (h, params) => {
            return h(Upload, {
              props: {
                'show-upload-list': false,
                format: ['jpg', 'jpeg', 'png'],
                action: config.baseUrl + '/goods/item/file/upload/params/' + this.id,
                'on-success': (response) => {
                  params.row.path = response.data
                  this.properties[params.index] = params.row
                },
                'with-credentials': true
              },
              nativeOn: {
                setPreviewUrl (url, index) {
                  // this.form.thumbnail = url
                  // this.editCompleteCheck()
                }
              },
              scopedSlots: {
                default: () => {
                  if (!params.row.path) {
                    return h('div', {
                      style: {
                        cursor: 'pointer',
                        display: 'inline-block',
                        width: '58px',
                        border: '1px dashed',
                        margin: '10px 0',
                        'text-align': 'center',
                        'border-radius': '5px',
                        height: '58px',
                        'line-height': '58px'
                      }
                    }, '缩略图')
                  } else {
                    return h('img', {
                      attrs: {
                        src: config.baseUrl + '/goods/item/file/load?filePath=' + params.row.path
                      },
                      style: {
                        width: '58px',
                        height: '58px',
                        display: 'inline-block',
                        'vertical-align': 'middle',
                        margin: '10px 0',
                        'object-fit': 'cover'
                      }
                    })
                  }
                }
              }
            })
          }
        }
      ]
    }
  },
  computed: {
    loadId () {
      this.load()
      return this.id
    },
    filterDefinitions () {
      let ids = this.form.definitions
      let currentSelecteds = this.definitions.filter(item => {
        for (let j in ids) {
          let id = ids[j]
          if (item.id == id) {
            return true
          }
        }
        return false
      })
      let list = currentSelecteds.concat()
      for (let i in ids) {
        let id = ids[i]
        for (let j in this.selectedDefinitions) {
          let item = this.selectedDefinitions[j]
          if (id == item.id) {
            let found = false
            for (let k in list) {
              if (id == list[k].id) {
                found = true
                break
              }
            }
            if (!found) {
              list.push(item)
            }
            break
          }
        }
      }
      this.selectedDefinitions = list
      return this.selectedDefinitions
    },
    filterValues () {
      let list = []
      for (let i in this.selectedValues) {
        let item = this.selectedValues[i]
        if (item && item.length > 0) {
          list.push(item)
        }
      }
      list = multiDecartesian(list)
      let arr = []
      let selections = this.data.properties
      let selection
      list.forEach(listItem => {
        let flag = selections.some(s => {
          let flag = this.equalsAll(listItem, s.values, 'id')
          if (flag) {
            selection = s
          }
          return flag
        })
        if (flag) {
          selection = {
            id: selection.id,
            values: listItem,
            price: selection.price,
            inventory: selection.inventory,
            path: selection.path
          }
        } else {
          selection = {
            id: null,
            values: listItem,
            price: 0,
            inventory: 0,
            path: ''
          }
        }
        arr.push(selection)
      })
      // list.forEach(listItem => {
      //   let flag = listItem.every(item => {
      //     return selections.some(s => {
      //       let flag = s.values.some(value => {
      //         return value.name === item.name
      //       })
      //       if (flag) {
      //         selection = s
      //       }
      //       return flag
      //     })
      //   })
      //   if (flag) {
      //     selection = {
      //       id: selection.id,
      //       values: listItem,
      //       price: selection.price,
      //       inventory: selection.inventory,
      //       path: selection.path
      //     }
      //   } else {
      //     selection = {
      //       id: null,
      //       values: listItem,
      //       price: 0,
      //       inventory: 0,
      //       path: ''
      //     }
      //   }
      //   arr.push(selection)
      // })
      return arr
    }
  },
  methods: {
    equalsAll (arr1, arr2, key) {
      if (arr1.length !== arr2.length) {
        return false
      }
      let all = arr1.concat(arr2)
      let values = all.map(item => item[key])
      return [...new Set(values)].length === values.length / 2
    },
    loadAllCategories () {
      this.loading = true
      CategoryAPI.list({
        data: {},
        page: {
          num: 1,
          size: 999999999
        }
      }).then(data => {
        this.categories = []
        for (let i in data) {
          let item = data[i]
          item.value = item.id
          this.categories.push(item)
        }
        this.loading = false
      }).catch(ex => {
        this.loading = false
      })
    },
    setCategory (option) {
      this.form.categoryId = option
      this.loadGroups()
    },
    loadGroups () {
      this.loading = true
      GroupAPI.loadGroups(this.form.categoryId).then(data => {
        this.groups = data
        this.loading = false
      }).catch(ex => {
        this.loading = false
      })
    },
    load () {
      if (this.id) {
        this.loading = true
        API.load(this.id).then(data => {
          if (data.properties) {
            let selections = data.properties
            this.data.properties = data.properties
            if (selections && selections.length > 0) {
              let values = selections[0].values
              for (let i in values) {
                let value = values[i]
                this.form.definitions.push(value.parent.id)
              }
            }
          }
          this.loadAllDefinitions()
          this.loadAllCategories()
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      }
    },
    loadAllDefinitions () {
      if (this.id) {
        this.loading = true
        DefinitionAPI.list({
          data: {
            statusText: 'all'
          },
          page: {
            num: 1,
            size: 999999999
          }
        }).then(data => {
          let definitions = []
          for (let i in data.list) {
            let definition = data.list[i]
            for (let j in this.form.definitions) {
              let id = this.form.definitions[j]
              if (id == definition.id) {
                definitions.push(definition)
                break
              }
            }
          }

          let selections = this.data.properties
          let selectedValues = {}
          for (let k in selections) {
            let values = selections[k].values
            let matched = 0
            for (let l in values) {
              let value = values[l]
              out: for (let i in definitions) {
                let definition = definitions[i]
                for (let j in definition.attrs) {
                  let attr = definition.attrs[j]
                  if (attr.id == value.id) {
                    matched++
                    break out
                  }
                }
              }
            }
            if (matched == values.length) {
              for (let i in values) {
                let value = values[i]
                let arr = selectedValues['def_' + value.parent.id]
                if (!arr) {
                  arr = []
                  selectedValues['def_' + value.parent.id] = arr
                }
                let found = false
                for (let j in arr) {
                  let item = arr[j]
                  if (item.id == value.id) {
                    found = true
                    break
                  }
                }
                if (!found) {
                  arr.push(value)
                }
              }
            }
          }
          this.selectedValues = selectedValues
          this.definitions = definitions
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      }
    },
    selected (selections) {
      this.selections = selections
    },
    save () {
      this.data.id = this.id
      if (!this.data.id) {
        Message.warning('请先保存基本信息再编辑规格')
        this.$emit('goInfo')
        return
      }
      if (this.selections.length == 0) {
        Message.warning('请先选中再提交')
        return
      }
      for (let j in this.selections) {
        let selection = this.selections[j]
        let selectedValues = this.selections[j].values
        for (let i in this.properties) {
          let item = this.properties[i]
          let values = item.values
          let matched = 0
          for (let k in values) {
            let value = values[k]
            let selectedValue = selectedValues[k]
            if (value.id == selectedValue.id) {
              matched++
            }
          }
          if (matched == values.length) {
            selection.price = item.price
            selection.inventory = item.inventory
            selection.path = item.path
            break
          }
        }
      }
      this.data.properties = this.selections
      this.loading = true
      API.saveProperties(this.data).then(res => {
        this.loading = false
        Message.success('保存成功')
        this.goList()
      }).catch(ex => {
        this.loading = false
      })
    },
    goList () {
      this.$router.push({
        name: 'GoodsItemList'
      })
    },
    changeDefinition (ids) {
      let list = this.selectedValues
      let newList = {}
      for (let i in list) {
        let arr = list[i]
        let found = false
        for (let j in ids) {
          if (ids[j] == arr[0].parent.id) {
            found = true
            break
          }
        }
        if (found) {
          newList[i] = arr
        }
      }
      this.selectedValues = newList
    },
    loadDefinitions (groupId, newData) {
      if (groupId) {
        this.loading = true
        DefinitionAPI.loadDefinitions(groupId).then(data => {
          this.definitions = data
          if (newData) {
            this.form.definitions.push(newData.id)
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      }
    },
    changeValueName (index, name) {
      this.modalForm.attrs[index].name = name
    },
    removeValue (index) {
      this.modalForm.attrs.splice(index, 1)
      if (this.modalForm.attrs.length == 0) {
        this.addValue(-1)
      }
    },
    addValue (index) {
      this.modalForm.attrs.splice(index + 1, 0, {
        id: null,
        name: ''
      })
    },
    addDefinition () {
      this.$refs.modalForm.validate().then(valid => {
        if (valid) {
          this.loading = true
          DefinitionAPI.save(this.modalForm).then(data => {
            this.loading = false
            this.loadDefinitions(this.form.groupId, data)
            Message.success('保存成功')
            this.closeModal()
          }).catch(ex => {
            this.loading = false
          })
        }
      })
    },
    openModal () {
      if (!this.form.groupId) {
        this.$refs.form.validateField('groupId')
        return
      }
      this.$refs.modalForm.resetFields()
      this.modalForm.parent.id = this.form.groupId
      this.modalForm.attrs = []
      this.addValue(-1)
      this.addDefinitionModal = true
    },
    closeModal () {
      this.addDefinitionModal = false
    }
  }
}
</script>
<style scoped>
</style>
