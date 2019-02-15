<template>
	<div id="expassignlist">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span>  
			<!--<span class="pagetitle">实验列表</span>-->
			实验分配
		</div>

		<div class="selectclass">

			<div class="statustitle">学校：</div>
			
				<div style="display: inline-block;">
					<el-select v-model="school_value" placeholder="请搜索学校名称" v-on:change="" filterable>
						<el-option
						  v-for="item in school_options"
						  :key="item.id"
						  :label="item.name"
						  :value="item.id">
						</el-option>
					</el-select>
				</div>

				<div class="searchwindow explist-searchwindow">

					<input class="searchinput" 
							  v-model="search_state"
							  v-on:keydown=""
							  placeholder="请搜索实验名称">
					</input>

					<div class="searchbtn explist-searchbtn" v-on:click="">
						<i class="el-icon-search" ></i>
					</div>

				</div>
		</div>

		<div style="display: flex; justify-content: space-between; align-items: baseline;">
			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="goToAssign()">分配</el-button>
			</div>

			<div style="display: inline-block; float: right; margin: 10px;">
				<span>显示 </span>
					<select v-model="rowsPerPage" v-on:change="" style="width: 60px; height: 25px;">
						<option v-for="item in row_nums" v-bind:value="item.value">
							{{item.label}}
						</option>
					</select>
				<span> 条</span>
			</div>
		</div>

		<template>
		  <el-table
		    :data="list"
		    style="width: 100%;">
		    <el-table-column
		      prop=""
		      label="学校名称"
		      min-width="100"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    
		    <el-table-column
		      prop=""
		      label="实验名称"
		      min-width="100">
		    </el-table-column>

		     <el-table-column
		      prop="create_time"
		      label="创建时间"
		      min-width="100">
		    </el-table-column>

		     <el-table-column
		      prop="update_time"
		      label="更新时间"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="operation"
		      label="操作"
		      min-width="100">

		      <template slot-scope="scope">
		      	<el-button  class="op" type="text" @click="">
		      		取消分配
		      	</el-button>
		      </template>
		    </el-table-column>

		  </el-table>
		</template>


	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';
	export default {
		data(){
			return {
				search_state: '',
				school_value: '',
				school_options: [],
				list: [],
				tableData: [],
				rowsPerPage: 10,
				row_nums: [
					{
						label: '5',
						value: 5
					},
					{
						label: '10',
						value: 10
					},
					{
						label: '15',
						value: 15
					},
					{
						label: '20',
						value: 20
					},
					{
						label:'50',
						value: 50
					}
				],
			}
		},
		methods: {
			goToAssign(){
				this.$router.push('/expassign');
			},
			
			reqSchoolData(name, alias, page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqSchoolList.call(this, name, alias, page);
	     			this.school_options = resp.body._list;
	     			this.school_options.unshift({name: '所有学校', id: null});
	     		}			
			},

			reqAssignData(){
				let api = global_.exp_assign_list;
				this.$http.post(api, {}).then((resp)=>{
					console.log(resp);
				}, (err)=>{

				});
			},			
		},
		mounted(){
			Utils.page_check_status.call(this);
			this.reqSchoolData('','', 1);
			this.reqAssignData();
		}
	}
</script>

<style type="text/css" scoped>
.selectclass {
	background: #ffffff;
}

.addbtndiv {
	display: inline-block;
	margin-bottom: 15px;
}

.statustitle {
	display: inline-block; 
	line-height: 60px;
}

.explist-searchwindow {
	position: relative;
	top: 15px;
	margin-top: 0px;
}

</style>