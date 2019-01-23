<template>
	<div id="schadminadd">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			校管理员
		</div>

		<div style="height: 20px;"></div>

		<div>
			<div class='texts'>
				<div> 学校名称： 
					<template>
					  <el-select class="longselect"
					  			 v-model="school_value" 
					  			 placeholder="请搜索学校名称"
					  			 filterable>
					    <el-option
					      v-for="item in school_options"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
					</template>
						
					<span class="redalert" v-show="!school_value">*</span>
					<span class="whitedefault"v-show="school_value">*</span>
					<!---->
				</div>
				<div style="height: 30px;"></div>
				<div> 用户名： 
					<input class="longinput" type="text" v-model="username">
					<!--<el-input class="usrenter" v-model="usrid" placeholder=""></el-input>-->
					<span class="redalert" v-show="!username">*</span>
					<span class="whitedefault"v-show="username">*</span>
					<!---->
				</div>
				<div style="height: 30px;"></div>
				<div> 密码： 
					<input class="longinput" type="password" v-model="password">
					<!--<el-input class="usrenter" v-model="password" placeholder=""></el-input>-->
					<span class="redalert" v-show="!password">*</span>
					<span class="whitedefault" v-show="password">*</span>
				</div>
				<div style="height: 30px;"></div>
				<div> 姓名： 
					<input class="longinput" type="text" v-model="realname">
					<!--<el-input class="usrenter" v-model="name" placeholder=""></el-input>-->
					<span class="redalert" v-show="!realname">*</span>
					<span class="whitedefault" v-show="realname">*</span>
				</div>
				<div style="height: 30px;"></div>

				<!--
				<div class="genderdiv">
					<div class="gendertitle">性别:</div>
					<input id="male" v-model="gender" type="radio" checked="checked" value=1>
					<label for="male">男</label>

					<input id="female" v-model="gender" type="radio" value=0 style="margin-left: 20px;">
					<label for="female">女</label>

					<input id="emale" v-model="gender" type="radio" value=2 style="margin-left: 20px;">
					<label for="emale">不限</label>			
				</div>

				<div style="height: 30px;"></div>

				<div class="statusdiv">
					<div class="statustitle">状态:</div>
					<el-switch class="switch"
					  v-model="status"
					  active-value=1
					  inactive-value=0
					  active-text="启用">
					</el-switch>					
				</div>
				<div style="height: 30px;"></div>
				-->
				<div class="btn-group">
					<el-button class="confirm" v-on:click="addCreate()">确定</el-button>
					<el-button class="goback" v-on:click="goBack()">返回</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import global_ from '../../Global.js';
	import Utils from '../../Utils.js';
	import store from '@/vuex/store.js';

	export default {
		data(){
			return {
				username: '',
				password: '',
				realname: '',
				epassword: '',
				status: 0,
				gender: 1,
				school_options:[],
				mod_name: 'sch-admin',
				school_value: ''
			}
		},
		
		store: store,

		methods:{
			goBack(){
				this.$router.go(-1);
			},

			reqSchoolData(name, alias, page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqSchoolList.call(this, name, alias, page);
	     			this.school_options = resp.body._list;
	     		}			
			},

			addCreate(){
				asyncReq.call(this);
				async function asyncReq(){
					
					this.epassword = await Utils.encrypt.call(this, this.password);
					var api = global_.schadmin_create;
					let data = {
						'school_id': this.school_value,
						'username': this.username,
						'password': this.epassword,
						'realname': this.realname,
						//'status': this.status,
						//'gender': this.gender
					}

					this.$http.post(api, data).then((resp)=>{
						Utils.lalert('添加校管理员成功');
						this.$store.commit('sign', this.mod_name);
						this.$store.commit('incRowNumAfter', 1);
						this.$router.go(-1);

					}, (err)=>{
						Utils.lalert('添加校管理员失败');
						console.log(err);
					});
				}
			}
		},

		mounted(){
			this.reqSchoolData('','',1);
		}
	}
</script>



<style type="text/css" scoped>

.longselect /deep/ .el-input__inner {
	height: 34px;
	width: 300px;
}

.texts {
	width: 430px;
	height: 300px;
	text-align: right;
}

.texts .btn-group {
	float: left;
	margin-left: 118px;
}

.redalert {
	color: red;
}
.whitedefault {
	/*same with bg color*/
	color: #ffffff;
}

/*
.genderdiv {
	display: flex;
	margin-left: 10px;
}

.gendertitle {
	margin-left: 60px;
	margin-right: 8px;
}

.statusdiv {
	display: flex;
	margin-left: 10px;
}

.statustitle {
	margin-left: 60px;
	margin-right: 10px;
}

#female + label::before, #emale + label::before {
  margin-left: 20px;
}*/
</style>