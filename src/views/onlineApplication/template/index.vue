<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="流程名称" prop="qualificationName">
        <el-input v-model="queryParams.qualificationName" placeholder="请输入流程名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['onlineApplication:template:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['onlineApplication:template:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['onlineApplication:template:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['onlineApplication:template:export']">导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="templateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模板名称" align="center" prop="qualificationName" />
      <el-table-column label="咨询入口类型" prop="qualificationEntrance" align="center">
        <template slot-scope="scope">
          <el-cascader :options="options" disabled="disabled" v-model="scope.row.qualificationEntrance"></el-cascader>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['onlineApplication:template:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['onlineApplication:template:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <el-dialog :title="title" :visible.sync="open" width="500px" @close="cancel" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div style="border-bottom: 1px #ccc solid;">
          <el-form-item label="咨询入口类型" prop="qualificationEntrance">
            <el-cascader :options="options" v-model="form.qualificationEntrance" @change="opchange"></el-cascader>
          </el-form-item>
          <el-form-item label="选项卡名称" prop="name">
            <el-input v-model="form.name" maxlength="200" placeholder="请输入选项卡名称" />
          </el-form-item>
          <el-form-item label="添加字段">
            <el-button type="success" size="mini" @click="addint">添加</el-button>
          </el-form-item>
        </div>
        <div style="max-height: 500px;overflow-y: auto;">
          <div class="addnewtabbox" v-for="(v,index) in newint" :key="index">
            <el-form-item label="label名称" prop="label">
              <el-input v-model="v.label" maxlength="200" placeholder="请输入label" />
            </el-form-item>
            <!-- <el-form-item label="key(字段名)" prop="key">
              <el-input v-model="v.key" maxlength="200" placeholder="请输入key" />
            </el-form-item> -->
            <el-form-item label="是否必填" prop="required">
              <el-switch v-model="v.required"></el-switch>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="v.type" placeholder="请选择类型" @change="changetype($event,index)">
                <el-option label="input(单行文本)" value="input"></el-option>
                <el-option label="textarea(多行文本)" value="textarea"></el-option>
                <el-option label="select(下拉选择)" value="select"></el-option>
                <el-option label="switch(开关)" value="switch"></el-option>
                <el-option label="日期选择器" value="date-picker"></el-option>
                <el-option label="时间选择器" value="time-picker"></el-option>
                <el-option label="日期时间选择器" value="datetime-picker"></el-option>
                <el-option label="上传按钮" value="upload"></el-option>
                <el-option label="可增加删除列表" value="table"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表单验证" prop="rule" v-if="v.showinput">
              <el-select v-model="v.rule" placeholder="请选择表单验证">
                <el-option label="验证手机" value="phone"></el-option>
                <el-option label="验证只能输入字母" value="str"></el-option>
                <el-option label="验证只能输入汉字" value="han"></el-option>
                <el-option label="验证只能输入数字整数" value="int"></el-option>
                <el-option label="验证只能输入字母或数字" value="intstr"></el-option>
                <el-option label="验证身份证" value="idcard"></el-option>
                <el-option label="验证邮箱" value="email"></el-option>
                <el-option label="验证网址" value="url"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文本框默认提示" prop="placeholder" v-if="v.showinput">
              <el-input v-model="v.placeholder" maxlength="200" placeholder="请输入placeholder" />
            </el-form-item>
            <el-form-item label="下拉数据" prop="selectdata" v-if="v.showselect">
              <el-input v-model="v.selectdata" maxlength="200" placeholder="请输入下拉数据" />
              <p style="color: #999;line-height: initial;">据格式(数据名_数据)例：name_value 多条用英文","隔开</p>
            </el-form-item>
            <el-form-item label="table表头和字段" prop="tabledata" v-if="v.showtable">
              <el-input v-model="v.tabledata" maxlength="200" placeholder="请输入table表头和字段" />
              <p style="color: #999;line-height: initial;">据格式(表头文字_表头对应字段)例：标题_title 多条用英文","隔开</p>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input type="textarea" v-model="v.remarks" maxlength="300" placeholder="请输入备注" />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="subaddnewtab">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listTemplate,
    getTemplate,
    delTemplate,
    addTemplate,
    updateTemplate,
    exportTemplate,
    CascadeConsultationJson
  } from "@/api/onlineApplication/template";

  export default {
    data() {
      return {
        zindex:0,
        newint: [],
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
        // 资质申请模板表格数据
        templateList: [],

        options: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          qualificationName: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          qualificationType: [{
            required: true,
            message: "资质申请流程类型不能为空",
            trigger: ["blur", "change"]
          }],
          name: [{
            required: true,
            message: "流程名称不能为空",
            trigger: ["blur", "change"]
          }],
          qualificationEntrance: [{
            required: true,
            message: "咨询入口类型不能为空",
            trigger: ["blur", "change"]
          }]
        }
      };
    },
    created() {
      this.getList();
      this.getCascadeConsultationJson();
    },
    methods: {
      cancel() { //取消按钮
        this.open = false;
        this.reset();
        this.$refs["form"].resetFields();
        this.zindex=0
      },
      opchange(e) {
        // console.log(this.form.qualificationEntrance)
      },
      /** 查询资质申请模板列表 */
      getList() {
        this.loading = true;
        listTemplate(this.queryParams).then(response => {
          for(var i=0;i<response.rows.length;i++){
            response.rows[i].qualificationEntrance=JSON.parse(response.rows[i].qualificationEntrance)
          }
          this.templateList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      getCascadeConsultationJson() { //获取资质申请流程类型
        CascadeConsultationJson().then(response => {
          this.options = JSON.parse(response.data)
        });
      },
      changetype(e, index) { //类型选择
        this.newint[index].value = ''
        this.newint[index].showinput = false;
        this.newint[index].showselect = false;
        this.newint[index].showtable = false;
        if (e == 'input' || e == 'textarea') {
          this.newint[index].showinput = true
        }
        if (e == 'select') {
          this.newint[index].showselect = true
        }
        if (e == 'table') {
          this.newint[index].showtable = true
          this.newint[index].required = false
        }
        if (e == 'upload') {
          this.newint[index].value = []
        }
      },
      addint() { //添加字段
        this.newint.push({
          key: 'key'+this.zindex++,
          label: '',
          placeholder: '',
          type: '',
          required: false,
          rule: '',
          remarks: '',
          selectdata: '',
          tabledata: '',
          showselect: false,
          showinput: false,
          showtable: false
        })
      },
      // 表单重置
      reset() {
        this.newint = []
        this.form = {}
        // this.resetForm("form");
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
        this.title = "添加资质申请模板";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids;
        getTemplate(id).then(response => {
          this.form = response.data;
          this.form.qualificationEntrance = JSON.parse(response.data.qualificationEntrance.split(","));
          var templateData = JSON.parse(response.data.templateData);
          this.form.name = templateData.name
          this.newint = templateData.form
          this.zindex=this.newint.length
          this.open = true;
          this.title = "修改资质申请模板";
        });
      },
      subaddnewtab() { //提交字段
        this.$refs["form"].validate(valid => {
          if (valid) {
            var fromkey = []
            for (var i = 0; i < this.newint.length; i++) {
              fromkey.push(this.newint[i].key)
            }
            // console.log(fromkey)
            var templatedata = {}
            templatedata['name'] = this.form.name
            // templatedata['qualificationEntrance'] = this.form.qualificationEntrance
            templatedata['form'] = this.newint
            templatedata['fromkey'] = fromkey
            var myform = {}
            myform['qualificationEntrance'] = JSON.stringify(this.form.qualificationEntrance)
            myform['qualificationName'] = this.form.name
            myform['id'] = this.form.id
            myform['templateData'] = JSON.stringify(templatedata)
            // return
            if (this.form.id != undefined) {
              updateTemplate(myform).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addTemplate(myform).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
            this.cancel()
          }
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          this.form.qualificationEntrance = JSON.stringify(this.form.qualificationEntrance);
          if (valid) {
            console.log(this.form)
            return
            if (this.form.id != undefined) {
              updateTemplate(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {

              addTemplate(this.form).then(response => {
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
            '是否确认删除资质申请模板编号为"' + ids + '"的数据项?',
            "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(function() {
            return delTemplate(ids);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
          .catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm("是否确认导出所有资质申请模板数据项?", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(function() {
            return exportTemplate(queryParams);
          })
          .then(response => {
            this.download(response.msg);
          })
          .catch(function() {});
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-tabsbox {
    background: #fff;
    padding: 10px;
    padding-top: 0;
  }

  .addnewtabbox {
    border-top: 1px #ccc dashed;
    padding-top: 10px;
  }

  .addnewtabbox .el-form-item {
    margin-bottom: 5px;
  }
</style>
