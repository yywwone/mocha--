// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont.css'
import '@/assets/styles/main.scss'

import VueAMap from 'vue-amap'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '8703164b6d9a53e64195238e3e17b1f3',
  plugin: ['AMap.TruckDriving', 'AMap.RangingTool', 'AMap.MouseTool', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Autocomplete', 'AMap.EllipseEditor', 'AMap.RectangleEditor', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geocoder', 'Geolocation'],
  uiVersion: '1.0'
})



Vue.config.productionTip = false
Vue.use(ElementUI)

// 请求
import api from './utils/request.js'
Vue.prototype.$api = api




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  data: {
    eventHub: new Vue()
  },
  
})


