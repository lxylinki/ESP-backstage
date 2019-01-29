<template>
	<div id="adminedit">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			后台用户
		</div>
		<div style="height: 40px;"></div>

		<div class="texts">
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
			<div class="statusdiv">
				<div class="statustitle">状态:</div>
				<!--same v-model: same group-->
				<input id="inuse" v-model="status" type="radio" checked="checked" value=1>
				<label for="inuse">启用</label>

				<input id="obsolete" v-model="status" type="radio" value=0 style="margin-left: 20px;">
				<label for="obsolete">废弃</label>	
			</div>
			<div style="height: 30px;"></div>
			<div class="btn-group">
				<el-button class="confirm" v-on:click="saveEdit()">确定</el-button>
				<el-button class="goback" v-on:click="goBack()">取消</el-button>
			</div>	
		</div>		
	</div>
</template>

<script type="text/javascript">
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';
	import store from '@/vuex/store.js';

	export default {
		store: store,
		data(){
			return{
				mod_name: 'admin',
				id: '',
				username: '',
				password: '',
				realname: '',
				epassword: '',
				status: null
			}
		},

		methods: {
			goBack(){
				this.$router.go(-1);
			},

			saveEdit(){
				asyncReq.call(this);
				async function asyncReq(){
					//this.epassword = await this.encrypt(this.password);
					this.epassword = await Utils.encrypt.call(this, this.password);
					var api = global_.admin_update;
					let data = {
						'id': this.id,
						'username': this.username,
						'password': this.epassword,
						'realname': this.realname,
						'status': this.status,
					}
					//var schid = await this.getSchId.call(this);					
					this.$http.post(api, data).then((resp)=>{
						Utils.lalert('编辑管理员成功');
						this.$router.go(-1);

					}, (err)=>{
						Utils.err_process.call(this, err, '编辑管理员失败');
					});
				}
			}
		},

		mounted(){
			var edit = this.$store.state.edit;
			
			if(!edit) {
				this.$router.go(-1);

			} else {
				var row = this.$store.state.row;
				this.id = row.id;
				this.username = row.username;
				this.realname = row.realname;
				this.status = row.status;				
			}
		}
	}
</script>

<style type="text/css" scoped>

.texts {
	width: 430px;
	height: 300px;
	text-align: right;
}

.texts .btn-group {
	float: left;
	margin-left: 114px;
}

.redalert {
	color: red;
}
.whitedefault {
	/*same with bg color*/
	color: #ffffff;
}

.statusdiv {
	display: flex;
	margin-left: 10px;
}

.statustitle {
	margin-left: 60px;
	margin-right: 8px;
}

#obsolete + label::before {
  margin-left: 20px;
}
</style>