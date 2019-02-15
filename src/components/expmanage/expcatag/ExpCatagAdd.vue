<template>
	<div id="expcatagadd">
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
			<div class="parentinp"> 父类别： 
				<template>
				  <el-select class="longselect"
				  			 v-model="parent_value" 
				  			 placeholder="请搜索实验父类别"
				  			 filterable
				  			 v-on:change="decidePar()">
				    <el-option
				      v-for="item in catag_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
				</template>
				<!--	
				<span class="redalert" v-show="!parent_value">*</span>-->
				<span class="whitedefault">*</span>
			</div>
			<div style="height: 30px;"></div>
			
			<div>级别： 
				<template>
				  <el-select class="longselect"
				  			 v-model="level_value" 
				  			 placeholder="请选择实验级别"
				  			 v-on:change="decideLev()">
				    <el-option
				      v-for="item in level_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				</template>
					
				<span class="redalert" v-show="!level_value">*</span>
				<span class="whitedefault" v-show="level_value">*</span>
			</div>
			<div style="height: 30px;"></div>
			<div class="btn-group">
				<el-button class="confirm" v-on:click="preCheck()">确定</el-button>
				<el-button class="goback" v-on:click="goBack()">返回</el-button>
			</div>		
		</div>


	</div>
</template>

<script type="text/javascript">
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';
	import store from '@/vuex/store.js';
	//import Rectable from './Rectable.vue';
	export default {
		store: store,
		data(){
			return {
				mod_name: 'exp-catag',
				catag_name: '',
				parent_value: '',
				level_value: '',
				parent_options: [],
				catag_options: [],
				level_options: [
					{
						label: '根类别',
						value: 1
					},
					{
						label: '子类别',
						value: -1
					},					
				]
			}
		},
		methods: {
			/*
			setTagTitle() {
		        var tagTextList = document.querySelector('.parentinp').querySelectorAll('.el-select-dropdown__item>span');
		        //console.log(tagTextList);
		        tagTextList.forEach( (item) => {
		          item.setAttribute('title', item.innerText);
		        })
			},*/

			goBack(){
				this.$router.go(-1);
			},

			preCheck(){
				if(!this.catag_name) {
					Utils.lalert('请输入分类名称');
					return;
				} else if(!this.level_value) {
					Utils.lalert('请选择实验级别');
				} else {
					this.addCreate();
				}
			},

			addCreate(){
				var api = global_.expcatag_create;
				let data = {
					'name': this.catag_name,
					'level': this.level_value
				}
				if (this.parent_value) {
					data.pid = this.parent_value;
				}
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('实验分类创建成功');
					this.$store.commit('sign', this.mod_name);
					this.$store.commit('incRowNumAfter', 1);
					this.$router.go(-1);

				}, (err)=>{
					if(err.body.error.hasOwnProperty('pid')) {
						if(err.body.error.pid == 2){
							Utils.lalert('父类别错误：无法创建子类');
						}
						
					} else {
						Utils.err_process.call(this, err, '实验分类创建失败');
					}
				});
			},


			reqCatagList(){
				var api = global_.expcatag_list;
				let data = {
					'all': 1
				}
				this.$http.post(api, data).then((resp)=>{
					this.catag_options = resp.body;
					this.catag_options.unshift({id: null, name: '无父类别'});

				}, (err)=>{
					Utils.err_process.call(this, err, '请求实验分类列表失败');
				});
			},

			decideLev(){
				if (this.level_value === 1) {
					this.parent_value = '';
				}
			},

			decidePar(){
				if (this.parent_value) {
					this.level_value = -1;
				}
			}
		},

		mounted(){
			Utils.page_check_status.call(this);
			this.reqCatagList();
		}
	}
</script>

<style type="text/css" scoped>
.el-select-dropdown__item {
	width: 300px;
}

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

</style>