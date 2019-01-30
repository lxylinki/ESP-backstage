<template>
	<div id="expcatagedit">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			实验项目分类
		</div>
		<div style="height: 20px;"></div>
		<div class="texts">
			<div> 分类名称： 
				<input class="longinput" type="text" v-model="catag_name">
				<span class="redalert" v-show="!catag_name">*</span>
				<span class="whitedefault"v-show="catag_name">*</span>
			</div>

			<div style="height: 30px;"></div>
			<div class="btn-group">
				<el-button class="confirm" v-on:click="saveEdit()">确定</el-button>
				<el-button class="goback" v-on:click="goBack()">返回</el-button>
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
				catag_name: '',
				id: '',
				mod_name: 'exp-catag'
			}
		},
		methods: {
			saveEdit(){
				var api = global_.expcatag_update;
				let data = {
					'id': this.id,
					'name': this.catag_name
				}
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('编辑实验类别成功');
					this.$router.go(-1);
					
				}, (err)=>{
					//400
					if(err.body.error.hasOwnProperty('pid') &&
						err.body.error.hasOwnProperty('level') &&
						err.body.error.hasOwnProperty('name')) {
						Utils.lalert('实验类别重复');
					
					} else {
						Utils.err_process.call(this, err, '编辑实验类别失败');
					}
				});
			},
			goBack(){
				this.$router.go(-1);
			}
		},
		mounted(){
			Utils.page_check_status.call(this);
			var edit = this.$store.state.edit;
			
			if(!edit) {
				this.$router.go(-1);

			} else {
				var row = this.$store.state.row;
				this.catag_name = row.name;
				this.id = row.id;
			}
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
</style>