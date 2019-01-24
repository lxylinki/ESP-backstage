<template>
	<div id="expadd">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			实验列表
		</div>
		<div style="height: 20px;"></div>

		<div>
			<div class="texts">
				<div> 所属分类： 
					<template>
					  <el-select class="longselect"
					  			 v-model="catag_value" 
					  			 placeholder="请搜索分类名称"
					  			 filterable>
					    <el-option
					      v-for="item in catag_options"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
					</template>
						
					<span class="redalert" v-show="!catag_value">*</span>
					<span class="whitedefault"v-show="catag_value">*</span>
				</div>	

				<div style="height: 30px;"></div>
				<div> 实验名称： 
					<input class="longinput" type="text" v-model="expname">
					<span class="redalert" v-show="!expname">*</span>
					<span class="whitedefault"v-show="expname">*</span>
				</div>

				<div style="height: 30px;"></div>
				<div> 实验编号： 
					<input class="longinput" type="text" v-model="exporder">
					<span class="redalert" v-show="!exporder">*</span>
					<span class="whitedefault"v-show="exporder">*</span>
				</div>	
				<div style="height: 30px;"></div>
				<div> <span style="vertical-align: top;">实验概述：</span>
					<textarea class="inputarea" v-model="expnote"></textarea>
					<span class="whitedefault">*</span>
				</div>
				<div style="height: 30px;"></div>
				<div class="btn-group">
					<el-button class="confirm" v-on:click="addCreate()">确定</el-button>
					<el-button class="goback" v-on:click="goBack()">返回</el-button>
				</div>

			</div> <!--texts-->

			<div class="picture">
				<div class='box'>
					<img id='image'>				
					<div style="height: 30px"></div>
					<br>
					<input type="file" id="uploadfile" v-on:change="upFile($event)">		
					<el-button class="addbtn uploadbtn">上传图片</el-button>
				</div>				
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
				mod_name: 'exp-list',
				ufile: null,
				catag_value: '',
				catag_options: [],
				exporder:'',
				expname: '',
				expnote: ''
			}
		},

		methods: {
			reqCatagList(){
				var api = global_.expcatag_list;
				let data = {
					'all': 1
				}
				this.$http.post(api, data).then((resp)=>{
					this.catag_options = resp.body;
				}, (err)=>{
					Utils.err_process.call(this, err, '请求实验分类列表失败');
				});				
			},

			upFile(event) {
				$('#image').removeClass('emptyimg');
		      	this.ufile = event.target.files[0];
		      	document.querySelector('#image').setAttribute('src', URL.createObjectURL(this.ufile));
		    },

		    clearImgPlace(){
		    	if(!$('#image')[0].src) {
		    		$('#image').addClass('emptyimg');
		    	}
		    },

		    addCreate(){
		    	var api = global_.exp_create;
		    	var formData = new FormData();
		    	formData.append('cid', this.catag_value);
		    	formData.append('name', this.expname);
		    	formData.append('note', this.expnote);
		    	formData.append('img', this.ufile);
		    	formData.append('order', this.exporder);
		    	this.$http.post(api, formData).then((resp)=>{
		    		Utils.lalert('创建实验成功');
					this.$store.commit('sign', this.mod_name);
					this.$store.commit('incRowNumAfter', 1);
					this.$router.go(-1);

		    	},(err)=>{
		    		Utils.err_process.call(this, err, '创建实验失败');
		    	});
		    },

		    goBack(){
		    	this.$router.go(-1);
		    }			
		},

		mounted(){
			this.clearImgPlace();
			this.reqCatagList();
		}
	}
</script>


<style type="text/css" scoped>
.inputarea {
	box-sizing: border-box;
	width: 300px;
	height: 200px;
	padding: 15px;
}

.longselect /deep/ .el-input__inner {
	height: 34px;
	width: 300px;
}

.texts {
	width: 430px;
	text-align: right;
	display: inline-block;
}

.picture {
	width: 50%;
	height: 500px;
	float: right;
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

#image {
	height: 200px;
	position: relative;
	left: 80px;
	text-align: center;
}

/*show a placeholder when image is empty*/
.emptyimg {
	width: 300px;
	background: #f7f7f7;
}

/*
#image::after {
    content: "";
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: #ffffff;
}*/

#uploadfile {
	width: 180px;
	height: 40px;
 	position: absolute;
 	right: 250px;
 	cursor: pointer;
 	opacity: 0;
 	z-index: 1;
 }
 .uploadbtn {
 	position: absolute;
 	right: 250px;
 }

</style>