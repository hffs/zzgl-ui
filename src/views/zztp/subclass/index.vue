<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" class="mmform" :inline="device!=='mobile'" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <el-form-item label="父类名称" prop="aid">
        <el-select v-model="queryParams.aid" placeholder="请选择" clearable size="small">
          <el-option
              v-for="item in opplls"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.status == 1"
            ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['zztp:subclass:add']"
        >新增</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

   <!-- <el-row :gutter="10" class="mb8">
     
     <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['zztp:subclass:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['zztp:subclass:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['zztp:subclass:export']"
        >导出</el-button>
      </el-col>
    </el-row> -->

    <el-table v-loading="loading" :data="subclassList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="父类名称" align="center" min-width="110px" prop="aid" :formatter="nima"/>
      <el-table-column label="名称" align="center" min-width="110px" prop="name" />
      <el-table-column label="图标" align="center" min-width="110px" prop="image" >
       <template   slot-scope="scope">
                    <img :src="scope.row.image"  min-width="70" height="70" />
                 </template>
                 </el-table-column>
      <el-table-column label="备注" min-width="110px" align="center" prop="remark" />
      <el-table-column label="操作" min-width="110px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['zztp:subclass:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['zztp:subclass:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :page-sizes="[10, 20, 30, 50]"
      @pagination="getList"
    />

    <!-- 添加或修改资质小类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">



        <el-form-item label="父类名称" prop="aid">



          <el-select v-model="form.aid" placeholder="请选择">
            <el-option
              v-for="item in opplls"
              :key="item.aid"
              :label="item.name"
              :value="item.id"
              :disabled="item.status == 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>

            <el-form-item label="小类图标" prop="image">
          <el-upload
            class="avatar-uploader"
            action="string"
            :show-file-list="false"
            :http-request="uploadImage"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.image" :src="form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSubclass, getSubclass, delSubclass, addSubclass, updateSubclass, exportSubclass } from "@/api/zztp/subclass";
import { uploadAvatar } from "@/api/system/file";
import { getAll } from "@/api/zztp/atlas";

export default {
  data() {
    return {

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
      content:'', // 存储富文本框内容
      // 资质小类表格数据
      subclassList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      opplls:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        aid: undefined,
        name: undefined,
        image: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         aid: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        image: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      },

    };
  },
  computed: {
    device() {
      return this.$store.state.app.device
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询资质小类列表 */
    uploadImage(param){
      const formData = new FormData()
      formData.append('file', param.file)
      console.log(param.file)
      uploadAvatar(formData).then(response => {
        console.log('上传图片成功')
        this.form.image = process.env.VUE_APP_BASE_API + response.imgUrl
      }).catch(response => {
        console.log('图片上传失败')
      })
    },
    nima (row, column) {
      for (let i = 0; i <  this.opplls.length; i++) {
        const element =  this.opplls[i];
        if(element.id===row.aid){

            return element.name
        }
      }
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
    getList() {
       getAll().then(response => {
        this.opplls = response.zztpAtlaslist

      });
      this.loading = true;
      listSubclass(this.queryParams).then(response => {
        this.subclassList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        aid: undefined,
        name: undefined,
        image: undefined,
        remark: undefined
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
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加资质小类";
      getAll().then(response => {
        this.opplls = response.zztpAtlaslist
        this.open = true;

      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSubclass(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资质小类";
      });
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSubclass(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            console.log(this.form)
            addSubclass(this.form).then(response => {
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
      this.$confirm('是否确认删除资质小类名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSubclass(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有资质小类数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSubclass(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};


</script>
