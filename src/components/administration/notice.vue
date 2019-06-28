<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>行政管理</el-breadcrumb-item>
        <el-breadcrumb-item>消息通知</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

        <el-row>
            <el-button type="danger" icon="el-icon-circle-plus"  @click="dialogVisible = true" >发布新通知</el-button>
        </el-row>

        <!--发布新通知 弹框 -->
         <el-dialog title="发布新通知" :visible.sync ="dialogVisible" :close-on-click-modal="false">
        <el-form  label-width="80px"  ref="addForm">
          <el-form-item label="通知标题" prop="title">
            <el-input  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="落款" prop="end">
           
           <el-select v-model="value" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>

          </el-form-item>

           <el-form-item label="简介" prop="description">
            <el-input type="textarea" :rows="8"></el-input>
            </el-form-item>

            <el-form-item label="置顶时间" prop="topTime">
                <el-input-number v-model="num" @change="handleChange" :min="0" :max="10" label="描述文字"></el-input-number>
            </el-form-item>
          
        <el-form-item label="接收人" prop="person">
            <el-input  auto-complete="off"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button >取消</el-button>
          <el-button type="primary" >提交</el-button>
        </div>
      </el-dialog>



      <!-- 通知列表 -->
    <el-table highlight-current-row style="width: 100%;height:30rem" :data="tableData">
        <el-table-column type="selection" ></el-table-column>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="time" label="发布时间" ></el-table-column>
        <el-table-column prop="title" label="标题" width="500"></el-table-column>
        <el-table-column prop="end" label="落款" ></el-table-column>
        <el-table-column label="操作" width="250">
          <template >
            <el-button size="small">编辑</el-button>
            <el-button type="danger">删除</el-button>
            <el-button type="success">置顶</el-button>
          </template>
        </el-table-column>
    </el-table>
     
  </el-col>
      
  
  </el-row>
</template>
<script>
  export default{
    data(){
      return {
        msg: 'hello vue',
        dialogVisible:false,
        // 计数器天数
         num: 1,
        addForm: {
          name: '',
          number:''
        },

        // 落款选择

        options: [{
                value: '选项1',
                label: '总裁办'
                }, {
                value: '选项2',
                label: '设计部'
                }, {
                value: '选项3',
                label: '工程部'
                }, {
                value: '选项4',
                label: '信息部'
                }, {
                value: '选项5',
                label: '人事部'
                }],
                value: '',

        // 消息列表
        tableData: [{
            index:'1',
            time:'2019-1-24',
            title:'花心柳眼。郎似游丝常惹绊。慵困谁怜。绣线金针不喜穿',
            end:'柳永',
            
          }, {
           index:'2',
            time:'2019-7-10',
            title:'清晨帘幕卷轻霜。呵手试梅妆。都缘自有离恨，故画作远山长。',
            end:'某某',
          }]
      }
    },

    methods: {
      handleChange(value) {
        console.log(value);
      }
    },
  }
</script>

<style>

</style>

