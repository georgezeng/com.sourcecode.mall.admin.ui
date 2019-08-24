<template>
  <Card>
    <p slot="title">
      {{ action }}现金券
    </p>
    <div slot="extra">
      <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
      <Button @click="goList" type="success">返回</Button>
    </div>
    <Form ref="form" :model="form" :rules="rules" :label-width="100">
      <FormItem label="券名称" prop="name">
        <Input v-model="form.name"></Input>
      </FormItem>
      <FormItem label="券标题" prop="title">
        <Input v-model="form.title"></Input>
      </FormItem>
      <FormItem label="面额" prop="amount">
        <InputNumber :min="0" v-model="form.amount" style="width: 300px;" :precision="0"></InputNumber>
      </FormItem>
      <FormItem label="生效时间" prop="startDate">
        <DatePicker type="date" placeholder="选择日期" v-model="form.startDate"></DatePicker>
      </FormItem>
      <FormItem label="过期时间" prop="endDate">
        <RadioGroup v-model="isEndDateLimited">
          <Radio label="false">不限期</Radio>
          <Radio label="true">限期</Radio>
        </RadioGroup>
        <DatePicker v-if="isEndDateLimited == 'true'" type="date" placeholder="选择日期"
                    v-model="form.endDate"></DatePicker>
      </FormItem>
      <FormItem label="发放数量" prop="totalNums">
        <RadioGroup v-model="isTotalLimited">
          <Radio label="false">不限量</Radio>
          <Radio label="true">限量</Radio>
        </RadioGroup>
        <InputNumber v-if="isTotalLimited == 'true'" :min="0" :precision="0" v-model="form.totalNums"
                     style="width: 300px;"></InputNumber>
      </FormItem>
      <FormItem label="图片" prop="imgPath">
        <Upload
          :uploadUrl="uploadUrl"
          :previewUri="form.imgPath"
          btnText="上传图片"
          :imgPrefix="imgPrefix"
          @setPreviewUrl="setPreviewUrl"
        />
      </FormItem>
      <FormItem label="使用说明" prop="description">
        <Input v-model="form.description" type="textarea" :autosize="{minRows: 2, maxRows: 5}"></Input>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
  import API from '@/api/coupon'
  import {Message} from 'iview'
  import Upload from '@/components/upload/img-single-upload'
  import config from '@/config/index'


  export default {
    components: {
      Upload,
    },
    data() {
      const amountCheck = (rule, value, callback) => {
        if (!this.form.amount) {
          callback(new Error('面额必须大于0'));
        } else {
          callback();
        }
      }
      const startDateCheck = (rule, value, callback) => {
        if (!this.form.startDate) {
          callback(new Error('生效时间不能为空'));
        } else {
          callback();
        }
      }
      return {
        uploaded: false,
        loading: false,
        form: {
          id: null,
          name: '',
          amount: null,
          startDate: null,
          endDate: null,
          totalNums: 0,
          imgPath: null,
          description: null
        },
        rules: {
          name: [
            {required: true, message: '券名称不能为空', trigger: 'change'},
            {max: 50, message: '券名称不能多于50位', trigger: 'change'}
          ],
          title: [
            {required: true, message: '券标题不能为空', trigger: 'change'},
            {max: 14, message: '券标题不能多于14位', trigger: 'change'}
          ],
          amount: [
            {required: true, validator: amountCheck, trigger: 'change'},
          ],
          startDate: [
            {required: true, validator: startDateCheck, trigger: 'change'},
          ],
          totalNums: [
            {required: true},
          ],
          imgPath: [
            {required: true, message: '图片不能为空', trigger: 'change'},
          ],
        }
      }
    },
    methods: {
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            let data = {...this.form}
            data.status = null
            data.eventType = null
            data.hxType = null
            data.type = 'Cash'
            data.consumeSetting = null
            data.inviteSetting = null
            API.saveBaseInfo(data).then(id => {
              this.loading = false
              Message.success('保存成功')
              this.$emit('saveSuccess', {id, to: 'zs'})
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
      goList() {
        this.$router.push({
          name: 'CashCouponSettingList',
        })
      },
      load() {
        if (this.form.id > 0) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.loading = false
          }).catch(e => {
            this.loading = false
          })
        }
      },
      setPreviewUrl(url, index) {
        this.uploaded = true
        this.form.imgPath = url
      },
    },
    computed: {
      imgPrefix() {
        return this.isEdit && !this.uploaded ? config.publicBucketDomain : config.baseUrl + '/coupon/setting/file/load?filePath='
      },
      isEndDateLimited: {
        get: function () {
          return (this.form.endDate != null) + ''
        },
        set: function (value) {
          if (value == 'true') {
            this.form.endDate = ''
          } else {
            this.form.endDate = null
          }
        }
      },
      isTotalLimited: {
        get: function () {
          return (this.form.totalNums > 0) + ''
        },
        set: function (value) {
          if (value == 'true') {
            this.form.totalNums = 1
          } else {
            this.form.totalNums = 0
          }
        }
      },
      uploadUrl() {
        return config.baseUrl + '/coupon/setting/file/upload/params/' + this.uploadId
      },
      uploadId() {
        return this.form.id ? this.form.id : 0
      },
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
      isEdit() {
        return this.form.id != null && this.form.id > 0
      },
    },
    created: function () {
      this.form.id = this.$router.currentRoute.params.id
      let isEdit = this.form.id > 0
      this.form.id = isEdit ? this.form.id : null;
    },
    mounted() {
      this.load()
    }
  }
</script>
