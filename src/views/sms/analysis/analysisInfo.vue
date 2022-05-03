<template> 
  <div class="app-container">
    <!--    添加-->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>产品分析详细信息：</span>
      <p>
        <span style="float: left;margin: 30px;padding-left: 200px">分析评估分数：<span style="color: red">{{this.score}}</span>(满分100)</span>
        <span style="float: left;margin: 30px;padding-right: 200px">商品存货：<span style="color: red">{{this.stock}}</span>件</span>
        <span style="float: left;margin: 30px;padding-left: 100px">销售额：￥<span style="color: red">{{this.shopSumPrice}}</span></span>
        <span style="float: left;margin: 30px;padding-right: 200px">销量：<span style="color: red">{{this.shopSumCount}}</span>份</span>
        <span style="float: left;margin: 30px;padding-left: 200px">评估建议：<span style="size: 20px;color: #3c763d">{{this.score | formatScore}}</span></span>
        <span style="float: left;margin: 30px;padding-left: 100px">退货量：<span style="color: red">{{this.shopReturnSum}}</span>单</span>
      </p>
    </el-card>
    <el-card class="pie">
      销量占比
    </el-card>
    <ve-pie :data="chartData1" ></ve-pie>
    <el-card class="pie">
      销售额占比
    </el-card>
    <ve-pie :data="chartData2" ></ve-pie>
    <el-card class="pie">
      退货占比
    </el-card>
    <ve-ring :data="chartData3" ></ve-ring>
  </div>
</template>
<script>
import {getAnalysis} from '@/api/forecast'
export default {
  name: 'forecastInfo',
  data() {
    return {
      stock : this.$route.query.stock,
      lowStock : this.$route.query.lowStock,
      returnSum: 0,
      shopReturnSum:  0,
      shopSumCount:  0,
      shopSumPrice:  0,
      sumCount:  0,
      sumPrice: 0,
      score: 100,
      chartData1:{
        columns: ['name', 'num'],
        rows: [
          { 'name': '当前商品', 'num': 9 },
          { 'name': '其他商品', 'num': 7},
        ]
      },
      chartData2:{
        columns: ['name', 'num'],
        rows: [
          { 'name': '当前商品', 'num': 19 },
          { 'name': '其他商品', 'num': 107},
        ]
      },
      chartData3:{
        columns: ['name', 'num'],
        rows: [
          { 'name': '当前商品', 'num': 29 },
          { 'name': '其他商品', 'num': 57},
        ]
      }
    }
  },
  created() {
    this.getDataLine();
  },
  filters:{
    formatScore(type) {
      if (type >= 60) {
        return "状态良好！建议进货！";
      }else if(type>=30){
        return "保持状态！"
      }else {
        return "建议调整！"
      }
    }
  },
  methods: {
    getDataLine() {
      getAnalysis({id:this.$route.query.id}).then(result => {
          this.returnSum=result.data.returnSum;
          this.shopReturnSum= result.data.shopReturnSum;
          this.shopSumCount= result.data.shopSumCount;
          this.shopSumPrice= result.data.shopSumPrice;
          this.sumCount=  result.data.sumCount;
          this.sumPrice= result.data.sumPrice;
          this.handleData();
      });
    },
    handleData(){
      this.chartData1.rows[0].num = this.shopSumCount;
      this.chartData1.rows[1].num = this.sumCount-this.shopSumCount;
      this.chartData2.rows[0].num = this.shopSumPrice;
      this.chartData2.rows[1].num = this.sumPrice-this.shopSumPrice;
      this.chartData3.rows[0].num = this.shopReturnSum;
      this.chartData3.rows[1].num = this.returnSum-this.shopReturnSum;
      this.score = Math.ceil(((this.shopSumCount/this.sumCount) *3 + (this.shopSumPrice/this.sumPrice) *2 - this.shopReturnSum/this.returnSum)/2 * 100);
    }
  }
}
</script>
<style scoped>
.pie{
  margin: 30px;
  background-color: #409EFF;
  color: #303133;
}
</style>
