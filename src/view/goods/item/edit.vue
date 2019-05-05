<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}商品
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="上下架" prop="enabled">
          <Select v-model="form.enabled">
            <Option v-for="status in statusList" :value="status.value" :key="status.value">{{ status.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="货号" prop="code">
          <Input v-model="form.code"></Input>
        </FormItem>
        <FormItem label="商品分类" prop="categoryId">
          <CategoryList :value="form.categoryId" :parents="categories"
                        @change="setCategory"/>
        </FormItem>
        <FormItem label="商品品牌" prop="brandId">
          <Select v-model="form.brandId">
            <Option v-for="brand in brands" :value="brand.id" :key="brand.id">{{ brand.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="市场售价" prop="marketPrice">
          <Input v-model="form.marketPrice"></Input>
        </FormItem>
        <FormItem label="商品卖点" prop="sellingPoints">
          <Input v-model="form.sellingPoints" type="textarea" :autosize="{minRows: 2, maxRows: 5}"></Input>
        </FormItem>
        <FormItem label="缩略图" prop="thumbnail">
          <Upload
            :uploadUrl="uploadUrl"
            :previewUri="form.thumbnail"
            btnText="上传缩略图"
            :imgPrefix="imgPrefix"
            @setPreviewUrl="setThumbPreviewUrl"
          />
        </FormItem>
        <FormItem label="照片" prop="photos">
          <MultiUpload v-for="item in photos"
                       :index="item.index"
                       :uploadUrl="uploadUrl"
                       :previewUri="form.photos[item.index]"
                       :btnText="('上传照片' + (item.index + 1))"
                       :imgPrefix="imgPrefix"
                       width="180"
                       height="180"
                       btnWidth="140px"
                       :removeable="true"
                       @remove="removePhoto"
                       @setPreviewUrl="setPhotoPreviewUrl"
          />
          <div class="clearfix"></div>
        </FormItem>
        <FormItem label="商品描述" prop="content">
          <editor ref="editor" :value="form.content" @on-change="setContent"/>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/goods-item'
  import CategoryAPI from '@/api/goods-category'
  import BrandAPI from '@/api/goods-brand'
  import {Message} from 'iview'
  import Upload from '@/components/upload/img-single-upload'
  import MultiUpload from '@/components/upload/img-multi-upload'
  import config from '@/config/index'
  import Editor from '_c/editor'
  import CategoryList from '../components/parents-category'
  import ApplicationAPI from '@/api/merchant-shop-application'


  export default {
    name: 'GoodsItemEdit',
    components: {
      Upload,
      MultiUpload,
      Editor,
      CategoryList
    },
    data() {
      const photoCheck = (rule, value, callback) => {
        if (this.form.photos.length == 0) {
          callback(new Error('至少需要一张照片'));
        } else {
          callback();
        }
      }
      const categoryCheck = (rule, value, callback) => {
        if (!this.form.categoryId) {
          callback(new Error('分类不能为空'));
        } else {
          callback();
        }
      }
      const brandCheck = (rule, value, callback) => {
        if (!this.form.brandId) {
          callback(new Error('品牌不能为空'));
        } else {
          callback();
        }
      }
      const marketPriceCheck = (rule, value, callback) => {
        if (isNaN(this.form.marketPrice)) {
          callback(new Error('市场售价必须是数字'));
        } else {
          callback();
        }
      }
      return {
        imgPrefix: config.baseUrl + '/goods/item/file/load?filePath=',
        statusList: [
          {
            value: 'true',
            label: '上架'
          },
          {
            value: 'false',
            label: '下架'
          }
        ],
        categories: [],
        brands: [],
        photos: [],
        loading: false,
        form: {
          id: null,
          name: '',
          categoryId: null,
          brandId: '',
          enabled: 'false',
          sellingPoints: null,
          content: null,
          thumbnail: null,
          photos: []
        },
        rules: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'change'},
            {max: 50, message: '名称不能多于50位', trigger: 'change'}
          ],
          code: [
            {max: 50, message: '货号不能多于50位', trigger: 'change'}
          ],
          sellingPoints: [
            {max: 100, message: '卖点不能多于100位', trigger: 'change'}
          ],
          categoryId: [
            {required: true, validator: categoryCheck, trigger: 'change'},
          ],
          brandId: [
            {required: true, validator: brandCheck, trigger: 'change'},
          ],
          enabled: [
            {required: true, message: '上下架状态不能为空', trigger: 'change'},
          ],
          marketPrice: [
            {required: true, validator: marketPriceCheck, trigger: 'change'},
          ],
          content: [
            {required: true, message: '描述不能为空', trigger: 'change'},
          ],
          thumbnail: [
            {required: true, message: '缩略图不能为空', trigger: 'change'},
          ],
          photos: [
            {required: true, validator: photoCheck, trigger: 'change'},
          ],
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
                this.loadAllCategories()
                this.loadAllBrands()
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
            type: '信息',
            from: 'GoodsItemEdit'
          }
        })
      },
      setCategory(option) {
        this.form.categoryId = option
      },
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
      setContent(html, text) {
        this.form.content = html
      },
      loadAllBrands() {
        this.loading = true
        BrandAPI.loadAllBrands().then(data => {
          this.brands = data
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
            this.form.enabled = data.enabled ? 'true' : 'false'
            this.$refs.editor.setHtml(data.content)
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
            let data = {...this.form, enabled: this.form.enabled == 'true'}
            API.save(data).then(res => {
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
          name: 'GoodsItemList',
        })
      },
      setThumbPreviewUrl(url, index) {
        this.form.thumbnail = url
      },
      setPhotoPreviewUrl(url, index) {
        this.form.photos[index] = url
        this.addPhoto(index + 1)
      },
      addPhoto(index) {
        if (this.photos[index]) {
          let nextIndex = this.photos.length
          this.photos.push({
            index: nextIndex,
          })
          this.photos.splice(nextIndex, 1)
          return
        }
        if (index >= 10) {
          let nextIndex = this.photos.length
          this.photos.push({
            index: nextIndex,
          })
          this.photos.splice(nextIndex, 1)
          return
        }
        this.photos.push({
          index,
        })
      },
      removePhoto(index) {
        if (this.photos.length > 1) {
          this.form.photos.splice(index, 1)
          this.photos.splice(index, 1)
          this.photos[index].index = index
        } else {
          this.form.photos[0] = null
          this.photos.splice(0, 1)
          this.addPhoto(0)
        }
      }
    },
    computed: {
      uploadUrl() {
        return config.baseUrl + '/goods/item/file/upload/params/' + this.uploadId
      },
      uploadId() {
        return this.form.id ? this.form.id : 0
      },
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
      isEdit() {
        return this.form.id != null && this.form.id != 0
      },
      imgPreviewUrl() {
        return config.baseUrl + '/goods/item/file/load/params/' + this.uploadId + '?filePath='
      }
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      let isEdit = this.form.id != 0
      this.form.id = isEdit ? this.form.id : null;
      this.addPhoto(0)
      this.$refs.editor.setHtml('')
      this.loadApplication()
    }
  }
</script>
