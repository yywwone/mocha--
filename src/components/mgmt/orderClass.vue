<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运维管理</el-breadcrumb-item>
        <el-breadcrumb-item>排班</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--查询条件-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;width:1700px;">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="当月值班" name="first">
            <!-- 当月值班 -->
            <div class="block">
              <el-select v-model="value" @change="handleChange" placeholder="请选择">
                <el-option
                  v-for="item in listoptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-button type="primary" @click="selectSchedule">查询</el-button>
              <el-button type="warning" @click="download" icon="el-icon-download">数据导出</el-button>
              <span style="color:red; vertical-align:bottom;margin-left:10px;">查询必须选择条件！</span>
            </div>

            <!-- 人员显示 -->
            <el-col :span="24" class="personalList">
              <table border>
                <thead>
                  <tr>
                    <td style="width:100px;">{{projectName}}</td>
                    <td style="width:100px;">{{userName}}</td>
                    <td v-for="(item,index) in rightHeader" :key="index">{{item.day}}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in data2" :key="index">
                    <td>{{item.groupName}}</td>
                    <td>{{item.userName}}</td>
                    <td
                      @click="showhandClass(item2)"
                      v-for="(item2,index) in item.schedule"
                      :key="index"
                      :class="{Active:item2.workTypeEn == 'DAY',Active2:item2.workTypeEn == 'NIGHT',Active3:item2.workTypeEn == 'REST',Active4:item2.workTypeEn == 'ALL'}"
                    >{{item2.workTypeCh}}</td>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-tab-pane>

          <el-tab-pane label="下月排班" name="second" >
            <!-- 选择查询下月排班条件 -->
            <div class="block">
              <el-button type="info" size="small">选择运维组</el-button>
              <el-select v-model="values" @change="changeOr" placeholder="请选择">
                <el-option
                  v-for="item in listoptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>

              <!-- 班组/人员选择 -->
              <el-button type="info" size="small">选择班组或人员</el-button>
              <el-radio-group v-model="radio" @change="groupChange" style="margin:0 10px;">
                <el-radio :label="1">班组排班</el-radio>
                <el-radio :label="2">人员排班</el-radio>
              </el-radio-group>

              <el-button type="primary" @click="showDetails">查询</el-button>
              <span style="color:red; vertical-align:bottom;margin-left:10px;">查询必须选择条件！</span>
            </div>
            
            <div class="quan" v-show="canChange">
              <el-button @click="open" type="danger" icon="el-icon-check" style="margin-top:15px">确认</el-button>
              <el-button @click="updateNextMonth" type="primary" icon="el-icon-refresh" style="margin-top:15px">更新</el-button>
            </div>
            <!-- 班组显示 -->
            <el-col :span="24" class="personalList">
              <table border>
                <thead>
                  <tr>
                    <td style="width:100px;" v-show="userIs">{{headName}}</td>
                    <td style="width:100px;">{{className}}</td>
                    <td v-for="(item,index) in rightHeader" :key="index">{{item.day}}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in groupList" :key="index">
                    <td>{{item.groupName}}</td>
                    <td v-show="userIs">{{item.userName}}</td>
                    <td
                      @click="showhandClass(item2)"
                      v-for="(item2,index) in item.schedule"
                      :key="index"
                      :class="{Active:item2.workTypeEn == 'DAY',Active2:item2.workTypeEn == 'NIGHT',Active3:item2.workTypeEn == 'REST',Active4:item2.workTypeEn == 'ALL'}"
                    >{{item2.workTypeCh}}</td>
                  </tr>
                </tbody>
              </table>

              <el-dialog
                class="changeClass"
                title="修改此人得当天排班"
                :visible.sync="centerDialogVisible"
                width="15%"
              >
                <ul class="classul">
                  <li class="classli" @click="changegrouoSch">
                    <div class="classdiv zhiban">值班</div>
                  </li>
                  <li class="classli" @click="changegrouoSch">
                    <div class="classdiv morcl">早班</div>
                  </li>
                  <li class="classli" @click="changegrouoSch">
                    <div class="classdiv evecl">晚班</div>
                  </li>
                  <li class="classli" @click="changegrouoSch">
                    <div class="classdiv reast">休</div>
                  </li>
                </ul>
                <span slot="footer" class="dialog-footer">
                  <el-button @@click.native="centerDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click.native="submitChange">确 定</el-button>
                </span>
              </el-dialog>
            </el-col>
          </el-tab-pane>

          <el-tab-pane label="数据导出" name="third">
            <div class="dateChoice">
              <el-date-picker v-model="value2" @change="chioceMonth" value-format="yyyy-MM" type="month" placeholder="选择月"></el-date-picker>
              <span class="demonstration">选择项目/班组</span>
              <el-select v-model="value" @change="choiceClass" placeholder="请选择">
                <el-option 
                  v-for="item in listGroup"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-button type="success" class="sure" icon="el-icon-check">确定</el-button>
              <el-button type="warning" @click="downChoice" icon="el-icon-download">数据导出</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
import { formatDate } from '@/utils/date.js'
export default {
  data() {
    return {
      msg: "hello vue",
      //   tab切换
      activeName: "first",
      tablabel: "当月值班",
      thisMonth: true,
      // 加载进度
      loading: false,
      groups: [],

      //  下月运维组数据列表
      data2: [],
      rightHeader: [],
      className: "班组名称",

      // 下月运维组数据列表
      groupList: [],

      projectName: "",
      userName: "",

      //   下拉选择
      listoptions: [],
      value: "",
      groupId: "",
      groupName: "",
      values: "",

      // 下载
      listGroup:[],
      mounth: "",

      // 日期选择
      value2: "",

      //  单选
      radio: 1,
      centerDialogVisible: false,
      changeinnerText: "",

      // 人员显示
      userIs: false,
      headName: "班组名称",

      // 更改的班组名称
      changedClassfa: "",
      // 更改的人员名称
      changePeople: "",

      // 提交修改
      schid: "",
      // 权限
      canChange: false,
      canID:'',
    };
  },
  methods: {
    //   tab切换
    handleClick(tab, event) {
      // console.log(tab.label);
      this.tablabel = tab.label;
      if (this.tablabel == "当月值班") {
        this.thisMonth = true;
        this.requestDate();
        this.ppgSearch();
      };
      if (this.tablabel == "下月排班") {
        this.thisMonth = false;
        // console.log(111);
        this.requestDate();
        this.ppgSearch();
      };
      // console.log(this.thisMonth);
      if(this.tablabel == "数据导出"){
        let that = this;
      this.$api
        .ppgSelect()
        .then(res => {
          // console.log(res.data);
          that.listGroup = res.data;
        })
        .catch(error => {
          console.log(error);
        });

      };
    },

    // 单元格 手动排班
    showhandleChange(row, column, cell) {
      // console.log(2222);
    },

    // 获取单选选择
    groupChange(value) {
      this.radio = value;
      // console.log(value);
    },

    // 查询排班时用来选择的运维组关系
    ppgSearch() {
      let that = this;
      this.$api
        .ppgSelect()
        .then(res => {
          // console.log(res.data);
          that.listoptions = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    //   获取当月排班的选中项 下拉选择
    handleChange(value) {
      // 获取value
      this.groupId = value;
      // 获取 label
      let groupObj = {};
      groupObj = this.listoptions.find(item => {
        return item.id === value;
      });
      this.groupName = groupObj.name;

      //  console.log(this.groupId);
      // console.log(this.groupName);
    },

    // 获取下月排班的选中项 下拉选择
    changeOr(value) {
      // 获取value
      this.groupId = value;
      // 获取 label
      let groupObj = {};
      groupObj = this.listoptions.find(item => {
        return item.id === value;
      });
      this.groupName = groupObj.name;

      //  console.log(this.groupId);
      // console.log(this.groupName);
    },

    // 根据运维组关系id查询本月或下月排班 运维组接口
    selectSchedule(data) {
      // console.log(this.tablabel);

      // 判断是否选择内容
      if (this.groupId == "") {
        this.$message.error({
          showClose: true,
          message: "请选择查询条件",
          duration: 2000
        });
      } else {
        let params = {
          thisMonth: this.thisMonth,
          ppgid: this.groupId
        };
        this.$api
          .selectUserSchedule(params)
          .then(res => {
            if (res.success == true) {
              this.data2 = res.data;
            } else {
              alert(res.errMsg);
            }
            
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    // 查询下月排班
    showDetails(data) {
      // console.log(this.className);
      // 判断是班组排班还是人员排班
      if (this.radio == 1) {
        this.className = "班组名称";
        this.userIs = false;
      } else {
        this.className = "姓名";
        this.userIs = true;
      }
      // 判断是否选择内容
      if (this.groupId == "") {
        this.$message.error({
          showClose: true,
          message: "请选择查询条件",
          duration: 2000
        });
      } else if (this.className == "班组名称") {
        // console.log(9999);

        let params = {
          thisMonth: this.thisMonth,
          ppgid: this.groupId
        };
        this.$api
          .selectGroupSchedule(params)
          .then(res => {
            if (res.success == true) {
              this.groupList = res.data;
            } else {
              alert(res.errMsg);
            }

            // console.log(this.data2);
          })
          .catch(error => {
            console.log(error);
          });


          // console.log("111",params);

          this.$api.edit(params).then(res => {
            if (res.success == true) {
              
              // this.canChange =res.data.canChange;
              
            this.canChange = res.data.canChange ==="false" ? false : true;

              this.canID = res.data.id;
               console.log(this.canChange);
            } else {
              alert(res.errMsg);
            }

          }).catch();

        



      } else if (this.className == "姓名") {
        this.userIs = true;
        let params = {
          thisMonth: this.thisMonth,
          ppgid: this.groupId
        };
        this.$api
          .selectUserSchedule(params)
          .then(res => {
            if (res.success == true) {
              this.groupList = res.data;
            } else {
              alert(res.errMsg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
   

    // 请求表头
    requestDate() {
      let params = {
        thisMonth: this.thisMonth
      };

      this.$api
        .AndWeek(params)
        .then(res => {
          // console.log(res.data);
          this.projectName = "班组名称";
          this.userName = "姓名";
          this.className = "班组名称";
          // console.log(this.rightHeader);
          if (res.success == true) {
            this.rightHeader = res.data;
          } else {
            alert(res.errMsg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 单元格 手动排班
    showhandClass(event) {
      this.schid = event.id;
      // console.log(event);

      // 判断 如果是下月排班 则显示修改弹窗
      if (this.thisMonth == false && this.canChange == true) {
        this.centerDialogVisible = true;
      }
    },

    // 获取改变得内容
    changegrouoSch(event) {
      // console.log(event.target.innerText);
      if (event.target.innerText == "值班") {
        this.changeinnerText = "ALL";
      }
      if (event.target.innerText == "早班") {
        this.changeinnerText = "DAY";
      }
      if (event.target.innerText == "晚班") {
        this.changeinnerText = "NIGHT";
      }
      if (event.target.innerText == "休") {
        this.changeinnerText = "REST";
      }

      // console.log(this.changeinnerText);
    },

    // 提交更新列表
    submitChange(data) {
      let parmas = {
        id: this.schid,
        workType: this.changeinnerText
      };

      // 判断是班组还是人员
      if (this.className == "班组名称") {
        this.$api
          .editGroupSchedule(parmas)
          .then(res => {
            if (res.success == true) {
              this.showDetails();
              this.$message.success({
                showClose: true,
                message: "修改成功",
                duration: 1500
              });
            } else {
              alert(res.errMsg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else if (this.className == "姓名") {
        this.$api
          .editUserSchedule(parmas)
          .then(res => {
            console.log(res);

            if (res.success == true) {
              this.showDetails();
              this.$message.success({
                showClose: true,
                message: "修改成功",
                duration: 1500
              });
            } else {
              alert(res.errMsg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }

      this.centerDialogVisible = false;
    },

    // 刷新下月排班
    updateNextMonth(){
      this.$api.flushAllNextMonthSchedule().then(res => {
        if(res.success==true){
          alert(res.errMsg);

        };
      }).catch(error => {
        console.log(error);
      });

    },

    open() {
        this.$confirm('确认排班后将不能再修改排班', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '确认成功!'
          });

           // 修改排班配置，是否可以显示（确认）（更新）按钮

          let params = {
          scheduleConfigId: this.canID,
          canChange:this.canChange
        };
        this.$api.editConfig(params).then(res => {
          // console.log(res);
          if (res.success == true) {
             alert(res.errMsg);
             this.canChange = false;
             this.centerDialogVisible = false;


            } else {
              alert(res.errMsg);
            }

        }).catch();

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },

    // 下载
    download(){
      // console.log(111);
       // 判断是否选择内容
      if (this.groupId == "") {
        this.$message.error({
          showClose: true,
          message: "请选择运维组",
          duration: 2000
        });
      } else {
         const date = new Date();
         const formDate = formatDate(date, 'yyyy-MM')
       
        let url = "http://172.16.0.172:8082/testOa/sys/scheduleUser/exportUserScheduleByMonth?month="+formDate+"&ppgid="+this.groupId;
        window.location.href = window.location.href= url;
      
      };

    },

    chioceMonth(value){
      // console.log(value);
      this.mounth = value
    },

    choiceClass(value){
       // 获取value
      this.groupId = value;
    },

    // 选择月份下载
    downChoice(){
     if (this.groupId == "") {
        this.$message.error({
          showClose: true,
          message: "请选择运维组",
          duration: 2000
        });
      } else {
        
        let url = "http://172.16.0.172:8082/testOa/sys/scheduleUser/exportUserScheduleByMonth?month="+this.mounth+"&ppgid="+this.groupId;
        window.location.href = window.location.href= url;
      
      };
    }



  },
  mounted() {
    this.ppgSearch();
    this.requestDate();
  }
};
</script>


<style scoped>
.demonstration {
  display: inline-block;
  padding: 0.6rem;
  color: #fff;
  border-radius: 4px;
  background: #409eff;
}
.el-icon-check {
  background-color: #39d4cb;
}

.personalList {
  margin-top: 2rem;
}

.Active {
  background: #fb6370;
  color: #fff;
  border: #fb6370;
}
.Active2 {
  background: #ff943e;
  border-color: #ff943e;
  color: #fff;
}
.Active3 {
  background: #f6f6f6;
  border-color: #f6f6f6;
  color: #191f25;
}
.Active4 {
  background: #5e90ff;
  border-color: #5e90ff;
  color: #fff;
}

table {
  text-align: center;
  border-collapse: separate;
  border: 1px solid #e9e9e9;
  border-spacing: 1px;
  border-radius: 4px 4px 0 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}
td {
  border-collapse: collapse;
  border: 1px solid #e9e9e9;
  width: 50px;
  height: 35px;
  font-size: 12px;
  cursor: pointer;
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
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  line-height: 46px;
  transition: background 0.3s, width 0.2s;
}

.classli {
  padding: 0 20px;
  font-size: 12px;
  line-height: 42px;
  height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  list-style: none;
}
.classdiv:hover {
  opacity: 0.6;
}
.classdiv {
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
</style>


<style>
</style>


