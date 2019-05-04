<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}商品分类
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="上级分类" prop="parentId">
          <ParentList :parents="parents" :disabled="isEdit" :value="form.parentId" :noneValue="true" @change="setParent"/>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="图标" prop="icon">
          <Upload
            :uploadUrl="uploadUrl"
            :previewUri="form.icon"
            btnText="上传图标"
            :imgPrefix="imgPrefix"
            :uploadPlaceholder="uploadPlaceholder"
            width="32"
            height="32"
            @setPreviewUrl="setPreviewUrl"
          />
          <div class="clearfix"></div>
        </FormItem>
        <FormItem label="排序" prop="order">
          <InputNumber :min="1" v-model="form.order"></InputNumber>
        </FormItem>
        <FormItem label="规格列表" prop="groups" v-if="this.form.id && this.form.level == 3">
          <Button type="primary" @click="goSubList">查看类型</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/goods-category'
  import ParentList from '../components/parents-category'
  import Upload from '@/components/upload/img-one-line-upload'
  import {Message} from 'iview'
  import ApplicationAPI from '@/api/merchant-shop-application'
  import uploadPlaceholder from '@/assets/images/upload-placeholder.png'
  import config from '@/config/index'

  export default {
    name: 'GoodsCategoryEdit',
    components: {
      ParentList,
      Upload
    },
    data() {
      const orderCheck = (rule, value, callback) => {
        if (!this.form.order) {
          callback(new Error('排序不能为空'));
        } else if (this.form.order < 1) {
          callback(new Error('排序必须大于0'));
        } else {
          callback()
        }
      }
      return {
        uploadPlaceholder,
        imgPrefix: config.baseUrl + '/goods/category/file/load?filePath=',
        loading: false,
        parents: [],
        form: {
          id: null,
          level: null,
          parentId: '',
          order: null,
          parent: null,
          name: '',
          icon: null
        },
        rules: {
          order: [
            {required: true, validator: orderCheck, trigger: 'change'},
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'change'},
            {max: 50, message: '名称不能多于50位', trigger: 'change'}
          ],
          parentId: [
            {required: true, message: '上级分类不能为空', trigger: 'change'},
          ],
          icon: [
            {required: true, message: '图标不能为空', trigger: 'change'},
          ]
        }
      }
    },
    methods: {
      loadApplication() {
        this.loading = true
        ApplicationAPI.load().then(res => {
          this.loading = false
          if (res && res.id) {
            switch (res.status.name) {
              case 'Passed': {
                this.load()
                this.loadAllParents()
                return
              }
            }
          }
          this.goNoPermit()
        })
      },
      goNoPermit() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'GoodsNoPermit',
          params: {
            type: '分类',
            from: 'GoodsCategoryEdit'
          }
        })
      },
      setParent(option) {
        this.form.parentId = option
      },
      goSubList() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'GoodsSpecificationGroupList',
          params: {
            ids: this.form.id
          }
        })
      },
      loadAllParents() {
        this.loading = true
        API.loadAllParents().then(data => {
          this.parents = []
          for (let i in data) {
            let item = data[i]
            item.value = item.id + ',' + item.level
            this.parents.push(item)
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.form.parentId = data.parent ? data.parent.id + ',' + data.parent.level : '0,0'
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            let arr = this.form.parentId.split(',')
            this.form.level = parseInt(arr[1]) + 1
            if (arr[0] != '0') {
              this.form.parent = {
                id: parseInt(arr[0])
              }
            }
            API.save(this.form).then(res => {
              this.loading = false
              Message.success('保存成功')
              this.goList()
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
      goList() {
        this.$router.push({
          name: 'GoodsCategoryList',
        })
      },
      setPreviewUrl(url) {
        this.form.icon = url
      }
    },
    computed: {
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
      isEdit() {
        return this.form.id != null && this.form.id != 0
      },
      uploadUrl() {
        return config.baseUrl + '/goods/category/file/upload/params/' + (this.form.id ? this.form.id : 0)
      }
    },
    mounted: function () {
      let id = this.$router.currentRoute.params.id
      this.form.id = this.$router.currentRoute.params.id
      let isEdit = this.form.id != 0
      this.form.id = isEdit ? this.form.id : null;
      this.loadApplication()
    }
  }
</script>
