<template>
  <div class="app-container">
    <swiper class="myswiper" :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
      <swiper-slide v-for="(v,index) in swiperdata" :key="index">
          <div class="myswiper-slide" :class="{'myslideon':index==tabindex}" @click="ckindex(index)">
            <div class="tpbox">
              <div class="onli">
                <img class="img1" :src="v.img">
                <img class="img2" :src="v.imgon">
              </div>
              <h2>{{v.title}}</h2>
            </div>
          </div>
      </swiper-slide>
    </swiper>
    <div class="mylist">
      <ul>
        <li v-for="(v,index) in mylist" :key="index">
          <router-link :to="v.url">
            <img :src="v.img" alt="">
            <h2>{{v.title}}</h2>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
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
        tabindex:0,
        mylist: [],
        swiperdata: [{
            img: require('../../../assets/image/zztp01.png'),
            imgon: require('../../../assets/image/zztp01on.png'),
            title: 'ITSS',
            mylist: [{
              url: '/pages',
              img: require('../../../assets/image/zztp05.png'),
              title: '运行维护',
            }, {
              url: '/pages',
              img: require('../../../assets/image/zztp06.png'),
              title: '云服务',
            }, {
              url: '/pages',
              img: require('../../../assets/image/zztp07.png'),
              title: '数据中心',
            }, {
              url: '/pages',
              img: require('../../../assets/image/zztp08.png'),
              title: '咨询设计',
            }, {
              url: '/pages',
              img: require('../../../assets/image/zztp09.png'),
              title: '工具产品',
            }],
          },
          {
            img: require('../../../assets/image/zztp02.png'),
            imgon: require('../../../assets/image/zztp02on.png'),
            title: 'CMMI',
            mylist: [{
              url: '/pages',
              img: require('../../../assets/image/zztp05.png'),
              title: '运行维护',
            }],
          },
          {
            img: require('../../../assets/image/zztp03.png'),
            imgon: require('../../../assets/image/zztp03on.png'),
            title: '信息安全',
            mylist: [{
              url: '/pages',
              img: require('../../../assets/image/zztp05.png'),
              title: '运行维护2222',
            }],
          },
          {
            img: require('../../../assets/image/zztp04.png'),
            imgon: require('../../../assets/image/zztp04on.png'),
            title: '建筑资质',
            mylist: [{
              url: '/pages',
              img: require('../../../assets/image/zztp08.png'),
              title: '咨询设计',
            }, {
              url: '/pages',
              img: require('../../../assets/image/zztp09.png'),
              title: '工具产品',
            }],
          },
          {
            img: require('../../../assets/image/zztp04.png'),
            imgon: require('../../../assets/image/zztp04on.png'),
            title: '建筑资质2',
            mylist: [{
              url: '/pages',
              img: require('../../../assets/image/zztp07.png'),
              title: '数据中心',
            }, {
              url: '/pages',
              img: require('../../../assets/image/zztp08.png'),
              title: '咨询设计',
            }, {
              url: '/pages',
              img: require('../../../assets/image/zztp09.png'),
              title: '工具产品',
            }],
          }
        ],
        swiperOption: {
          autoplay: false,
          slidesPerView: 4,
          spaceBetween: 0,
          slideActiveClass: 'swiper-slide-active now_on',
        }
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      },
    },
    created() {
      this.mylist = this.swiperdata[this.tabindex].mylist
    },
    methods: {
      ckindex(i) {
        this.tabindex=i
        this.mylist = this.swiperdata[this.tabindex].mylist
      },
      callback(e) {
        console.log(e)
      }
    }
  }
</script>
