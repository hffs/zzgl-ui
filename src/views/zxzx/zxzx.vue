<template>
  <div class="app-container ">
    <div class="zxzxbox">
      <div class="cktree">
        <div>
          <h1>咨询类型</h1>
          <div class="zxcknav" v-for="(v,index) in options" :key="index">
            <div class="firstnav">{{v.label}}</div>
            <div class="secondnav" :class="{hover:zindex==v.value+''+vv.value}" v-for="(vv,index2) in v.children" :key="index2"
              @click.stop="getdata2(v.value,vv.value)">{{vv.label}}</div>
          </div>
        </div>
      </div>
      <div class="zxrightbox">
        <div class="zxnodata2" v-if="teploding"><span>渲染模板中...</span></div>
        <div class="zxnodata" v-if="datalist==''">请先选择咨询类型</div>
        <div class="el-tabsbox" v-else>
          <el-tabs type="card" v-model="activeName">
            <el-tab-pane v-for="(v,index) in datalist" :key="index" :label="v.name" :name="index+'i'">
              <tableform :makeform="v" :dosub="dosub" :name="v.name" v-model="fsubform[index]" :tianform="tianform[index]"></tableform>
            </el-tab-pane>
          </el-tabs>
          <el-button class="suball" type="primary" @click="suball" :disabled="subdisabled">{{subtext}}</el-button>
        </div>
      </div>
    </div>

    <!-- <div class="checktype" v-if="datalist==''">
      <div class="checktypebox">
        <h1>请先选择咨询入口类型</h1>
        <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="120px" label-position="top">
          <div>
            <el-form-item prop="qualificationEntrance">
              <el-cascader :options="options" v-model="form.qualificationEntrance"></el-cascader>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer checktype-foot">
          <el-button size="la" type="primary" @click="getdata">确 定</el-button>
        </div>
      </div>
    </div> -->
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
    CascadeConsultationJson,
    getTempAndData
  } from "@/api/onlineApplication/template";
  import {
    updateManagement
  } from "@/api/onlineApplication/management";

  import tableform from './tableform'
  export default {
    name: 'zxzx',
    components: {
      tableform
    },
    data() {
      return {
        teploding: false,
        zindex: '',
        tianform: {},
        subdisabled: false,
        subtext: '提交',
        dosub: false,
        tepID: '',
        open: true,
        activeName: '0i',
        datalist: [],
        form: {},
        fsubform: {},
        options: [],
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
      }
    },
    computed: {
      level() {
        return this.$store.state.user.roles[0]
      },
      device() {
        return this.$store.state.app.device
      }
    },
    created() {
      this.getCascadeConsultationJson();
    },
    mounted() {
      // this.model = this.fApi.model();
    },
    methods: {
      // getdata() { //获取数据
      //   this.$refs["form"].validate(valid => {
      //     if (valid) {
      //       var data = {
      //         "qualificationEntranceBack": this.form.qualificationEntrance
      //       }
      //       getTempAndData(data).then(response => {
      //         var resdata = response.data
      //         var newdatalist = []
      //         var firstT = JSON.parse(resdata.templateData)
      //         for (var i = 0; i < firstT.length; i++) {
      //           newdatalist.push(JSON.parse(firstT[i]))
      //         }
      //         this.tepID = resdata.id
      //         this.datalist = newdatalist
      //       });
      //     }
      //   })
      // },
      suball() {
        var that = this
        this.dosub = !this.dosub
        setTimeout(function() {
          var substate = true;
          for (var key in that.fsubform) {
            if (that.fsubform[key] == '失败') {
              substate = false
            }
          }
          if (substate) {
            that.subtext = '提交中...';
            that.subdisabled = true;
            var data = JSON.stringify(that.fsubform)
            var requstdata = {
              id: that.tepID,
              managementData: data
            }
            updateManagement(requstdata).then(response => {
              that.subtext = '提交';
              that.subdisabled = false;
              if (response.code !== 200) {
                that.$message.error('保存失败，请检查网络');
              } else {
                that.$message.success('保存成功');
              }
            });

          }
        }, 1000)
      },
      getCascadeConsultationJson() { //获取资质申请流程类型
        CascadeConsultationJson().then(response => {
          this.options = JSON.parse(response.data)
        });
      },
      getdata2(data1, data2) { //获取数据
        this.teploding = true;
        this.zindex = data1 + '' + data2
        var qualificationEntrance = [data1, data2]
        var data = {
          "qualificationEntranceBack": qualificationEntrance
        }
        getTempAndData(data).then(response => {
          if (response.code == 200) {
            this.teploding = false;
            this.activeName= '0i'
            if (typeof response.data == "undefined") {
              this.datalist = ''
              this.$notify({
                title: '提醒',
                message: '模板数据尚未加载!请联系管理员',
                type: 'warning'
              });
              return
            }
            var resdata = response.data
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
              this.fsubform['sbudata' + i]
            }
            this.tepID = resdata.id
            this.datalist = newdatalist
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  body {
    background: #fff;
  }


  .suball {
    display: flex;
    margin: auto;
  }

  .zxzxbox {
    padding: 20px;
    background: #fff;
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .zxzxbox .cktree {
    min-width: 200px;
    width: 200px;
    padding-right: 20px;
    border-right: 1px #eee solid;
    margin-right: 20px;
  }

  .zxzxbox .cktree h1 {
    font-size: 14px;
    text-align: left;
    margin-top: 0;
  }

  .zxzxbox .zxcknav {
    margin-bottom: 10px;
  }

  .zxcknav .firstnav {
    font-weight: bold;
    font-size: 14px;
    line-height: 30px;
    background: #5A8EF6;
    padding: 0 10px;
    margin-bottom: 10px;
    color: #fff;
  }

  .zxcknav .secondnav {
    margin: 0 20px;
    font-weight: normal;
    font-size: 14px;
    line-height: 30px;
    border-bottom: 1px #eee solid;
    cursor: pointer;
    padding: 0 10px;
    color: #666;
  }

  .zxcknav .firstnav,
  .zxcknav .secondnav {
    border-radius: 5px;
  }

  .zxcknav .secondnav:hover,
  .zxcknav .secondnav.hover {
    background: #5A8EF6;
    color: #fff;
  }

  .zxrightbox {
    position: relative;
    display: flex;
    flex: 1;
    z-index: 1;
    height: 100%;
  }

  .zxnodata {
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999;
    font-size: 16px;
  }

  .zxnodata2 {
    box-sizing: border-box;
    padding-top: 50px;
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #333;
    font-size: 16px;
    background: rgba(255, 255, 255, 0.6);
    text-align: center;
  }

  .app-container {
    height: 100%;
  }

  .zxrightbox .el-tabsbox {
    height: 100%;
    width: 100%;
  }

  .zxrightbox .el-tabs {
    height: 100%;
    height: calc(100% - 36px) !important;
  }

  .zxrightbox>>>.el-tabs__content {
    height: calc(100% - 16px - 55px) !important;
    overflow-y: scroll;
    border-bottom: 1px #eee solid;
  }
</style>
