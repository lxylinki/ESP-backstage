<template>
	<div id="schooledit">
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
		data(){
			return {
				mod_name: 'school',
				id:'',
				schname: '',
				alias: '',
				visits: 0
			}
		},
		methods: {
			goBack(){
				this.$router.go(-1);
			},

			saveEdit(){
				var api = global_.school_update;
				let data = {
					'id': this.id,
					'name': this.schname,
					'alias': this.alias,
					'login_num': this.visits
				}
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('编辑学校成功');
					this.$router.go(-1);

				}, (err)=>{
					Utils.lalert('编辑学校失败');
					console.log(err);

				});
			}
		},
		mounted(){
			var edit = this.$store.state.edit;
			
			if(!edit) {
				this.$router.go(-1);

			} else {
				var row = this.$store.state.row;
				this.id = row.id;
				this.schname = row.name;
				this.alias = row.alias;
				this.visits = row.login_num;
			}			
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