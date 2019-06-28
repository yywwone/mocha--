<template>
  <div class="amap-container" :style="{height: flexHeight}">
    <div class="svgBtn" v-show="chooseArea">
      <!-- <el-select v-model="svgChoose" placeholder="请选择选择区域" @change="changeSvg">
        <el-option label="圆" value="1" />
        <el-option label="折线" value="2" />
        <el-option label="椭圆" value="3" />
        <el-option label="矩形" value="4" />
        <el-option label="多边形" value="5" />
        <el-option label="自定义多边形" value="6" />
      </el-select> -->
        <el-button-group v-show="svgChoose == 1">
          <el-button @click="addCircle">添加圆</el-button>
          <el-button @click="editCircle">编辑圆</el-button>
          <el-button @click="exitCircle">结束编辑圆</el-button>
          <el-button @click="removeCircle">del circle</el-button>
        </el-button-group>
        <el-button-group v-show="svgChoose == 5">
          <el-button @click="addPolygon">添加多边形</el-button>
          <el-button @click="editPolygon">编辑多边形</el-button>
          <el-button @click="exitPolygon">结束编辑多边形</el-button>
          <el-button @click="removePolygon">del多边形</el-button>
        </el-button-group>
        <el-button-group v-show="svgChoose == 6">
          <el-button id="addmPolygon">添加自定义多边形</el-button>
          <el-button id="clearPolygon">删除多边形</el-button>
        </el-button-group>
        <el-button-group v-show="svgChoose == 2">
          <el-button  id="measureLine">两点测距离</el-button>
          <el-button  id="measureLineDel">删除直线</el-button>
        </el-button-group>
    </div>

    <el-amap-search-box class="search-box" v-model="inputSearch"  :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
      <el-amap
        :vid="vid"
        :center="mapCenter"
        :zoom="zoom"
        :rotateEnable="rotateEnable"
        :resizeEnable="resizeEnable"
        :mapStyle="mapStyle"
        :amap-manager="amapManager"
        :plugin="plugin"
        :events="events"
      >
      <div v-show="false" id="panel"></div>
      <!-- <el-amap-marker  zIndex="2000" class="aaaaa" icon="http://pevw4ryx8.bkt.clouddn.com/default_2x-fs.png" @click.stop="markerClick" :clickable="clickable" :position="mapCenter"></el-amap-marker> -->
      <el-amap-marker cursor="pointer" :bubble="bubble" :clickable="clickable" v-for="(marker,index) in markers" :key="index" :position="marker.poi" :title="marker.address" @click.stop="markerClick"></el-amap-marker>
      <!-- circle -->
      <el-amap-circle :visible="circle.visible" :editable="circle.editable" :center="mapCenter" :radius="circle.radius" :fill-opacity="circle.fillOpacity" :events="circle.events"></el-amap-circle>
      <el-amap-polygon  :visible="polygon.visible" :editable="polygon.editable" :vid="polygon.id" :path="polygon.path" :draggable="polygon.draggable" :events="polygon.events"></el-amap-polygon>
      </el-amap>

  </div>
</template>
<script>
  import VueAMap from 'vue-amap'
  import { lazyAMapApiLoaderInstance,AMapManager } from 'vue-amap';
  const amapManager = new VueAMap.AMapManager();
/**
 * 高德地图组件
 * ----------------------
 * @Author: Calamus
 * @Date: 2018.09.13
 *
 * @prop {string} [vid= 'amap-demo'] - 地图id，调用多个地图id不能重复
 * @prop {Number} [flex= 0] - 地图高度，默认0为自动填满屏幕
 * @prop {Array}  [center=  [121.59996, 31.197646]] - 中心坐标经纬度
 * @prop {Number} [zoom= 16] - 默认放大比例
 * @prop {Boolean} [rotateEnable= true] - 是否可旋转
 * @prop {Boolean} [resizeEnable= true] - 大小是否根据容器变化自动变化
 * @prop {string} [mapStyle= 'normal'] - 地图风格
 * @prop {Boolean} [chooseArea= true] - 是否展示选择区域范围
 * @event {function} click - 获取点击地图后的坐标和地址中文
 */
export default {
  name: 'GMap',
  props: {
    //地图id，调用多个地图id不能重复
    vid: {
      type: String,
      default: 'amap-demo'
    },
    flex:{
      type: Number,
      default: 0
    },
    center:{
      type:Array,
      default:()=>{return [121.59996, 31.197646]}
    },
    zoom:{
      type: Number,
      default: 16
    },
    rotateEnable:{
      type:Boolean,
      default:true
    },
    resizeEnable:{
      type:Boolean,
      default:true
    },
    mapStyle:{
      type:String,
      default:"normal"
    },
    chooseArea:{
      type:Boolean,
      default:true
    },
    //选择轨迹模式 1:推荐火车路线形式 2:自定义marker形式 3:巡航模式
    TruckDrivingFlag:{
      type:Number,
      default:3
    },
    drivingable:{
      type:Boolean,
      default:false
    },
    //途经坐标
    lineArr:{
      type:Array,
      default:()=>{
        return [] ;
      }
    },
    //起点
    lineStart:{
      type:Array,
      default:()=>{
        return [] ;
      }
    },
    //终点
    lineEnd:{
      type:Array,
      default:()=>{
        return [] ;
      }
    },
    trackStop:{
      type:Boolean,
      default:true
    }

  },
  data(){
    let self = this ;
    return {
      amapManager,
      map:null,
      geocoder:null,
      ruler:null,
      mouseTool:null,
      mPolygon:null,
      flagBit: false, //绘制围栏标志位
      renderFenceOk: false, //绘制围栏成功标志位
      driving:null, //轨迹
      fenceArr:[],
      mapCenter:[],
      svgChoose:'',
      chooseVisible:false,
      bubble:true,
      clickable:true,
      minHeight:300,
      loaded:false,
      markers: [],
      inputSearch:'',
      ellipse:{},
      rectangle:{},
      searchOption: {
        city: '西安',
        citylimit: false
      },
      currentAddress:'',
      currentPosition:[],
      events: {
        init: (map) => {
            let addPolygonButton = document.getElementById("addmPolygon")
            let clearPolygonButton = document.getElementById("clearPolygon")

            //绘制自定义多边形
            // 引入绘图插件  全局调用绘图插件
            self.mouseTool = new AMap.MouseTool(map);

            // 绘制围栏
            AMap.event.addDomListener(addPolygonButton, "click", (resData) => {
                // self.mouseTool.polygon();
                self.mouseTool.measureArea();
                self.flagBit = true ;
            }, false);
            // 清除围栏
            AMap.event.addDomListener(clearPolygonButton, "click", () => {
            //移除计算的围栏
              self.mouseTool.close(true);
              self.flagBit = false ;
            }, false);
            //绘制完成触发此事件
            self.mouseTool.on("draw", (resData) => {
              console.log("draw",resData.obj.getPath())
              self.flagBit = false ;
              self.mouseTool.close(false) //停止画好的围栏
              // 把坐标点传给连接坐标点插件
              let arr = resData.obj.getPath().map((item) => {
                return [item.lng, item.lat]
              })
            })

          console.log("init",map.getCenter())
          map.getCity(result => {
            console.log("init map",result)
          })

          //测距直线line
          let measureLine = document.getElementById("measureLine")
          let measureLineDel = document.getElementById("measureLineDel")
          //引入测量距离插件 全局调用插件
          self.ruler = new AMap.RangingTool(map);
          var sMarker = {
              icon: new AMap.Icon({
                  size: new AMap.Size(19, 31),//图标大小
                  image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b1.png"
              })
          };
          var eMarker = {
              icon: new AMap.Icon({
                  size: new AMap.Size(19, 31),//图标大小
                  image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b2.png"
              }),
              offset: new AMap.Pixel(-9, -31)
          };
          var lOptions = {
              strokeStyle: "solid",
              strokeColor: "#FF33FF",
              strokeOpacity: 1,
              strokeWeight: 2
          };
          var rulerOptions = {startMarkerOptions: sMarker, endMarkerOptions: eMarker, lineOptions: lOptions};

          AMap.event.addDomListener(measureLine, "click", (resData) => {
              self.ruler.turnOn();
              self.flagBit = true ;
          }, false);
          AMap.event.addListener(self.ruler, "end", function(e) {
            self.ruler.turnOff(false);
            self.flagBit = false ;
          });
            //移除line
          AMap.event.addDomListener(measureLineDel, "click", () => {
              // self.mouseTool.close(true);
            self.ruler.turnOff(true);
              self.flagBit = false ;
            }, false);




            //推荐轨迹
            if(self.drivingable && self.TruckDrivingFlag == 1){
              this.driving = new AMap.TruckDriving({
                      map: map,
                      policy:0,
                      size:1,
                      city:'shanghai',
                      panel:'panel'
              });
              var path = [];
              // path.push({lnglat:[116.303843, 39.983412]});//起点
              // path.push({lnglat:[116.321354, 39.896436]});//途径
              // path.push({lnglat:[116.407012, 39.992093]});//终点
              this.driving.search(path,function(status, result) {
                      //TODO something
                      console.log("guiji")
              });
            }

            //轨迹巡航
            else if(self.drivingable && self.TruckDrivingFlag == 2){
              AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {

                if (!PathSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！');
                    return;
                }

                var pathSimplifierIns = new PathSimplifier({
                    zIndex: 100,
                    //autoSetFitView:false,
                    map: map, //所属的地图实例

                    getPath: function(pathData, pathIndex) {

                        return pathData.path;
                    },
                    getHoverTitle: function(pathData, pathIndex, pointIndex) {

                        if (pointIndex >= 0) {
                            //point
                            return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                        }

                        return pathData.name + '，点数量' + pathData.path.length;
                    },
                    renderOptions: {

                        renderAllPointsIfNumberBelow: 100 //绘制路线节点，如不需要可设置为-1
                    }
                });

                window.pathSimplifierIns = pathSimplifierIns;

                //设置数据
                pathSimplifierIns.setData([{
                    name: '路线0',
                    path: [
                        // [116.405289, 39.904987],
                        // [113.964458, 40.54664],
                        // [111.47836, 41.135964],
                        // [108.949297, 41.670904],
                        // [106.380111, 42.149509],
                        // [103.774185, 42.56996],
                        // [101.135432, 42.930601],
                        // [98.46826, 43.229964],
                        // [95.777529, 43.466798],
                        // [93.068486, 43.64009],
                        // [90.34669, 43.749086],
                        // [87.61792, 43.793308]
                    ]
                }]);

                  //initRoutesContainer(d);

                function onload() {
                    pathSimplifierIns.renderLater();
                }

                function onerror(e) {
                    alert('图片加载失败！');
                }

                //对第一条线路（即索引 0）创建一个巡航器
                var navg1 = pathSimplifierIns.createPathNavigator(0, {
                    loop: false, //循环播放
                    speed: 1000000, //巡航速度，单位千米/小时
                    pathNavigatorStyle: {
                      width: 24,
                      height: 24,
                      //使用图片
                      content: PathSimplifier.Render.Canvas.getImageContent('https://webapi.amap.com/images/car.png', onload, onerror),
                      strokeStyle: null,
                      fillStyle: null,
                      //经过路径的样式
                      pathLinePassedStyle: {
                          lineWidth: 6,
                          strokeStyle: 'black',
                          dirArrowStyle: {
                              stepSpace: 15,
                              strokeStyle: 'red'
                          }
                      }
                    }
                });

                navg1.start();
              })
            }

            //自定义路径轨迹
            else if(self.drivingable && self.TruckDrivingFlag == 3){

              var lineArr = [] ;
              let len = self.lineArr.length ;
              var lineStart = self.lineStart;
              var lineEnd = self.lineEnd;
              var customMarker = new AMap.Marker({
                  map: map,
                  position: [116.397428, 39.983412],
                  icon: "https://webapi.amap.com/images/car.png",
                  offset: new AMap.Pixel(-26, -13),
                  autoRotation: true
              });
              for (var i = 1; i < len; i++) {
                  lineArr.push(new AMap.LngLat(self.lineArr[i][0],self.lineArr[i][1]));
              };
                // 绘制轨迹
              var polyline = new AMap.Polyline({
                  map: map,
                  path: lineArr,
                  strokeColor: "#00A",  //线颜色
                  strokeOpacity: 0.8,     //线透明度
                  strokeWeight: 3,      //线宽
                  strokeStyle: "dashed"  //线样式
              });
              var passedPolyline = new AMap.Polyline({
                  map: map,
                  // path: lineArr,
                  strokeColor: "#F06292",  //线颜色
                  strokeOpacity: 1,     //线透明度
                  strokeWeight: 3,      //线宽
                  strokeStyle: "solid"  //线样式
              });

              customMarker.on('moving',function(e){
                  passedPolyline.setPath(e.passedPath);
                  if(e.passedPath.length -1 >=0){
                    var end = e.passedPath[e.passedPath.length -1] ;
                    if( Math.abs(end.lng - lineEnd[0] ) <= 0.001 && Math.abs(end.lat - lineEnd[1]) <= 0.001){
                      console.log("stop")
                      customMarker.stopMove();
                  }
                  }else{
                      customMarker.stopMove();
                  }
              })
              map.setFitView();
              //开始运动
              if(self.trackStop){
                console.log("start")
                customMarker.moveAlong(lineArr, 5000);
              }else{
                console.log("resetStop")
                customMarker.stopMove();
              }
              //暂停
              // customMarker.pauseMove();
              //继续
              //  customMarker.resumeMove();
              //结束
              // customMarker.stopMove();

            }

        },
      'moveend': () => {
      },
      'zoomchange': () => {
      },
      'click': (e) => {
        if(!this.flagBit){
            this.chooseVisible = true ;
            let { lng, lat } = e.lnglat;
            this.mapCenter = [lng ,lat];
            this.getAddress([lng ,lat]);
            let message = self.getAddress([lng ,lat]);
            this.$nextTick(()=>{
              console.log(self.getAddress([lng ,lat]),"111",message)
            });
        }
      }
      },
      plugin: ['AMap.TruckDriving','AMap.RangingTool','ToolBar', 'MapType', 'Scale', 'AMap.EllipseEditor', 'AMap.RectangleEditor',
      'AMap.PolyEditor', 'AMap.MouseTool'],
      circle:{
              editable:false,
              visible:false,
              center: [121.5273285, 31.21515044],
              radius: 1000,
              fillOpacity: 0.5,
              events: {
                click: () => {
                  console.log('click');
                }
              }
      },
      polygon:{
        id:'1',
        visible:false,
        editable:false,
        draggable: true,
        path:[],
        events: {
          click: () => {
            console.log('click polygon');
            console.log(amapManager.getComponent(0));
            console.log(this.$refs.map.$$getCenter())
            console.log(this.$refs.polygon_0[0].$$getPath())
          }
        }
      }
    }
  },
  mounted(){
      this.initMap();
  },
  computed:{
    flexHeight(){
      var mh = document.documentElement.clientHeight - this.flex > this.minHeight
      ? document.documentElement.clientHeight - this.flex
      : this.minHeight ;
      console.log("height",mh)
      return mh + 'px'
    },
  },
  watch:{
    svgChoose(newVal,oldVal){
        switch(newVal){
          case '1':
            break;
          case '2':
            break;
        }
    },
    center(newVal,oldVal){
      if(newVal){
        this.mapCenter = newVal
      }else{
        this.mapCenter =  [121.59996, 31.197646]
      }
    }
  },
  methods:{
    // initMap(){
    //   this.mapCenter = this.center ;
    //   this.geocoder = new AMap.Geocoder({
    //                         radius: 1000,
    //                         extensions: "all"
    //                       });
    //   this.getAddress(this.mapCenter);
    //   this.getLocation("上海市")
    // },
    initMap(){
      lazyAMapApiLoaderInstance.load().then(() => {
        this.map = new AMap.Map('amapContainer', {
          center: new AMap.LngLat(this.center[0],this.center[1])
        });
        this.geocoder = new AMap.Geocoder({
                            radius: 1000,
                            extensions: "all"
                          });
      this.getAddress([121.59996,31.197646]);
      this.getLocation("上海市")
      });
      this.mapCenter = this.center ;
    },
    //经纬度返回地址
    getAddress(location){
      var address ;
      this.geocoder.getAddress(location, (status, result)=> {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                  this.currentAddress = result.regeocode.formattedAddress;
                  this.$emit('click',{'lat':location[0],'lng':location[1],'address':this.currentAddress})
                  this.$nextTick();
              }
            }
          });
      return this.currentAddress
    },
    //地址返回经纬度列表
    getLocation(address){
      this.geocoder.getLocation(address, (status, result) =>{
        console.log("address",address);
          if (status === 'complete' && result.info === 'OK') {
            // result中对应详细地理坐标信息
            console.log("result",result.geocodes[0].location);
             let { lng, lat } = result.geocodes[0].location;
            this.currentPosition = [lng, lat];
          }
        })
        return  this.currentPosition;
    },
    addMarker: function() {
          let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
          let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
          this.markers.push([lng, lat]);
        },
    onSearchResult(pois) {
      console.log("po",this.inputSearch,pois)
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach(poi => {
          let {lng, lat} = poi;
          let address = poi.address ;
          lngSum += lng;
          latSum += lat;
          this.markers.push({'poi':[poi.lng, poi.lat],'address':address});
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        };
        this.mapCenter = [center.lng, center.lat];
      }
      console.log("mar",this.markers)
    },
    markerClick(res){
        console.log("markerClick",res)
    },
    //高德SDK实践
    //圆
    changeSvg(res){
     console.log(res)
    },
    addCircle() {
        this.circle.visible = true ;
    },
    editCircle (){
        this.circle.editable = true ;
    },
    exitCircle (){
        this.circle.editable = false ;
    },
    removeCircle(){
        this.circle.editable = false ;
        this.circle.visible = false ;
    },
    //椭圆
    addEllipse() {
          // this.map = this.amapManager.getMap();
          this.ellipse = new AMap.Ellipse({
            map: this.map,
            center: this.mapCenter,
            radius: [ 4000, 6000 ],
            strokeColor:'red',
            strokeWeight:10,
            strokeOpacity:0.5,
            strokeDasharray: [30,10],
            strokeStyle: 'dashed',
            fillColor:'blue',
            fillOpacity:0.5,
            zIndex:10,
            bubble:true,
            cursor:'pointer',
            bubble: false
          })
          this.ellipse.setMap(this.map);
    },
    editEllipse (){
      return  new AMap.EllipseEditor(this.map, this.ellipse).open()
    },
    exitEllipse (){
      return  new AMap.EllipseEditor(this.map, this.ellipse).close()
    },
    //多边形
    addPolygon(){
        let map1 = this.mapCenter;
        let map2 = [this.mapCenter[0], this.mapCenter[1]]
        let map3 = [this.mapCenter[0]+0.002, this.mapCenter[1]]
        let map4 = [this.mapCenter[0]+0.002, this.mapCenter[1]+0.002]
        let map5 = [this.mapCenter[0], this.mapCenter[1]+0.002]
        this.polygon.path = [map2,map3,map4,map5,map2];
        this.polygon.visible = true ;
    },
    editPolygon(){
        this.polygon.editable = true ;
    },
    exitPolygon(){
        this.polygon.editable = false ;
    },
    removePolygon(){
        this.polygon.editable = false ;
        this.polygon.visible = false ;
    }
  }
}
</script>
<style  scoped>
.amap-container {
      position: relative;
    }
.amap-demo {
    height: 514px;
  }
.search-box {
    position: absolute;
    top: 15px;
    left: 70px;
  }
  .market-choose{
    width: 25px;
    height: 34px;
    color: #e90000;
    background: url(https://www.amap.com/assets/img/poi-marker.png) no-repeat;
    cursor: pointer;
    background-size: 437px 267px;
    background-position: -359px -3px;
  }
  .svgBtn{
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 10000;
  }
          #panel{
            position: fixed;
            top:10px;
            right: 10px;
            width: 300px;
        }
</style>
