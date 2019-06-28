<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>运维管理</el-breadcrumb-item>
                <el-breadcrumb-item>人员配置</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col :span="24" class="warp-main">
            <!-- 筛选条件 -->
            <el-col :span="24" class="">
                <el-form :inline="true">
                    <!-- 人员选择 -->
                    <el-form-item>
                        <el-button type="info" style="cursor:text">人员选择</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select @change="hanPer" v-model="values" placeholder="请选择项目">
                            <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                      <!-- 工作制 -->
                    <el-form-item>
                        <el-button type="info"  style="cursor:text; " >工作制选择</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select @change="hanSystem" v-model="value" placeholder="请选择工作制">
                            <el-option
                            v-for="item in option1"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    
                    <!-- 专业选择 -->
                    <el-form-item >
                        <el-button type="info" style="cursor:text">专业选择</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-select @change="handleChange" v-model="value1" placeholder="请选择专业">
                            <el-option
                            v-for="item in option2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 查询 -->
                     <el-form-item>
                        <el-button type="primary" @click="handleSearch" icon="el-icon-search">搜索</el-button>
                    </el-form-item>

                </el-form>
            </el-col>

            <!-- 人员列表 -->
            <el-col :span="24" class="">
                <el-table :data="mocaUser" highlight-current-row style="width: 100%;">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column type="index" ></el-table-column>
                    <el-table-column prop="roles" label="角色" ></el-table-column>
                    <el-table-column prop="userName" label="姓名" ></el-table-column>
                    <el-table-column prop="position" label="职位" ></el-table-column>
                    <el-table-column prop="hiredDate" label="入职时间"></el-table-column>
                    <el-table-column prop="divisionAge" label="司龄" ></el-table-column>
                    <el-table-column prop="specialty" label="所属专业"></el-table-column>
                    <el-table-column prop="workSystem" label="工作制" ></el-table-column>
                    <el-table-column label="操作" width="150">
                        <!-- 编辑 -->
                        <template slot-scope="scope">
                            <el-button size="small" type="success" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                   
                </el-table>

                  <!--分页-->
                <el-col :span="24" class="toolbar">
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                                style="float:right;">
                    </el-pagination>
                </el-col>

            </el-col>

                <!-- 修改弹框 -->
              <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="职位" prop="position">
                    <el-input v-model="editForm.position" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="专业">
                    <el-select v-model="value1" placeholder="请选择专业">
                        <el-option 
                        v-for="item in option2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作制" prop="workSystem">
                    <el-radio-group v-model="radio">
                        <el-radio :label="3">7*24</el-radio>
                        <el-radio :label="6">5*8</el-radio>
                        <el-radio :label="9">7*8</el-radio>
                    </el-radio-group>
                </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit">提交</el-button>
                </div>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: '',
    data () {
        return {
            msg: '',
            // 分页
            total: 0,
            page: 1,
            limit: 10,

            mocaUser: [],
            // 传参
            current:'',
            pageSize: '',

            //编辑相关数据
            editFormVisible: false,//编辑界面是否显示
            editFormRules: {
            position: [
                {required: true, message: '请输入职位', trigger: 'blur'}
            ],
            specialty: [
                {required: true, message: '请选择专业', trigger: 'blur'}
            ],
            workSystem: [
                {required: true, message: '请选择工作制', trigger: 'blur'}
            ]
            },
            editForm: {
            id: 0,
            position: '',
            specialty: '',
            workSystem: '',
            },
           
           
            // 人员选择
            options: [],
            values: '',
            position: '',

            // 获取选择器选择的条件
            // selectOpt: '',// 级联选择器
            workSystem: '',//  选择工作制
            specialty: '',// 选择专业


            // 下拉工作制选择
            option1: [{
            value: 'SEVEN_TWENTY_FOUR',
            label: '7*24'
            }, {
            value: 'FIVE_EIGHT',
            label: '5*8'
            }, {
            value: 'SEVEN_EIGHT',
            label: '7*8'
            }],
            value: '',

            // 下拉专业选择
            option2: [{
            value: '电气',
            label: '电气'
            }, {
            value: '暖通',
            label: '暖通'
            }, {
            value: '弱电',
            label: '弱电'
            },{
            value: '实习生',
            label: '实习生'
            }],
            value1: '',

            // 工作制 单选
             radio: '',
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.page = val;
            this.search();
        },
        handleSearch(){
            this.total = 0;
            this.page = 1;
            this.search();
        },

        //编辑 请求
        editSubmit: function () {
            let that = this;
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    let para = Object.assign({}, this.editForm);
                    

                    // 转化工作制
                    if(para.workSystem == "7*24"){
                        para.workSystem = "SEVEN_TWENTY_FOUR";
                    }else if(para.workSystem == "5*8"){
                        para.workSystem = "FIVE_EIGHT";
                    }else{
                        para.workSystem = "SEVEN_EIGHT";
                    };

                    let params = {
                        position: para.position,
                        id: para.id,
                        specialty: para.specialty,
                        workSystem: para.workSystem,
                    }; 
                    // console.log(params);

                    this.$api.updateper(params).then(function (result) {
                        // console.log(result);
                        if (result.success  == true) {
                            that.$message.success({showClose: true, message: '修改成功', duration: 2000});
                            that.$refs['editForm'].resetFields();
                            that.editFormVisible = false;
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

        // 获取人员选择
        hanPer(value){    
           
            this.position = value;

        },
        //  选择工作制
        hanSystem(value){
            this.workSystem = value;
            // console.log(this.workSystem);

        },

        // 选择专业
        handleChange(value){

            this.specialty = value;
            // console.log(this.specialty);
        },
        
        // 请求下拉框列表
        flash(){
            // 请求选择内容
            let that = this;
            this.$api.getClassname().then(function (res) {
                
                that.options = res.data;
                
            }).catch(err =>{
                console.log(res.errMsg);
            });
        },

        // 请求运维人员列表，可以分页渲染
        search(){
             let params = {
                current: this.page,
                pageSize:  this.limit,
                deptId: this.position,
                workSystemEnum: this.workSystem,
                specialty: this.specialty,
            }; 
            // console.log(params);
            this.$api.getTotalper(params).then(res => {

                // console.log(res);
                // 判断数据是否为空
                if (res.data && res.data.records) {
                    // 页数
                    this.total = res.data.total;
                    this.mocaUser = res.data.records;
                    // console.log(this.mocaUser);
                };

            }).catch(errMsg =>{
                console.log(res.errMsg);
            });

           
        },

        //显示编辑界面
        showEditDialog: function (index, row) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
      

    },
    mounted() {
        this.handleSearch();
        this.flash();
    },
}
</script>

<style>

</style>
