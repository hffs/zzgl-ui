<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')

      },
      setOptions({
        names,
        values,
      } = {}) {
        if(values==''){
          this.chart.showLoading({
              type:'none',
              text: '暂无数据',
              color: '#ddd',
              textStyle: { fontSize : 30 , color: '#666' },
              maskColor: 'rgba(255, 255, 255, 0.5)',
          });
        }else{
          this.chart.hideLoading
        }
        this.chart.setOption({
          title:{
            text:'企业人员资质统计'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            show:false,
            left: 'center',
            bottom: '10',
            data: names
          },
          series: [{
            name: '企业人员资质统计',
            type: 'pie',
            // roseType: 'radius',
            radius: [0, 95],
            center: ['50%', '55%'],
            data: values,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }]
        })
      }
    }
  }
</script>
