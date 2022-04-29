<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>商品列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="300" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p>品牌：{{scope.row.brandName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
            <p>货号：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="评论数" width="100" align="center">
          <template slot-scope="scope">{{scope.row.commentSum}}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleSendComment(scope.$index, scope.row)">发布评论
              </el-button>
              <el-button
                size="mini"
                @click="handleSendCommentReply(scope.$index, scope.row)">回复评论
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogTitle">
      <el-autocomplete
        class="inline-input"
        v-model="comment.content"
        :fetch-suggestions="querySearch"
        placeholder="请输入需要发布的内容"
        @select="handleSelect"
      ></el-autocomplete>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendComment()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {fetchList} from '@/api/product'
import {fetchList as fetchBrandList} from '@/api/brand'
import {fetchListWithChildren} from '@/api/productCate'
import {sendComment} from '@/api/comment'

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null
};
const commentParam = {
  productId: null,
  productName: null,
  productAttribute: null,
  content: null
};
export default {
  name: "productComment",
  data() {
    return {
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      comment: Object.assign({},commentParam),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      dialogFormVisible: false,
      dialogTitle:'',
      productCateOptions: [],
      brandOptions: [],
      restaurants: []
    }
  },
  created() {
    this.getList();
    // 品牌下拉初始化
    this.getBrandList();
    // 商品分类下拉级联初始化
    this.getProductCateList();
    this.mounted();
  },
  watch: {
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }

    }
  },
  methods: {
    sendComment(){
      this.dialogFormVisible = false
      sendComment(this.comment).then(res => {
        this.$message("发布成功！！！");
        this.comment.content = '';
        this.getList();
      });
    },
    handleSelect(item) {
      console.log(item);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    querySearch(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSendComment(index,row){
      this.comment.productId = row.id;
      this.comment.productName = row.name;
      this.dialogFormVisible = true;   // 显示对话框
      this.dialogTitle = "发布评论";
    },
    handleSendCommentReply(index,row){
      this.$router.push({path:'/sms/replyComment',query:{id:row.id}});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    getBrandList() {
      fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
        }
      });
    },
    getProductCateList() {
      fetchListWithChildren().then(response => {
        let list = response.data;
        this.productCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({label: list[i].children[j].name, value: list[i].children[j].id});
            }
          }
          this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
        }
      });
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleShowProduct(index,row){
      console.log("handleShowProduct",row);
    },
    handleShowVerifyDetail(index,row){
      console.log("handleShowVerifyDetail",row);
    },
    handleShowLog(index,row){
      console.log("handleShowLog",row);
    },
    mounted() {
      this.restaurants = this.loadAll();
    },
    loadAll() {
      return [
        { "value": "好的，感谢您的建议！！！！", "address": "好的，感谢您的建议！！！！" },
        { "value": "这个我们也没办法，请包涵！！！", "address": "这个我们也没办法，请包涵！！！" },
        { "value": "谢谢！！！", "address": "谢谢！！！" },
        { "value": "已阅，立马处理！！！", "address": "已阅，立马处理！！！" },
        { "value": "请联系管理员，谢谢！！", "address": "请联系管理员，谢谢！！" },
        { "value": "哈哈哈哈，嗝！！", "address": "哈哈哈哈，嗝！！" },
        { "value": "商品库存充足，24小时等您！！", "address": "商品库存充足，24小时等您！！" }
      ];
    }
  }
}
</script>
<style></style>


