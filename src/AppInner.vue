<template>
	<div id='app'>
		<div class='navigation'>
			<el-container>
				<el-header style="background: #20222d; height: 100px; overflow: hidden;">
					<img src="@/assets/esplogo.png" class="logo">
					
					<div class="welcometext">{{hellotext}}： 超级管理员</div>

					<div class='ctrl'>
						<div class="setting">
							<!--<i class="el-icon-setting" style="color: white"></i>-->
							<i class="iconfont" style="color: white">&#xe606;</i>
							<!--<el-button type="primary" icon="el-icon-search">搜索</el-button>-->
							<el-button type="text" style="color: white;" v-on:click="goPersonal()">设置</el-button>
						</div>
						<div class="logoff">
							<!--<i class="el-icon-delete" style="color: white;"></i>-->
							<i class="iconfont" style="color: white;">&#xe62e;</i>
							<el-button type="text" style="color: white" v-on:click="quit()">退出</el-button>
						</div>
					</div>
				</el-header>


    			<el-aside width="240px">
    				<!--<div style="height: 110px; background: #31313c"></div>-->
    				<Nav v-bind:menuList='menuList'
    				     v-bind:curGroup='current_group'></Nav>
    				<!--<div class="navbg"></div>-->
    			</el-aside>
    
    			<el-main>
    				<!--main content area-->
    				<router-view></router-view>
    			</el-main>

			</el-container>

		</div>


	</div>
</template>


<script type="text/javascript">
	import Nav from '@/components/Nav.vue';
	import global_ from '@/components/Global.js';
	import store from '@/vuex/store.js';
	
	export default {
		components:{
			'Nav': Nav
		},
		store: store,
		data(){
			return {
				hellotext: '',
				menuList:[
					{
	            		name:'用户管理',
	            		url: "",
	            		isSubShow: false,
	            		subItems:[
	            			{
	            				name: '学校管理',
	            				url:"/school",
	            				isSubShow: false,
	            				subItems:[]
	            			},
	            			{
	            				name:'超管用户',
	            				url: "/admin",
	            				isSubShow: false,
	            				subItems:[]
	            			},
	            			{
	            				name: '校管理员',
	            				url: "/schooladmin",
	            				isSubShow: false,
	            				subItems:[]
	            			}
	            		]
            		}, 
            		{
            			name: '实验管理',
            			url:"",
            			isSubShow: false,
            			subItems:[
            				{
            					name: '实验分类',
            					url: "/expcatag",
            					isSubShow: false,
            					subItems:[]
            				},
            				{
            					name: '实验列表',
            					url: "/explist",
            					isSubShow: false,
            					subItems:[]
            				},
            				{
            					name: '实验分配',
            					url: "/expassignlist",
            					isSubShow: false,
            					subItems:[]
            				}
            			]
            		},
            		{
            			name: '试题管理',
            			url:"",
            			isSubShow: false,
            			subItems:[
            				{
	            				name: '试题管理',
	            				url: "/quesmng",
	            				isSubShow: false,
	            				subItems: []           					
            				}
            			]
            		},
            		{
            			name: '考核管理',
            			url:"",
            			isSubShow: false,
            			subItems:[
            				{
	            				name: '考核管理',
	            				url: "/exam",
	            				isSubShow: false,
	            				subItems: []               					
            				}
            			]
            		}      	      	      		      
				],
				current_group: '',
			}
		},

		methods: {

			setHelloText(){
				var curTime = new Date();
				var hours = curTime.getHours();
				
				if(hours >= 6 && hours <= 12) {
					this.hellotext = '上午好';

				} else if(hours > 12 && hours <= 18) {
					this.hellotext = '下午好';

				} else {
					this.hellotext = '晚上好';
				}
			},	

	      	quit(){
		      	var api = global_.logout;		
				this.$http.post(api, {}).then((resp)=>{
					this.$router.push('/login');

				}, (err)=>{
					console.log(err);
					layer.alert('注销失败',
						{title:'提示', area:['280px','190px']});
				});	      	
		    },

		    goPersonal(){
		    	layer.alert('个人中心');
		    }
		},

		mounted(){
			this.setHelloText();
		}
	}
</script>


<style type="text/css" scoped>
.logo{
	position: relative;
	top: 30px;
	left: 40px;
}

.welcometext {
	position: relative;
	left: 350px;
	color: #ffffff;
}

.ctrl {
	position: relative;
	top: 5px;
	width: 100%;
	height: 100%;
	text-align: right;
}

.setting {
	z-index: 1;
	vertical-align: top;
	position: relative;
	text-align: center;
	display: inline-block;
	width: 100px;
	height: 80px;
	line-height: 80px;
	top: -60px;
	/*background: grey;*/
}

.logoff {
	z-index: 1;
	vertical-align: top;
	position: relative;
	line-height: 80px;
	text-align: center;
	height: 80px;
	display: inline-block;
	width: 100px;
	top: -60px;
	border-left: 1.5px solid rgba(238, 238, 238, 0.5);
	/*background: grey;*/
}

/*
.navbg {
	position: absolute;
	height: 100%;
	width: 240px;
	background: #ffffff;
}*/
</style>