<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

  const animationDuration = 6000

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
        default: '400px'
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
        title,
        dataname,
        names,
        values,
        barBorderRadius,
        linercolor
      } = {}) {
        this.chart.setOption({
          title:{
            text:title
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: '12%',
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: names,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 'auto',
              // rotate: 45,
            },
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [{
            name: dataname,
            type: 'bar',
            stack: 'vistors',
            barWidth: '50%',
            barMaxWidth: 20,
            data: values,
            animationDuration,
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: linercolor[0] // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: linercolor[1] // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                },
                barBorderRadius: barBorderRadius
              },
              // emphasis: {
              //   barBorderRadius: 15
              // },
            },
          }]
        })
      }
    }
  }
</script>
