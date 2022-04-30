<template> 
  <div class="app-container">
<!--    搜索-->
    <el-card class="filter-container" shadow="never">
<!--      搜索-->
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
<!--      筛选-->
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="用户名称：">
            <el-input v-model="listQuery.memberNickName" class="input-width" placeholder="用户昵称"></el-input>
          </el-form-item>
          <el-form-item label="违规状态：">
            <el-select v-model="listQuery.showStatus" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
<!--    添加-->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>回复评论列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加评论</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="编号" width="50" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="用户" width="110" align="center">
          <template slot-scope="scope">{{scope.row.memberNickName}}</template>
        </el-table-column>
        <el-table-column label="评论内容" width="500" align="center">
          <template slot-scope="scope">{{scope.row.content}}</template>
        </el-table-column>
        <el-table-column label="违规状态" width="90"  align="center">
          <template slot-scope="scope">{{scope.row.showStatus | formatType}}</template>
        </el-table-column>
        <el-table-column label="置顶状态" width="90" align="center">
          <template slot-scope="scope">{{scope.row.sort | formatType2}}</template>
        </el-table-column>
        <el-table-column label="是否违规删评"  align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUpdateStatus(scope.$index, scope.row)"
              style="display: block"
              v-model="scope.row.showStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="1"
              active-text="无违规记录"
              inactive-text="违规评论禁用">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="置顶程度"  align="center">
          <template slot-scope="scope">
            <div class="block">
              <el-slider
                @change="handleSlider(scope.$index, scope.row)"
                v-model="scope.row.sort"
                show-input>
              </el-slider>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="回复数" width="100"  align="center">
          <template slot-scope="scope">{{scope.row.replayCount | formatType3}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       @click="showCommentReply(scope.$index, scope.row)">查看回复
            </el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       @click="handleDelete(scope.$index, scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--    批量处理-->
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
<!--    分页-->
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
<!--    发布商品信息-->
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
import {fetchList,sendComment,updateStatus,deleteReply,updateSort,getCommentReply} from '@/api/comment'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  memberNickName: null,
  showStatus: null
};
const defaultTypeOptions = [
  {
    label: '违规',
    value: 1
  },
  {
    label: '非违规',
    value: 0
  }
];
const commentParam = {
  productId: null,
  productName: null,
  productAttribute: null,
  content: null
};
export default {
  name: 'homeAdvertiseList',
  data() {
    return {
      selectCommentVisible: false,
      dialogTitle: '',
      restaurants: [],
      dialogFormVisible: false,
      listQuery: Object.assign({}, defaultListQuery),
      typeOptions: Object.assign({}, defaultTypeOptions),
      comment: Object.assign({},commentParam),
      list: null,
      replyList:null,
      total: null,
      listLoading: false,
      multipleSelection: [],
      operates: [
        {
          label: "标记违规",
          value: 1
        },
        {
          label: "取消标记违规",
          value: 2
        },
        {
          label: "删除商品评论",
          value: 0
        }
      ],
      operateType: null,
      num: 0,
    }
  },
  created() {
    this.getList();
    this.mounted();
  },
  filters:{
    formatType(type){
      if(type===1){
        return '违规';
      }else{
        return '非违规';
      }
    },
    formatType2(type){
      if(type===100){
        return '管理员评论';
      }else if (type >= 10){
        return '置顶';
      } else{
        return '非置顶';
      }
    },
    formatType3(type){
      if(type===null){
        return 0;
      }else{
        return type;
      }
    }
  },
  methods: {
    showCommentReply(index, row){
      this.$router.push({path:'/sms/replyCommentInfo',query:{id:row.id}});
    },
    handleSlider(index,row){
      let params = new URLSearchParams();
      params.append("id",row.id);
      params.append("sort",row.sort);
      updateSort(params).then(result => {
        this.$message({
          message: '成功！',
          type: 'success',
          duration: 1000
        });
        this.getList();
      })
    },
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
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
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
    handleUpdateStatus(index,row){
      let data = new URLSearchParams();
      data.append("showStatus",row.showStatus);
      data.append("ids",row.id);
      updateStatus(data).then(response=>{
        this.getList();
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
      });
    },
    handleDelete(index,row){
      let ids=[];
      ids.push(row.id);
      this.deleteReply(ids);
    },
    deleteReply(ids){
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids",ids);
        deleteReply(params).then(response=>{
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 1000
          });
          this.listQuery.pageNum=1;
          this.getList();
        });
      })
    },
    handleBatchOperate(){
      if (this.multipleSelection < 1) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      if(this.operateType===0){
        //删除
        let ids=[];
        for(let i=0;i<this.multipleSelection.length;i++){
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteReply(ids).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
        this.getList();
      }else if(this.operateType===1){
        //违规
        let ids=[];
        let data = new URLSearchParams();
        for(let i=0;i<this.multipleSelection.length;i++){
          ids.push(this.multipleSelection[i].id);
        }
        data.append("ids", ids);
        data.append("showStatus", "1");
        this.$confirm('是否要修改为违规状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(data).then(response => {
            this.getList();
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消操作!'
          });
          this.getList();
        });

      }else if(this.operateType===2){
        //取消违规
        let ids=[];
        let data = new URLSearchParams();
        for(let i=0;i<this.multipleSelection.length;i++){
          ids.push(this.multipleSelection[i].id);
        }
        data.append("ids", ids);
        data.append("showStatus", "0");
        this.$confirm('是否要修改为非违规状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(data).then(response => {
            this.getList();
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消操作!'
          });
          this.getList();
        });
      }else {
        this.$message({
          message: '请选择批量操作类型',
          type: 'warning',
          duration: 1000
        });
      }
    },
    handleAdd(){
      this.comment.productId = this.list[0].productId;
      this.comment.productName = this.list[0].productName;
      this.dialogFormVisible = true;   // 显示对话框
      this.dialogTitle = "发布评论";
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery, this.$route.query.id).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      })
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
<style scoped>
.input-width {
  width: 203px;
}
</style>
