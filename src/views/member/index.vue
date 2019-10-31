<template>
  <div>
    <!--:inline=”true“ 表单一行显示-->

    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px"
      class="demo-form-inline"
    >
      <!-- //重置会看 el-form-item 组件元素的prop 上是否指定了字段名，指定了才会重置生效 -->
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.carNum" placeholder="卡号" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="名字" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型" style="width:110px">
          <el-option
            :label="option.name"
            :value="option.type"
            v-for="option in payTypeOptions"
            :key="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <!-- value-format 是指定绑定值的格式 -->
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="出生日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据列表 :data绑定渲染的数据 -->
    <el-table :data="list" border style="width: 100%" height="450">
      <!-- type="index" 获取索引值  prop=数据字段名-->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="cardNum" label="卡号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="birthday" label="生日"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="integral" label="可以积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{scope.row.payType|payTypeFiler}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete( scope.row)">删除</el-button>
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
    >
      <!-- 弹出新增窗口 title 窗口标题   :visible.sync它为true的时候窗口会被弹出-->
    </el-pagination>
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width=400px"
      >
        <el-form-item label="卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item prop="birthday" label="生日">
          <!-- value-format 是指定绑定值的格式 -->
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item prop="payType" label="支付类型">
          <el-select v-model="pojo.payType" placeholder="支付类型" style="width:110px">
            <el-option
              :label="option.name"
              :value="option.type"
              v-for="option in payTypeOptions"
              :key="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input v-model="pojo.address" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button
          type="primary"
          @click="pojo.id===null?addData('pojoForm'): updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import memberApi from "../../api/menmber";

const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "支付宝" },
  { type: "3", name: "银行卡" },
  { type: "4", name: "微信" }
];
export default {
  created() {
    //初始化获取列表数据
    this.fetchData();
  },
  methods: {
    fetchData() {
      // memberApi.getList()
      //调用分页查询数据
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(res => {
          const resp = res.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
          console.log(resp.data.rows);
        });
    },
    updateData(formName) {
        console.log('gengxin')
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交更新
          memberApi.update(this.pojo).then(res => {
            const resp = res.data;
            if (resp.flag) {
              //刷新列表
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message({
                message:"更新成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "更新失败",
                type: "warning"
              });
            }
          });
        }else{
            return false
        }
      });
    },
    //打开编辑窗口
    handleEdit(id) {
        
      this.handleAdd();
      memberApi.getById(id).then(res => {
        const resp = res.data;

        if (resp.flag) {
          this.pojo = resp.data;
          console.log(this.pojo)
        }
      });
    },
    handleDelete(id) {
      console.log("删除", id);
    },
    //当每页显示条数改变后，被触发 val是最新的每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    //当页码改变之后，被处罚 val是最新的页面
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    resetForm(fromName) {
      //重置会看 el-form-item 组件元素的prop 上是否指定了字段名，指定了才会重置生效
      this.$refs[fromName].resetFields();
    },
    //提交新增数据
    addData(fromName) {
        console.log(this.pojo)
      this.$refs[fromName].validate(valid => {
        if (valid) {
          console.log("addDate");
          //提交表单
          memberApi.add(this.pojo).then(res => {
            const resp = res.data;
            if (resp.flag) {
              //新增成功，刷新数据
              this.fetchData();
              this.dialogFormVisible = false; //关闭窗口
            } else {
              this.$message({
                //element-ui 语法
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //弹出新增窗口
    handleAdd() {
      // this.pojo={};
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        //他是一个异步事件this.$nextTick(() 当渲染结束之后 它的回调函数 才会被执行
        // 弹出窗口打开之后，需要加载Dom 就需要花费一点事件，我们就应该等待它加载完成dom之后，在进行调用resetFields方法，重置表单和清楚样式
        this.$refs["pojoForm"].resetFields();
      });
    },
    handleDelete(id){
        this.$confirm('此操作将永久删除该数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          
        }).then(()=>{
            //确认
            memberApi.deleteById(id).then((res)=>{
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
    
  },
  filters: {
    payTypeFiler(type) {
      //   payTypeOptions.find(obj=>{
      //       obj.type===type
      //   })
      //在过滤器当中不能引用当前实例 this
      //数组里的find查找一条数据
      const payObj = payTypeOptions.find(obj => obj.type === type);
      //true有值 返回payObj.name
      return payObj ? payObj.name : null;
    }
  },
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示10条数据
      searchMap: {
        //条件查询绑定的条件值
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      },
      payTypeOptions,
      dialogFormVisible: false, //控制对话框
      pojo: {
        id: null,
        cardNum: "",
        name: "",
        payType: "",
        birthday: "",
        phone: "",
        money: "",
        integral: "",
        payType: "",
        address: ""
      }, //提交的数据
      rules: {
        //校验规则
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "支付不能为空", trigger: "change" }
        ]
      }
    };
  }
};
</script>
<style scoped>
</style>