<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" class="mmform" :inline="device!=='mobile'" label-width="68px">
      <el-form-item label="租户编码" prop="tenantNo">
        <el-input
          v-model="queryParams.tenantNo"
          placeholder="请输入租户编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租户名称" prop="tenantName">
        <el-input
          v-model="queryParams.tenantName"
          placeholder="请输入租户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租户状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="租户状态"
          clearable
          size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="租户角色">
        <el-select v-model="queryParams.roleId" placeholder="请选择">
          <el-option
            v-for="item in roleOptions"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
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
          v-hasPermi="['systemq:tenant:add']"
        >新增</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="tenantList" @selection-change="handleSelectionChange">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="租户编码" align="center" prop="tenantNo" min-width="110px" />
      <el-table-column label="租户名称" align="center" prop="tenantName" min-width="110px" />
      <el-table-column label="租户账号" align="center" min-width="110px">admin</el-table-column>
      <el-table-column label="租户角色" align="center" prop="roleName" min-width="110px" />
      <el-table-column label="联系人" align="center" prop="contact" min-width="110px" />
      <el-table-column label="联系电话" align="center" prop="phone" min-width="110px" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark" min-width="110px" />

      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row,'see')"
            v-hasPermi="['systemq:tenant:edit']"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,'edit')"
            v-hasPermi="['systemq:tenant:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['systemq:tenant:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-key"
            @click="handleResetPwd(scope.row)"
            v-hasPermi="['system:user:resetPwd']"
          >重置密码</el-button>
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

    <!-- 添加、查看、修改系统租户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="租户编码" prop="tenantNo">
          <el-input :disabled="mdisbled" v-model="form.tenantNo" maxlength="20" placeholder="请输入租户编码" />
        </el-form-item>
        <el-form-item label="租户名称" prop="tenantName">
          <el-input :disabled="mdisbled" v-model="form.tenantName" maxlength="20" placeholder="请输入租户名称" />
        </el-form-item>
        <el-form-item label="租户账号" prop="admin">
          <el-input :disabled="true" value="admin" maxlength="20" placeholder="请输入租户账号" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input :disabled="mdisbled" v-model="form.contact" maxlength="20" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input :disabled="mdisbled" v-model="form.phone" maxlength="11" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input :disabled="mdisbled" v-model="form.address" maxlength="50" placeholder="请输入联系地址" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            active-value="0"
            inactive-value="1"
          ></el-switch>
        </el-form-item>

        <el-form-item label="租户角色" prop="roleName">
          <el-select v-model="form.roleName" placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
              :disabled="mdisbled"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="备注信息" prop="remark">
          <el-input  :disabled="mdisbled" type="textarea" maxlength="200" v-model="form.remark" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!mdisbled" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, exportRole, dataScope, changeRoleStatus } from "@/api/systemq/role";
import { listTenant, getTenant, delTenant, addTenant, updateTenant, changeTenantStatus, resetTenantPwd, exportTenant ,TenantMenuTreeselect } from "@/api/systemq/tenant";
import { treeselect as menuTreeselect } from "@/api/system/menu";
export default {
  data() {
    var checkAuthCode = (rule, value, callback) => {
      var t=/^[0-9a-zA-Z]*$/g;
      var p=t.test(value)
      if (!value) {
        return callback(new Error('租户编码不能为空'))
      } else if (!p) {
        callback(new Error('租户编码只能输入字母数字'))
      } else {
        callback()
      }
    }
    return {
      // 角色选项
      roleOptions: [],
      mdisbled:false,
      // 菜单列表
      menuOptions: [],
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
      // 系统租户表格数据
      tenantList: [],
      // 状态数据字典
      statusOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tenantNo: undefined,
        tenantName: undefined,
        contact: undefined,
        phone: undefined,
        address: undefined,
        status: undefined,
        dueTime: undefined,
        roleId:''
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        tenantNo: [
          {validator: checkAuthCode, required: true, trigger: "blur" }
        ],
        tenantName: [
          { required: true, message: "租户名称不能为空", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
          { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }
        ],
        address: [
          { required: true, message: "联系地址不能为空", trigger: "blur" }
        ],
        roleName: [
          { required: true, message: "租户角色不能为空", trigger: "blur" }
        ]
      },
      menuIdx:[]
    };
  },
  computed: {
    device() {
      return this.$store.state.app.device
    }
  },
  created() {
    this.getList();
    this.getroleList()
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询角色列表 */
    getroleList() {
      listRole().then(
        response => {
          this.roleOptions=[]
          var data = response.rows;
          for(var i=0;i<data.length;i++){
            this.roleOptions.push({
              roleName:data[i].name,
              roleId:data[i].id
            })
          }
          // this.total = response.total;
          // this.loading = false;
        }
      );
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有菜单节点数据
    // getMenuAllCheckedKeys() {//返回树状选择的数组
    //   var checkedKeys=this.$refs.menu.getCheckedKeys()
    //   return checkedKeys;
    // },
    /** 查询菜单树结构 */
    getMenuTreeselect(tenantId) {//初始化多选框并查询默认选中，如果ID为空则清空
      // this.menuOptions =[]
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
        if(!tenantId){
          this.form.menuIds=[]
          this.menuIdx=[]
          return
        }
        TenantMenuTreeselect(tenantId).then(response => {
          this.form.menuIds=response.data
          this.menuIdx=response.data
        });
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.tenantName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
          resetTenantPwd(row.tenantId, value).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功，新密码是：" + value);
            } else {
              this.msgError(response.msg);
            }
          });
        }).catch(() => {});
    },
    // 租户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '" "' + row.tenantName + '"租户吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeTenantStatus(row.tenantId, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /** 查询系统租户列表 */
    getList() {
      this.loading = true;
      listTenant(this.queryParams).then(response => {
        this.tenantList = response.rows;
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
        tenantId: undefined,
        tenantNo: undefined,
        tenantName: undefined,
        contact: undefined,
        phone: undefined,
        address: undefined,
        status: "0",
        dueTime: undefined,
        createTime: undefined,
        updateTime: undefined,
        remark: undefined,
      };
      this.resetForm("form");
      this.menuIdx=[]
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
      this.ids = selection.map(item => item.tenantId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getroleList()
      // this.getMenuTreeselect()
      this.mdisbled=false;
      this.open = true;
      this.title = "添加系统租户";
    },
    /** 修改按钮操作 */
    handleUpdate(row,type) {
      this.reset();
      const tenantId = row.tenantId || this.ids
      getTenant(tenantId).then(response => {
        this.form = response.data;
        // this.getMenuTreeselect(tenantId)
        this.getroleList()
        this.open = true;
        if(type=='see'){
          this.title = "查看系统租户";
          this.mdisbled=true
        }else{
          this.title = "修改系统租户";
          this.mdisbled=false
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.tenantId != undefined) {
            updateTenant(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTenant(this.form).then(response => {
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
      const tenantIds = row.tenantId || this.ids;
      this.$confirm('是否确认删除系统租户名称为"' + row.tenantName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTenant(tenantIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有系统租户数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTenant(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
