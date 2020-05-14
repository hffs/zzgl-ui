<template>
  <div class="app-container zztpBox">
    <swiper ref="mySwiper" class="myswiper" :options="swiperOption" @someSwiperEvent="callback">
      <swiper-slide v-for="(v,index) in swiperdata" :key="index">
        <div class="myswiper-slide" :class="{'myslideon':index==tabindex}" @click="ckindex(index)">
          <div class="tpbox">
            <div class="onli">
              <img class="img1" :src="v.img">
              <img class="img2" :src="v.imgon">
            </div>
            <h2>{{ v.title }}</h2>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <div class="mylist">
      <ul>
        <li v-for="(v,index) in mylist" :key="index">
          <!-- <router-link :to="'/zh-zztp/zztpxq/zzdetails?id=' + v.url.query.sid + '&title=' + v.title"> -->
          <a href="javascript:" @click="findlist(v.url.query.sid,v.title)">
            <img :src="v.img" alt="">
            <h2>{{ v.title }}</h2>
          </a>
          <!-- </router-link> -->
        </li>
      </ul>
    </div>
    <el-dialog :title="zzname+'-资质详情列表'" :visible.sync="dialogTableVisible" width="1000px">
      <el-form :model="queryParams" ref="queryForm" class="mmform" :inline="device!=='mobile'" label-width="68px">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
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
      <el-table v-loading="loading" :data="detailsList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column label="资质名称" min-width="110px" align="center" prop="sid" :formatter="nima" />
        <el-table-column label="名称" min-width="110px" align="center" prop="name" />
        <!-- <el-table-column label="描述" align="center" prop="text" /> -->
        <el-table-column label="备注" min-width="110px" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button v-hasPermi="['zztp:details:edit']" size="mini" type="text" icon="el-icon-view" @click="find(scope.row.id,scope.row.name)">查看</el-button>

          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        @pagination="getList(thisid)"
      />
      <el-dialog :append-to-body="true" :title="tname+'-详情'" :visible.sync="dialogTableVisible2" width="700px" style="margin-top: 8vh!important;">
        <template>
          <div class="descBox" v-html="htext" />
        </template>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { listDetails, getDetails, delDetails, addDetails, updateDetails, exportDetails } from "@/api/zztp/details";
import { getAll } from "@/api/zztp/subclass";
import {
  gettable,
} from '@/api/zztp/tpxq'
import {
  swiper,
  swiperSlide
} from 'vue-awesome-swiper'
export default {
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      tname:'',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        sid: undefined
      },
      total: 0,
      ids: [],
      opplls:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      dialogTableVisible: false,
      detailsList: [],
      loading: true,
      zzname: '',
      htext: '',
      dialogTableVisible2: false,
      tabindex: 0,
      mylist: [],
      swiperdata: [],
      swiperOption: {
        autoplay: false,
        slidesPerView: 4,
        spaceBetween: 0,
        slideActiveClass: 'swiper-slide-active now_on'
      },
      thisid:'',
      screenWidth:''
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    },
    device() {
      return this.$store.state.app.device
    }
  },
  created() {
    window.screenWidth = document.body.clientWidth
    this.screenWidth = window.screenWidth
    if(this.screenWidth<=750){
      this.swiperOption.slidesPerView=1.2
    }
    gettable().then(response => {
      this.swiperdata = response.swiperdata
      this.mylist = this.swiperdata[this.tabindex].mylist
    })
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.thisid)
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    nima (row, column) {
      for (let i = 0; i <  this.opplls.length; i++) {
        const element =  this.opplls[i];
        if(element.id===row.sid){

            return element.name
        }
      }
    },
    /** 查询资质详情列表 */
    getList(id) {
      getAll().then(response => {
        this.opplls = response.zztpSubclasslist
      });
      this.loading = true
      this.queryParams.sid = id
      listDetails(this.queryParams).then(response => {
        this.detailsList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    findlist(id, title) {
      this.thisid=id
      this.dialogTableVisible = true
      this.zzname = title
      this.getList(this.thisid)
    },
    find(id,title) {
      this.dialogTableVisible2 = true
      this.tname=title
      this.htext = '加载中...'
      getDetails(id).then(response => {
        this.htext = response.data.text
      })
    },
    ckindex(i) {
      this.tabindex = i
      this.mylist = this.swiperdata[this.tabindex].mylist
    },
    callback(e) {
      console.log(e)
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
  .zztpBox{
    .myswiper .swiper-slide{
      width: 270px!important;
      padding: 12px;
    }
    .myswiper .swiper-slide .myslideon{
      box-shadow: 0px 5px 10px #ababab;
      transform: scale(1.05);
    }
    .myswiper .swiper-slide .myswiper-slide:hover{
      box-shadow: 0px 5px 10px #ababab;
    }
    .myswiper .swiper-slide:nth-child(1) .myslideon,.myswiper .swiper-slide:nth-child(5) .myslideon,.myswiper .swiper-slide:nth-child(9) .myslideon{
      background: 0;
      border: 1px solid #ef6a6a;
      color: #ef6a6a;
    }
    .myswiper .swiper-slide:nth-child(2) .myslideon,.myswiper .swiper-slide:nth-child(6) .myslideon,.myswiper .swiper-slide:nth-child(10) .myslideon{
      background: 0;
      border: 1px solid #7FBDE9;
      color: #7FBDE9;
    }
    .myswiper .swiper-slide:nth-child(3) .myslideon,.myswiper .swiper-slide:nth-child(7) .myslideon,.myswiper .swiper-slide:nth-child(11) .myslideon{
      background: 0;
      border: 1px solid #F1C47E;
      color: #F1C47E;
    }
    .myswiper .swiper-slide:nth-child(4) .myslideon,.myswiper .swiper-slide:nth-child(8) .myslideon,.myswiper .swiper-slide:nth-child(12) .myslideon{
      background: 0;
      border: 1px solid #65D499;
      color: #65D499;
    }
  }
</style>
