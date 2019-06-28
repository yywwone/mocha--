<template>
  <el-row class="warp">
    <!-- 表头 -->
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>通用配置</el-breadcrumb-item>
        <el-breadcrumb-item>分组设置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="分组名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-col>

    <el-col :span="24">
      <el-button type="text" class="kaoqin" @click="openAddr">添加考勤地点</el-button>
    </el-col>

    <!--弹框 -->

    <el-dialog title="高德地图" :visible.sync="dialogFormVisible">
      <mapDrag  class="mapbox"></mapDrag>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </el-row>
</template>

<script>
import mapDrag from './mapDrag'
export default {
  name: "",
  components: {
    mapDrag
  },
  data() {
    return {
      msg: "",
      dialogFormVisible: false,
       dragData: {
        lng: null,
        lat: null,
        address: null,
        nearestJunction: null,
        nearestRoad: null,
        nearestPOI: null
      },
    };
  },
  methods: {
  

    openAddr(data) {
      // console.log(11);
      this.dialogFormVisible = true;
    },

   
  }
};
</script>

<style scoped>
.kaoqin {
  color: #38adff;
  background: transparent;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  transition: color 0.3s ease;
}
</style>

