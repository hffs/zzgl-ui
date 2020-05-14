<template>
  <div class="evaluation_table_box">
    <vxe-table
      border
      resizable
      row-key
      highlight-hover-row
      ref="xTable"
      keep-source
      :loading="loading"
      :data="tableDatae"
      :span-method="rowspanMethod"
      :edit-config="{trigger: 'click', mode: 'cell', showStatus: true, icon: 'fa fa-pencil'}"
      @cell-dblclick="cellDBLClickEvent"
    >
      <vxe-table-column type="seq" width="50" align="center"></vxe-table-column>
      <vxe-table-column field="essentialFactor" align="center" title="要素" width="90"></vxe-table-column>
      <vxe-table-column field="standardClauseNo" title="标准条款号" align="center" width="100"></vxe-table-column>
      <vxe-table-column field="maturityRequirements" title="成熟度要求">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            readonly="readonly"
            autosize
            v-model="scope.row.maturityRequirements"
            placeholder
            style="line-height: normal"
          ></el-input>
        </template>
      </vxe-table-column>
      <vxe-table-column field="keyIndicators" title="关键指标" align="center" width="150"></vxe-table-column>
      <vxe-table-column field="auditPoints" title="审核要点">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            readonly="readonly"
            autosize
            v-model="scope.row.auditPoints"
            placeholder
            style="line-height: normal"
          ></el-input>
        </template>
      </vxe-table-column>
      <vxe-table-column field="evaluationResult" title="评估情况说明" width="180">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            readonly="readonly"
            field="auditPoints"
            autosize
            v-model="scope.row.evaluationResult"
            placeholder
            style="line-height: normal"
          ></el-input>
          <p>
            <el-radio-group v-model="scope.row.status">
              <el-radio disabled label="1">满足要求</el-radio>
              <el-radio disabled label="2">改进项</el-radio>
              <el-radio disabled label="3">一般不符合</el-radio>
              <el-radio disabled label="4">严重不符合</el-radio>
            </el-radio-group>
          </p>
        </template>
      </vxe-table-column>
    </vxe-table>

    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-form-item label="评估情况">
            <el-input type="textarea" autosize v-model="form.evaluationResult"></el-input>
          </el-form-item>

          <el-form-item label="评估发现">
            <el-radio-group v-model="form.status">
              <el-radio label="1">满足要求</el-radio>

              <el-radio label="2">改进项</el-radio>

              <el-radio label="3">一般不符合</el-radio>

              <el-radio label="4">严重不符合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForme">确 定</el-button>
        <el-button @click="cancele">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { evaluationTableList, add } from "@/api/assessment/evaluationTable";
export default {
  name: "evaluationTable",
  data() {
    return {
      title: undefined,
      open: false,
      submitLoading: false,
      queryParams: {
        id: undefined,
        aid: undefined,
        type: undefined
      },
      aaid: undefined,
      form: {},
      tableDatae: [],
      selectRow: null,
      showEdit: false
    };
  },
  computed: {
    device() {
      return this.$store.state.app.device;
    }
  },
  created() {
    this.aaid = this.$route.params.eavid;

    this.loading = true;
    this.getList();
  },
  methods: {
    getList() {
      this.queryParams.aid = this.aaid;

      evaluationTableList(this.queryParams).then(response => {
        this.tableDatae = response.data;
        this.loading = false;
      });
    },

    rowspanMethod({ row, $rowIndex, column, data }) {
      let fields = [
        "essentialFactor",
        "standardClauseNo",
        "maturityRequirements",
        "keyIndicators",
        "auditPoints"
      ];
      let cellValue = row[column.property];
      if (cellValue && fields.includes(column.property)) {
        let prevRow = data[$rowIndex - 1];
        let nextRow = data[$rowIndex + 1];
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          let countRowspan = 1;
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = data[++countRowspan + $rowIndex];
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
    },
    cellDBLClickEvent({ row }) {
      this.editEvent(row);
    },
    editEvent(row) {
      this.title = "评估情况说明";
      this.form = {
        id: row.bid,
        aid: null,
        eid: row.id,
        status: row.status,
        evaluationResult: row.evaluationResult
      };
      this.selectRow = row;
      this.open = true;
    },

    submitForme() {
      this.form.aid = this.queryParams.aid;
      add(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("新增成功");
          this.open = false;
          this.loading = true;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    cancele() {
      this.open = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.evaluation_table_box {
  .vxe-header--row th {
    text-align: center;
  }
  .vxe-table .vxe-cell {
    padding: 10px;
  }
}
</style>