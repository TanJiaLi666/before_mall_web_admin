<template> 
  <div class="app-container">
    <!--    添加-->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>预测图表</span>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <span>未来七天销量预测</span>
    </el-card>
    <ve-line :data="chartData" :settings="chartSettings" :width="lineWidth" :height="lineHeight" :legend-visible="true" :tooltip-visible="true" ></ve-line>
  </div>
</template>
<script>
import {fetchList} from '@/api/forecast'
export default {
  name: 'forecastInfo',
  data() {
    return {
      chartSettings : {
        stack: {
          '用户': ['time', 'sale']
        },
        area: true,//是否显示为面积图
        itemStyle:{ //面积图颜色设置
          color:{
            type:'linear',
            x:0,
            y:0,
            x2:0,
            y2:1,
            colorStops:[
              {
                offset: 0,
                color: 'rgba(120,170,229,0.6)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(20,5,69,0.1)' // 100% 处的颜色
              },
            ],
            globalCoord: false // 缺省为 false
          }

        },
      },
      lineWidth: '1400px',//宽度
      lineHeight: '700px',//高度
      chartData:{
        columns: ['time', 'sale'],
        rows: [
          { 'time': '2018-05-17', 'sale': 32371 },
          { 'time': '2018-05-23', 'sale': 12328},
          { 'time': '2018-05-24', 'sale': 92381 },
          { 'time': '2018-05-25', 'sale': 92381 },
          { 'time': '2018-05-26', 'sale': 92381},
          { 'time': '2018-05-27', 'sale': 92381 },
          { 'time': '2018-05-28', 'sale': 92381 },
          { 'time': '2018-05-29', 'sale': 92381 },
          { 'time': '2018-05-30', 'sale': 92381},
          { 'time': '2018-05-31', 'sale': 92381 },
        ]
      }
    }
  },
  created() {
    this.getDataLine();
  },
  filters:{

  },
  methods: {
    getDataLine() {
      fetchList({id:this.$route.query.id}).then(result => {
        this.chartData.rows = result.data;
      });
    }
  }
}
</script>
<style scoped>
</style>
