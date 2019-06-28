<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>运维管理</el-breadcrumb-item>
        <el-breadcrumb-item>出勤管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

    <div class="block">
          <!-- 选择月份 -->
        <span class="chMonth">选择时间(年/月)</span>
        <el-date-picker
        v-model="value2"
        type="month"
        placeholder="选择月">
        </el-date-picker>
        <!-- 级联选择 -->
        <span class="chMonth">选择项目/班组</span>
        <el-cascader
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
        </el-cascader>

        <el-button type="success">查询</el-button>
        <el-button type="warning">数据导出</el-button>
    </div>

    <!-- 列表 -->
        <el-table highlight-current-row style="width: 100%;">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" ></el-table-column>
        <el-table-column prop="proname" label="项目组" ></el-table-column>
        <el-table-column prop="classname" label="班组"></el-table-column>
        <el-table-column prop="author" label="姓名" ></el-table-column>
        <el-table-column prop="position" label="职位"></el-table-column>
        <el-table-column prop="workrule" label="工作制"></el-table-column>
        <el-table-column prop="shodate" label="应到天数" ></el-table-column>
        <el-table-column prop="reldate" label="实到天数" ></el-table-column>
        <el-table-column prop="workser" label="顶班" ></el-table-column>
        <el-table-column prop="overtime" label="加班" ></el-table-column>
        <el-table-column prop="position" label="三倍薪" ></el-table-column>
        <el-table-column prop="workrule" label="无薪假" ></el-table-column>
        <el-table-column prop="shodate" label="带薪假" ></el-table-column>
        <el-table-column prop="reldate" label="部分薪假" ></el-table-column>
        <el-table-column prop="workser" label="绩效奖惩（金额）" ></el-table-column>
        <el-table-column prop="overtime" label="绩效奖惩（日薪）" ></el-table-column>
      </el-table>
     
  
    </el-col>
  </el-row>
</template>
<script>
  export default{
    data(){
      return {
        msg: 'hello vue',
        value2: '',

        // 级联选择
        options: [
            // 一级1
          {
            value: 'zhinan',
            label: '项目A',
            children: [{
              value: 'shejiyuanze',
              label: '班组1',
            
            }, {
              value: 'daohang',
              label: '班组2',
              
          },{
              value: 'banzu',
              label: '班组3',
              
            }]
          },
          // 一级2 
          {
            value: 'zujian',
            label: '项目B',
            children: [{
              value: 'basic',
              label: '班组1',
            
            }, {
              value: 'form',
              label: '班组2',
            
            }, {
              value: 'data',
              label: '班组3',
            
            }, {
              value: 'notice',
              label: '班组4',
            
            }, {
              value: 'navigation',
              label: '班组5',
            
            }]
          }, 
          // 三级
          {
            value: 'ziyuan',
            label: '项目C',
            children: [{
              value: 'axure',
              label: '班组1'
            }, {
              value: 'sketch',
              label: '班组2'
            }, {
              value: 'jiaohu',
              label: '班组3'
            }]
          }
        ],
        selectedOptions: [],

  
      }
    },

    methods: {
      handleChange(value) {
        console.log(value);
      }
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
</style>

