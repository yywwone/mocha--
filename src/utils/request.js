import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import qs from 'qs'
let that = Vue.prototype
    // axios 配置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'http://172.16.0.172:8082';

export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
    axios.get(url, { params: params }).then(res => {
    resolve(res.data);
    }).catch(err => {
    reject(err.data)
    })
    });
    }

export function post(url, params) {
    return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params))
    .then(res => {
    resolve(res.data);
    })
    .catch(err => {
    reject(err.data)
    })
    });
    }
    
export default {
//   存储节假日
setHoliday(params) {
    return post('/testOa/holiday/addTripleConfig', params)
},
// 获取节假日
getHoliday(params) {
    return get('/testOa/holiday/getHolidayConfig', params)
},
// 更新 修改节假日
updateHoliday(params) {
    return post('/testOa/holiday/updateTripleConfig', params)
},

// 获取所有在职运维人员信息
getTotalper(params) {
    return get('/testOa/sys/user/userInfoPage', params)
},

// 编辑个人信息

updateper(params) {
    return post('/testOa/sys/user/editUserInfo', params)
},

// 获取当前部门
getClassname(params) {
    return get('/testOa/sys/user/loginUserSonDept', params)
},

// 添加项目
addClass(params) {
    return post('/testOa/sys/project/add', params)
},

// 获取项目列表
getClass(params) {
    return get('/testOa/sys/project/page', params)
},

// 修改更新项目列表
updateClass(params) {
    return post('/testOa/sys/project/update', params)
},

// 删除项目列表
delClass(params) {
    return post('/testOa/sys/project/delete', params)
},
// 添加运维组
addCurrent(params) {
    return post('/testOa/sys/projectParkGroup/add', params)
},
// 获取运维组列表
getCurrent(params) {
    return get('/testOa/sys/projectParkGroup/page', params)
},

// 获取下拉选择运维组列表
getGroupList(params) {
    return get('/testOa/sys/projectParkGroup/getGroupList', params)
},

// 添加运维组与区域关系
addParkGroup(params) {
    return post('/testOa/sys/projectParkGroup/add', params)
},

// 更新 修改运维组与区域关系
updateParkGroup(params) {
    return post('/testOa/sys/projectParkGroup/update', params)
},

// 删除 修改运维组与区域关系
deleteParkGroup(params) {
    return post('/testOa/sys/projectParkGroup/delete', params)
},

// 查询排班时用来选择的运维组关系
ppgSelect(params) {
    return get('/testOa/sys/schedule/ppgSelect', params)
},
// 根据运维组关系id查询本月或下月排班 班组排班
selectGroupSchedule(params) {
    return get('/testOa/sys/schedule/selectGroupSchedule', params)
},
// 查询某个月日期和星期对应的关系

AndWeek(params) {
    return get('/testOa/sys/schedule/getMonthDayAndWeek', params)
},

// 根据运维组关系id查询本月或下月排班 人员排班
selectUserSchedule(params) {
    return get('/testOa/sys/scheduleUser/selectUserSchedule', params)
},

// 根据运维组关系id查询本月或下月排班 人员排班
editGroupSchedule(params) {
    return post('/testOa/sys/schedule/editGroupSchedule', params)
},
// 修改用户某天排班
editUserSchedule(params) {
    return post('/testOa/sys/scheduleUser/editUserSchedule', params)
},
// 更新下个月所有班组用户排班
flushAllNextMonthSchedule(params) {
    return get('/testOa/sys/schedule/flushAllNextMonthSchedule', params)
},

// 下载
downscheduleUser(params) {
    return get('/testOa/sys/scheduleUser/exportUserScheduleByMonth', params)
},

// 查询排班配置，是否可以显示（确认）（更新）按钮
edit(params) {
    return get('/testOa/sys/scheduleConfig/get', params)
},

// 修改排班配置，是否可以显示（确认）（更新）按钮
editConfig(params) {
    return post('testOa/sys/scheduleConfig/edit', params)
},


}