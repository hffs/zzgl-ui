<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" class="mmform" :inline="device!=='mobile'" label-width="68px">
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资质名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入资质名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <el-form-item label="资质类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择资质类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
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

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['zz:pers:cert:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['zz:pers:cert:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['zz:pers:cert:remove']"
        >删除</el-button>
      </el-col>
      </el-col>
    </el-row> -->

    <div class="zizhilist">
      <ul>
        <li v-for="(v,index) in certList" :key="index">
          <el-image :src="v.picUrl" fit="cover"></el-image>
          <div class="hoverbox">
             <h2>{{v.name}}</h2>
             <div class="edittool">
               <ul>
                 <!-- <li>
                   <img class="hoverimg1" src="../../../assets/image/zz01.png" alt="">
                   <img class="hoverimg2" src="../../../assets/image/zz01on.png" alt="">
                   <p>详情</p>
                 </li> -->
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

    <!-- <el-table v-loading="loading" :data="certList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="资质名称" align="center" prop="name" />
      <el-table-column label="资质有效期" align="center" prop="startEndDate" />
      <el-table-column label="资质类型" align="center" prop="type" />
      <el-table-column label="资质介绍" align="center" prop="introduce" />
      <el-table-column label="资质照片" align="center" prop="picUrl" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['zz:pers:cert:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['zz:pers:cert:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->

    <pagination
      layout="total,prev, pager, next"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改个人资质对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="人员姓名" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择">
            <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
              :disabled="item.status == 1"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="form.userId" placeholder="请输入用户id" /> -->
        </el-form-item>
        <el-form-item label="资质名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入资质名称" />
        </el-form-item>
        <el-form-item label="资质有效期" prop="startEndDate">
          <el-date-picker
            v-model="form.startEndDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="资质类型">
          <el-input v-model="form.type" placeholder="请输入资质名称" />
        </el-form-item>
        <el-form-item label="资质介绍" prop="introduce">
          <el-input v-model="form.introduce" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="资质照片" prop="picUrl">
          <el-upload
            class="avatar-uploader"
            action="string"
            :show-file-list="false"
            :http-request="uploadImage"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.picUrl" :src="form.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
import { listCert, getCert, delCert, addCert, updateCert, exportCert } from "@/api/zz/persCert";
import { allUser } from "@/api/system/user";
import { uploadAvatar } from "@/api/system/file";

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
      // 个人资质表格数据
      certList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 所有用户
      userOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 8,
        userId: undefined,
        name: undefined,
        type: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "人员姓名不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "资质名称不能为空", trigger: "blur" }
        ],
        startEndDate: [
          { required: true, message: "资质有效期不能为空", trigger: "blur" }
        ],
        picUrl: [
          { required: true, message: "资质照片不能为空", trigger: "blur" }
        ],
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
  },
  methods: {
    // 上传图片方法
    uploadImage(param){
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
    /** 查询个人资质列表 */
    getList() {
      this.loading = true;
      listCert(this.queryParams).then(response => {
        this.certList = response.rows;
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
        userId: undefined,
        name: undefined,
        startEndDate: undefined,
        type: undefined,
        introduce: undefined,
        picUrl: undefined,
        tenantId: undefined
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
      allUser().then(response => {
        this.userOptions = response.userOptions
        this.open = true;
        this.title = "添加个人资质";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCert(id).then(response => {
        this.form = response.data;
        this.form.startEndDate = response.data.startEndDate.split('~');
        this.open = true;
        this.title = "修改个人资质";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var startEndDates = this.form.startEndDate;
          this.form.startEndDate = startEndDates[0]+"~"+this.form.startEndDate[1];
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
      this.$confirm('是否确认删除个人资质名称为"' + row.name + '"的数据项?', "警告", {
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
      this.$confirm('是否确认导出所有个人资质数据项?', "警告", {
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
