<template>
  <div class="app-container applicationBox">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <!-- <el-form-item label="公司名称" prop="corporateName">
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
      </el-form-item>-->
      <el-form-item label="审核时间" prop="auditTime">
        <el-date-picker v-model="queryParams.auditTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        <!-- <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.auditTime"
          type="datetime"
          value-format="yyyy-MM-dd"
          placeholder="选择审核时间">
        </el-date-picker>-->
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['assessment:assessment:add']"
        >填写</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="assessmentList">
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column label="审核类型" align="center" prop="auditType" :formatter="auditTypeDict" />
      <el-table-column label="申请表" align="center" prop="applicationName">
        <template slot-scope="scope">
          <a>
            <span class="colFileSpan" @click="preview(scope.row)">{{ scope.row.applicationName}}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="提交人" align="center" prop="submitter" />
      <el-table-column label="提交时间" align="center" prop="createTime" width="160" />
      <!-- <el-table-column label="审批人" align="center" prop="id" /> -->
      <el-table-column
        label="当前状态"
        align="center"
        prop="currentState"
        :formatter="currentStateFormat"
      />
      <el-table-column label="审核时间" align="center" prop="auditTime" width="165" ></el-table-column>
      <el-table-column label="审批人" align="center" prop="approver" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.currentState==1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['assessment:assessment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['assessment:assessment:remove']"
          >删除</el-button>
          <el-button
          type="text"
          size="mini"
          icon="el-icon-document"
          @click="histryget(scope.row)"
          >记录</el-button>
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

        <el-form-item label="审核类型" prop="auditType">
          <el-select v-model="form.auditType" @change="auditTypeExists" placeholder="请选择">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="附件" prop="applicationName">
          <el-upload
            class="upload-demo"
            ref="upload"
            drag
            multiple
            action="string"
            v-model="form.applicationName"
            :on-remove="handleRemove"
            :http-request="uploadFile"
            :file-list="fileList"
            :limit="1"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传一个文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="disabled"  @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-drawer title="历史记录时间轴" :visible.sync="histry" direction="rtl" size="50%" class="reviewOpinion">
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
  judgementExists,
  getHistry,
  listAssessment,
  getAssessment,
  delAssessment,
  addAssessment,
  updateAssessment,
  exportAssessment
} from "@/api/assessment/assessment";
import { uploadAvatar } from "@/api/system/file";
export default {
  data() {
    return {
      // 遮罩层
      histry: false,
      disabled:true,
      applicationUrl_back: undefined,
      activities: [],
      typeOptions: [],
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      fileList: [],
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

        auditType: undefined,
        currentState: undefined,
        auditTime: undefined,
        approver: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        applicationName: [
          { required: true, message: "申请表不能为空", trigger: "blur" }
        ],
        auditType: [
          { required: true, message: "审核类型不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("invitation_type").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    auditTypeExists() {
      judgementExists({ auditType: this.form.auditType }).then(response => {
        if (response.msg != undefined) {
          console.log(response.msg);
          this.$alert(response.msg, "提示信息", {
            confirmButtonText: "确定",
            callback: action => {
              this.form.auditType = undefined;
            }
          });
        }
      });
    },

    /**文件上传 */

    uploadFile(param) {
      this.loading=true;
      const formData = new FormData();
      formData.append("file", param.file);
      uploadAvatar(formData)
        .then(response => {
          var fileObj = {
            name: response.name,
            url: process.env.VUE_APP_BASE_API + response.imgUrl
          };
          this.form.applicationName = response.name;
          this.applicationUrl_back =
            process.env.VUE_APP_BASE_API + response.imgUrl;
          this.fileList.push(fileObj);
          this.disabled = false;
        })
        .catch(response => {
          console.log("图片上传失败");
        });
        this.loading=false;
    },
    // 移除文件
    handleRemove(file, fileList) {
      this.fileList = [];
      this.form.applicationUrl = undefined;
      this.form.applicationName = undefined;
      this.applicationUrl_back = undefined;
    },
    handlePreview(file) {
      console.log(file);
    },
    auditTypeDict(row, column) {
      return this.selectDictLabel(this.typeOptions, row.auditType);
    },

    /** 查询邀约评审列表 */
    getList() {
      this.loading = true;
      //   this.queryParams.auditType = "a";
      listAssessment(this.queryParams).then(response => {
        this.assessmentList = response.rows;
        this.assessmentList.forEach((key)=>{
          let auditTime = key.auditTime;
          let auditTimeArr;
          if (key.auditTime != undefined) {
            auditTimeArr = auditTime.split("~");
            key.auditTime = auditTimeArr[0]+`\n`+'~'+`\n`+auditTimeArr[1];
          }
        })

        this.total = response.total;
        this.loading = false;
      });
    },
    preview(val) {
      this.downloadByPath(val.applicationUrl,val.applicationName);
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
      this.fileList = [];
      this.applicationUrl_back = undefined;
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        createTime: undefined,
        auditType: undefined,
        applicationUrl: undefined,
        submitter: undefined,
        currentState: undefined,
        auditTime: undefined,
        approver: undefined,
        applicationName: undefined
      };
      this.fileList = [];
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
      this.form.disabled = false;
      this.reset();
      this.open = true;
      this.title = "添加邀约评审";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      if (row.auditTime != undefined) {
        this.$alert("当前申请已经反馈，无法进行修改", "修改信息", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      } else {
        this.reset();
        const id = row.id || this.ids;
        getAssessment(id).then(response => {
          this.form = response.data;
          if (response.data.auditTime != undefined) {
            this.form.auditTime = response.data.auditTime.split(" ~ ");
          }

          var fileObj = {
            name: response.data.applicationName,
            url: response.data.applicationUrl
          };
          this.fileList.push(fileObj);
          this.open = true;
          this.title = "修改邀约评审";
        });
      }
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
          this.form.applicationUrl = this.applicationUrl_back;

          if (this.form.auditTime != undefined) {
            var startEndDates = this.form.auditTime;
            this.form.auditTime =
              startEndDates[0] + " ~ " + this.form.auditTime[1];
          }

          if (this.form.id != undefined) {
            console.log("修改提交");
            console.log(this.form);
            updateAssessment(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
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
      if (row.auditTime != undefined) {
        this.$alert("当前申请已经反馈，无法进行删除", "修改信息", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      } else {
        const ids = row.id || this.ids;
        this.$confirm("是否确认删除邀约评审数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(function() {
            return delAssessment(ids);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
          .catch(function() {});
      }
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
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
  .applicationBox{
    .el-table .cell{
      white-space: pre-line;
    }
  }
  .reviewOpinion{
    .el-drawer__open .el-drawer.rtl{
      padding:0 35px;
    }
  }

</style>
