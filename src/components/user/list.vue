<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-input v-model="filters.name" placeholder="用户名/姓名/昵称" style="min-width: 240px;" @keyup.enter.native="handleSearch"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
             <el-form-item>
              <el-button type="primary" @click="dialogVisible = true">增加</el-button>
            </el-form-item>
          </el-form>
        </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" sortable>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="120" sortable>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="160" sortable>
        </el-table-column>
        <el-table-column prop="addr" label="地址" sortable>
        </el-table-column>
      </el-table>


<!-- 增加管理人员页面 -->
      <el-dialog title="新增" :visible.sync ="dialogVisible" :close-on-click-modal="false">
        <el-form  label-width="80px"  ref="addForm">
          <el-form-item label="姓名" prop="name">
            <el-input  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="学习管理">
           <el-checkbox>课程</el-checkbox>
           <el-checkbox >培训</el-checkbox>
            <el-checkbox >考试</el-checkbox>
           <el-checkbox >微课</el-checkbox>
        </el-form-item>
         <el-form-item label="运维管理">
           <el-checkbox >排班</el-checkbox>
           <el-checkbox >人员配置</el-checkbox>
            <el-checkbox >故障管理</el-checkbox>
           <el-checkbox >问题管理</el-checkbox>
            <el-checkbox >投诉管理</el-checkbox>

        </el-form-item>

         <el-form-item label="人事管理">
           <el-checkbox >荣誉资质</el-checkbox>
           <el-checkbox>效率统计</el-checkbox>
            <el-checkbox >绩效考核</el-checkbox>
           <el-checkbox >离职管理</el-checkbox>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button >取消</el-button>
          <el-button type="primary" >提交</el-button>
        </div>
      </el-dialog>



    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_user';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        loading: false,
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        dialogVisible:false,
        addForm: {
          name: '',
          number:''
        },
      // 增加管理员中 多选框默认不选中
        // checked: false,
      }

 

    },

    
    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },

      handleSearch(){
        this.total = 0;
        this.page = 1;
        
        // this.search();
      },


      // 新增管理人员，使用带提交功能的弹框

addMan: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          author: '',
          publishAt: '',
          description: ''
        };
      },


      //获取用户列表
      search: function () {
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          name: that.filters.name
        };

        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result && result.users) {
            that.total = result.total;
            that.users = result.users;
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      }
    },
    mounted() {
      this.handleSearch()
    }
  }
</script>

<style scoped>

</style>
