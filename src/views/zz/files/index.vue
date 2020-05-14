<template>
  <div class="app-container">
    <el-dialog title="资质文件管理" :visible.sync="dialog_open" fullscreen width="500px">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item prop="fileName">
          <el-input
            v-model="queryParams.fileName"
            placeholder="请输入文件名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
          </el-input>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="warning"
            size="mini"
            @click="handleAddFolder"
            v-hasPermi="['zz:files:add']"
          >新增文件夹</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['zz:files:add']"
          >上传文件</el-button>
        </el-col>

          <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAddFileder"
            v-hasPermi="['zz:files:add']"
          >上传文件夹</el-button>
        </el-col> -->

        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['zz:files:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['zz:files:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :disabled="multipleDownload"
            @click="handleDownload"
          >下载</el-button>
        </el-col>
        <el-col :span="10" style="float: right;text-align: right;">
          <img @click="upOneLevel" class="exeCatalogIcon" src="../../../assets/image/file/上一级.png" alt="">
          <img @click="getList(0)" class="exeCatalogIcon" src="../../../assets/image/file/根目录.png" alt="">
        </el-col>
      </el-row>

      <el-table border v-loading="loading" :data="filesList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="文件名称" align="left" prop="fileName">
          <template slot-scope="scope">
            <img v-if="scope.row.fileType === '文件夹'" class="fileIcon" src="../../../assets/image/file/folder.png" alt="">
            <img v-if="scope.row.fileType === 'png'" class="fileIcon" src="../../../assets/image/file/file_img.png" alt="">
            <img v-if="scope.row.fileType === 'doc' || scope.row.fileType === 'docx'" class="fileIcon" src="../../../assets/image/file/file_docx.png" alt="">
            <img v-if="scope.row.fileType === 'xls' || scope.row.fileType === 'xlsx'" class="fileIcon" src="../../../assets/image/file/file_excel.png" alt="">
            <img v-if="scope.row.fileType === 'ppt' || scope.row.fileType === 'pptx'" class="fileIcon" src="../../../assets/image/file/file_ppt.png" alt="">
            <img v-if="scope.row.fileType === 'pdf'" class="fileIcon" src="../../../assets/image/file/file_pdf.png" alt="">
            <img v-if="scope.row.fileType === 'txt'" class="fileIcon" src="../../../assets/image/file/file_txt.png" alt="">
            <img v-if="scope.row.fileType === 'zip'" class="fileIcon" src="../../../assets/image/file/file_zip.png" alt="">
            <span class="colFileSpan" @click="openFile(scope.row)">{{ scope.row.fileName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件类型" width="90" align="center" prop="fileType" />
        <!-- <el-table-column label="大小" align="center" prop="size" /> -->
        <el-table-column label="创建时间" align="center" prop="createTime" :formatter="createTimeFormat"/>
        <el-table-column label="修改时间" align="center" prop="updateTime" :formatter="updateTimeFormat"/>
      </el-table>

      <!-- 添加或修改企业资质附件对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="文件目录" prop="parentId">
            <treeselect v-model="form.parentId" :options="fileOptions" placeholder="选择文件夹" />
          </el-form-item>
          <el-form-item label="附件" prop="filePath"  v-show="this.isAddFile">
            <el-upload
              class="upload-demo"
              ref="upload"
              drag multiple
              action="string"
              :v-model="form.filePath"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :http-request="uploadFile"
              :file-list="fileLists"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">可上传多个文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="名称" prop="fileName" v-show="!this.isAddFile">
            <el-input v-model="form.fileName" placeholder="请输入文件夹名称" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
  <!--    <el-dialog :title="title" :visible.sync="openfileder" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="文件目录" prop="parentId">
            <treeselect v-model="form.parentId" :options="fileOptions"  placeholder="选择文件夹" />
          </el-form-item>
             <el-form-item label="名称" prop="fileder" >
            <input ref="file" id="fileder" name="fileder"   class="fileUploaderClass" type='file'  mozdirectory webkitdirectory  @change.stop="changesData"/>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitFormfileder">确 定</el-button>
          <el-button @click="cancelfileder">取 消</el-button>
        </div>
      </el-dialog> -->

    </el-dialog>
  </div>
</template>

<script>
import {uploadAvatar,uploadfilder, listFiles, getFiles, delFiles, addFiles,treeselect, updateFiles, exportFiles } from "@/api/zz/files";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { truncate } from 'fs';

export default {
  name:"File",
  components: { Treeselect },

  data() {
    return {
      // 上一级目录父id
      upOneLevelParentIds:[],
      // 项目id(属于按个资质)
      projectId:undefined,
      // 添加文件
      isAddFile:true,
      openfileder:false,
      //文件列表
      fileLists: [],
      dialog_open:false,
      // 文件夹树选项
      fileOptions: undefined,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      fileder:[],
      // 选中rows
      rows:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 下载按钮禁用
      multipleDownload: true,
      // 企业资质附件表格数据
      filesList: [],
      filederId:undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        projectId:undefined,
        parentId: 0,
        ancestors: undefined,
        fileName: undefined,
        fileType: undefined,
        filePath: undefined,
        size: undefined,
        tenantId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        //  filePath: [
        //   { required: true, message: "文件不能为空", trigger: "blur" }
        // ]
      }
    };
  },
  methods: {
    /** 查询文件夹下拉树结构 */
    getTreeselect() {
      //加入过滤参数，根据资质名称查询资质文件夹
      treeselect(this.projectId).then(response => {
        this.fileOptions = response.data;
      });
    },
    // 移除文件
    handleRemove(file, fileList) {

      this.fileLists = fileList;
      if (this.fileLists.length == 0) {
        this.form.filePath = undefined;
      }

    },
    handlePreview(file) {
      console.log(file);
    },
    // 上传文件方法
    uploadFile(param) {
      const formData = new FormData()
      console.log(this.form.parentId)
      // formData.append('parentId', this.form.parentId)
      formData.append('file', param.file)
      uploadAvatar(formData).then(response => {
        console.log('上传文件成功')
        var fileObj = {
          'name': response.name,
          'url': process.env.VUE_APP_BASE_API + response.imgUrl
        }
        this.fileLists.push(fileObj)
        this.form.filePath = this.fileLists;
        // this.form.picUrl = process.env.VUE_APP_BASE_API + response.imgUrl
      }).catch(response => {
        console.log('文件上传失败')
      })
    },
    // 打开文件，查看详情
    openFile(val){
      // 如果是文件夹，则直接打开文件夹，如果是文件，则进行预览
      if(val.fileType === '文件夹'){
        this.upOneLevelParentIds.push(val.parentId);
        this.filederId = val.id;
        this.getList(val.id)
      }else{
        this.downloadByPath(val.filePath,val.fileName + "." + val.fileType);
        // var baseUrl = window.location.href.replace(this.$route.path,'')
        // var url = baseUrl + val.filePath; //要预览文件的访问地址
        // window.open(this.viewFileUrl+encodeURIComponent(url));
      }

    },
    // 上一级目录
    upOneLevel(){
      this.getList(this.upOneLevelParentIds[this.upOneLevelParentIds.length - 1])
      if(this.upOneLevelParentIds.length > 1){
        this.upOneLevelParentIds.pop();
      }
    },
    // 初始化页面
    init(projectId){
      this.dialog_open = true
      this.projectId = projectId
      this.upOneLevelParentIds.push(0)
      this.getList(0)
      this.getTreeselect()
    },
    /** 查询企业资质附件列表 */
    getList(parentId) {
      this.loading = true;
      this.queryParams.parentId = parentId
      this.queryParams.projectId = this.projectId
      listFiles(this.queryParams).then(response => {
        this.filesList = response.rows;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelfileder() {
      this.openfileder = false;
      //this.$refs.file.files=[],

      document.getElementById('fileder').value = "";
      //this.getList(this.upOneLevelParentIds[this.upOneLevelParentIds.length - 1]);
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        // projectId:undefined,
        parentId: 0,
        ancestors: undefined,
        fileName: undefined,
        fileType: undefined,
        filePath: undefined,
        size: undefined,
        createTime: undefined,
        updateTime: undefined,
        createBy: undefined,
        updateBy: undefined,
        tenantId: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList(0);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.rows = selection;
      this.single = selection.length!=1
      this.move = selection.length!=1
      this.multiple = !selection.length
      var fileTypes = selection.map(item => item.fileType)
      if(fileTypes.indexOf("文件夹") >= 0){//如果下载内容包含文件夹，禁用下载按钮
        this.multipleDownload = true
      }else{
        this.multipleDownload = false
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.fileLists = [];
      this.getTreeselect();
      this.form.parentId = this.filederId;
      this.isAddFile = true;
      this.open = true;
      this.title = "上传文件";
    },
    // handleAddFileder(){
    //   this.reset();
    //   this.fileLists = [];
    //   this.getTreeselect();

    //   this.openfileder = true;
    //   this.title = "上传文件夹";
    // },
     changesData(){

        this.fileder = this.$refs.file.files

     }
     ,
    // 新增文件夹
    handleAddFolder(){
      this.reset();
      this.fileLists = [];
      this.getTreeselect();
      this.isAddFile = false;
      this.open = true;
      this.title = "添加文件夹";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.fileLists = [];
      this.getTreeselect();
      const id = row.id || this.ids;
      getFiles(id).then(response => {
        this.form = response.data;
        this.isAddFile = false;
        this.open = true;
        this.title = "修改";
      });
    },
    // submitFormfileder:function(){
    //   console.log(this.form.parentId)
    //   console.log(this.fileder)
    //   console.log(this.projectId)
    //   if(this.fileder.length===0){
    //     this.msgError("请选择文件夹");
    //   }
    //   const formData = new FormData()
    //   for (let index = 0; index < this.fileder.length; index++) {
    //     const element = this.fileder[index];
    //     if(element.name!='~WRL0001.tmp'&&element.name!="~WRL2220.tmp"){
    //       formData.append('files',element)
    //     }

    //   }
    //   formData.append('projectId',this.projectId)
    //   formData.append('parentId',this.form.parentId)
    //   uploadfilder(formData).then(response => {
    //                     console.log('上传图片成功')

    //                 }).catch(response => {
    //                     console.log('图片上传失败')
    //                 })
    // },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.projectId = this.projectId
          if(this.form.filePath){
          this.form.filePath = JSON.stringify(this.form.filePath)}
          console.log(this.form)
          if (this.form.id != undefined) {
            updateFiles(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList(this.upOneLevelParentIds[this.upOneLevelParentIds.length - 1]);
              } else {
                this.msgError(response.msg);
              }
            });
          } else {

            addFiles(this.form).then(response => {
              console.log(response)
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList(this.upOneLevelParentIds[this.upOneLevelParentIds.length - 1]);
              } else {
                this.msgError(response.msg);
              }
            });
          }
          this.init(this.form.projectId);
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除企业资质附件编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFiles(ids);
        }).then(() => {
          this.getList(this.upOneLevelParentIds[this.upOneLevelParentIds.length - 1]);
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    // 下载
    handleDownload(){
      this.$confirm('是否确认下载所有选中文件?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(response => {
          for (let i = 0; i < this.rows.length; i++) {
            const element = this.rows[i];
            this.downloadByPath(element.filePath,element.fileName + "." + element.fileType);
          }
        }).catch(function() {
          console.log('下载出现异常！')
        });
    }
  }

};

</script>
<style scoped>
  .fileIcon{
    margin-bottom: -5px;
  }
  .exeCatalogIcon{
    width: 20px;
    cursor: pointer;
  }
  .el-dialog__wrapper >>> .el-dialog{
    margin-top: 0 !important;
  }
  .colFileSpan{
    margin-left: 10px;cursor: pointer;
  }
  .colFileSpan:hover{
    color: #457ff4
  }
</style>
