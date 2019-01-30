<template>
	<div id="schooladd">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			学校管理
		</div>	
		<div class="texts">
			<div> 名称： 
				<input class="longinput" type="text" v-model="schname">
				<!--<el-input class="usrenter" v-model="usrid" placeholder=""></el-input>-->
				<span class="redalert" v-show="!schname">*</span>
				<span class="whitedefault"v-show="schname">*</span>
				<!---->
			</div>
			<div style="height: 30px;"></div>
			<div> 简称： 
				<input class="longinput" type="text" v-model="alias">
				<!--<el-input class="usrenter" v-model="name" placeholder=""></el-input>-->
				<span class="redalert" v-show="!alias">*</span>
				<span class="whitedefault" v-show="alias">*</span>
			</div>
			<div style="height: 30px;"></div>
			<div class="visitsdiv">
				<div class="visitstitle">访问人数: </div>
				<input class="longinput visitsinp" type="text" v-model="visits">
				<span>人</span>
			</div>
			<div style="height: 30px;"></div>
			<div class="btn-group">
				<el-button class="confirm" v-on:click="preCheck()">确定</el-button>
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
		data(){
			return {
				mod_name: 'school',
				schname: '',
				alias: '',
				visits: 0
			}
		},
		methods: {
			goBack(){
				this.$router.go(-1);
			},

			preCheck(){
				if(!this.schname) {
					Utils.lalert('请输入学校名称');
					return;

				} else if(!this.alias) {
					Utils.lalert('请输入学校简称');
					return;

				} else if(!this.visits || this.visits <= 0) {
					Utils.lalert('请输入访问人数');
					return;

				} else {
					this.addCreate();
				}
			},

			addCreate(){
				var api = global_.school_create;
				let data = {
					'name': this.schname,
					'alias': this.alias,
					'login_num': this.visits
				}
				
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('创建学校成功');
					this.$store.commit('sign', this.mod_name);
					this.$store.commit('incRowNumAfter', 1);
					this.$router.go(-1);

				}, (err)=>{
					Utils.err_process.call(this, err, '创建学校失败');
				});
			}
		},
		mounted(){
			Utils.page_check_status.call(this);
		}
	}
</script>

<style type="text/css" scoped>
.visitsdiv {
	display: flex;
	align-items: baseline;
	margin-left: 30px;
}

/*overwrite global setting*/
.visitsinp {
	margin-left: 20px;
	margin-right: 10px;
	padding: 0;
	width: 40px;
	text-align: center;
}

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
</style>