<template>
   <el-row class="warp">
        <!-- 表头 -->
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>通用配置</el-breadcrumb-item>
                <el-breadcrumb-item>节假日设置</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        

        <el-col :span="24" class="warp-main"  element-loading-text="拼命加载中">
          <!--工具条-->
          <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" >
              <el-form-item>
              
              <el-button type="primary" @click="showAddDialog">添加节假日</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="showupdateDialog">修改节假日</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-col>

        <el-col>
           <!-- 今年 -->
            <div class="calendarday">
             <p class="dataset">今年节假日设置</p>
              <div class="hoildays" v-for='(item,index) in showFestivals' :key="index">
                  <p :key="index">{{item.holidayName}}：{{item.holidays}}</p>
              </div>
            </div>
        </el-col>

        <el-col>
           <!-- 今年 -->
            <div class="calendarday">
             <p class="dataset">下一年节假日设置</p>
              <div class="hoildays" v-for='(item,index) in nextFestivals' :key="index">
                  <p :key="index">{{item.holidayName}}：{{item.holidays}}</p>
              </div>
            </div>
        </el-col>

       <!--添加节假日新增界面-->
      <el-dialog title="添加节假日设置" :visible.sync ="Addholiday" :close-on-click-modal="false">
        <el-form  label-width="80px"  ref="addForm">
          <!-- <p>5*8</p> -->
             <el-form-item label="节假日" prop="end">
              <el-select v-model="value"  @change="handleChange" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                   >
                    </el-option>
                </el-select>
          </el-form-item>
          <div id="calendar-box">
            <Calendar @checkedDay = "getDay"></Calendar>
         </div>
        </el-form>
         <div slot="footer" class="dialog-footer">
          <el-button @click.native="Addholiday = false">取消</el-button>
          <el-button type="primary" @click.native="submitDay">提交</el-button>
        </div>
      </el-dialog>



      <!-- 修改节假日弹框 页面 -->
      <el-dialog title="修改节假日设置" :visible.sync ="updateholiday" :close-on-click-modal="false">
        <el-form  label-width="80px"  ref="addForm">
             <el-form-item label="节假日" prop="end">
              <el-select v-model="value"  @change="handleChange" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                   >
                    </el-option>
                </el-select>
          </el-form-item>
          <div id="calendar-box">
            <Calendar @checkedDay = "getDay"></Calendar>
         </div>
        </el-form>
         <div slot="footer" class="dialog-footer">
          <el-button @click.native="updateholiday = false">取消</el-button>
          <el-button type="primary" @click.native="subupdateday">提交</el-button>
        </div>
      </el-dialog>

    </el-row>
</template>

<script>
 import Calendar from '../common/calendar';

export default {
  name: '',
  components: {
      Calendar
    },
  data () {
    return {
      msg: '',
      setHoliday: '',
      setDay: '',
      yearGet: '',
      showFestivals: [],
      nextFestivals: [],
      workSystemEnum: '',
      holidayarr: '',
      Addholiday:false,
      updateholiday:false,
        // 节日选择
         value: [],
        options: [{
                value: '春节',
                label: '春节'
                }, {
                value: '清明节',
                label: '清明节'
                }, {
                value: '五一',
                label: '五一'
                }, {
                value: '端午节',
                label: '端午节'
                }, {
                value: '十一',
                label: '十一'
                },{
                value: '中秋节',
                label: '中秋节'
                },{
                value: '元旦',
                label: '元旦'
                }],
                value: '',


    }
  },
  created() {
    let date = new Date();
    let year = date.getFullYear();    
      let params = {
                year: year,
                workSystemEnum : this.workSystemEnum,
              }
      this.$api.getHoliday(params).then(res => {
        // 获取到数据

        this.showFestivals = res.data;
        // console.log(this.showFestivals);

      }).catch(errMsg => {
          console.log(res.errMsg);
      });
      
    this.getNextday();

  },

      
 
  methods: {
    // 获取选择器选择的节日/
    handleChange(value){
      this.setHoliday = value
      // console.log(this.setHoliday);
    },

    getDay(data){
      // console.log(data);
      this.setDay = data 
    },
 
    // 显示增加弹框
    showAddDialog: function () {
      this.Addholiday = true;
      
    },

    // 显示修改弹框
    showupdateDialog: function () {
      this.updateholiday = true;
      
    },
    // 获取下一年节假日设置
    getNextday(){
        let date = new Date();
        let years = date.getFullYear(); 
        let year = Number(years)+1;
        let params = {
                year: year,
                workSystemEnum : this.workSystemEnum,
              }
      this.$api.getHoliday(params).then(res => {
        // 获取到数据

        this.nextFestivals = res.data;
        
        // console.log(1111);
        // console.log(this.nextFestivals);

      }).catch(errMsg => {
          console.log(res.errMsg);
      })

    },

    // 修改节假日
    subupdateday(data){
        let yearGet = window.localStorage.getItem("checkedYear")
        let workSystemEnum = "SEVEN_TWENTY_FOUR";
        let holidayName = this.setHoliday;
        let holidays = this.setDay.toString()

        let params = {
                workSystemEnum: workSystemEnum,
                year: yearGet,
                holidayName: holidayName,
                holidays: holidays,
        };
        this.$api.updateHoliday(params).then(res => {
          if(res.success == true){
              let params = {
                year: yearGet,
                workSystemEnum : workSystemEnum,
              }
              this.$api.getHoliday(params).then(res => {

                this.holidayarr = res.data;
                  this.updateholiday = false;

              }).catch(errMsg => {
                console.log(res.errMsg);
                });  
          };
          if(res.success == false){
            alert(res.errMsg);
          };
      
        }).catch(errMsg => {
        console.log(res.errMsg);
        });  

    },

    //添加节假日 请求 向后台发送数据
    submitDay(data){
      let yearGet = window.localStorage.getItem("checkedYear")
        // console.log(yearGet);
      let workSystemEnum = "SEVEN_TWENTY_FOUR";
      let holidayName = this.setHoliday;
        // console.log("holidayName",holidayNamse);
      let holidays = this.setDay.toString()

      //  console.log("holidays",holidays);    

      let params = {
                workSystemEnum: workSystemEnum,
                year: yearGet,
                holidayName: holidayName,
                holidays: holidays,
      };

        // console.log("发送选择得日期",params);    

      this.$api.setHoliday(params).then(res => {
          if(res.success == true){
              let params = {
                year: yearGet,
                workSystemEnum : workSystemEnum,
              }
              this.$api.getHoliday(params).then(res => {
              // console.log("请求数据结果",res.datsa);

                this.holidayarr = res.data;
                 this.Addholiday = false;

                  }).catch(errMsg => {
                     console.log(res.errMsg);
                      });  
          };
          if(res.success == false){
            alert(res.errMsg);
          };
          
      }).catch(errMsg => {
            console.log(res.errMsg);
          });    
      
    },

    
  },

  // 方法结束


}
</script>



<style scoped>
.calendarday{
  width:600px;
  border:1px solid #75c1cc;
  padding:2rem;
  box-shadow: 0 3px 10px #ccc;
  margin-bottom:2rem;
} 
.hoildays {
  /* border:1px solid red; */
}
.hoildays{
  line-height:1rem;
}
.dataset {
  color:#409EFF;
  /* border:1px solid green; */
  ;
  
}
</style>
