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
        <el-input v-model="searchMap.name" placeholder="商品名称" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
          <!-- el-input 是组件 要在组件元素监听原生事件需要使用v-on.native=“处理函数” -->
        <el-input readonly @click.native="dialogSupplierVisible=true" v-model="searchMap.supplierName" placeholder="选择供应商" style="width:200px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="$refs['searchForm'].resetFields()">重置</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
   <el-table :data="list" border style="width: 100%" height="450">
      <!-- type="index" 获取索引值  prop=数据字段名-->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价"></el-table-column>
 <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
  <el-table-column prop="storageNum" label="库存数量"></el-table-column>
   <el-table-column prop="supplierName" label="供应商"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete( scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20,50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 选择供应商标签 -->
    <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
     <supplier :isDialog="true" @option-supplier="optionsupplier"></supplier>>
    </el-dialog>
     <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" width="500px">
          
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width=400px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item prop="spec" label="商品">
          <!-- value-format 是指定绑定值的格式 -->
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice" ></el-input>
        </el-form-item>
         <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice" ></el-input>
        </el-form-item>
         <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum" ></el-input>
        </el-form-item>
         <el-form-item label="供应商" prop="supplierName">
          <el-input readonly @click.native="editOptionSupplier" placeholder="选择供应商" v-model="pojo.supplierName" ></el-input>
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
import goodsApi from '../../api/goods'
import Supplier from '@/views/supplier'
export default {

    components:{
        //注册 作为子组件
        Supplier
    },
    data(){
        return{
            list:[],
            pageSize:10,
            currentPage:1,
            total:0,
            searchMap:{
                name:'',
                code:'',
                supplierName:''
            },
            dialogSupplierVisible:false,//弹出供应商对话框
            dialogFormVisible:false,//编辑窗口
            rules:{
              name:[{required:true,message:'商品名称不能为空',trigger:'blur'}],
              code:[{required:true,message:'商品编码不能为空',trigger:'blur'}],
              retailPrice:[{required:true,message:'零售价不能为空',trigger:"blur"}]
            },
            pojo:{
              name:'',
              code:'',
              spec:'',
              retailPrice:"",
              purchasePrice:"",
              storageNum:"",
              supplierName:'',
              supplierId:null,
              id:null
            },
            isEdit:false//是否为编辑出口
        }
    },created() {
        this.fetchData()
    },
    methods: {
        fetchData(){
            goodsApi.search(this.pageSize,this.currentPage,this.searchMap).then(res=>{
                const resp=res.data
                this.list=resp.data.rows
                this.total=resp.data.total
                console.log(this.list)
            })
        },
        handleSizeChange(val){
            this.pageSize=val
            this.fetchData()
        },
        handleCurrentChange(val){
            this.currentPage=val
           this.fetchData()
        },
        optionsupplier(curentRow){
            // 供应商名称
            if(this.isEdit){
              //是编辑窗口打开的选择供应商
              this.pojo.supplierName=curentRow.name
              this.pojo.supplierId=curentRow.id
            }else{
              //就是搜索区域打开的选择供应商
              this.searchMap.supplierName=curentRow.name
            //供应商ID
          this.searchMap.supplierId= curentRow.id
            }
            this.isEdit=false
          this.dialogSupplierVisible=false
        },
        //新增
        handleAdd(){
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        //他是一个异步事件this.$nextTick(() 当渲染结束之后 它的回调函数 才会被执行
        // 弹出窗口打开之后，需要加载Dom 就需要花费一点事件，我们就应该等待它加载完成dom之后，在进行调用resetFields方法，重置表单和清楚样式
        this.$refs["pojoForm"].resetFields();
      });
        },
        addData(fromName){
this.$refs[fromName].validate(valid => {
        if (valid) {
          //提交表单
          console.log('提交新增表单')
          goodsApi.add(this.pojo).then(res=>{
            const resp=res.data
            if(resp.flag){
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
    editOptionSupplier(){
        this.dialogSupplierVisible=true
        this.isEdit=true//当前是编辑窗口中的选择供应商打开的窗口
    },
    //打开编辑窗口
    handleEdit(id){
      this.handleAdd();
      goodsApi.getById(id).then(res=>{
        const resp=res.data
        if(resp.flag){
          this.pojo=resp.data
        }
      })
    },
    //提交更新数据
    updateData(fromName){
      this.$refs[fromName].validate(val=>{
        if(val){
          //校验通过
          goodsApi.update(this.pojo).then(res=>{
            const resp=res.data
            if(resp.data){
              this.fetchData()
              this.dialogSupplierVisible=false
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
        this.$confirm('此操作将永久删除该数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          
        }).then(()=>{
            //确认
            goodsApi.deleteById(id).then((res)=>{
                const resp=res.data
                this.$message({
                    message:resp.message,
                    type:resp.flag? 'success':'error'
                })
                if(resp.flag)
                {
                    this.fetchData()
                }
            })
        }).catch(()=>{
          
            
            // 取消 自动消失 不用理会
        })
    }
    }
}
          
          
   

</script>