<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}商品品牌
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="商品分类" prop="categoryId">
          <CategoryList :value="form.categoryId" :disableParent="true" :parents="categories" @change="setCategory" />
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="排序" prop="order">
          <InputNumber :min="1" v-model="form.order"></InputNumber>
        </FormItem>
        <FormItem label="logo" prop="logo">
          <Upload
            :uploadUrl="uploadUrl"
            :previewUri="form.logo"
            btnText="上传Logo"
            :imgPrefix="imgPrefix"
            @setPreviewUrl="setPreviewUrl"
          />
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/goods-brand'
  import {Message} from 'iview'
  import Upload from '@/components/upload/img-single-upload'
  import config from '@/config/index'
  import ApplicationAPI from '@/api/merchant-shop-application'
  import CategoryList from '../components/parents-category'
  import CategoryAPI from '@/api/goods-category'


  export default {
    name: 'GoodsBrandEdit',
    components: {
      Upload,
      CategoryList
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
      const categoryCheck = (rule, value, callback) => {
        if (!this.form.categoryId || this.form.categoryId == 0) {
          callback(new Error('分类不能为空'));
        } else {
          callback()
        }
      }
      return {
        categories: [],
        imgPrefix: config.baseUrl + '/goods/brand/file/load?filePath=',
        loading: false,
        form: {
          categoryId: null,
          id: null,
          order: null,
          name: '',
          logo: null
        },
        rules: {
          order: [
            {required: true, validator: orderCheck, trigger: 'change'},
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'change'},
            {max: 50, message: '名称不能多于50位', trigger: 'change'}
          ],
          logo: [
            {required: true, message: 'logo不能为空', trigger: 'change'},
          ],
          categoryId: [
            {required: true, validator: categoryCheck, trigger: 'change'},
          ]
        }
      }
    },
    methods: {
      loadAllCategories() {
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
      setCategory(categoryId) {
        this.form.categoryId = categoryId
      },
      loadApplication() {
        this.loading = true
        ApplicationAPI.load().then(res => {
          this.loading = false
          if (res && res.id) {
            switch (res.status.name) {
              case 'Passed': {
                this.load()
                this.loadAllCategories()
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
            type: '品牌',
            from: 'GoodsBrandEdit'
          }
        })
      },
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
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
          name: 'GoodsBrandList',
        })
      },
      setPreviewUrl(url, index) {
        this.form.logo = url
      },
    },
    computed: {
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
      isEdit() {
        return this.form.id != null && this.form.id != 0
      },
      uploadUrl() {
        return config.baseUrl + '/goods/brand/file/upload/params/' + (this.form.id ? this.form.id : 0)
      },
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      let isEdit = this.form.id != 0
      this.form.id = isEdit ? this.form.id : null;
      this.loadApplication()
    }
  }
</script>
