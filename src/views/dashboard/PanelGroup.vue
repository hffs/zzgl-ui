<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :sm="12" :lg="8" class="card-panel-col" v-for="(v,index) in paneldata" :key="index">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-lists">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{v.name}}
          </div>
          <count-to :start-val="0" :end-val="v.value" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
<!--    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            订单
          </div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col> -->
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  watch:{
    paneldata(v){
      this.paneldata=v
    }
  },
  props:{
    paneldata:{
      required: true,
      type:Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
    &:nth-child(1):hover .icon-lists {
      background: #40c9c6;
      .card-panel-icon{color: #ff !important;}
    }
    &:nth-child(2):hover .icon-lists {
      background: #36a3f7;
      .card-panel-icon{color: #ff !important;}
    }
    &:nth-child(3):hover .icon-lists {
      background: #f4516c;
      .card-panel-icon{color: #ff !important;}
    }
    &:nth-child(4):hover .icon-lists {
      background: #34bfa3;
      .card-panel-icon{color: #ff !important;}
    }
  }
  .card-panel-col:nth-child(1) .icon-lists {
    color: #40c9c6;
  }
  .card-panel-col:nth-child(2) .icon-lists{
    color: #36a3f7;
  }
  .card-panel-col:nth-child(3) .icon-lists{
    color: #f4516c;
  }
  .card-panel-col:nth-child(4) .icon-lists{
    color: #34bfa3
  }
  .card-panel {
    height: 108px;
    // cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

    }

    .card-panel-icon-wrapper {
      position: absolute;left: 15px;top: 50%;
      transform: translateY(-50%);
      width: 80px;
      height: 80px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      text-align: right;
      position: absolute;
      right: 15px;top: 50%;
      transform: translateY(-50%);
      font-weight: bold;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:750px) {
  .card-panel-icon-wrapper {
    width: 50%;
    height: 100%;
    margin: 0 !important;
    .svg-icon {
      display: block;
    }
  }
}
</style>
