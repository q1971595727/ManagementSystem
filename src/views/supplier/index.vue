<template>
  <div>
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px"
      class="demo-form-inline"
    >
      <!-- //重置会看 el-form-item 组件元素的prop 上是否指定了字段名，指定了才会重置生效 -->
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="linkman">
        <el-input v-model="searchMap.linkman" v-if="!isDialog" placeholder="联系人" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="mobile"  v-if="!isDialog" >
        <el-input v-model="searchMap.mobile"  v-if="!isDialog"  placeholder="联系电话" style="width:200px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary"  v-if="!isDialog"  @click="resetForm('searchForm')">重置</el-button>
        <el-button type="primary"  v-if="!isDialog"  @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- highlight-current-row激活单选行
      @current-change="handleCurrentChange"
      当点击某一行后，会触发这个事件，从而会触发这个事件 从而调用对应的函数 handleCurrentChange
      handleCurrentChange函数会接收两个参数： currentRow，oldCurrentRow-->
    <el-table :data="list" border style="width: 100%" height="450" :highlight-current-row="isDialog"   @current-change="clickCurrentChange">
      <!-- type="index" 获取索引值  prop=数据字段名-->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column prop="mobile" label="联系电话"  v-if="!isDialog" ></el-table-column>
      <el-table-column prop="remark" label="备注"  v-if="!isDialog" ></el-table-column>

      <el-table-column label="操作" width="150"  v-if="!isDialog" >
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete( scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20,50]"
      :page-size="pageSize"
      
      :total="total"
    ></el-pagination>
    <el-dialog title="供应商编辑" v-if="!isDialog" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width=400px"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="联系电话">
          <!-- value-format 是指定绑定值的格式 -->
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button type="primary" @click="pojo.id===null ? addData('pojoForm'): updateData('pojoForm') ">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import supplierApi from "../../api/supplier";
export default {
        props:{
        //接收父组件传递过来的数据通过isDialog来判断是否是弹框
        //true则是弹
        isDialog:Boolean
    },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // supplierApi.getList().then(res=>{
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(res => {
          this.list = res.data.data.rows;
          this.total = res.data.data.total;
          console.log("supplier", this.list);
        });
    },
    //打开编辑窗口
    handleEdit(id) {
      console.log("编辑", id);
      //清楚原来的表单数据和校验结果
        this.handleAdd()

        supplierApi.getById(id).then(res=>{
            const resp=res.data
            if(resp.flag){
                this.pojo=resp.data
            }else{
                //提交获取数据失败
                this.$message({
                    message:resp.message,
                    type:'warning'
                })
            }
            
        })
    },
    handleDelete(id) {
      console.log("删除", id);
    },
    updateData(fromName){
        //页面检验通过，才可以发送发送请求 进行更新
        this.$refs[fromName].validate(val=>{
            if(val){
      supplierApi.update(this.pojo).then(res=>{
          const  resp=res.data
          if(resp.flag){
              //刷新数据
              this.fetchData()
              this.dialogFormVisible=false
          }else{
              this.$message({
                  message:resp.message,
                  type:'warning'
              })
          }
        }
    )
         }else{
             return false
         } })
      
    },
    //当每页显示条数改变后们进行调用该方法，val是改变后的条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    resetForm(fromName) {
      //重置会看 el-form-item 组件元素的prop 上是否指定了字段名，指定了才会重置生效
      this.$refs[fromName].resetFields();
    },
    //打开新增窗口
    handleAdd() {
      // this.pojo={};
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        //他是一个异步事件this.$nextTick(() 当渲染结束之后 它的回调函数 才会被执行
        // 弹出窗口打开之后，需要加载Dom 就需要花费一点事件，我们就应该等待它加载完成dom之后，在进行调用resetFields方法，重置表单和清楚样式
        this.$refs["pojoForm"].resetFields();
      });
    },
    //提交新功能
    addData(fromName){
        this.$refs[fromName].validate(valid=>{
            if(valid)
            {
                //提交表单
                supplierApi.add(this.pojo).then(res=>{
                    const resp= res.data
                    if(resp.flag){
                        //刷新页面
                       this.fetchData()
                    this.dialogFormVisible=false
                    }else{
                        this.$message({
                            message:resp.message,
                            type:'warning'
                        })
                    }
                })
            }else{
                return false
            }
        })
    },
    handleDelete(id){
        this.$confirm('确认删除这条记录吗？','提示',{
            consfirmButtonText:'确认',
            cancleButtonText:'取消',
        }).then(()=>{
     supplierApi.deleteById(id).then(res=>{
            const resp=res.data
             if(resp.flag){
                //删除失败 刷新数据
                this.fetchData()
            }
             this.$message({
                            message:resp.message,
                            type:resp.flag ?'success':'error'
                        })
           
        })
        }).catch(()=>{

        })
       
    },
    // 当点击某一行时，会调用这个函数进行处理
    clickCurrentChange(currentRow){
        //点击后，要将点击的数据传递到父组件（商品管理中），
        //则可以触发父组件中的option-supplier，触发之后，父组件可以在option-supplier 这个事件处理函数中接收数据
        this.$emit('option-supplier',currentRow)
    }
  },
  data() {
    return {
      list: [],
      pageSize: 10, //每页显示10条
      currentPage: 1, //当前页码
      total: 0, //z总记录数
      searchMap: {
        //条件查询的绑定字段
        name: "",
        linkman: "",
        mobile: ""
      },
      dialogFormVisible: false,
      rules:{
          name:[{required:true,message:'供应商不能为空',trigger:'blur'}],
          linkman:[{required:true,message:'联系人不能为空',triggerL:'blur'}]
          
      },
      pojo:{
          name:'',
          linkman:'',
          mobile:'',
          remark:"",
          id:null
      }
    };
  }
};
</script>