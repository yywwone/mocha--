<template>
<el-row>
  <el-col :span="18" class="mapDemo">
          <g-map
          v-if="mapVisible"
              :vid="vid"
              @click="choose"
              :drivingable="drivingable"
              :center="center"
              :lineArr="lineArr"
              :lineStart="lineStart"
              :lineEnd="lineEnd"
              :trackStop="showMessage"
              :TruckDrivingFlag="TruckDrivingFlag" >
          </g-map>
  </el-col>
  <el-col :span="6" class="mapBtn">
      <div>
        <p>当前经纬度：{{poi.lat}},{{poi.lng}}</p>
        <p>城市为: {{ address }}</p>
      </div>
      <el-button @click="changePoi">切换位置</el-button>
      <!-- <div>
         选择轨迹模式：
         <el-select v-model="TruckDrivingFlag" @change="truckChange">
            <el-option label="推荐线路模式" :value="1">推荐线路模式</el-option>
            <el-option label="航线模式" :value="2">航线模式</el-option>
            <el-option label="marker自定义模式" :value="3">marker自定义模式</el-option>
          </el-select>
      </div> -->

  </el-col>

</el-row>
</template>

<script>
import GMap from './gMap'


  export default {
    name: 'demo3D',
    components: { GMap },
    data () {
      return {
        vid:'amap-vue',
        poi:{lat:'',lng:''},
        mapVisible:true,
        drivingable:true,
        address:'',
        center:[116.41153, 39.989744],
        showMessage:true,
        TruckDrivingFlag:1,
        // lineEnd:[116.41153, 39.989744],
        // lineStart:[116.397428, 39.983412],
        lineEnd:[116.41153, 39.989744],
        lineStart:[116.397428, 39.983412],
        lineArr:[[116.397428, 39.983412],[116.403228, 39.983612],[116.408228, 39.989612],[116.413228, 39.989812]]
      }
    },
    methods:{
      choose(e){
        this.poi.lat = e.lat ;
        this.poi.lng = e.lng ;
        this.address = e.address;
      },
      changePoi(){
        this.center = [116.41153, 39.989744] ;
      },
      truckChange(e){
        this.mapVisible = false ;
        setTimeout(()=>{
        this.mapVisible = true ;
        },10)
        console.log(this.TruckDrivingFlag)
      }
    }
  }
</script>

<style scoped>
  .amap-demo {
    height: 200px;
  }
  .mapDemo{
    border:1px solid pink ;
    border-radius: 20px;
    padding: 20px;
  }

</style>

<style>

.amap-container {
    height:360px!important;
}
</style>

