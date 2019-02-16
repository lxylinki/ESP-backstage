<template>
	<div id="schooladmin">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			校管理员
		</div>

		<div class="selectclass">

			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="addSchAdmin()">添加</el-button>
			</div>

			<div class="searchwindow admin-searchwindow">

				<input class="searchinput" 
						  v-model="search_state"
						  v-on:keydown="invokeSearch($event)"
						  placeholder="请搜索真实姓名">
				</input>

				<div class="searchbtn admin-searchbtn" v-on:click="searchReq()">
					<i class="el-icon-search" ></i>
				</div>

			</div>
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

		<template>
		  <el-table
		    :data="list"
		    style="width: 100%;">

			<el-table-column
			  label="序号"
			  type="index"
			  min-width="100">
			</el-table-column>

		    <el-table-column
		      prop="user_id"
		      label="ID"
		      min-width="100">
		    </el-table-column>
		    
		    <el-table-column
		      prop="school_name"
		      label="学校名称"
		      min-width="100">
		    </el-table-column>
		    		    
		    <el-table-column
		      prop="username"
		      label="用户名"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop="realname"
		      label="真实姓名"
		      min-width="100">
		    </el-table-column>

		    <el-table-column
		      prop=""
		      label="操作"
		      min-width="100">

		      <template slot-scope="scope">

		      	<el-button  class="op" type="text" @click="editRow(scope.row)">
		      		<i class="iconfont">&#xe61a;</i>编辑
		      	</el-button>
		      	<!--
		      	<el-button class="op" type="text" @click="deleteRow(scope.row)">
		      		<i class="iconfont">&#xe7e0;</i>删除
		      	</el-button> -->

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
	import Pager from '@/components/Pager.vue';
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';

	export default {
		components: {
			'Pager': Pager 
		},

		data(){
			return {
				mod_name: 'sch-admin',
				search_state: '',
				list: [],
				tableData: [],
				curPage: 1,
				totalPage: 0,
				rowsPerPage: 10,
				loading: null,
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
			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.searchReq();
				}
			},

			addSchAdmin(){
				this.$router.push('/schadminadd');
			},

			editRow(row){
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$store.commit('setRowsPerPage', this.rowsPerPage);
				this.$router.push('/schadminedit');					
			},

			reqMngList(usr_name, real_name, sch_name, page){
				return new Promise((resolve, reject)=>{
					var api = global_.schadmin_list
							 + '?page=' 
							 + page 
							 + '&pagesize=' 
							 + this.rowsPerPage;
					// status null: all
					let data = {
						'status': this.status_value,
						'gender': this.gender,
						'search': {
							'username': usr_name,
							'realname': real_name,
							'school_name':sch_name
						}
					}
					this.$http.post(api, data).then((resp)=>{
						//console.log(resp);
						layer.close(this.loading);
						resolve(resp);
						
					},(err)=>{
						layer.close(this.loading);
						Utils.err_process.call(this, err, '请求校管理员列表失败');
					});
				});
			},

			reqData(usr_name, real_name, sch_name, page){
				asyncReq.call(this);
				async function asyncReq(){
					let resp = await this.reqMngList(usr_name, real_name, sch_name, page);

					this.$store.commit('sign', this.mod_name);
			    	this.$store.commit('setRowNumBefore', resp.body.total);
			    	this.$store.commit('setRowNumAfter', resp.body.total);
			    	this.$store.commit('setRowsPerPage', this.rowsPerPage);

					this.tableData = resp.body._list;
					this.totalPage = resp.body.total_page;
					this.filterData(page);
				}
			},

		    searchReq() {
		    	this.reqData('', this.search_state, '', 1);
		    },

		    pageSizeChange(){
		    	this.reqData('', this.search_state, '', 1);
		    },

		    loadPage(page) {
		    	this.reqData('', this.search_state, '', page);
		    },

			filterData(page) {
				this.list = this.tableData;
				this.curPage = page;
			},
		},
		beforeMount(){
			this.loading = layer.load(1, {shade: false});
		},
		mounted(){
			Utils.page_check_status.call(this);
			
			var name = this.$store.state.last_author;

			if(name === this.mod_name) {
				var before = this.$store.state.row_num_before,
					after = this.$store.state.row_num_after,
					pagesize = this.$store.state.rows_per_page,
					keyword = this.$store.state.current_search,
					curpage = this.$store.state.current_page;

				if (pagesize > 0) {
					this.rowsPerPage = pagesize;
				}

				if (keyword) {
					this.search_state = keyword;
				}

				//item added: default append to list end
				if(after > before) {
					this.curPage = Math.ceil(after / this.rowsPerPage);	

				} else if(curpage > 0) {
					this.curPage = curpage;
				} 				
			}

			this.reqData('', '', '', this.curPage);
		}
	}
</script>

<style type="text/css" scoped>

.addbtndiv {
	display: inline-block;
	margin-top: 15px;
}

.btnfocus {
	border-top: 1px solid #409eff;
	border-bottom: 1px solid #409eff;
	border-right: 1px solid #409eff;
}

.notinuse {
	color: #a1a1a1;
}
</style>