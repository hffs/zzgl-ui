<template>
  <div class="dashboard-editor-container">

    <panel-group :paneldata="paneldata" @handleSetLineChartData="handleSetLineChartData" />

   <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row> -->
    <el-row>
      <el-col :span="24">
        <div class="chart-wrapper">
          <BarChartsolo :chart-data="BarChartsolodata"></BarChartsolo>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartdata" />
        </div>
      </el-col>
      <el-col v-if="level!=='super'" :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <!-- <raddar-chart /> -->
          <div class="indextable">
            <div class="indextabletit">企业资质统计</div>
            <div class="indextablec">
              <el-table class="el-tablex" :data="tableList">
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column label="资质名称" align="center" prop="name" min-width="110px" />
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
      <el-col v-if="level!=='super'" :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <PieChartnormal :chart-data="pieCharnormaltdata"></PieChartnormal>
          <!-- <bar-chart /> -->
        </div>
      </el-col>
      <el-col v-if="level=='super'" :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <BarChartsolo height="300px" :chart-data="BarChartsolodata2"></BarChartsolo>
        </div>
      </el-col>
    </el-row>
    <!-- level=='super' -->
    <el-row>
      <el-col v-if="level!=='super'" :span="24">
        <div class="chart-wrapper">
          <BarChartsolo :chart-data="BarChartsolodata2"></BarChartsolo>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getindexdata,getshengdata,getzhengdata,getqiyedata,getqyrenyuandata,getzztpdata
  } from '@/api/pindex'
  import PanelGroup from './dashboard/PanelGroup'
  import LineChart from './dashboard/LineChart'
  import RaddarChart from './dashboard/RaddarChart'
  import PieChart from './dashboard/PieChart'
    import PieChartnormal from './dashboard/PieChartnormal'
  import BarChart from './dashboard/BarChart'
  import BarChartsolo from './dashboard/BarChart-solo'
  export default {
    name: 'Index',
    components: {
      PanelGroup,
      LineChart,
      RaddarChart,
      PieChart,
      BarChart,
      BarChartsolo,
      PieChartnormal
    },
    data() {
      return {
        tableList:[],
        BarChartsolodata:{
          barBorderRadius:[50, 50, 0, 0],
          linercolor:['#39dbff','#0e82ff'],
          title:'国家省市自治区政策统计',
          dataname:'政策数量',
          names:[],
          values:[]
        },
        BarChartsolodata2:{
          barBorderRadius:[0, 0, 0, 0],
          linercolor:['#10B0FF','#10B0FF'],
          title:'资质图谱图表',
          dataname:'资质数量',
          names:[],
          values:[]
        },
        pieChartdata:{
          names:[],
          values:[]
        },
        pieCharnormaltdata:{
          names:[],
          values:[]
        },
        paneldata:[],
        lineChartData: {
          legend: ['2019国家政策', '2020国家政策'],
          xAxisdata: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          expectedData: [100, 120, 161, 134, 105, 160, 155, 125, 135, 145, 155, 175],
          actualData: [120, 82, 91, 154, 162, 140, 145, 115, 155, 135, 115, 165]
        }
      }
    },
    computed:{
      level(){
        return this.$store.state.user.roles[0]
      }
    },
    created() {
      this.getdata()
    },
    mounted() {
    },
    methods: {
      getdata(){
        if(this.level=='super'){
          getindexdata().then(res => {//平台端-租户使用情况
            var data=res.data
            var paneldata=[]
            for(var key in data){
              paneldata.push({
                name:key,
                value:data[key]
              })
            }
            this.paneldata=paneldata
          })
        }
        getshengdata().then(res => {//国家政策统计
          var data=res.data
          data=data.sort(function(a, b) {
                return b.数量 - a.数量;
              })
          var shengnames=[]
          var shengdata=[]
          for(var i=0;i<data.length;i++){
            shengnames.push(data[i].省份)
            shengdata.push(data[i].数量)
          }
          this.BarChartsolodata.names=shengnames
          this.BarChartsolodata.values=shengdata
        })
        getzhengdata().then(res => {//国家政策统计-政策类型
          var data=res.data
          data=data.sort(function(a, b) {
                return b.数量 - a.数量;
              })
          var shengnames=[]
          var shengdata=[]
          for(var i=0;i<data.length;i++){
            shengnames.push(data[i].政策类型)
            shengdata.push({
              name:data[i].政策类型,
              value:data[i].数量,
            })
          }
          this.pieChartdata.names=shengnames
          this.pieChartdata.values=shengdata
        })
        getqiyedata().then(res => {//企业资质统计
          var data=res.data
          var tableList=[]
          for(var i=0;i<data.length;i++){
            tableList.push({
              name:data[i].资质名称,
            })
          }
          this.tableList=tableList
        })
        // getqyrenyuandata
        getqyrenyuandata().then(res => {//企业资质统计
          var data=res.data
          data=data.sort(function(a, b) {
                return b.数量 - a.数量;
              })
          var shengnames=[]
          var shengdata=[]
          for(var i=0;i<data.length;i++){
            shengnames.push(data[i].资质名称)
            shengdata.push({
              name:data[i].资质名称,
              value:data[i].数量,
            })
          }
          this.pieCharnormaltdata.names=shengnames
          this.pieCharnormaltdata.values=shengdata
        })
        getzztpdata().then(res => {//资质图谱图表
          var data=res.data
          data=data.sort(function(a, b) {
                return b.数量 - a.数量;
              })
          var shengnames=[]
          var shengdata=[]
          for(var i=0;i<data.length;i++){
            shengnames.push(data[i].资质名称)
            shengdata.push(data[i].数量)
          }
          this.BarChartsolodata2.names=shengnames
          this.BarChartsolodata2.values=shengdata
        })
      },
      handleSetLineChartData(type) {
        // this.lineChartData = lineChartData[type]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
  .indextable{height: 300px;overflow: hidden;}
  .indextable .indextabletit{color: #008ACD;font-size: 18px;}
  .indextable .indextablec{height: 280px;overflow-y: auto;margin-right: -10px;}
  .indextable .indextablec .el-tablex{color: #888 !important;}
</style>
