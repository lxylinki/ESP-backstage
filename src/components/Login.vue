<template>
	<div id="login">

		<div class="panel">
			<div class='login-texts'>
				
				<div class="loginheader">
					<div class="decor"></div>
					<div class="logintitle">管理员登录</div>
					<img src="@/assets/esplogo.png" class="logo">
				</div>

				<div class="inputs">
					<div style="display: flex;">
						<div class="username-icon"><i class="iconfont">&#xe611;</i></div>
						<input class="longinput usrid" type="text" v-model="username" placeholder="请输入你的账户" v-on:keydown="invokeLogin($event)"></input>
					</div>
					
					<div style="height: 30px;"></div>

					<div style="display: flex;">
						<div class="password-icon"><i class="iconfont">&#xe61d;</i></div>
						<input class="longinput passwd" type="password" v-model="password" placeholder="请输入你的密码" v-on:keydown="invokeLogin($event)"></input>
					</div>

					<div style="height: 30px;"></div>					
				</div>

				<el-button class="loginbtn" v-on:click="admin_login()">登陆</el-button>
			</div>			
		</div>
	
	</div>
</template>

<script type="text/javascript">
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';

	export default {
		data(){
			return {
				username:'',
				password:'',
				epassword:''
			}
		},

		methods:{
			invokeLogin(e) {
				if(e.keyCode == 13) {
					this.admin_login();
				}
			},

			admin_login(){
				asyncReq.call(this);
				async function asyncReq(){
					this.epassword = await Utils.encrypt.call(this, this.password);
					var api = global_.admin_login;

					let data = {
						'username': this.username,
						'password': this.epassword,
						'remember': 0
					}
					
					this.$http.post(api, data).then((resp)=>{
						//console.log(resp);
						this.$router.push('/admin');
					}, (err)=>{
						Utils.lalert('登陆失败');
						console.log(err);
					});
				}
			},
		}
	}
</script>

<style type="text/css" scoped>

input:focus {
	outline: none;
}

.iconfont {
	color: #20222d;
	font-size: 20px;
	position: relative;
	top: 5px;
	left: 5px;
	margin: 0;
}

.panel {
	position: fixed;
	display: flex;
	align-items: center;
	height: 100%;
	width: 100%;
	background:  #ffffff;
}

.login-texts {
	width: 400px;
	height: 400px;
	margin: 0 auto;
	border-color: #ffffff;
	background:  #f0f2f5;
	border: 1px solid #20222d;
}


.logintitle, .logo {
	display: inline-block;
	margin-top: 10px;
}

.logo {
	width: 180px;
	margin-left: 110px;
	margin-right: 10px;
}

.loginheader {
	display: flex;
	align-items: center;
	background: white;
	padding-bottom: 20px;
	background: #20222d;
}

.logintitle {
	font-size: 14px;
	text-align: center;
	color: #ffffff;
}

.decor {
	height: 20px;
	width: 8px;
	background: #5a98de;
	display: inline-block;
	margin-left: 10px;
	margin-right: 10px;
	margin-top: 10px;
}

.usrid, .passwd {
	background: #ffffff;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	-webkit-border-top-right-radius: 5px;
	-webkit-border-bottom-right-radius: 5px;
	color: #20222d;
	height: 30px !important;
	width: 250px !important;
	margin: 0;
}

/*overwrite default*/
input:-webkit-autofill {
	box-shadow: 0 0 0 10000px #ffffff inset;
    -webkit-box-shadow: 0 0 0 10000px #ffffff inset;
    -webkit-text-fill-color: #20222d;
    caret-color: #20222d;
    /*full coverage*/
    border: 5px solid #ffffff !important;
}

.inputs {
	position: relative;
	top: 5rem;
	margin-left: 50px;
}

.loginbtn{
	background: #5a98de;
	border: none;
	color: #ffffff;
	position: relative;
	left: 50px;
	top: 80px;
	width: 300px;
	height: 40px;
	border-radius: 5px;
}

.username-icon, .longinput, .password-icon {
	display: inline-block;
	vertical-align: top;
	margin: 0;
	padding-left: 0 !important;
	border: 5px solid #ffffff !important;
}

.username-icon, .password-icon {
	width: 30px;
	height: 32px;
	background: #ffffff;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	-webkit-border-top-left-radius: 5px;
	-webkit-border-bottom-left-radius: 5px;
}

</style>