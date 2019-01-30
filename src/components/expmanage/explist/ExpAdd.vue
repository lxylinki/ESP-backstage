<template>
	<div id="expadd">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			实验列表
		</div>
		<div style="height: 20px;"></div>

		<div>
			<div class="texts">
				<div> 所属分类：

					<!--<template>
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
					</template>-->

				    <div class="allcatags" style="display: inline-block;">
				    	<div class="select-header select-header-normal">
					    	<input type="text" class="select-header-text" placeholder="请搜索实验分类名称"  v-on:click="activate()" v-on:focus="showToggle=true" v-model="catag_search_state"></input>
							<i class="iconfont togglesign" v-on:click="toggleList()" v-show="!showToggle">&#xe607;</i>
							<i class="iconfont togglesign" v-on:click="toggleList()" v-show="showToggle">&#xe608;</i>
				    	</div>

						<div class="select-list" v-show="showToggle" style="overflow-y: scroll; height: 190px;">
					    	<!--<RecSelect v-bind:item_list="catag_options" @makechoice="makeChoice"></RecSelect>-->
							<li class="select-item" v-bind:class="{leafcatag: item.isleaf}" v-for="item in filtered_catags" v-on:click="makeChoice(item)">{{item.name}}</li>	
						</div>
				    </div>
						
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
					<el-button class="confirm" v-on:click="preCheck()">确定</el-button>
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
				filtered_catags: [],
				exporder:'',
				expname: '',
				expnote: '',
				catag_search_state: '',
				showToggle: false,
			}
		},

		methods: {
			activate(){
				$('.select-header').removeClass('select-header-normal').addClass('select-header-active');
			},
			toggleList(){
				this.showToggle = !this.showToggle;
			},
			makeChoice(item){
				//console.log(item);
				this.catag_search_state = item.name;
				this.catag_value = item.id;
				this.showToggle = false;
			},
			reqCatagList(){
				var api = global_.expcatag_list;
				let data = {
					'all': 1
				}
				this.$http.post(api, data).then((resp)=>{
					//this.catag_options = resp.body;
					for(let i in resp.body) {
						this.catag_options.push(resp.body[i]);
						if(resp.body[i].hasOwnProperty('sub_categories')) {
							for(let j in resp.body[i].sub_categories) {
								resp.body[i].sub_categories[j].isleaf = true;
								this.catag_options.push(resp.body[i].sub_categories[j]);
							}
						}
					}
					this.filtered_catags = this.catag_options;
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

		    preCheck(){
		    	if(!this.catag_search_state) {
		    		Utils.lalert('请选择所属分类');

		    	} else if(!this.expname) {
		    		Utils.lalert('请输入实验名称');

		    	} else if(!this.exporder) {
		    		Utils.lalert('请输入实验编号');

		    	} else {
		    		this.addCreate();
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
					this.$router.go(-1);

		    	},(err)=>{
		    		if(err.body.error.hasOwnProperty('cid')) {
		    			if (err.body.error.cid == 2) {
		    				Utils.lalert('实验类别错误');
		    			}
		    		} else {
		    			Utils.err_process.call(this, err, '创建实验失败');
		    		}	
		    	});
		    },

		    goBack(){
		    	this.$router.go(-1);
		    },

		    // init select
		    inactivate(){
				var _this = this;
				$(document).on('blur', '.select-header', function(){
					$(this).removeClass('select-header-active').addClass('select-header-normal');
					_this.showToggle = false;
				});		    	
		    },

		    decorFileInp(){
				var upbtn = document.querySelector(".uploadbtn"),
				    upfile = document.querySelector("#uploadfile");
				 
				upbtn.addEventListener("click", function(e) {
					if (upfile) {
						upfile.click();
					}
					// prevent navigation to "#"
					e.preventDefault();
					}, false
				);
		    }	
		},

		watch: {
			catag_search_state(newVal, oldVal) {
				if (!this.catag_search_state) {
					this.filtered_catags = this.catag_options;
				} else {
					this.filtered_catags = this.catag_options.filter( item => item.name.indexOf(this.catag_search_state) != -1);
				}
			}
		},		

		mounted(){
			Utils.page_check_status.call(this);
			this.inactivate();
			this.decorFileInp();
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
	margin-top: 10px;
	float: right;
}

.box {
	text-align: center;
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
 	position: relative;
 	cursor: pointer;
 	display: none;
 }


/*select*/
.select-header {
	text-align: left;
	box-sizing: border-box;
	font-size: 14px;
	margin: auto;
	margin-top: 10px;
	padding-left: 15px;
	padding-right: 10px;
	padding-top: 5px;
	width: 300px;
	height: 34px;
	border-radius: 0px;
}

.select-header-normal {
	border: 1px solid #cccccc;
	/*box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);*/
}

.select-header-active {
	border: 1px solid #619cde;
	/*box-shadow: 0 1px 6px rgba(97, 156, 222, 0.2);*/
}

.select-list {
	text-align: left;
	box-sizing: border-box;
	background: #ffffff;
	position: absolute;
	z-index: 10;
	margin: auto;
	padding-left: 5px;
	padding-right: 5px;
	margin-top: 5px;
	width: 300px;
	height: 100%;
	border: 1px solid #cccccc;
	box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.togglesign {
	float: right;
	font-size: 12px;
	color: #cccccc;
	cursor: pointer;
}

.select-header-text, .togglesign {
	display: inline-block;
}

.select-header-text {
	width: 90%;
	height: 80%;
	border: none;
	cursor: pointer;
}

.select-header-text:focus {
	outline: none;
}

.select-item {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	cursor: pointer !important;
	font-size: 14px;
	margin: 5px;
	height: 30px;
	line-height: 30px;
}

.select-item:hover {
	background: #f7f8fc;
}

.highlight {
	background: #f7f8fc;
}

.select-text {
	width: 100%;
}

.leafcatag {
	padding-left: 15px;
	color: #757575;
}
</style>