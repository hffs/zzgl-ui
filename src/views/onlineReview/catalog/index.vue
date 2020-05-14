<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="目录名称">
        <el-input
          v-model="queryParams.catalogtName"
          placeholder="请输入目录名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件夹所属">
        <el-select v-model="queryParams.status" placeholder="文件夹所属" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          class="filter-item"
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['assessment:catalog:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="catalogList"
      row-key="catalogId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="catalogName" label="目录名称"></el-table-column>
     
      <el-table-column
        prop="status"
        label="文件夹所属"
        align="center"
        :formatter="statusFormat"
        width="100"
      ></el-table-column>
      <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['assessment:catalog:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['assessment:catalog:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['assessment:catalog:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="85px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级目录">
              <treeselect v-model="form.parentId" :options="deptOptions" placeholder="选择上级目录" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="目录名称" prop="catalogName">
              <el-input v-model="form.catalogName" placeholder="请输入文件目录名称" />
            </el-form-item>
          </el-col>
        

          <el-col :span="24">
            <el-form-item label="文件夹所属">
              <el-select v-model="form.status">
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCatalog,
  getCatalog,
  treeselect,
  delCatalog,
  addCatalog,
  updateCatalog
} from "@/api/assessment/catalog";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Catalog",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      catalogList: [],
      // 部门部门树选项
      deptOptions: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        catalogName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        catalogName: [
          { required: true, message: "目录名称不能为空", trigger: "blur" }
        ],
        
        status: [
          { required: true, message: "目录所属不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("invitation_type").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listCatalog(this.queryParams).then(response => {
        this.catalogList = response.data;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        catalogId: undefined,
        parentId: 100,
        catalogName: undefined,
        orderNum: undefined,
        status: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.catalogId;
        this.form.status = row.status;
      }
      this.open = true;
      this.title = "添加目录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getCatalog(row.catalogId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改目录";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (
          !this.form.parentId ||
          this.form.parentId == "" ||
          this.form.parentId == undefined
        ) {
          this.form.parentId = 0;
        }
        if (valid) {
          if (this.form.catalogId != undefined) {
            updateCatalog(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCatalog(this.form).then(response => {
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
      this.$confirm(
        '是否确认删除名称为"' + row.catalogName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delCatalog(row.catalogId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  
</style>
