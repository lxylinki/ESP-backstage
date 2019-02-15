<template>
	<div id="expassign">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1281b2; font-weight: bold">|</span> 
			实验分配
		</div>		
		<div style="height: 20px;"></div>
		<div class='texts'>
			<div> 学校列表： 
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
			</div>	
			<div style="height: 30px;"></div>

			<div style="display: inline-block;"> 实验列表： 
				<template>
				  <el-select class="longselect"
				  			 v-model="exp_value" 
				  			 placeholder="请搜索实验名称"
				  			 filterable>
				    <el-option
				      v-for="item in exp_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
				</template>
					
				<span class="redalert" v-show="!exp_value">*</span>
				<span class="whitedefault"v-show="exp_value">*</span>
			</div>	

		</div><!--end texts-->

		<div class="addexp">
			<el-button type="text" @click="addExp()">+添加</el-button>
		</div>
		<div style="height: 30px;"></div>

		<div class="exps-added">
			<li class="exp-added" v-for='(exp, key) in exps_added'>
				{{exp.name}}
				<el-button type="text" class="rmexp hide-rm-btn" @click="rmExp(key)">-移除</el-button>
			</li>
		</div>

		<div style="height: 30px;"></div>
		<div class="btn-group">
			<el-button class="confirm" v-on:click="preCheck()">确定</el-button>
			<el-button class="goback" v-on:click="goBack()">返回</el-button>
		</div>

	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';
	export default {
		data(){
			return {
				school_value: '',
				school_options: [],
				exp_value:'',
				exp_options: [],
				exps_added: []
			}
		},

		methods: {
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

			reqExpData(){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this);
					this.exp_options = resp.body._list;
				}			
			},	

			addExp(){
				if(this.exp_value) {
					for(let exp of this.exp_options) {
						if(exp.id === this.exp_value) {
							if(! Utils.contains_obj(this.exps_added, exp)) {
								this.exps_added.push(exp);
								return;
							}
						}
					}
				}
			},

			rmExp(key) {
				this.exps_added.splice(key, 1);
			},

			preCheck(){
				if(!this.school_value) {
					Utils.lalert('请选择学校');
					return;
				} else if(!this.exp_value) {
					Utils.lalert('请选择实验');
				} else {
					this.addCreate();
				}
			},

			addCreate(){
				for(let exp of this.exps_added) {
					this.addOneExp(exp.id);
				}
				this.$router.go(-1);
			},

			addOneExp(exp_id){
				let api = global_.exp_assign_create;
				let data = {
					'eid': exp_id,
					'school_id': this.school_value
				}

				this.$http.post(api, data).then((resp)=> {
					Utils.lalert('实验分配成功');
					//this.$router.go(-1);

				}, (err)=>{
					if(err.body.error.hasOwnProperty('eid')) {
						if(err.body.error.eid == 4) {
							Utils.lalert('重复分配');
						}

					} else {
						Utils.err_process.call(this, err, '实验分配失败');
					}
					return;
				});				
			}

		},

		mounted(){
			Utils.page_check_status.call(this);
			$(document).on('click', 'li.exp-added', function(){
				$(this).addClass('highlight').siblings().removeClass('highlight');
				$(this).find('button').removeClass('hide-rm-btn');
				$(this).siblings().find('button').addClass('hide-rm-btn');
			});

			this.reqSchoolData('','', 1);
			this.reqExpData();			
		}
	}
</script>

<style type="text/css" scoped>

.longselect /deep/ .el-input__inner {
	height: 34px;
	width: 300px;
}

.texts {
	width: 450px;
	height: 100%;
	text-align: right;
	vertical-align: bottom;
	display: inline-block;
}

.addexp {
	display: inline-block;
}

.btn-group {
	float: left;
	margin-left: 136px;
}

.redalert {
	color: red;
}

.whitedefault {
	/*same with bg color*/
	color: #ffffff;
}

.exps-added {
	margin-left: 136px;
}

.exp-added {
	box-sizing: border-box;
	padding-left: 15px;
	width: 358px; 
	height: 30px; 
	font-size: 14px;
}

.rmexp {
	float: right;
}
.highlight {
	background: #f7f7f7;
}
.hide-rm-btn{
	display: none;
}

</style>