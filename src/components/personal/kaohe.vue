<template>
  <el-row class="warp">
      <!-- 表头 -->
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>人事管理</el-breadcrumb-item>
        <el-breadcrumb-item>绩效考核</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>


    <el-col :span="24" class="warp-main">
        <div class="block">
            <span class="chMonth">绩效考核</span>

        <el-cascader
            v-model="value"
            :options="options"
            @change="handleChange">
        </el-cascader>

        <!-- 列表 -->
        <el-table @cell-click="showhandleChange" :data="tableData" :cell-style="cellStyle" style="width: 100%">

            <el-table-column prop="name" label="团队成员"></el-table-column>
            <el-table-column prop="q1" label="Q1" ></el-table-column>
            <el-table-column prop="q2" label="Q2"></el-table-column>
            <el-table-column prop="q3" label="Q3" ></el-table-column>
            <el-table-column prop="q4" label="Q4"></el-table-column>
        </el-table>


     


        <el-dialog class="changeClass" title="修改此人得当天排班" :visible.sync="centerDialogVisible" width="15%" >
          <ul class="classul">
            <li class="classli">
              <div class="classdiv zhiban">值班</div>
            </li>
           <li class="classli">
              <div class="classdiv morcl">早班</div>
            </li>
            <li class="classli">
              <div class="classdiv evecl">晚班</div>
            </li>
             <li class="classli">
              <div class="classdiv reast">休</div>
            </li>
          </ul>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>


        </div>
    </el-col>
  </el-row>
</template>
<script>


  export default{
    data(){
      return {

       
        // 级联选择
        value: [],
        options: [
            // 一级1
          {
            value: 'one',
            label: '2019年度',
          },
           {
            value: 'two',
            label: '2018年度',
          },
           {
            value: 'three',
            label: '2017年度',
          },
          {
            value: 'four',
            label: '2016年度',
          },
           {
            value: 'fif',
            label: '2015年度',
          },
          
        ],

        tableData: [{
            name: '王小虎',
            q1: '90',
            q2: '80',
            q3: '90',
            q4: '80',
          }, {
           name: '王小',
            q1: '90',
            q2: '80',
            q3: '90',
            q4: '80',
          }, {
            name: '王',
            q1: '90',
            q2: '80',
            q3: '90',
            q4: '80',
          }, {
            name: '小虎',
            q1: '90',
            q2: '80',
            q3: '90',
            q4: '80',
        }],

        centerDialogVisible:false,


    

        }

      
    },

  
    methods: {
     handleChange(value) {
        console.log(value);
      },

      // 单元格 手动排班
      showhandleChange(row,column,cell,event){

        // 获取点击的单元格内容
        console.log(row[column.property]);
        this.centerDialogVisible = true;


      },

      cellStyle({row, column, rowIndex, columnIndex}){
        if(row[column.property] === '王小虎'){
          return 'background:#5e90ff;color:#fff;'

        }else if(row[column.property] === '王小'){
          return 'background:#fb6370;color:#fff;'

        }else if(row[column.property] === '王'){
          return 'background:#ff943e;color:#fff;'

        }else if(row[column.property] === '王小'){
          return 'background:#f6f6f6;color: rgb(152, 152, 152);'

        }

      },

      
    },
  }
</script>

<style scoped>

.chMonth {
    display:inline-block;
    padding:0.6rem;
    color:#fff;
    border-radius:4px;
    background:#409EFF;
}


/* 弹框 */
.classul {
  /* width:400px; */
    outline: none;
    margin-bottom: 0;
    padding-left: 0;
    list-style: none;
    z-index: 1050;
    /* box-shadow: 0 1px 6px rgba(0,0,0,.2); */
    color: rgba(0,0,0,.65);
    background: #fff;
    line-height: 46px;
    transition: background .3s,width .2s;
}

.classli{
    padding: 0 20px;
    font-size: 12px;
    line-height: 42px;
    height: 42px;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    list-style: none;

}
.classdiv:hover{
  opacity: 0.6;
  
}
.classdiv{
    height: 26px; 
    text-align: center;
    line-height: 26px;
    background: #5e90ff;
    border-color: #5e90ff;
    color: #fff;
    text-overflow: ellipsis;
    overflow: hidden;
    border-radius: 0;

}
.morcl {
  background: #fb6370;
}
.evecl {
  background: #ff943e;
}
.reast {
  background: #f6f6f6;
    border-color: #f6f6f6;
    color: #191f25;

}

/* 单元格 */
.active {
  display:inline-block;
  width:100%;
  height:100%;
  color:blue;
  background:green;
}

.active {
  display:inline-block;
  width:100%;
  height:100%;
  color:blue;
  background:pink;
}




</style>

<style>
.el-table .cell, .el-table th div {
 padding: 0px;
 height:100%;
}
.el-table td, .el-table th {
  padding:0 0;
}

</style>


