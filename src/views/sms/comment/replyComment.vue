<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
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
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="用户名称：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="广告名称"></el-input>
          </el-form-item>
          <el-form-item label="违规状态：">
            <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width">
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
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>回复评论列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">回复</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="90" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="用户" width="120" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="评论内容"  align="center">
          <template slot-scope="scope">{{scope.row.clickCount}}</template>
        </el-table-column>
        <el-table-column label="违规状态" width="120"  align="center">
          <template slot-scope="scope">{{scope.row.type | formatType}}</template>
        </el-table-column>
        <el-table-column label="置顶状态" width="120" align="center">
          <template slot-scope="scope">{{scope.row.type | formatType}}</template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">评论置顶
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">违规评论
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  </div>
</template>
<script>
import {fetchList,updateStatus,deleteHomeAdvertise} from '@/api/homeAdvertise';
import {formatDate} from '@/utils/date';
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  name: null,
  type: null,
  endsTime:null
};
const defaultTypeOptions = [
  {
    label: '违规',
    value: 0
  },
  {
    label: '非违规',
    value: 1
  }
];
export default {
  name: 'homeAdvertiseList',
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      typeOptions: Object.assign({}, defaultTypeOptions),
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
      operates: [
        {
          label: "删除",
          value: 0
        }
      ],
      operateType: null
    }
  },
  created() {
    this.getList();
  },
  filters:{
    formatType(type){
      if(type===1){
        return '违规';
      }else{
        return '非违规';
      }
    },
    formatTime(time){
      if(time==null||time===''){
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
  },
  methods: {
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
      this.$confirm('是否要修改上线/下线状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(row.id,{status:row.status}).then(response=>{
          this.getList();
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
        });
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '已取消操作!'
        });
        this.getList();
      });
    },
    handleDelete(index,row){
      this.deleteHomeAdvertise(row.id);
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
        this.deleteHomeAdvertise(ids);
      }else {
        this.$message({
          message: '请选择批量操作类型',
          type: 'warning',
          duration: 1000
        });
      }
    },
    handleAdd(){
      this.$router.push({path: '/sms/addAdvertise'})
    },
    handleUpdate(index,row){
      this.$router.push({path: '/sms/updateAdvertise', query: {id: row.id}})
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      })
    },
    deleteHomeAdvertise(ids){
      this.$confirm('是否要删除该广告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params=new URLSearchParams();
        params.append("ids",ids);
        deleteHomeAdvertise(params).then(response=>{
          this.getList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
      })
    }
  }
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>


