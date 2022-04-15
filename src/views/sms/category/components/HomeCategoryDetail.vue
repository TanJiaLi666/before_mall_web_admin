<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="分类专题名称：" prop="categoryName">
        <el-input v-model="homeAdvertise.categoryName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="所属分类：" v-model="homeAdvertise.categoryId">
        <el-cascader v-model="selectProductCateValue" :options="productCateOptions" :show-all-levels="false"></el-cascader>
      </el-form-item>
      <el-form-item label="展示平台位置：">
        <el-select v-model="homeAdvertise.type">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上线/下线：">
        <el-radio-group v-model="homeAdvertise.status">
          <el-radio :label="0">下线</el-radio>
          <el-radio :label="1">上线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="宣传图片：">
        <single-upload v-model="homeAdvertise.pic"></single-upload>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="homeAdvertise.sort" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="类别跳转链接：" prop="url">
        <el-input v-model="homeAdvertise.url" class="input-width"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import {fetchListWithChildren} from '@/api/productCate'
import SingleUpload from '@/components/Upload/singleUpload'
import {createHomeCategory, getHomeCategory, updateHomeCategory} from '@/api/homeCategory'
const defaultTypeOptions = [
  {
    label: 'PC首页轮播',
    value: 0
  },
  {
    label: 'APP首页轮播',
    value: 1
  }
];
const defaultHomeAdvertise = {
  categoryName: null,
  categoryId: null,
  type: 1,
  pic: null,
  status: 0,
  url: null,
  sort: 0
};
export default {
  name: 'HomeCategoryDetail',
  components:{SingleUpload},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasEditCreated:false,
      productCateOptions: null,
      selectProductCateValue: [],
      homeAdvertise: {
        categoryName: null,
        categoryId:null,
        type: 1,
        pic: null,
        status: 0,
        url: null,
        sort: 0
      },
      rules: {
        categoryName: [
          {required: true, message: '请输入广告名称', trigger: 'blur'},
          {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
        ],
        url: [
          {required: true, message: '请输入广告链接', trigger: 'blur'}
        ],
        productCategoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
        pic: [
          {required: true, message: '请选择广告图片', trigger: 'blur'}
        ]
      },
      typeOptions: Object.assign({}, defaultTypeOptions)
    }
  },
  created(){
    if (this.isEdit) {
      getHomeCategory(this.$route.query.id).then(response => {
        let res = response.data;
        this.homeAdvertise.categoryId = res.categoryId;
        this.homeAdvertise.categoryName = res.categoryName;
        this.homeAdvertise.type = res.type;
        this.homeAdvertise.pic = res.pic;
        this.homeAdvertise.url = res.url;
        this.homeAdvertise.sort = res.sort;
        this.homeAdvertise.status = res.status;
      });
    }else{
      this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
    }
    this.getProductCateList();
  },
  watch: {
    homeAdvertise: function(newValue){
      if(!this.isEdit)return;
      if(this.hasEditCreated)return;
      if(newValue===undefined||newValue==null||newValue===0)return;
      if(this.homeAdvertise.categoryId!=null){
        this.selectProductCateValue.push(this.homeAdvertise.categoryId);
      }
      this.hasEditCreated=true;
    },
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length === 2) {
        this.homeAdvertise.categoryId = newValue[1];
        console.log(newValue[1]);
      } else {
        this.homeAdvertise.categoryId = null;
        this.homeAdvertise.categoryName=null;
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateHomeCategory(this.$route.query.id, this.homeAdvertise).then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration:1000
                });
                this.$router.back();
              });
            } else {
              createHomeCategory(this.homeAdvertise).then(response => {
                this.$refs[formName].resetFields();
                this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration:1000
                });
                this.$router.back();
              });
            }
          });

        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration:1000
          });
          return false;
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
    }
  }
}
</script>
<style scoped>
.input-width {
  width: 70%;
}
</style>


