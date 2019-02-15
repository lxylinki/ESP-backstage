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
					<el-select v-model="school_value" placeholder="请搜索学校名称" v-on:change="filterAssigns()" filterable>
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
							  v-on:keydown="invokeSearch($event)"
							  placeholder="请搜索实验名称">
					</input>

					<div class="searchbtn explist-searchbtn" v-on:click="searchReq()">
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
					<select v-model="rowsPerPage" v-on:change="pageSizeChange()" style="width: 60px; height: 25px;">
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
		      prop="school_name"
		      label="学校名称"
		      min-width="100"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    
		    <el-table-column
		      prop="name"
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
		      	<el-button  class="op" type="text" @click="deleteRow(scope.row)">
		      		取消分配
		      	</el-button>
		      </template>
		    </el-table-column>

		  </el-table>
		</template>

		<div style="height: 40px;"></div>
   		<Pager 	v-bind:current_page='curPage' 
   				v-bind:pages='totalPage'
   		       	@setPage='loadPage'
   		       	></Pager>

	</div>
</template>

<script type="text/javascript">
	import Utils from '@/components/Utils.js';
	import global_ from '@/components/Global.js';
	import Pager from '@/components/Pager.vue';

	export default {
		components: {
			'Pager': Pager
		},
		data(){
			return {
				search_state: '',
				school_value: '',
				school_options: [],
				list: [],
				tableData: [],
				rowsPerPage: 10,
				curPage: 1,
				totalPage: 0,
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
			filterAssigns(){
				this.reqAssignData(this.school_value, this.search_state, 1);
			},

			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.searchReq();
				}
			}, 

			goToAssign(){
				this.$router.push('/expassign');
			},

			pageSizeChange(){
				this.reqAssignData(this.school_value, this.search_state, 1);
			},
			
			reqSchoolData(name, alias, page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await Utils.reqSchoolList.call(this, name, alias, page);
	     			this.school_options = resp.body._list;
	     			this.school_options.unshift({name: '所有学校', id: null});
	     		}			
			},

			reqAssignData(sch_id, exp_name, page){
				let api = global_.exp_assign_list
						+ '?page=' 
						+ page 
						+ '&pagesize=' 
						+ this.rowsPerPage;

				let data = {
					'school_id': sch_id,
					'search': {
						'name': exp_name,
					}
				}

				this.$http.post(api, data).then((resp)=>{
					//console.log(resp);
					//console.log(Object.keys(resp.body.school_list));
					for(let assign of resp.body._list) {
						//if school has been deleted
						if(!Object.keys(resp.body.school_list).includes(assign.school_id)){
							assign.school_name = null;
						} else {
							assign.school_name = resp.body.school_list[assign.school_id].name;
						}
						assign.create_time = Utils.convTime(assign.created_at);
 						assign.update_time = Utils.convTime(assign.updated_at);
					}

					this.tableData = resp.body._list;
					this.totalPage = resp.body.total_page;
					this.filterData(page);

				}, (err)=>{
					Utils.err_process.call(this, err, '请求实验分配列表失败');
				});
			},	

			searchReq(){
				this.reqAssignData(this.school_value, this.search_state, 1);
			},

			filterData(page){
				this.list = this.tableData;
				this.curPage = page;
			},

			loadPage(page) {
				this.reqAssignData(this.school_value, this.search_state, page);
			},

			deleteRow(row) {
				var _this = this;
				Utils.lconfirm("确定取消实验分配？", function(){_this.delAssign(row)});	
			},

			delAssign(row) {
				//console.log(row);
				let api = global_.exp_assign_delete;
				let data = {
					'id': row.id
				}
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('取消实验分配成功');
					this.loadPage(this.curPage);
					
				}, (err)=>{
					Utils.err_process.call(this, err, '取消实验分配失败');
				});
			}
		},
		mounted(){
			Utils.page_check_status.call(this);
			this.reqSchoolData('', '', 1);
			this.reqAssignData(this.school_value, this.search_state, 1);
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