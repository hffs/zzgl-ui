<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" class="mmform" :inline="device!=='mobile'" label-width="68px">
      <el-form-item label="资质名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入资质名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="资质类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择资质类型" clearable size="small">
          <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button
            type="success"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['zz:pers:cert:add']"
          >新增</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="zizhilist">
      <ul>
        <li v-for="(v,index) in certList" :key="index">
          <el-image :src="v.picUrl" fit="cover"></el-image>
          <div class="hoverbox">
             <h2>{{v.name}}</h2>
             <div class="edittool">
               <ul>
                 <li @click="addOrUpdateHandle(v.id)">
                   <img class="hoverimg1" src="../../../assets/image/zz01.png" alt="">
                   <img class="hoverimg2" src="../../../assets/image/zz01on.png" alt="">
                   <p>文件</p>
                 </li>
                 <li @click="handleUpdate(v)">
                   <img class="hoverimg1" src="../../../assets/image/zz02.png" alt="">
                   <img class="hoverimg2" src="../../../assets/image/zz02on.png" alt="">
                   <p>修改</p>
                 </li>
                 <li @click="handleDelete(v)">
                   <img class="hoverimg1" src="../../../assets/image/zz03.png" alt="">
                   <img class="hoverimg2" src="../../../assets/image/zz03on.png" alt="">
                   <p>删除</p>
                 </li>
               </ul>
             </div>
          </div>
        </li>
      </ul>
    </div>

    <pagination layout="total,prev, pager, next" v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改企业资质对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="资质名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入资质名称" />
        </el-form-item>
        <el-form-item label="资质类型">
          <el-select v-model="form.type" placeholder="请选择资质类型">
            <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资质有效期" prop="startEndDate">
          <el-date-picker v-model="form.startEndDate" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核频次" prop="verifyFreq">
          <el-input v-model="form.verifyFreq" placeholder="资质审核周期">
            <template slot="append">月</template>
          </el-input>
        </el-form-item>

        <el-form-item label="提前提醒月数" prop="remindMonth">
          <el-input v-model="form.remindMonth" placeholder="审核前几个月进行自动提醒">
            <template slot="append">月</template>
          </el-input>
        </el-form-item>
        <el-form-item label="资质介绍" prop="introduce">
          <el-input v-model="form.introduce" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="资质照片" prop="picUrl">
          <el-upload class="avatar-uploader" action="string" :show-file-list="false" :http-request="uploadImage"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.picUrl" :src="form.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="附件" prop="files">
          <el-upload class="upload-demo" drag multiple action="string" :on-preview="handlePreview" :on-remove="handleRemove"
            :http-request="uploadFile" :file-list="form.files">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">可上传多个文件</div>
          </el-upload>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 弹框，文件列表 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from '../files/index'
  import {
    listCert,
    getCert,
    delCert,
    addCert,
    updateCert,
    exportCert
  } from "@/api/zz/compCert";
  import {
    debuglog
  } from 'util';
  import {
    uploadAvatar
  } from "@/api/system/file";

  export default {
    components:{
      AddOrUpdate
    },
    data() {
      return {
        addOrUpdateVisible:false,
        //文件列表
        fileLists: [],
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 企业资质表格数据
        certList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 资质类型字典
        typeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 8,
          name: undefined,
          type: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          name: [{
            required: true,
            message: "资质名称不能为空",
            trigger: "blur"
          }],
          startEndDate: [{
            required: true,
            message: "资质有效期不能为空",
            trigger: "blur"
          }],
          type: [{
            required: true,
            message: "资质类型不能为空",
            trigger: "blur"
          }],
          picUrl: [{
            required: true,
            message: "资质照片不能为空",
            trigger: "blur"
          }],
        }
      };
    },
    computed: {
      device() {
        return this.$store.state.app.device
      }
    },
    created() {
      this.getList();
      this.getDicts("zz_comp_type").then(response => {
        this.typeOptions = response.data;
      });
    },
    methods: {
      addOrUpdateHandle(id){
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 移除文件
      handleRemove(file, fileList) {
        console.log(file, fileList);
        for (let i = 0; i < this.form.files.length; i++) {
          const ele = this.form.files[i];
          if (ele.url = file.url) {
            this.form.files.splice(i, 1);
          }
        }
      },
      handlePreview(file) {
        console.log(file);
        document.location.href = file.url
      },
      // 上传文件方法
      uploadFile(param) {
        const formData = new FormData()
        formData.append('file', param.file)
        uploadAvatar(formData).then(response => {
          console.log('上传文件成功')
          var fileObj = {
            'name': response.name,
            'url': process.env.VUE_APP_BASE_API + response.imgUrl
          }
          this.fileLists.push(fileObj)
          this.form.files = this.fileLists;
          // this.form.picUrl = process.env.VUE_APP_BASE_API + response.imgUrl
        }).catch(response => {
          console.log('文件上传失败')
        })
      },
      // 上传图片方法
      uploadImage(param) {
        const formData = new FormData()
        formData.append('file', param.file)
        uploadAvatar(formData).then(response => {
          console.log('上传图片成功')
          this.form.picUrl = process.env.VUE_APP_BASE_API + response.imgUrl
        }).catch(response => {
          console.log('图片上传失败')
        })
      },
      // 资质照片上传前校验
      beforeAvatarUpload(file) {
        const isPic = file.type.indexOf('image') >= 0;
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isPic) {
          this.$message.error('资质照片只能为图片格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isPic && isLt2M;
      },
      /** 查询企业资质列表 */
      getList() {
        this.loading = true;
        listCert(this.queryParams).then(response => {
          this.certList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },

      // 资质类型字典翻译
      typeFormat(row, column) {
        return this.selectDictLabel(this.typeOptions, row.type);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          name: undefined,
          startEndDate: undefined,
          verifyFreq: undefined,
          type: undefined,
          remindMonth: undefined,
          introduce: undefined,
          picUrl: undefined,
          // files: undefined
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加企业资质";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getCert(id).then(response => {
          this.form = response.data;
          this.form.startEndDate = response.data.startEndDate.split('~');
          this.form.files = JSON.parse(response.data.files)
          this.open = true;
          this.title = "修改企业资质";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            var startEndDates = this.form.startEndDate;
            this.form.startEndDate = startEndDates[0] + "~" + this.form.startEndDate[1];
            // this.form.files = JSON.stringify(this.form.files)
            if (this.form.id != undefined) {
              updateCert(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addCert(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除企业资质名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCert(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有企业资质数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCert(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
