<style scoped lang="less">
</style>
<template>
  <div>
    <Card>
      <p slot="title">
        {{action}}文章分类
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right"
                :loading="loading">保存
        </Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form :model="form" ref="form" :rules="rules" :label-width="100">
        <FormItem label="文章分类" prop="categoryId">
          <Select v-model="form.categoryId" @on-change="changeCategory">
            <Option v-for="category in categoryList" :value="category.id" :key="category.id">{{ category.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="标题" prop="title">
          <Input v-model="form.title"></Input>
        </FormItem>
        <FormItem label="是否隐藏标题2" prop="hidden">
          <Select v-model="form.hidden">
            <Option v-for="value in hiddenValues" :value="value.name" :key="value.name">{{ value.text }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="排序" prop="orderNum">
          <InputNumber v-model="form.orderNum" :min="1" style="width: 300px;" :precision="0"></InputNumber>
        </FormItem>
        <FormItem label="图片" prop="imgPath">
          <Upload
            :uploadUrl="uploadUrl"
            :previewUri="form.imgPath"
            btnText="上传图片"
            :imgPrefix="imgPrefix"
            @setPreviewUrl="setImgPreviewUrl"
          />
        </FormItem>
        <FormItem label="视频" prop="vedioPath">
          <Vedio
            :uploadUrl="uploadUrl"
            :previewUri="form.vedioPath"
            btnText="上传视频"
            :vedioPrefix="vedioPrefix"
            @setPreviewUrl="setVedioPreviewUrl"
          />
        </FormItem>
        <FormItem label="内容" prop="content">
          <editor ref="editor" :uploadUrl="editorUploadUrl"
                  :value="form.content" @on-change="setContent"/>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/article'
  import {Message} from 'iview'
  import config from '@/config/index'
  import Upload from '@/components/upload/img-single-upload'
  import Vedio from '@/components/upload/vedio-single-upload'
  import Editor from '_c/editor'

  export default {
    name: 'ClientUserEdit',
    components: {
      Upload,
      Vedio,
      Editor
    },
    data() {
      const categoryCheck = (rule, value, callback) => {
        if (!this.form.categoryId) {
          callback(new Error('文章分类不能为空'));
        } else {
          callback();
        }
      }
      const numCheck = (rule, value, callback) => {
        if (!this.form.orderNum || isNaN(this.form.orderNum)) {
          callback(new Error('排序必须大于1'));
        } else {
          callback();
        }
      }
      return {
        imgUploaded: false,
        vedioUploaded: false,
        loading: false,
        hiddenValues: [
          {
            name: 'true',
            text: '是'
          },
          {
            name: 'false',
            text: '否'
          }
        ],
        categoryList: [],
        form: {
          id: null,
          categoryId: null,
          title: null,
          orderNum: null,
          imgPath: null,
          vedioPath: null,
          content: null
        },
        rules: {
          categoryId: [
            {required: true, validator: categoryCheck, trigger: 'change'}
          ],
          title: [
            {required: true, message: '标题不能为空', trigger: 'change'},
            {max: 50, message: '标题不能大于50字', trigger: 'change'}
          ],
          hidden: [
            {required: true, message: '是否隐藏标题不能为空', trigger: 'change'},
          ],
          orderNum: [
            {required: true, validator: numCheck, trigger: 'change'},
          ],
          content: [
            {required: true, message: '内容不能为空', trigger: 'change'},
          ]
        }
      }
    },
    methods: {
      changeCategory(id) {
        this.form.categoryId = id
      },
      setContent(html, text) {
        this.form.content = html
      },
      setVedioPreviewUrl(url) {
        this.vedioUploaded = true
        this.form.vedioPath = url
      },
      setImgPreviewUrl(url) {
        this.imgUploaded = true
        this.form.imgPath = url
      },
      load() {
        this.loading = true
        API.listCategory().then(list => {
          this.categoryList = list
          if (this.form.id > 0) {
            API.load(this.form.id).then(data => {
              this.form = data
              this.form.type = data.type.name
              this.form.hidden = data.hidden + ""
              this.$refs.editor.setHtml(data.content)
              this.loading = false
            }).catch(ex => {
              this.loading = false
            })
          } else {
            this.loading = false
          }
        }).catch(ex => {
          this.loading = false
        })
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.save({
              ...this.form,
              hidden: this.form.hidden == 'true'
            }).then(res => {
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
          name: 'ArticleList'
        })
      },
    },
    computed: {
      imgPrefix() {
        return this.imgUploaded ? config.baseUrl + '/article/file/load?filePath=' : config.publicBucketDomain
      },
      vedioPrefix() {
        return this.vedioUploaded ? config.baseUrl + '/article/file/load?filePath=' : config.publicBucketDomain
      },
      uploadUrl() {
        return config.baseUrl + '/article/file/upload/params/' + this.uploadId
      },
      uploadId() {
        return this.form.id > 0 ? this.form.id : 0
      },
      editorUploadUrl() {
        return config.baseUrl + '/article/content/image/upload/params/' + this.uploadId
      },
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
      isEdit() {
        return this.form.id != null && this.form.id != 0
      },
    },
    created: function () {
      this.form.id = this.$router.currentRoute.params.id
      this.form.id = this.form.id > 0 ? this.form.id : null;
      this.load()
    }
  }
</script>
