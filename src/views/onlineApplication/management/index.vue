<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="咨询名称" prop="qualificationName">
        <el-input
          v-model="queryParams.qualificationName"
          placeholder="请输入咨询名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="咨询类别" prop="qualificationEntrance">
        <el-input
          v-model="queryParams.qualificationEntrance"
          placeholder="请输入咨询类别"
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

    <el-row :gutter="10" class="mb8">

    </el-row>

    <el-table v-loading="loading" :data="managementList" @selection-change="handleSelectionChange">
      <el-table-column label="企业名称" align="center" prop="applicant" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="咨询入口类型" prop="qualificationEntrance" align="center">
        <template slot-scope="scope">
          <el-cascader :options="options" disabled="disabled" v-model="scope.row.qualificationEntrance"></el-cascader>
        </template>
      </el-table-column>
      <el-table-column label="反馈意见" align="left" prop="applicationFeedback" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row)"
          v-hasPermi="['consultationManagement:management:look']"
          >查看</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="fankui(scope.row)"
            v-hasPermi="['consultationManagement:management:fankui']"
          >反馈</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="tijiao(scope.row)"
            v-hasPermi="['consultationManagement:management:tijiao']"
          >提交</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['consultationManagement:management:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改咨询管理对话框 -->
    <el-dialog title="查看" :visible.sync="open" width="1200px">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane v-for="(v,index) in datalist" :key="index" :label="v.name" :name="index+'i'">
          <tableform :makeform="v" :mdisbled="true" :name="v.name" :tianform="tianform[index]"></tableform>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog title="反馈" :visible.sync="openfankui" width="1200px">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane v-for="(v,index) in datalist" :key="index" :label="v.name" :name="index+'i'">
          <tableform :makeform="v" :mdisbled="true" :name="v.name" :tianform="tianform[index]"></tableform>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <div class="w100">
          <el-form :model="fadeback" ref="fadeback" label-position="top">
            <el-form-item label="反馈意见" prop="applicationFeedback">
              <el-input
              maxlength="200"
              type="textarea"
                v-model="fadeback.applicationFeedback"
                placeholder="输入反馈"
                clearable
              />
            </el-form-item>
          </el-form>
        </div>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
import {
  listManagement,
  getManagement,
  delManagement,
  addManagement,
  updateManagement,
  exportManagement,
  getTempAndData,
  applicationFeedback,
  changeStatus,
} from "@/api/onlineApplication/management";
import { CascadeConsultationJson } from "@/api/onlineApplication/template";
  import tableform from '../../zxzx/tableform.vue'
export default {
  components: {
    tableform
  },
  data() {
    return {
      fadeback:{
        id:'',
        applicationFeedback:''
      },
      fsubform:{},
      datalist: [],
      activeName: '0i',
      options: [],
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
      // 咨询管理表格数据
      managementList: [],
      options:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openfankui:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        qualificationName: undefined,
        qualificationEntrance: undefined,
        managementData: undefined,
        tenantId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      tianform: {},
    };
  },
  created() {
    this.getList();
    this.getCascadeConsultationJson()
  },
  methods: {
    /** 查询咨询管理列表 */
    getList() {
      this.loading = true;
      listManagement(this.queryParams).then(response => {
        for(var i=0;i<response.rows.length;i++){
          response.rows[i].qualificationEntrance=JSON.parse(response.rows[i].qualificationEntrance)
        }
        this.managementList = response.rows;
        this.total = response.total;
        this.loading = false;
      });

    },
    getCascadeConsultationJson() {
      CascadeConsultationJson().then(response => {
        this.options = JSON.parse(response.data)
        // JSON.parse(response.data).cascadeConsultation;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.openfankui = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        qualificationName: undefined,
        createTime: undefined,
        qualificationEntrance: undefined,
        templateData: undefined,
        managementData: undefined,
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加咨询管理";
    },
    /** 查看操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.activeName= '0i'
      var resdata = row
      var newdatalist = []
      var firstT = JSON.parse(resdata.templateData)
      var managementData = resdata.managementData
      if (managementData == null) {
        managementData = "{}"
      }
      var tianform = JSON.parse(managementData)
      this.tianform = tianform
      for (var i = 0; i < firstT.length; i++) {
        newdatalist.push(JSON.parse(firstT[i]))
      }
      this.datalist = newdatalist
    },

    fankui(row) {
      this.reset();
      this.openfankui = true;
      this.fadeback.id = row.id || this.ids;
      this.fadeback.applicationFeedback = row.applicationFeedback;
      this.activeName= '0i'
      var resdata = row
      var newdatalist = []
      var firstT = JSON.parse(resdata.templateData)
      var managementData = resdata.managementData
      if (managementData == null) {
        managementData = "{}"
      }
      var tianform = JSON.parse(managementData)
      this.tianform = tianform
      for (var i = 0; i < firstT.length; i++) {
        newdatalist.push(JSON.parse(firstT[i]))
      }
      this.datalist = newdatalist
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["fadeback"].validate(valid => {
        if (valid) {
          applicationFeedback(this.fadeback).then(response => {
            if (response.code === 200) {
              this.msgSuccess("反馈成功");
              this.openfankui = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除咨询管理编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delManagement(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },

    tijiao(row) {
      this.$confirm(
        '是否确认提交当前申请?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return changeStatus({id:row.id});
        })
        .then(() => {
          this.getList();
          this.msgSuccess("提交成功");
        })
        .catch(function() {});
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有咨询管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportManagement(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style scoped="scoped">
  .w100{border-top: 1px #ccc solid;padding-top: 10px;}
  .el-dialog__body{max-height: 60vh !important;overflow: auto;}
</style>
