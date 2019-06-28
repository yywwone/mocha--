<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>运维管理</el-breadcrumb-item>
        <el-breadcrumb-item>运维配置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>


    <el-col :span="24" class="warp-main">
     <span class="proList">项目列表</span>
     <el-button type="danger" icon="el-icon-plus" @click="dialogVisible = true">增加</el-button>
    </el-col>

    <!-- 项目列表 -->
    <el-col :span="24" class="warp-main">
      <el-table :data="projectList" @row-click="currentSet" highlight-current-row style="width: 100%;">
          <el-table-column type="index" ></el-table-column>
          <el-table-column prop="projectName" label="项目名称" ></el-table-column>
          <el-table-column prop="territory" label="属地"></el-table-column>
          <el-table-column prop="dayShift" label="白班时间" ></el-table-column>
          <el-table-column prop="eveningShift" label="晚班时间"></el-table-column>
          <el-table-column prop="replaceFlag" label="是否可顶替白班"></el-table-column>
          <el-table-column label="操作" width="350">
            <template slot-scope="scope">
              <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
              <el-button type="danger" @click="delProject(scope.$index,scope.row)" size="small">删除</el-button>
              <el-button size="small" type="success" @click="showclassdialog(scope.$index,scope.row)">添加运维组</el-button>
               <!-- <el-button size="small" @click="currentSet(scope.$index,scope.row)" style="opacity:0;"></el-button> -->

            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
          <el-col :span="24" class="toolbar" >
              <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="5" :total="total"
                          style="float:right;">
              </el-pagination>
          </el-col>
      
    </el-col>



      <!-- 增加项目页面 -->
      <el-dialog title="新增项目" :visible.sync ="dialogVisible" :close-on-click-modal="false">
        <el-form  label-width="83px"  ref="addForm">

          <el-form-item label="项目名称：">
            <el-input v-model="input"  ref="ProjectName" placeholder="请输入项目"></el-input>
          </el-form-item>

          <el-form-item label="考勤地址：">
            <el-input v-model="inputaddress" placeholder="请输入考勤地址"></el-input>
          </el-form-item>


          <el-form-item label="归属地：">
            <el-cascader
                :options="options"
                v-model="selectedOptions"
                @change="handleChange"
                :separator="' '"

            >
            </el-cascader>
          </el-form-item>  

          <el-form-item label="白班时间：">
                <el-time-picker @change="dayTime"
                is-range
                 v-model="value1"
                format="HH:mm"
                value-format="HH:mm"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
            
          </el-form-item>

          <el-form-item label="晚班时间：">
                <el-time-picker @change="ninghtTime"
                is-range
                 v-model="value2"
                format="HH:mm"
                value-format="HH:mm"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
          </el-form-item>

          

        <el-form-item label="">
             <el-checkbox @change="checkedSelect" v-model="radio">5*8工作制员工上班时间不可顶白班</el-checkbox>
        </el-form-item>
      
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPro" >提交</el-button>
        </div>
      </el-dialog>

      <!-- 编辑页面 -->
      <el-dialog title="修改项目" :visible.sync ="editdialogVisible" :close-on-click-modal="false">
        <el-form  :model="editForm" label-width="83px"  ref="editForm">

          <el-form-item label="项目名称：" prop="projectName">
            <el-input v-model="editForm.projectName"  ref="ProjectName" placeholder="请输入项目"></el-input>
          </el-form-item>
          <el-form-item label="归属地：" >
            <el-cascader 
                :options="options"
                v-model="selectedOptions"
                @change="handleChange"
                :separator="' '"

            >
            </el-cascader>
          </el-form-item>  

          <el-form-item label="白班时间">
                <el-time-picker @change="dayTime"
                is-range
                 v-model="value1"
                format="HH:mm"
                value-format="HH:mm"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
            
          </el-form-item>

          <el-form-item label="晚班时间">
                <el-time-picker @change="ninghtTime"
                is-range
                 v-model="value2"
                format="HH:mm"
                value-format="HH:mm"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
          </el-form-item>


        <el-form-item label="">
             <el-checkbox @change="checkedSelect" v-model="radio">5*8工作制员工上班时间不可顶白班</el-checkbox>
        </el-form-item>
      
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editdialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updatePro" >提交</el-button>
        </div>
      </el-dialog>


     <!-- 运维组与区域关系列表 -->
      <el-col :span="24" class="warp-main">
          <span class="proList">运维组列表</span>
      </el-col>
      <el-col :span="24" class="warp-main">
        <el-table :data="groupList" highlight-current-row style="width: 100%;">
            <el-table-column type="index" ></el-table-column>
            <el-table-column prop="projectName" label="项目名称" ></el-table-column>
            <el-table-column prop="part" label="区域" ></el-table-column>
            <el-table-column prop="groupName" label="运维组"></el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button size="small" @click="editClassDialog(scope.$index,scope.row)">编辑</el-button>
                <el-button type="danger" @click="delGroup(scope.$index,scope.row)" size="small">删除</el-button>
              </template>
            </el-table-column>
        </el-table>

          <!--分页-->
          <el-col :span="24" class="toolbar">
              <el-pagination layout="prev, pager, next" @current-change="handleCurrentSet"  :page-size="4" :total="all"
                          style="float:right;">
              </el-pagination>
          </el-col>

     
      </el-col>


      <!-- 添加运维组 -->
       <el-dialog title="新增运维组" :visible.sync ="addclassdialog" :close-on-click-modal="false">
        <el-form  label-width="83px"  ref="addClass">

          <el-form-item label="区域设置：" prop="Proname">
            <el-input v-model="input"  ref="groupName" placeholder="请输入区域"></el-input>
          </el-form-item>
          <el-form-item label="归属地：" prop="position">
            <el-select @change="getgroupList" v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in optionclass"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>  

      
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addclassdialog = false">取消</el-button>
          <el-button type="primary" @click="submitGroupSet" >提交</el-button>
        </div>
      </el-dialog>

       <!-- 修改运维组 -->
       <el-dialog title="编辑运维组" :visible.sync ="editclassdialog" :close-on-click-modal="false">
        <el-form  :model="editGroup" label-width="83px"  ref="editGroup">

          <el-form-item label="区域设置：" prop="part">
            <el-input  v-model="editGroup.part" ref="groupName" placeholder="请输入区域"></el-input>
          </el-form-item>
          <el-form-item label="归属地：" prop="position">
            <el-select @change="getgroupList" v-model="groupvalue" placeholder="请选择">
                <el-option
                  v-for="item in optionclass"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>  

      
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editclassdialog = false">取消</el-button>
          <el-button type="primary" @click="groupListUpdate" >提交</el-button>
        </div>
      </el-dialog>
     

    </el-row>
</template>

<script src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js"></script>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=8aba81336cb43de048d40bf518191299&plugin=AMap.Geocoder"></script>

<script>
  // 城市联动
  import options from '../../api/country-data';

  export default{
    data(){
      return {
        msg: 'hello vue',
        dialogVisible:false,
        editdialogVisible: false,
        input: '',
        addForm: {
          name: '',
          number:''
        },  
        ProjectName: '',
        radio: '',

        editForm: {
            id: 0,
            projectName: '',
            replaceFlag: '',
            dayShift: '',
            eveningShift: '',
            territory: '',
        },
           
        // 时间选择
        value1: '',
        value2: '',

        cityVlue: '',
        daytime: '',
       
        nighttime: '',
        checkDom: '',
        

        // 项目表分页
          total: 0,
          page: 1,
          limit: 5,
          projectList: [],

          // 运维组分页
          all: 0,
          current: 1,
          size: 4,
          groupList:[],
      // 城市联动
        selectedOptions: [],//存放默认值
        options:options ,  //存放城市数据

       
      // 添加运维组弹框
      addclassdialog: false,
      // select 下拉
        optionclass: [],
        value: '',
        part: '',
        // input 输入
        // groupName: '',
        projectId: '',
        part: '',
        groupId: '',

        // 编辑运维组与区域
        editclassdialog: false,
        relationship: '',
        groupvalue:'',
        editGroup:{
        id:0,
        part: '',
        groupId: '',
        groupName: '',

        },

        rowdel:'',

        // 考勤位置
        inputaddress: '',



      }
    },
    methods: {
        // 项目分页
        handleCurrentChange(val) {
            this.page = val;
            this.search();
        },
        // 页面刷新时直接渲染
        handleSearch(){
            this.total = 0;
            this.page = 1;
            this.search();
           
        },

        // 运维组分页
        handleCurrentSet(val){
          this.current = val;
          this.currentSet(this.rowdel);
        },


        // 城市联动
        handleChange(value) {
          // 获取城市选择
            // console.log(value);
            if(value != null){
            this.cityVlue = value.join("");
            }
        },

        // 请求项目列表，可以分页渲染
        search(){
            let params = {
                  current: this.page,
                  size: this.limit
              }; 
              this.$api.getClass(params).then(res => {
                // console.log(res.data.records);
                  // 判断数据是否为空
                  if (res.data && res.data.records) {
                      // 页数
                      this.total = res.data.total;
                      this.projectList = res.data.records;
                  };


              }).catch(err => {
                console.log(res.errMsg);
              });
        },

        // 白班时间
        dayTime(value){
          if(value != null){
          this.daytime = value.join("-");

          }

        },
        // 晚班时间
        ninghtTime(value){
          if(value != null){
          this.nighttime = value.join("-");

          }
        },
        // 获取单选状态
        checkedSelect(){
          let checked = event.target.checked;

          if(checked){
          this.checkDom = "YES";

          }else {
            this.checkDom = "NO";

          }
          // console.log(this.checkDom);

        },

        // 添加项目
        submitPro(data){
          // 获取 input 输入框输入得内容
          this.ProjectName = this.$refs.ProjectName.value;

          // console.log(this.$refs.ProjectName.value);

          let params = {
            projectName: this.ProjectName,
            territory:  this.cityVlue,
            dayShift: this.daytime,
            eveningShift: this.nighttime,
            replaceFlag: this.checkDom,
          };
          // console.log(params);
          this.$api.addClass(params).then(res => {
            //  console.log(res);
            this.dialogVisible = false;
            this.search();
            // 判断提交内容是否为空
            if(res.success == false){
              alert(res.errMsg);
            }

          }).catch(err =>{
            console.log(errMsg);
          
          });

        },

        //显示编辑界面
        showEditDialog (index, row) {
          // 显示编辑弹框
          this.editdialogVisible = true;
          this.editForm = Object.assign({}, row);
        },

        // 编辑请求
        updatePro(data){
          let that = this;
              this.$refs.editForm.validate((valid) => {
                  if (valid) {
                      let para = Object.assign({}, this.editForm);
                      console.log(para);

                      let params = {
                        id: para.id,
                        projectName: para.projectName,
                        territory:that.cityVlue,
                        dayShift: that.daytime,
                        eveningShift: that.nighttime,
                        replaceFlag: para.replaceFlag,
                          
                      }; 
                      // console.log(params);

                      this.$api.updateClass(params).then(function (result) {
                          // console.log(result);
                          if (result.success  == true) {
                              that.$message.success({showClose: true, message: '修改成功', duration: 2000});
                              that.$refs['editForm'].resetFields();
                              that.editdialogVisible = false;
                              that.search();
                          } else {
                              that.$message.error({showClose: true, message: '修改失败', duration: 2000});
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
              });

        },

        // 删除项目
        delProject(index, row){
          let that = this;
          console.log("id",row.id);
          this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
            // console.log("id",row.id);

            let params = {
              id: row.id,
            }
            this.$api.delClass(params).then(function (result) {
              console.log(result);
              if (result.success == true) {
                that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                that.search();
              }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          }).catch(() => {
          });

        },


        // 获取运维组 列表
        currentSet(row){
          this.leave = true;
          this.rowdel = row;
          let params = {
            current: this.current,
            size: this.size,
            projectId: row.id,
          };
         
          this.$api.getCurrent(params).then(res => {
            // console.log(res);
            // 跳数
            this.all = res.data.total;
            console.log(this.all);
            this.groupList = res.data.records;
            // console.log(this.groupList);

          }).catch(err => {
            console.log(res.errMsg);
          });

        },

        //显示新增运维徐界面
        showclassdialog (index,row) {
          // 获取 项目 id
          this.projectId = row;

          // 显示添加弹框
          this.addclassdialog = true;
          
          // 请求运维组下拉框
          let that =this;
          this.$api.getGroupList().then(res => {

            // console.log(res);
            that.optionclass = res.data;
          

          }).catch(err => {

          });

        },

        // 获取新增运维组 下拉选择
        getgroupList(value){
          // console.log(value);
          // 获取value
          this.groupId = value;
          // 获取 label
            let groupObj = {};
            groupObj = this.optionclass.find((item)=>{
              return item.id === value;
            });
           this.groupName = groupObj.name;

        },


        // 提交添加运维组请求
        submitGroupSet(row){

            // 获取 input 输入框输入得内容
          this.part = this.$refs.groupName.value;

          let params = {
            projectId: this.projectId.id,
            part: this.part,
            groupId: this.groupId,
            groupName: this.groupName,

          };
          // console.log(params);
          this.$api.addParkGroup(params).then(res => {
            // console.log(res);
            // console.log(this.projectId);
            this.addclassdialog = false;
            this.currentSet(this.projectId);

            

          }).catch();



        },


        //显示 编辑运维组与区域关系 界面
        editClassDialog(index,row){
          this.groupvalue = row.groupId;
          this.groupName = row.groupName;
          // 获取运维组 id
          this.relationship = row;
          // 显示编辑弹框
          this.editclassdialog = true;
          
          // 请求运维组下拉框
          let that =this;
          this.$api.getGroupList().then(res => {
            // console.log(res.data);
            that.optionclass = res.data;
          

          }).catch(err => {

          });

          this.editGroup = Object.assign({}, row);


        },

        //  提交更新运维组与区域
        groupListUpdate(){
          // 获取 input 输入框输入得内容
          this.part = this.$refs.groupName.value;
          let params = {
            id: this.relationship.id,
            part: this.part,
            groupId: this.groupvalue,
            groupName: this.groupName,
          }
          // console.log(params);
         
          this.$api.updateParkGroup(params).then(res => {            
            if(res.success = true){
              this.editclassdialog = false;
            }

          }).catch(err => {
            console.log(res.errMsg);
          });

        },

        // 删除运维组
        delGroup(index, row){
          let that = this;
          // console.log("id",row.id);
          this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
            // console.log("id",row.id);

            let params = {
              id: row.id,
            }
            this.$api.deleteParkGroup(params).then(function (result) {
              // console.log(result);
              if (result.success == true) {
                that.$message.success({showClose: true, message: '删除成功', duration: 1500});
                that.currentSet(that.rowdel);
              }
            }, function (err) {
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          }).catch(() => {
          });

        },


        // 获取考勤位置
       

        


    },

    

     mounted() {
        this.handleSearch();
    },
  }
</script>




<style scoped>
.warp-main {
      margin: 1rem;
  }
  .proList {
      display:inline-block;
      padding:0.6rem;
      color:#fff;
      border-radius:4px;
      background:#409EFF;
  }

  .el-form-item {
    /* border:1px solid red;  */
  }

</style>

<style>
.el-button--danger {
  vertical-align: top;

}

</style>





