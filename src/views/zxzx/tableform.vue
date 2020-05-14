<template>
  <div class="mytableform" :key="dindex">
    <el-form ref="form" :model="subform" :rules="rules" label-width="120px" label-position="top">
      <el-form-item v-for="(v,index) in makeform.form" :key="index" :label="v.label" :prop="v.key">
        <el-input :disabled="mdisbled" v-if="v.type=='input'" v-model="subform[v.key]" :placeholder="v.placeholder" />
        <el-input :disabled="mdisbled" v-if="v.type=='textarea'" type="textarea" v-model="subform[v.key]" :placeholder="v.placeholder" />
        <el-select :disabled="mdisbled" v-if="v.type=='select'" v-model="subform[v.key]" placeholder="请选择">
          <el-option v-for="item in form['selectdata'+index]" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-switch :disabled="mdisbled" v-if="v.type=='switch'" v-model="subform[v.key]"></el-switch>
        <el-date-picker :disabled="mdisbled" v-if="v.type=='date-picker'" v-model="subform[v.key]" type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-time-picker :disabled="mdisbled" v-if="v.type=='time-picker'" v-model="subform[v.key]" placeholder="选择时间">
        </el-time-picker>
        <el-date-picker :disabled="mdisbled" v-if="v.type=='datetime-picker'" v-model="subform[v.key]" type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
        <el-upload :disabled="mdisbled" v-if="v.type=='upload'" :action="baseURL"
          :on-preview="handlePreview" :on-remove="(file, fileList)=>handleRemove(file, fileList,v.key)" multiple
          :before-upload="beforeAvatarUpload" :headers="myHeaders" :file-list="subform[v.key]" :on-success="(response, file, fileList)=>osuccess(response, file, fileList,v.key)">
          <el-button size="small" type="primary" :disabled="mdisbled">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">{{uploadtipps}}</div>
        </el-upload>
        <!-- <el-input style="display: block;" size="mini" :disabled="true" v-if="v.type=='upload'" v-model="subform[v.key]" :placeholder="v.placeholder" /> -->
        <div v-if="v.type=='table'">
          <el-button :disabled="mdisbled" @click="adddata(subform[v.key],index)">增加</el-button>
          <el-table :data="subform[v.key]" class="tb-edit" style="width: 100%" highlight-current-row>
            <el-table-column v-for="(vv,index2) in form['tabledata'+index]" :label="vv.thead" :prop="vv.tdname" :key="index2">
              <template scope="scope">
                <el-input :disabled="mdisbled" size="small" v-model="scope.row[vv.tdname]" placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-form ref="scope.row" :model="scope.row">
                  <el-form-item>
                    <el-button :disabled="mdisbled" size="small" type="danger" @click="handleDeleteUsertable(scope.$index, scope.row,subform[v.key])">删除</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span v-if="v.remarks!==''" style="line-height: 20px;margin-top: 2px;color: #999;display: block;">{{v.remarks}}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    uploadAvatar,
    returnUpUrl
  } from "@/api/system/file";
  import {
    getToken
  } from '@/utils/auth'
  export default {
    watch: {
      dosub(v) {
        this.submitForm()
      },
      makeform(v) {
        this.intform()
        this.$refs["form"].resetFields();
      }
    },
    props: {
      name: {
        type: String,
        default: ''
      },
      dosub: {
        type: Boolean,
        default: false
      },
      mdisbled: {
        type: Boolean,
        default: false
      },
      makeform: {
        required: true,
        type: Object,
        default: function() {
          return {}
        }
      },
      tianform: {
        required: true,
        type: Object,
        default: function() {
          return {}
        }
      },
    },
    data() {
      return {
        dindex: 0,
        myHeaders: {
          Authorization: 'Bearer ' + getToken()
        },
        uploadtipps: "请上传 doc、docx、pdf、xls、xlsx、7z、rar、zip格式，且大小不超过50M",
        baseURL: process.env.VUE_APP_BASE_API+'/system/file/upload',
        form: {},
        rules: {},
        subform: {},
        tablefields: []
      }
    },
    created() {
      this.intform()
    },
    mounted() {
    },
    updated() {
    },
    methods: {
      osuccess(response, file, fileList, key) {
        this.subform['' + key + ''] = fileList
          ++this.dindex
        console.log(this.subform['' + key + ''])
      },
      // 上传图片方法
      uploadImage(param) {
        const formData = new FormData()
        formData.append('file', param.file)
        uploadAvatar(formData).then(response => {
          this.form.picUrl = process.env.VUE_APP_BASE_API + response.imgUrl
          // console.log(process.env.VUE_APP_BASE_API + response.imgUrl)
        }).catch(response => {
          // console.log('图片上传失败')
        })
      },
      intform() {
        this.form = {}
        this.rules = {}
        this.subform = {}
        this.tablefields = []
        if (this.makeform.fromkey !== '') {
          var fromkey = this.makeform.fromkey
          for (var i = 0; i < fromkey.length; i++) {
            this.subform[fromkey[i]]
          }
        }
        // console.log(this.subform)
        if (this.makeform.form !== '') {
          var formdata = JSON.parse(JSON.stringify(this.makeform.form))
          var form = {}
          var rules = {}
          for (var i = 0; i < formdata.length; i++) {
            // form['all']=formdata
            // form[formdata[i].key] = formdata[i].value
            rules[formdata[i].key] = []
            if (formdata[i].required == true) {
              rules[formdata[i].key].push({
                required: true,
                message: "此项必填项",
                trigger: ["blur", "change"]
              })
            }
            if (formdata[i].rule !== '') {
              if (formdata[i].rule == 'phone') { //验证手机
                rules[formdata[i].key].push({
                  pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                  message: "请输入11位正确的手机号码",
                  trigger: ["blur", "change"]
                })
              }
              if (formdata[i].rule == 'int') { //验证整数数字
                rules[formdata[i].key].push({
                  pattern: /^\+?[1-9][0-9]*$/,
                  message: "请输入数字整数",
                  trigger: ["blur", "change"]
                })
              }
              if (formdata[i].rule == 'han') { //验证汉字
                rules[formdata[i].key].push({
                  pattern: /^[\u4e00-\u9fa5]+$/,
                  message: "请输入汉字",
                  trigger: ["blur", "change"]
                })
              }
              if (formdata[i].rule == 'str') { //验证只能输入字母
                rules[formdata[i].key].push({
                  pattern: /^[a-zA-Z]+$/,
                  message: "只能输入字母",
                  trigger: ["blur", "change"]
                })
              }
              if (formdata[i].rule == 'intstr') { //验证只能输入字母数字
                rules[formdata[i].key].push({
                  pattern: /^[0-9a-zA-Z]*$/g,
                  message: "只能输入数字或字母",
                  trigger: ["blur", "change"]
                })
              }
              if (formdata[i].rule == 'idcard') { //验证身份证
                rules[formdata[i].key].push({
                  pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                  message: "请输入正确的身份证号",
                  trigger: ["blur", "change"]
                })
              }
              if (formdata[i].rule == 'email') { //验证邮箱
                rules[formdata[i].key].push({
                  pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                  message: "请输入正确的邮箱",
                  trigger: ["blur", "change"]
                })
              }
              if (formdata[i].rule == 'url') { //验证网址
                rules[formdata[i].key].push({
                  pattern: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/|www\.)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/,
                  message: "请输入正确的网址",
                  trigger: ["blur", "change"]
                })
              }
            }
            if (formdata[i].type == 'select') {
              var selectdata = formdata[i].selectdata.split(',');
              var res_selectdata = []
              for (var k = 0; k < selectdata.length; k++) {
                var d1 = selectdata[k].split('_')
                res_selectdata.push({
                  label: d1[0].toString(),
                  value: d1[1].toString()
                })
              }
              form['selectdata' + i] = res_selectdata
            }
            if (formdata[i].type == 'table') { //循环table
              var tabledata = formdata[i].tabledata.split(',');
              var res_tabledata = []
              var tablefiledid = []
              for (var k = 0; k < tabledata.length; k++) {
                var d1 = tabledata[k].split('_')
                res_tabledata.push({
                  thead: d1[0].toString(),
                  tdname: d1[1].toString()
                })
                tablefiledid.push(d1[1].toString())
              }
              form['tabledata' + i] = res_tabledata
              var tablefield = {}
              if (tablefiledid) {
                for (var kk = 0; kk < tablefiledid.length; kk++) {
                  tablefield[tablefiledid[kk]] = ''
                }
              }
              this.subform[formdata[i].key] = []
              this.subform[formdata[i].key].push(tablefield)
              this.tablefields.push(tablefield)

            }
            if (formdata[i].type == 'upload') { //循环table
              this.subform[formdata[i].key] = []
            }
          }
          this.form = form
          this.rules = rules
        }
        if (JSON.stringify(this.tianform) !== '{}') {
          this.subform = this.tianform
        }
        // console.log(this.subform)
      },
      handleDeleteUsertable(lindex, row, e) {
        e.splice(lindex, 1);
      },
      adddata(e, index) {
        e.push({})
        // e.push(this.tablefields[index])
      },
      beforeAvatarUpload(file) {
        var typelist = ['doc','docx','pdf','xls','xlsx','7z','rar','zip'];
        var fileName=file.name.substring(file.name.lastIndexOf('.')+1);
        console.log(fileName)
        function istype(arr) {
          for (var i = 0; i < arr.length; i++) {
            if (fileName == arr[i]) {
              return true
            }
          }
          return false
        }
        const fileSize = file.size / 1024 / 1024 < 50;
        if (!istype(typelist)) {
          this.$message.error('请检查上传文件格式!');
        }
        if (!fileSize) {
          this.$message.error('文件大小不能超过 50M!');
        }
        return istype(typelist) && fileSize;
      },
      handleRemove(file, fileList, key) { //移除
        this.subform['' + key + ''] = fileList
        console.log(file, fileList);
      },
      handlePreview(file) {//查看
         console.log(file)
         this.downloadByPath("/zzgl-prod-api"+file.response.imgUrl,file.name);
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.$emit('input', this.subform)
          } else {
            this.$emit('input', '失败')
            this.$notify.closeAll()
            this.$notify({
              title: '保存失败',
              message: '选项卡“' + this.name + '” 中有必填项未填写',
              type: 'warning'
            });
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .mytableform {
    background: #fff;
    padding: 0 20px;
  }
</style>
