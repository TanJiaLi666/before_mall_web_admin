<template> 
  <div class="app-container">
    <!--    添加-->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>预测图表</span>
    </el-card>
    <ve-ring :data="chartData" width="1200px" roseType></ve-ring>
  </div>
</template>
<script>
export default {
  name: 'forecastInfo',
  data() {
    return {
      chartData:{
        columns: ['日期', '预测销量', '当月库存'],
        rows: [
          { '日期': '2018-05-17', '预测销量': 32371, '当月库存': 19810 },
          { '日期': '2018-05-23', '预测销量': 12328, '当月库存': 4398 },
          { '日期': '2018-05-24', '预测销量': 92381, '当月库存': 52910 },
          { '日期': '2018-05-25', '预测销量': 92381, '当月库存': 52910 },
          { '日期': '2018-05-26', '预测销量': 92381, '当月库存': 52910 },
          { '日期': '2018-05-27', '预测销量': 92381, '当月库存': 52910 },
          { '日期': '2018-05-28', '预测销量': 92381, '当月库存': 52910 },
          { '日期': '2018-05-29', '预测销量': 92381, '当月库存': 52910 },
          { '日期': '2018-05-30', '预测销量': 92381, '当月库存': 52910 },
          { '日期': '2018-05-31', '预测销量': 92381, '当月库存': 52910 },
        ]
      }
    }
  },
  created() {
  },
  filters:{

  },
  methods: {

  }
}
</script>
<style scoped>
</style>
