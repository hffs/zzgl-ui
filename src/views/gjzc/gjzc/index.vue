<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" class="mmform" :inline="device!=='mobile'" label-width="68px">
        <el-form-item label="政策类型" prop="policytype">
        <el-select v-model="queryParams.policytype" placeholder="请选择政策类型" clearable size="small">
          <el-option
            v-for="dict in policytypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="省份" prop="policyprovince">
        <el-input
          v-model="queryParams.policyprovince"
          placeholder="请输入省市自治区"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

<el-form-item label="政策主题" prop="policyname">
        <el-input
          v-model="queryParams.policyname"
          placeholder="请输入政策主题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

          <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['gjzc:gjzc:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['gjzc:gjzc:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['gjzc:gjzc:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['gjzc:gjzc:export']"
        >导出</el-button>
      </el-col>
    </el-row>
-->
    <el-table v-loading="loading" :data="gjzcList" @selection-change="handleSelectionChange">

      <el-table-column label="编号" align="center" type="index" />
      <el-table-column label="政策主题" align="center" prop="policyname"  min-width="110px" />
      <el-table-column label="政策类型" align="center" prop="policytype" min-width="110px" :formatter="policytypeFormat" />
      <el-table-column label="省市自治区" align="center" prop="policyprovince" min-width="110px" />



       <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-view"
            @click="handlePreview(scope.row)"

          >查看详情</el-button>
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

    <!-- 添加或修改国家政策对话框
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="${comment}">
          <el-select v-model="form.policytype" placeholder="请选择${comment}">
            <el-option
              v-for="dict in policytypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="${comment}" prop="policytypename">
          <el-input v-model="form.policytypename" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="policydate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.policydate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择${comment}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="${comment}" prop="policycity">
          <el-input v-model="form.policycity" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="policyprovince">
          <el-input v-model="form.policyprovince" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="policylinkurl">
          <el-input v-model="form.policylinkurl" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="policysource">
          <el-input v-model="form.policysource" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="policyname">
          <el-input v-model="form.policyname" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="policyno">
          <el-input v-model="form.policyno" placeholder="请输入${comment}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
     -->
  </div>
</template>

<script>
import { listGjzc, getGjzc, delGjzc, addGjzc, updateGjzc, exportGjzc } from "@/api/gjzc/gjzc";

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
      // 国家政策表格数据
      gjzcList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // $comment字典
      policytypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        policytype: undefined,
        policytypename: undefined,
        policydate: undefined,
        policycity: undefined,
        policyprovince: undefined,
        policylinkurl: undefined,
        policysource: undefined,
        policyname: undefined,
        policyno: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
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
    this.getDicts("zclx").then(response => {
      this.policytypeOptions = response.data;
    });
  },
  methods: {
    /** 查询国家政策列表 */
    getList() {
      this.loading = true;
      listGjzc(this.queryParams).then(response => {
        this.gjzcList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // $comment字典翻译
    policytypeFormat(row, column) {
      return this.selectDictLabel(this.policytypeOptions, row.policytype);
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
        policytype: undefined,
        policytypename: undefined,
        policydate: undefined,
        policycity: undefined,
        policyprovince: undefined,
        policylinkurl: undefined,
        policysource: undefined,
        policyname: undefined,
        policyno: undefined
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

    handlePreview(row){
      console.log(row.policylinkurl)
      // window.location.href =row.policylinkurl;
      window.open(row.policylinkurl)
    }


  }
};
</script>
