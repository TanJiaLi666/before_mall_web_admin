<template>
  <div class="app-container">
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">订单总数</div>
            <div class="total-value">{{statistics.sum}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">今日订单总数</div>
            <div class="total-value">{{statistics.todaySum}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">今日销售总额</div>
            <div class="total-value">￥{{statistics.todaySaleSum}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">昨日销售总额</div>
            <div class="total-value">￥{{statistics.yesterdaySaleSum}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="total-week" class="total-icon">
            </svg-icon>
            <div class="total-title">近7天销售总额</div>
            <div class="total-value">￥{{statistics.recentSaleSum}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待付款订单</span>
              <span style="float: right" class="color-danger">({{statistics.a}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已完成订单</span>
              <span style="float: right" class="color-danger">({{statistics.d}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已关闭订单</span>
              <span style="float: right" class="color-danger">({{statistics.e}})</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已发货订单</span>
              <span style="float: right" class="color-danger">({{statistics.c}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待发货订单</span>
              <span style="float: right" class="color-danger">({{statistics.b}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待处理退货订单</span>
              <span style="float: right" class="color-danger">({{ returnOrder.return_a }})</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">正在退货订单</span>
              <span style="float: right" class="color-danger">({{ returnOrder.return_b }})</span>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已完成退款申请</span>
              <span style="float: right" class="color-danger">({{ returnOrder.return_c }})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">已拒绝退款申请</span>
              <span style="float: right" class="color-danger">({{ returnOrder.return_d }})</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{ productStatistics.downProductSum }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ productStatistics.upProductSum }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ productStatistics.stockLowSum }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ productStatistics.productSum }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">已下架</el-col>
                <el-col :span="6" class="overview-item-title">已上架</el-col>
                <el-col :span="6" class="overview-item-title">库存紧张</el-col>
                <el-col :span="6" class="overview-item-title">全部商品</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">用户总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{ userStatistics.todayMemberSum }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ userStatistics.yesterdayMemberSum }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ userStatistics.monthMemberSum }}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{ userStatistics.memberSum }}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日新增</el-col>
                <el-col :span="6" class="overview-item-title">昨日新增</el-col>
                <el-col :span="6" class="overview-item-title">本月新增</el-col>
                <el-col :span="6" class="overview-item-title">会员总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">订单统计</div>
      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div>
              <div style="color: #909399;font-size: 14px">本月订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{statistics.monthOrderSum}}</div>
              <div>
                <span :class="[this.statistics.monthOrderSum<this.statistics.lastMonthOrderSum?'color-danger':'color-success']" style="font-size: 14px">{{Math.round(((statistics.monthOrderSum-statistics.lastMonthOrderSum)/(statistics.monthOrderSum+statistics.lastMonthOrderSum))*100) }}%</span>
                <span style="color: #C0C4CC;font-size: 14px">较上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周订单总数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{ statistics.weekOrderSum }}</div>
              <div>
                <span :class="[this.statistics.weekOrderSum<this.statistics.lastWeekOrderSum?'color-danger':'color-success']" style="font-size: 14px">{{ Math.round(((statistics.weekOrderSum-statistics.lastWeekOrderSum)/(statistics.weekOrderSum+statistics.lastWeekOrderSum))*100) }}%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本月销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{ statistics.monthOrderSale }}</div>
              <div>
                <span :class="[this.statistics.monthOrderSale<this.statistics.lastMonthOrderSale?'color-danger':'color-success']" style="font-size: 14px">{{ Math.round(((statistics.monthOrderSale-statistics.lastMonthOrderSale)/(statistics.monthOrderSale+statistics.lastMonthOrderSale))*100) }}%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上月</span>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">本周销售总额</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{ statistics.weekOrderSale }}</div>
              <div>
                <span :class="[this.statistics.weekOrderSale<this.statistics.lastWeekOrderSale?'color-danger':'color-success']" style="font-size: 14px">{{ Math.round(((statistics.weekOrderSale-statistics.lastWeekOrderSale)/(statistics.weekOrderSale+statistics.lastWeekOrderSale))*100) }}%</span>
                <span style="color: #C0C4CC;font-size: 14px">同比上周</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6">
            <el-date-picker
              style="float: right;z-index: 1"
              size="small"
              v-model="orderCountDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
              :picker-options="pickerOptions">
            </el-date-picker>
            <div>
              <ve-line
                :data="chartData"
                :legend-visible="false"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"></ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {str2Date} from '@/utils/date';
  import img_home_order from '@/assets/images/home_order.png';
  import img_home_today_amount from '@/assets/images/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
  import {orderStatistics,returnOrder,ProductStatistics,UserStatistics,mapStatistics} from '@/api/home'
  import {parseTime} from "../../utils";
  const defaultListQuery = {
    start: 0,
    end: 0
  };
  export default {
    name: 'home',
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        listQuery: Object.assign({}, defaultListQuery),
        orderCountDate: '',
        chartSettings: {
          xAxisType: 'time',
          area:true,
          axisSite: { right: ['orderAmount']},
        labelMap: {'orderCount': '订单数量', 'orderAmount': '订单金额'}},
        chartData: {
          columns: [],
          rows: []
        },
        statistics: {
          orderAllList: [
            /*{date: '2022-04-01', orderCount: 10, orderAmount: 1093},
           */
          ],
          sum: 100,
          todaySum: 100,
          todaySaleSum: 1000,
          yesterdaySaleSum: 100,
          recentSaleSum: 100,
          a:0,
          b:0,
          c:0,
          d:0,
          e:0,
          f:0,
          weekOrderSum:0,
          lastWeekOrderSum:0,
          weekOrderSale:0,
          lastWeekOrderSale:0,
          //月信息
          monthOrderSum:0,
          lastMonthOrderSum:0,
          monthOrderSale:0,
          lastMonthOrderSale:0
        },
        returnOrder: {
          return_a:0,
          return_b:0,
          return_c:0,
          return_d:0
        },
        productStatistics: {
          productSum: 0,
          stockLowSum: 0,
          upProductSum: 0,
          downProductSum: 0
        },
        userStatistics: {
          memberSum:0,
          todayMemberSum:0,
          yesterdayMemberSum:0,
          monthMemberSum:0
        },
        loading: false,
        dataEmpty: false,
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount
      }
    },
    created(){
      this.getOrder();
      this.getReturnOrder();
      this.getProductStatistics();
      this.getUserStatistics();
      this.initOrderCountDate();
      this.getData();
    },
    methods:{
      getUserStatistics() {
        UserStatistics().then(response => {
          this.userStatistics.todayMemberSum = response.data.todayMemberSum;
          this.userStatistics.yesterdayMemberSum = response.data.yesterdayMemberSum;
          this.userStatistics.memberSum = response.data.memberSum;
          this.userStatistics.monthMemberSum = response.data.monthMemberSum;
        });
      },
      getProductStatistics() {
        ProductStatistics().then(response => {
          this.productStatistics.productSum = response.data.productSum;
          this.productStatistics.downProductSum = response.data.downProductSum;
          this.productStatistics.upProductSum = response.data.upProductSum;
          this.productStatistics.stockLowSum = response.data.stockLowSum;
        });
      },
      getReturnOrder() {
        returnOrder().then(response => {
          this.returnOrder.return_a = response.data.return_a;
          this.returnOrder.return_b = response.data.return_b;
          this.returnOrder.return_c = response.data.return_c;
          this.returnOrder.return_d = response.data.return_d;
        });
      },
      getOrder() {
        orderStatistics().then(response => {
          this.statistics.sum = response.data.sum;
          this.statistics.recentSaleSum = response.data.recentSaleSum;
          this.statistics.yesterdaySaleSum = response.data.yesterdaySaleSum;
          this.statistics.todaySaleSum = response.data.todaySaleSum;
          this.statistics.todaySum = response.data.todaySum;
          this.statistics.a = response.data.a;
          this.statistics.b = response.data.b;
          this.statistics.c = response.data.c;
          this.statistics.d = response.data.d;
          this.statistics.e = response.data.e;
          this.statistics.f = response.data.f;
          this.statistics.weekOrderSum = response.data.weekOrderSum;
          this.statistics.weekOrderSale = response.data.weekOrderSale;
          this.statistics.lastWeekOrderSum = response.data.lastWeekOrderSum;
          this.statistics.lastWeekOrderSale = response.data.lastWeekOrderSale;
          this.statistics.monthOrderSum = response.data.monthOrderSum;
          this.statistics.monthOrderSale = response.data.monthOrderSale;
          this.statistics.lastMonthOrderSum = response.data.lastMonthOrderSum;
          this.statistics.lastMonthOrderSale = response.data.lastMonthOrderSale;
          // this.statistics.orderAllList = response.data.orderList;
        });
      },
      handleDateChange(){
        this.getData();
      },
      getData(){
        setTimeout(() => {
          this.chartData = {
            columns: ['date', 'orderCount','orderAmount'],
            rows: []
          };
          /*this.statistics.orderAllList = [];*/
          this.chartData.rows = [];
          let start=this.orderCountDate[0];
          let end=this.orderCountDate[1];
          this.listQuery.start = parseTime(start, "{y}-{m}-{d}");
          this.listQuery.end = parseTime(end, "{y}-{m}-{d}");
          mapStatistics(this.listQuery).then(response => {
            this.statistics.orderAllList = response.data.orderList;
          });
          for(let i=0;i<this.statistics.orderAllList.length;i++){
            let item=this.statistics.orderAllList[i];
            let currDate=str2Date(item.date);
            if(currDate.getTime()>=start.getTime()&&currDate.getTime()<=end.getTime()){
              this.chartData.rows.push(item);
            }
          }
          this.dataEmpty = false;
          this.loading = false
        }, 1000)
      },
      initOrderCountDate(){
        let end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 1000 * 60 * 60 * 24 * 20);
        this.orderCountDate=[start,end];
      }
    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
</style>
