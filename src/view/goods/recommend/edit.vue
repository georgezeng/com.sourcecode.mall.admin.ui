<template>
  <div>
    <Card>
      <p slot="title">
        {{ title }}
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="商品分类" prop="categoryId">
          <Input :value="category" disabled></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="链接" prop="link">
          <Input v-model="form.link"></Input>
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
import API from '@/api/goods-recommend'
import { Message } from 'iview'
import Upload from '@/components/upload/img-single-upload'
import config from '@/config/index'
import CategoryAPI from '@/api/goods-category'

export default {
  name: 'GoodsRecommendAdd',
  components: {
    Upload
  },
  data () {
    const orderCheck = (rule, value, callback) => {
      if (!this.form.order) {
        callback(new Error('排序不能为空'))
      } else if (this.form.order < 1) {
        callback(new Error('排序必须大于0'))
      } else {
        callback()
      }
    }
    return {
      categories: [],
      imgPrefix: config.baseUrl + '/goods/category/recommend/file/load?filePath=',
      loading: false,
      form: {
        categoryId: null,
        id: null,
        order: null,
        name: '',
        logo: null,
        link: null
      },
      rules: {
        order: [
          { required: true, validator: orderCheck, trigger: 'change' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'change' },
          { max: 50, message: '名称不能多于50位', trigger: 'change' }
        ],
        link: [
          { required: true, message: '链接不能为空', trigger: 'change' }
        ],
        logo: [
          { required: true, message: 'logo不能为空', trigger: 'change' }
        ]
      },
      title: '',
      category: ''
    }
  },
  methods: {
    goNoPermit () {
      this.$store.commit('closeTag', this.$router.currentRoute)
      this.$router.push({
        name: 'GoodsNoPermit',
        params: {
          type: '品牌',
          from: 'GoodsBrandEdit'
        }
      })
    },
    save () {
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
    goList () {
      this.$router.replace({
        name: 'GoodsRecommendList',
        params: { id: this.$route.query.recommendId }
      })
    },
    setPreviewUrl (url, index) {
      this.form.logo = url
    }
  },
  computed: {
    uploadUrl () {
      return config.baseUrl + '/goods/category/recommend/file/upload/params/' + (this.form.id ? this.form.id : 0)
    }
  },
  mounted: async function () {
    const { name, meta: { title }, params: { id }, query: { recommendId } } = this.$route
    if (name === 'GoodsRecommendEdit') {
      const res = await API.load(id)
      this.form = res
    } else {
    }
    const { name: category } = await CategoryAPI.load(recommendId)
    this.category = category
    this.form.categoryId = recommendId
    this.title = title
  }
}
</script>
