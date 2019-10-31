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
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名" style="width:200px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary"   @click="resetForm('searchForm')">重置</el-button>
        <el-button type="primary"    @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
      <el-table :data="list" border style="width: 100%" height="450">
      <!-- type="index" 获取索引值  prop=数据字段名-->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="username" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="salary" label="薪酬"></el-table-column>
      <el-table-column prop="entryData" label="入职时间"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="用户编辑"  :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width=400px"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item prop="age" label="年龄">
          <!-- value-format 是指定绑定值的格式 -->
          <el-input v-model="pojo.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile" ></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryData">
          <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="pojo.entryData"
          type="date"
          placeholder="请点击选择"
        ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button type="primary" @click="pojo.id===null ? addData('pojoForm'): updateData('pojoForm') ">确 定</el-button>
      </div>
    </el-dialog>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20,50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
      <!-- 弹出新增窗口 title 窗口标题   :visible.sync它为true的时候窗口会被弹出-->
    </el-pagination>
    </div>
</template>
<script>
import staffApi from '../../api/staff'
export default {
    data(){
        return{
            list:[],
            currentPage:1,
            pageSize:10,
            total:0,
            searchMap:{
                username:'',
                name:''
            },
            rules:{
                username:[{required:'true',message:'账号不能为空',trigger:'blur'}],
                name:[{required:'true',message:'姓名不能为空',trigger:'blur'}],
                
            },
            pojo:{
                username:'',
                name:'',
                age:'',
                mobile:'',
                salary:'',
                entryData:''    
            },
            dialogFormVisible:false
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData(){
            staffApi.search(this.currentPage,this.pageSize,this.searchMap).then(res=>{
                const resp=res.data
                if(resp.flag)
                {
                    this.list=resp.data.rows
                    this.total=resp.data.total
                }
            })
        },
        handleEdit(id){
            this.dialogFormVisible=true
            staffApi.getById(id).then(res=>{
                const resp=res.data
                if(resp.flag)
                {
                    this.pojo=resp.data
                }else{
                    this.$message({
                        message:resp.message,
                        type:'warning'
                    })
                }
            })
        },
        updateData(formName){
            this.$refs[formName].validate(val=>{
                if(val){
                    staffApi.update(this.pojo).then(res=>{
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
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        handleAdd(){
            this.dialogFormVisible=true
            this.$nextTick(() => {
        //他是一个异步事件this.$nextTick(() 当渲染结束之后 它的回调函数 才会被执行
        // 弹出窗口打开之后，需要加载Dom 就需要花费一点事件，我们就应该等待它加载完成dom之后，在进行调用resetFields方法，重置表单和清楚样式
        this.$refs["pojoForm"].resetFields();
      });
        },
        addData(formName){
            this.$refs[formName].validate(val=>{
                if(val){
                staffApi.add(this.pojo).then(res=>{
                    const resp=res.data
                
                    if(resp.flag){
                        this.dialogFormVisible=false
                        this.fetchData()
                        
                    }
            })
                }else{
                    return false
                }
          })
            
        },
        handleSizeChange(val){
            this.pageSize=val
            this.fetchData()
        },
        handleCurrentChange(val){
            this.currentPage=val
            this.fetchData()
        }
    },

}
</script>