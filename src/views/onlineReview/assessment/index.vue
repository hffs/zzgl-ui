<template>
  <div class="app-container assessmentBox">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="公司名称" prop="corporateName">
        <el-input
          v-model="queryParams.corporateName"
          placeholder="请输入公司名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提交人" prop="submitter">
        <el-input
          v-model="queryParams.submitter"
          placeholder="请输入提交人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前状态" prop="currentState">
        <el-input
          v-model="queryParams.currentState"
          placeholder="请输入当前状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核时间" prop="auditTime">
        <el-date-picker v-model="queryParams.auditTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="审批人" prop="approver">
        <el-input
          v-model="queryParams.approver"
          placeholder="请输入审批人"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['assessment:assessment:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['assessment:assessment:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['assessment:assessment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['assessment:assessment:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="assessmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="公司名称" align="center" prop="corporateName" />
      <el-table-column label="审核类型" align="center" prop="auditType" :formatter="auditTypeDict" />
      <el-table-column label="申请表" align="center" prop="applicationName">
        <template slot-scope="scope">
          <a>
            <u>
              <span class="colFileSpan" @click="preview(scope.row)">{{ scope.row.applicationName}}</span>
            </u>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="提交人" align="center" prop="submitter" />
      <el-table-column label="提交时间" align="center" prop="createTime" width="100" />
      <!-- <el-table-column label="审批人" align="center" prop="id" /> -->
      <el-table-column
        label="当前状态"
        align="center"
        prop="currentState"
        :formatter="currentStateFormat"
      />
      <el-table-column label="审核时间" align="center" prop="auditTime" width="165" class="auditTimeBr"></el-table-column>
      <el-table-column label="审批人" align="center" prop="approver" />
      <el-table-column label="编写" align="center" width="145">
        <template slot-scope="scope">
          <router-link :to="'/assessment/type/evaluationTable/' + scope.row.id" class="link-type">
            <el-button type="primary" plain size="mini" class="writeBtn">评审表</el-button>
            <!-- <span>评审表</span> -->
          </router-link>
          <router-link
            :to="'/assessment/type/InvitationFile/' + scope.row.tenantId"
            class="link-type"
          >
            <el-button type="success" plain size="mini" class="writeBtn">评审附件</el-button>
            <!-- <span>评审附件</span> -->
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['assessment:assessment:edit']"
          >受理</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-document"
            @click="histryget(scope.row)"
          >记录</el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-download"
            @click="downloadpsb(scope.row)"
          >下载</el-button>

          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['assessment:assessment:remove']"
          >删除</el-button>-->
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

    <!-- 添加或修改邀约评审对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公司名称" prop="corporateName">
          <el-input v-model="form.corporateName" placeholder="请输入公司名称" :disabled="true" />
        </el-form-item>
        <el-form-item label="审核类型" prop="auditType">
          <el-select v-model="form.auditType" :disabled="true" placeholder="请选择">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请表" prop="applicationUrl">
          <el-input v-model="form.applicationName" placeholder="请输入申请表" :disabled="true" />
        </el-form-item>
        <el-form-item label="提交人" prop="submitter">
          <el-input v-model="form.submitter" placeholder="请输入提交人" :disabled="true" />
        </el-form-item>

        <el-form-item label="审核时间" prop="auditTime">
          <el-date-picker
            v-model="form.auditTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-drawer title="历史记录时间轴" :visible.sync="histry" direction="rtl" size="50%">
      <div class="source">
        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
            >{{activity.content}}</el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  getHistry,
  listAssessment,
  getAssessment,
  delAssessment,
  addAssessment,
  updateAssessment,
  exportAssessment,
  downloadpsba
} from "@/api/assessment/assessment";

export default {
  name: "Assessment",
  data() {
    return {
      // 遮罩层
      histry: false,
      activities: [],
      typeOptions: [],
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 邀约评审表格数据
      assessmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 当前状态字典

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        corporateName: undefined,
        auditType: undefined,
        currentState: undefined,
        auditTime: undefined,
        approver: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getDicts("invitation_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getList();
  },
  methods: {
    /** 查询邀约评审列表 */
    getList() {
      this.loading = true;
      // this.queryParams.auditType = "1";
      listAssessment(this.queryParams).then(response => {
        this.assessmentList = response.rows;
        this.assessmentList.forEach(key => {
          let auditTime = key.auditTime;
          let auditTimeArr;
          if (key.auditTime != undefined) {
            auditTimeArr = auditTime.split("~");
            key.auditTime =
              auditTimeArr[0] + `\n` + "~" + `\n` + auditTimeArr[1];
          }
        });

        this.total = response.total;
        this.loading = false;
      });
    },
    preview(val) {
       this.downloadByPath(val.applicationUrl,val.applicationName);
    },
    auditTypeDict(row, column) {
      return this.selectDictLabel(this.typeOptions, row.auditType);
    },
    // 当前状态字典翻译
    currentStateFormat(row, column) {
      // return this.selectDictLabel(this.currentStateOptions, row.currentState);
      var current_State = undefined;
      switch (row.currentState) {
        case "1":
          current_State = "新申请";
          break;
        case "2":
          current_State = "已反馈";
          break;
        case "3":
          current_State = "再次申请";
          break;
        case "4":
          current_State = "再次反馈";
          break;
        default:
          break;
      }
      return current_State;
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
        corporateName: undefined,
        createTime: undefined,
        auditType: undefined,
        applicationUrl: undefined,
        submitter: undefined,
        currentState: undefined,
        auditTime: undefined,
        approver: undefined,
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
      this.title = "添加邀约评审";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getAssessment(id).then(response => {
        this.form = response.data;
        if (response.data.auditTime != undefined) {
          this.form.auditTime = response.data.auditTime.split("~");
        }
        if (this.form.auditTime != undefined) {
          this.open = false;
          this.$alert("当前申请已经反馈", "受理信息", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        } else {
          this.open = true;
          this.title = "受理邀约评审";
        }
      });
    },

    histryget(row) {
      this.histry = true;
      (this.activities = []),
        getHistry({ invitationId: row.id }).then(response => {
          this.activities = response.data;
        });
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(this.form.auditTime);
          if (this.form.auditTime != undefined) {
            var startEndDates = this.form.auditTime;
            this.form.auditTime =
              startEndDates[0] + "~" + this.form.auditTime[1];
          }

          if (this.form.id != undefined) {
            updateAssessment(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("受理成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addAssessment(this.form).then(response => {
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
      this.$confirm(
        '是否确认删除邀约评审编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delAssessment(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    downloadpsb(row) {
      window.location.href =
        process.env.VUE_APP_BASE_API +
        "/assessment/evaluationTable/downlodepsb?aid=" +
        row.id;
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有邀约评审数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportAssessment(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  },
  psb() {}
};
</script>

<style rel="stylesheet/scss" lang="scss">
.assessmentBox {
  .fixed-width .el-button--mini {
    width: auto;
  }
  .el-table .fixed-width .el-button--mini {
    width: auto;
  }
  .writeBtn {
    padding: 5px 8px;
  }
  .el-table .cell {
    white-space: pre-line;
  }
}
</style>
