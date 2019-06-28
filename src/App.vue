<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>


<script>


export default {
  name: 'app',
  // created() {
  //   this.getLocation();
  // },

  //  methods: {
  //     getLocation() {
  //       const that = this;
  //       AMap.plugin("AMap.Geolocation", function() {
  //         var geolocation = new AMap.Geolocation({
  //           // 是否使用高精度定位，默认：true
  //           enableHighAccuracy: true,
  //           // 设置定位超时时间，默认：无穷大
  //           timeout: 10000,
  //           // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
  //           buttonOffset: new AMap.Pixel(10, 20),
  //           //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
  //           zoomToAccuracy: true,
  //           //  定位按钮的排放位置,  RB表示右下
  //           buttonPosition: "RB"
  //         });

  //         geolocation.getCurrentPosition();
  //         AMap.event.addListener(geolocation, "complete", onComplete);
  //         AMap.event.addListener(geolocation, "error", onError);

  //         function onComplete(data) {
  //           // data是具体的定位信息
  //           console.log(data);
  //         }

  //         function onError(data) {
  //           // 定位出错
  //           console.log(data);
  //           // 失败之后调用这个方法，使用IP定位获取当前城市信息
  //           that.getLngLatLocation();
  //         }
  //       });
  //     },
  //     // IP定位获取当前城市信息
  //     getLngLatLocation() {
  //       AMap.plugin("AMap.CitySearch", function() {
  //         var citySearch = new AMap.CitySearch();
  //         citySearch.getLocalCity(function(status, result) {
  //           if (status === "complete" && result.info === "OK") {
  //             // 查询成功，result即为当前所在城市信息
  //             console.log(result)
  //           }
  //         });
  //       });
  //     },

  //  },

}

</script>

<style>
body{
  padding:0px;
  margin:0px auto;
}
a{
  text-decoration:none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>
