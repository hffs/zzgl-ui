<template>
  <div class="app-container fileManagement">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入文件夹名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 10px"
          />
        </div>
        <div class="head-container" style="margin-bottom: 10px;">
          <div class="allselect" style="font-weight: bold;">文件夹名称</div>
          <div class="allselect" @click="handleNodeClickall">全部文件</div>
          <div class="tree_ellipsis">
            <el-tree
              ref="tree"
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              default-expand-all
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form
          ref="queryForm"
          :model="queryParams"
          class="mmform"
          :inline="device!=='mobile'"
          label-width="68px"
        >
          <el-form-item label="文件名称" prop="fileName">
            <el-input
              v-model="queryParams.fileName"
              placeholder="请输入文件名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <!-- <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button
              v-hasPermi="['assessment:invitationfile:add']"
              type="success"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table
          v-loading="loading"
          :data="invitationFileList"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="selection" width="40" align="center" /> -->
          <el-table-column type="index" width="50" align="center" />
          <!-- <el-table-column label="用户编号" align="center" prop="userId" /> -->

          <el-table-column label="文件名称" align="center" min-width="110px" prop="fileName">
            <template slot-scope="scope">
              <a>
                <span class="colFileSpan" @click="preview(scope.row)">{{ scope.row.fileName }}</span>
              </a>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" :formatter="statusFormat" prop="status" />

          <!--  <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>-->
          <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['assessment:invitationfile:edit']"
              >修改</el-button>-->
              <el-button
                v-hasPermi="['assessment:invitationfile:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="reviewOpinion(scope.row)"
              >评审意见</el-button>
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
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="文件目录" prop="catalogId">
              <treeselect
                v-model="form.catalogId"
                style="line-height: 35px;height: 35px;"
                :options="deptOptions"
                placeholder="请选择文件归属目录"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="附件" prop="fileUrl">
              <el-upload
                ref="upload"
                class="upload-demo"
                drag
                multiple
                action="string"
                :v-model="form.fileUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :http-request="uploadFile"
                :file-list="fileList"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div slot="tip" class="el-upload__tip">可上传多个文件</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-drawer title="评审意见时间轴" :before-close="ceshi" :visible.sync="histry" direction="rtl" size="50%" class="reviewOpinion">
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
            >{{ activity.content }}</el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <el-divider />
      <!-- <div class="reviewForm">
        <el-form :model="form">
          <el-form-item label="评审意见" prop="desc">
            <el-input v-model="form.record" type="textarea" />
          </el-form-item>
        </el-form>

        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="formsubmiteniam(activities)"
          >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div> -->
    </el-drawer>
  </div>
</template>
<style>
.demo2 {
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 50px;
  background-color: #4cedef;
  z-index: 999;
}
</style>
<script>
import {
  updateInvitationfile,
  delInvitationFile,
  addInvitationFile,
  listInvitationFile,
  getHistryByFileId,
  initialization
} from '@/api/assessment/invitationFile'
import { treeselect } from '@/api/assessment/catalog'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { uploadAvatar } from '@/api/system/file'
import { formatDate } from '@/utils/index'
export default {
  name: 'InvitationFile',
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      histry: false,
      test: false,

      // 选中数组
      ids: [],
      fileList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      invitationFileList: null,
      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],

      // 点击选中ID

      catalogDefutId: undefined,
      activities: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        catalogId: undefined,
        fileName: undefined
      },
      // 表单校验
      rules: {
        // fileUrl: [
        //   { required: true, message: "用户昵称不能为空", trigger: "blur" }
        // ],
        catalogId: [
          { required: true, message: '文件目录不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    device() {
      return this.$store.state.app.device
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList()
    this.getTreeselect()
    this.getDicts('review_type').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listInvitationFile(this.queryParams).then(response => {
        console.log(response.rows)
        this.invitationFileList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    ceshi(done) {
      console.log('**************************************')
      done()
    },
    // 移除文件
    handleRemove(file, fileList) {
      this.fileList = fileList
      if (fileList.length == 0) {
        this.form.fileUrl = undefined
      }
    },
    handlePreview(file) {},
    preview(val) {
       this.downloadByPath(val.fileUrl,val.fileName);
    },
    // 上传文件方法
    uploadFile(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      uploadAvatar(formData)
        .then(response => {
          var fileObj = {
            name: response.name,
            url: process.env.VUE_APP_BASE_API + response.imgUrl
          }
          this.fileList.push(fileObj)
          this.form.fileUrl = this.fileList
          // this.form.picUrl = process.env.VUE_APP_BASE_API + response.imgUrl
        })
        .catch(response => {})
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      (this.catalogDefutId = undefined), (this.queryParams.catalogId = data.id)
      this.catalogDefutId = data.id
      this.getList()
    },
    // 节点获取全部
    handleNodeClickall() {
      this.queryParams.catalogId = ''
      this.getList()
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        catalogId: undefined,
        fileUrl: undefined
      }
      this.fileList = []
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.getTreeselect()
      if (this.catalogDefutId != undefined) {
        this.form.catalogId = this.catalogDefutId
      }
      this.open = true
      this.title = '添加用户'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.rules.password[0].required = false
      this.reset()
      this.getTreeselect()
      const userId = row.userId || this.ids
      getUser(userId).then(response => {
        var data = response.data
        this.form = response.data
        this.postOptions = response.posts
        this.roleOptions = response.roles
        this.form.postId = data.post.postId
        var roles = []
        for (var i = 0; i < data.roles.length; i++) {
          roles.push(data.roles[i].roleId)
        }
        this.form.roleIds = roles
        this.open = true
        this.title = '修改用户'
        this.form.password = ''
      })
    },

    reviewOpinion(row) {
      this.histry = true
      this.test = true
      this.title = row.fileName + '评审意见'
      this.fileId = row.fileId;
      (this.status = row.status),
      (this.activities = []),
      initialization({
        fileId: this.fileId
      }).then(response => {
        this.activities = response.data
      })
    },
    formsubmiteniam(activity) {
      let reviewList = activity;
      // (this.activities = []),
      getHistryByFileId({
        fileId: this.fileId,
        record: this.form.record,
        status: this.status
      }).then(response => {
        reviewList.push(response.data)
        this.activities = reviewList;
        console.log(this.activities,3333333)
        this.form.record = ''
      })
    },
    cancelForm() {
      this.form.record = ''
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.fileList.length > 0) {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.form.fileUrl = JSON.stringify(this.fileList)
            addInvitationFile(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('上传文件成功')
                this.open = false
                this.queryParams.catalogId = this.form.catalogId
                this.getList()
              } else {
                this.msgError(response.msg)
              }
              this.reset()
            })
          }
        })
      } else {
        this.$message({
          showClose: true,
          message: '附件不能为空',
          type: 'error'
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      if (row.status === '2') {
        this.$alert('当前文件已经审核，无法进行删除', '修改信息', {
          confirmButtonText: '确定',
          callback: action => {}
        })
      } else {
        const fileIds = row.fileId || this.ids
        this.$confirm(
          '是否确认删除用户名称为"' + row.fileName + '"的数据项?',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(function() {
            return delInvitationFile(fileIds)
          })
          .then(() => {
            this.getList()
            this.msgSuccess('删除成功')
          })
          .catch(function() {})
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .tree_ellipsis{
    .el-tree-node__label{
      width: 83%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .reviewOpinion{
    .el-drawer__open .el-drawer.rtl{
      padding:0 35px;
    }
    // .reviewForm{
    //   position: fixed;
    //   right:50px;
    //   bottom:50px;
    //   width:45%;
    // }
    // .source{
    //   max-height: 58vh;
    //   overflow-y: scroll;
    // }
  }

</style>
