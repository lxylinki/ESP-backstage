<template>
	<div id="quesmanage">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			试题管理
		</div>
		<div style="height: 20px;"></div>

		<div class="selectclass">
			<div style="display: inline-block; width: 20px;"></div>
			<div class="pickexptitle">实验： </div>
			<div style="display: inline-block;">
				  <el-select v-model="exp_value" filterable placeholder="请搜索实验名称" v-on:change="filterQs()">
				    <el-option
				      v-for="item in exp_options"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>		
			</div>
			<div style="display: inline-block; width: 20px;"></div>
			<div class="pickquestype">题型： </div>
			<div style="display: inline-block;">
				  <el-select v-model="qtype_value" placeholder="请选择题型" v-on:change="">
				    <el-option
				      v-for="item in qtype_options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>					
			</div>

			<div class="searchwindow admin-searchwindow">

				<input class="searchinput" 
						  v-model="search_state"
						  v-on:keydown="invokeSearch($event)"
						  placeholder="请搜索试题名称">
				</input>

				<div class="searchbtn admin-searchbtn" v-on:click="searchReq()">
					<i class="el-icon-search" ></i>
				</div>

			</div>
		</div>

	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';

	export default {
		data(){
			return {
				search_state:'',
				exp_value:'',
				qtype_value:'',
				exp_options:[],
				qtype_options:[
					{
						label: '全部',
						value: null
					},
					{
						label: '单选',
						value: 1
					},
					{
						label: '多选',
						value: 2
					}				
				]
			}
		},

		methods: {
			fillExpSelect(){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqExpList.call(this);
					this.exp_options = resp.body._list;
					this.exp_options.unshift({'name': '所有实验', 'id': null});
				}
			},

			filterQs(){
			}
		},
		mounted(){
			this.fillExpSelect();
		}
	}
</script>

<style type="text/css" scoped>
.selectclass {
	background: white;
}

.pickexptitle {
	display: inline-block; 
	line-height: 70px;
}

.pickquestype {
	display: inline-block;
}
</style>