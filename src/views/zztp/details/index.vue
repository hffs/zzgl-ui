<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" class="mmform" :inline="device!=='mobile'" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['zztp:details:add']"
        >新增</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

   <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">

      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['zztp:details:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['zztp:details:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['zztp:details:export']"
        >导出</el-button>
      </el-col>
    </el-row> -->

    <el-table v-loading="loading" :data="detailsList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="资质名称" align="center" min-width="110px" prop="sid" :formatter="nima" />
      <el-table-column label="名称" align="center" min-width="110px" prop="name" />
      <!-- <el-table-column label="描述" align="center" prop="text" /> -->
      <el-table-column label="备注" align="center" min-width="110px" prop="remark" />
      <el-table-column label="操作" align="center" min-width="200px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['zztp:details:edit']"
          >修改</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="find(scope.row)"
            v-hasPermi="['zztp:details:edit']"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['zztp:details:remove']"
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
      <el-dialog title="查看详情" width="800px" :visible.sync="dialogTableVisible">
        <template>
          <div v-html="htext" class="descBox"></div>
      </template>
      </el-dialog>
    <!-- 添加或修改资质详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="资质小类" prop="sid">
          <el-select v-model="form.sid" placeholder="请选择资质小类">
            <el-option
              v-for="item in opplls"
              :key="item.sid"
              :label="item.name"
              :value="item.id"
              :disabled="item.status == 1"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述" prop="text">
        <quill-editor :options="quillOption"
            v-model="form.text" ref="myQuillEditor"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
            </quill-editor>
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
<style>
.descBox p.ql-align-center{
       text-align: center;
}
</style>
<script>
import { listDetails, getDetails, delDetails, addDetails, updateDetails, exportDetails } from "@/api/zztp/details";
import { getAll } from "@/api/zztp/subclass";
import quillConfig from './quill-config.js'


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
      dialogTableVisible: false,
      htext:'莫得数据',
      // 总条数
      total: 0,
      opplls:[],
      // 资质详情表格数据
      detailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
      },
      quillOption: quillConfig,

      // 表单参数
      form: {},
      // 表单校验
      rules: {
              sid: [
                { required: true, message: "不能为空", trigger: "blur" }
              ],
              name: [
                { required: true, message: "不能为空", trigger: "blur" }
              ],
              text: [
                { required: true, message: "不能为空", trigger: "blur" }
              ],

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
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    /** 查询资质详情列表 */
    getList() {
      getAll().then(response => {
        this.opplls = response.zztpSubclasslist

      });
      this.loading = true;
      listDetails(this.queryParams).then(response => {
        this.detailsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    nima (row, column) {
      for (let i = 0; i <  this.opplls.length; i++) {
        const element =  this.opplls[i];
        if(element.id===row.sid){

            return element.name
        }
      }
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
        sid: undefined,
        name:undefined,
        text: undefined,
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
      this.title = "添加资质详情";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDetails(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资质详情";
      });
    },

    find(row){
      this.dialogTableVisible = true
      this.reset();
      const id = row.id || this.ids
      getDetails(id).then(response => {
        this.htext = response.data.text;

      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDetails(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDetails(this.form).then(response => {
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
      this.$confirm('是否确认删除资质详情名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDetails(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有资质详情数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDetails(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
