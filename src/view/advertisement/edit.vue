<style scoped lang="less">
</style>
<template>
  <div>
    <Card>
      <p slot="title">
        {{action}}广告位
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right"
                :loading="loading">保存
        </Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="位置" prop="type">
          <Select v-model="form.type">
            <Option v-for="(type,index) in typeList" :value="type.value" :key="index">{{ type.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"></Input>
        </FormItem>
        <FormItem label="排序" prop="orderNum">
          <InputNumber v-model="form.orderNum" :min="1" style="width: 300px;" :precision="0"></InputNumber>
        </FormItem>
        <FormItem label="链接" prop="link">
          <Input v-model="form.link"></Input>
        </FormItem>
        <FormItem label="开始时间" prop="startTime">
          <DatePicker @on-change="changeStartDate" type="datetime" format="yyyy-MM-dd HH:mm" :value="form.startTime"
                      placeholder="请选择时间" style="width: 300px"></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endTime">
          <DatePicker @on-change="changeEndDate" type="datetime" format="yyyy-MM-dd HH:mm" :value="form.endTime"
                      placeholder="请选择时间" style="width: 300px"></DatePicker>
        </FormItem>
        <FormItem label="图片" prop="path">
          <Upload
            :uploadUrl="uploadUrl"
            :previewUri="form.path"
            btnText="上传图片"
            :imgPrefix="imgPrefix"
            @setPreviewUrl="setPreviewUrl"
          />
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/advertisement'
  import {Message} from 'iview'
  import config from '@/config/index'
  import Upload from '@/components/upload/img-single-upload'

  export default {
    components: {
      Upload
    },
    data() {
      const numCheck = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(new Error('序号必须大于等于1'));
        } else {
          callback();
        }
      }
      return {
        typeList: [
          {
            value: 'HomeBanner',
            label: '首页轮播图'
          },
          {
            value: 'HomeRecommend',
            label: '首页推荐图'
          },
          {
            value: 'CategoryBanner',
            label: '分类页轮播图'
          },
          {
            value: 'CategoryBrand',
            label: '分类页品牌'
          }
        ],
        loading: false,
        uploaded: false,
        form: {
          id: null,
          name: null,
          type: null,
          link: null,
          orderNum: null,
          startTime: null,
          endTime: null,
          path: null,
        },
        rules: {
          type: [
            {required: true, message: '位置不能为空', trigger: 'change'}
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'change'},
            {max: 50, message: '名称不能多于50位', trigger: 'change'}
          ],
          orderNum: [
            {required: true, validator: numCheck, trigger: 'change'}
          ],
          startTime: [
            {required: true, message: '开始时间不能为空', trigger: 'change'}
          ],
          endTime: [
            {required: true, message: '结束时间不能为空', trigger: 'change'}
          ],
          path: [
            {required: true, message: '图片不能为空', trigger: 'change'}
          ],
        }
      }
    },
    methods: {
      changeStartDate(value) {
        this.form.startTime = value
      },
      changeEndDate(value) {
        this.form.endTime = value
      },
      setPreviewUrl(url) {
        this.uploaded = true
        this.form.path = url
      },
      load() {
        if (this.form.id > 0) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.form.type = data.type.name
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
            API.save({
              ...this.form,
              startTime: this.form.startTime + ':00',
              endTime: this.form.endTime + ':00',
            }).then(res => {
              Message.success('保存成功')
              this.goList()
              this.loading = false
            }).catch(e => {
              this.loading = false
            })
          }
        })
      },
      goList() {
        this.$router.push({
          name: 'AdvertisementSettingList'
        })
      },
    },
    computed: {
      imgPrefix() {
        return this.isEdit && !this.uploaded ? config.publicBucketDomain : config.baseUrl + '/advertisement/file/load?filePath='
      },
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
      isEdit() {
        return this.form.id > 0
      },
      uploadUrl() {
        return config.baseUrl + '/advertisement/file/upload/params/' + this.uploadId
      },
      uploadId() {
        return this.form.id ? this.form.id : 0
      },
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      this.form.id = this.form.id != 0 ? this.form.id : null;
      this.load()
    }
  }
</script>
