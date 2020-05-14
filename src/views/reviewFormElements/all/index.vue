<template>
  <div class="app-container">
    <div>
      <el-divider content-position="left"><h3>人员信息</h3></el-divider>
    </div>
    <vxe-toolbar>
      <template v-slot:buttons>
        <vxe-button icon="fa fa-plus vxe-success-color" status="perfect" @click="insertEvent(0)">新增</vxe-button>
        <vxe-button icon="fa fa-trash-o vxe-danger-color" status="perfect" @click="removeEvent(0)">删除</vxe-button>
        <vxe-button icon="fa fa-save vxe-primary-color" status="perfect" @click="saveEvent(0)">保存</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="personnelTable"
      border
      resizable
      height="300"
      stripe
      highlight-current-row
      keep-source
      :data="personnelTableData"
      :edit-config="{ trigger: 'dblclick', mode: 'cell', showStatus: true, icon: 'fa fa-pencil' }"
      :edit-rules="validRulesPersonnel"
      @edit-closed="editClosedEvent"
    >
      <vxe-table-column type="checkbox" width="60" />
      <vxe-table-column type="seq" width="60" />
      <vxe-table-column title="基本信息">
        <vxe-table-column field="position" title="职位" :edit-render="{ name: 'input', defaultValue: '默认的名字' }" />
        <vxe-table-column field="personName" title="姓名" :edit-render="{ name: 'input' }" />
      </vxe-table-column>
      <vxe-table-column title="详细信息">
        <vxe-table-column field="school" title="毕业院校" :edit-render="{ name: 'input' }" />
        <vxe-table-column field="major" title="专业" :edit-render="{ name: 'input' }" />
        <vxe-table-column field="education" title="学历" :edit-render="{ name: '$select', options: majorList }" />
        <vxe-table-column field="qualificationCertificate" title="资质证书" :edit-render="{ name: 'input' }" />
        <vxe-table-column field="workingLife" title="工作年限" :edit-render="{ name: '$input', props: { type: 'integer', min: 1 } }">
          <template v-slot="{ row }">
            {{ row.workingLife }} 年
          </template>
        </vxe-table-column>
      </vxe-table-column>
    </vxe-table>
    <!-- ********************************************************************************************************************* -->
    <div>
      <el-divider content-position="left"><h3>运维合同信息</h3></el-divider>
    </div>
    <vxe-toolbar>
      <template v-slot:buttons>
        <vxe-button icon="fa fa-plus vxe-success-color" status="perfect" @click="insertEvent(1)">新增</vxe-button>
        <vxe-button icon="fa fa-trash-o vxe-danger-color" status="perfect" @click="removeEvent(1)">删除</vxe-button>
        <vxe-button icon="fa fa-save vxe-primary-color" status="perfect" @click="saveEvent(1)">保存</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="contractTable"
      border
      resizable
      height="300"
      stripe
      show-overflow
      highlight-current-row
      keep-source
      :data="contractTableData"
      :edit-config="{ trigger: 'dblclick', mode: 'cell', showStatus: true, icon: 'fa fa-pencil' }"
      :edit-rules="validRulescontract"
      @edit-closed="editClosedEvent"
    >
      <vxe-table-column type="checkbox" width="60" />
      <vxe-table-column type="seq" width="60" />
      <vxe-table-column field="contractName" title="合同名称" :edit-render="{ name: 'input', defaultValue: '默认的名字' }">
        <template v-slot="{ row }">
          《{{ row.contractName }}》
        </template>
      </vxe-table-column>
      <vxe-table-column title="详细信息">
        <vxe-table-column field="baginTime" title="开始时间" :edit-render="{ name: '$input', props: { type: 'date' } }" />
        <vxe-table-column field="period" title="合同期限" :edit-render="{ name: '$input', props: { type: 'integer', min: 1 } }">
          <template v-slot="{ row }">
            {{ row.period }} 年
          </template>
        </vxe-table-column>
        <vxe-table-column field="described" title="服务内容" :edit-render="{ name: 'textarea' }" />
      </vxe-table-column>
    </vxe-table>
    <!-- *********************************************************************************************************** -->
    <div>
      <el-divider content-position="left"><h3>研发信息</h3></el-divider>
    </div>
    <vxe-toolbar>
      <template v-slot:buttons>
        <vxe-button icon="fa fa-plus vxe-success-color" status="perfect" @click="insertEvent(2)">新增</vxe-button>
        <vxe-button icon="fa fa-trash-o vxe-danger-color" status="perfect" @click="removeEvent(2)">删除</vxe-button>
        <vxe-button icon="fa fa-save vxe-primary-color" status="perfect" @click="saveEvent(2)">保存</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="developmentTable"
      border
      resizable
      height="300"
      stripe
      show-overflow
      highlight-current-row
      keep-source
      :data="developmentTableData"
      :edit-config="{ trigger: 'dblclick', mode: 'cell', showStatus: true, icon: 'fa fa-pencil' }"
      :edit-rules="validRulesdevelopment"
      @edit-closed="editClosedEvent"
    >
      <vxe-table-column type="checkbox" width="60" />
      <vxe-table-column type="seq" width="60" />
      <vxe-table-column title="基本信息">
        <vxe-table-column field="develpmentName" title="项目名称" :edit-render="{ name: 'input', defaultValue: '默认的名字' }">
          <template v-slot="{ row }">
            《{{ row.develpmentName }}》
          </template>
        </vxe-table-column>
        <vxe-table-column field="develpmentType" title="项目类型" :edit-render="{ name: '$select', options: developList }" />
        <vxe-table-column field="funds" title="经费预算" :edit-render="{ name: '$input', props: { type: 'integer', min: 1 } }">
          <template v-slot="{ row }">
            ￥：{{ row.funds }} 万元
          </template>
        </vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="详细信息">
        <vxe-table-column title="人员信息">
          <vxe-table-column field="projectLeader" title="负责人" :edit-render="{ name: 'input', defaultValue: '默认的名字' }" />
          <vxe-table-column field="team" title="团队人员" :edit-render="{ name: 'input', defaultValue: '默认的名字' }" />
        </vxe-table-column>
        <vxe-table-column title="项目信息">
          <vxe-table-column field="starTime" title="开始时间" :edit-render="{ name: '$input', props: { type: 'date' } }" />
          <vxe-table-column field="endTime" title="结束时间" :edit-render="{ name: '$input', props: { type: 'date' } }" />
          <vxe-table-column field="postponed" title="是否延期" :edit-render="{ name: '$radio'}">
            <template v-slot="{ row }">
              <vxe-radio-group v-model="row.postponed">
                <vxe-radio label="是">是</vxe-radio>
                <vxe-radio label="否">否</vxe-radio>
              </vxe-radio-group>
            </template>
          </vxe-table-column>
          <vxe-table-column field="projectBriefIntroduction" title="项目简介" :edit-render="{ name: 'textarea', defaultValue: '默认的名字' }" />
        </vxe-table-column>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import { list, update, add, deleted } from '@/api/reviewFormElements/reviewFormElements'
export default {
  data() {
    return {
      /** 公共参数*/
      loading: false,
      queryParams: {},
      reviewFormElements: {
        personnelUrl: '/reviewFormElements/reviewPersonnel',
        contractUrl: '/reviewFormElements/reviewContract',
        developmentUrl: '/reviewFormElements/reviewDevelopment'
      },
      /**
       * personnel
       */
      personnelTableData: [],
      majorList: [
        { label: '博士', value: '博士' },
        { label: '研究生', value: '研究生' },
        { label: '本科', value: '本科' },
        { label: '专科', value: '专科' },
        { label: '其他', value: '其他' }
      ],
      validRulesPersonnel: {
        position: [{ required: true, message: '职位必须填写' }],
        personName: [{ required: true, message: '内容必须填写' }],
        school: [{ required: true, message: '内容必须填写' }],
        major: [{ required: true, message: '内容必须填写' }],
        education: [{ required: true, message: '内容必须填写' }],
        workingLife: [{ required: true, message: '内容必须填写' }]
      },
      /** *****************************结束符************************************/
      contractTableData: [],
      validRulescontract: {
        contractName: [{ required: true, message: '职位必须填写' }],
        baginTime: [{ required: true, message: '内容必须填写' }],
        period: [{ required: true, message: '内容必须填写' }],
        described: [{ required: true, message: '内容必须填写' }]
      },
      /** *****************************结束符************************************/
      developmentTableData: [],
      validRulesdevelopment: {
        developmentName: [{ required: true, message: '职位必须填写' }],
        baginTime: [{ required: true, message: '内容必须填写' }],
        period: [{ required: true, message: '内容必须填写' }],
        described: [{ required: true, message: '内容必须填写' }]
      },
      developList: [{ label: '发现问题', value: '发现问题' }, { label: '解决问题', value: '解决问题' }, { label: '新技术研究', value: '新技术研究' }]
    }
  },
  created() {
    this.personnellist()
    this.contractlist()
    this.developmentlist()
  },
  methods: {

    personnellist() {
      this.loading = true
      list(this.queryParams, this.reviewFormElements.personnelUrl).then(response => {
        response.data.forEach((val) => {
          val.tableIndex = 0;
        })
        this.personnelTableData = response.data
        this.loading = false
      })
    },
    contractlist() {
      this.loading = true
      list(this.queryParams, this.reviewFormElements.contractUrl).then(response => {
        response.data.forEach((val) => {
          val.tableIndex = 1;
        })
        this.contractTableData = response.data
        this.loading = false
      })
    },
    developmentlist() {
      this.loading = true
      list(this.queryParams, this.reviewFormElements.developmentUrl).then(response => {
        response.data.forEach((val) => {
          val.tableIndex = 2;
        })
        this.developmentTableData = response.data
        this.loading = false
      })
    },
    // 确认是第几个table
    confirmIndex(index){
      let tableInfo;
      let urlInfo;
      if (index == 0) {
        tableInfo = this.$refs.personnelTable;
        urlInfo = this.reviewFormElements.personnelUrl;
      } else if (index == 1) {
        tableInfo = this.$refs.contractTable;
        urlInfo = this.reviewFormElements.contractUrl;
      } else if (index == 2) {
        tableInfo = this.$refs.developmentTable;
        urlInfo = this.reviewFormElements.developmentUrl;
      }
      return {
        tableInfo: tableInfo,
        urlInfo: urlInfo
      }
    },
    editClosedEvent({ row, column }) {
      let index = row.tableIndex;
      let confirmIndex = this.confirmIndex(index);
      const field = column.property
      const cellValue = row[field]
      // 判断单元格值是否被修改
      if (confirmIndex.tableInfo.isUpdateByRow(row, field)) {
        confirmIndex.tableInfo.validate(valid => {
          if (valid) {
            setTimeout(() => {
              update(row, confirmIndex.urlInfo).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                } else {
                  this.msgError(response.msg)
                }
              })
              confirmIndex.tableInfo.reloadRow(row, null, field)
            }, 300)
          }
        })
      }
    },
    insertEvent(index) {
      const record = {}
      let confirmIndex = this.confirmIndex(index);
      confirmIndex.tableInfo.insert(record).then(({ row }) => {
        row.tableIndex = index;
        confirmIndex.tableInfo.setActiveCell(row, 'key')
      })
    },
    removeEvent(index) {
      let confirmIndex = this.confirmIndex(index);

      const selectRecords = confirmIndex.tableInfo.getCheckboxRecords()
      if (selectRecords.length) {
        this.$XModal.confirm('您确定要删除选中的数据吗?').then(type => {
          if (type === 'confirm') {
            console.log(selectRecords)
            deleted(selectRecords, confirmIndex.urlInfo).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                confirmIndex.tableInfo.removeCheckboxRow()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        })
      } else {
        this.$XModal.message({ message: '请至少选择一条数据', status: 'error' })
      }
    },
    saveEvent(index) {
      let confirmIndex = this.confirmIndex(index);

      const body = confirmIndex.tableInfo.getRecordset()
      const { insertRecords } = body
      if (insertRecords.length) {
        confirmIndex.tableInfo.validate(valid => {
          if (valid) {
            add(body.insertRecords, confirmIndex.urlInfo).then(response => {
              this.msgSuccess(response.msg)
              this.personnellist()
            })
          }
        })
      } else {
        this.msgSuccess('数据未发生改变！')
      }
    }
  }
}
</script>

<style></style>