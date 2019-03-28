<template>
	<div id="admin">
		<div style="width: 100%; height: 35px;">
			<span style="color: #1890ff; font-weight: bold">|</span> 
			后台用户
		</div>

		<div class="selectclass">

			<div class="addbtndiv">
				<el-button class="addbtn" v-on:click="addAdmin()">添加</el-button>
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
		    style="width: 100%;"
		    :row-class-name="row_name">

			<el-table-column
			  label="序号"
			  :formatter="formatter"
			  min-width="100">
			</el-table-column>
			
		    <el-table-column
		      prop="username"
		      label="用户名"
		      min-width="100"
		      :show-overflow-tooltip="true">
		    </el-table-column>
		    
		    <el-table-column
		      prop="realname"
		      label="真实姓名"
		      min-width="100">
		    </el-table-column>
		    		    
		    <el-table-column
		      prop=""
		      label="状态"
		      min-width="100">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.status == 1">启用</span>
		      	<span class="notinuse" v-if="scope.row.status == 0">失效</span>
		      </template>
		    </el-table-column>

		    <el-table-column
		      prop=""
		      label="操作"
		      min-width="100">

		      <template slot-scope="scope">

		      	<el-button  class="op" type="text" @click="editRow(scope.row)">
		      		<i class="iconfont">&#xe61a;</i>编辑
		      	</el-button>
		      	<!--<el-button type="text" @click="tableData.splice(scope.$index, 1)">-->
		      	<!--<el-button class="op" type="text" @click="delRow(scope.$index)">-->
		      	<el-button class="op" type="text" @click="deleteRow(scope.row)">
		      		<i class="iconfont">&#xe7e0;</i>删除
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
	import Pager from '@/components/Pager.vue';
	import global_ from '@/components/Global.js';
	import Utils from '@/components/Utils.js';

	export default {
		components: {
			'Pager': Pager 
		},

		data(){
			return {
				mod_name: 'admin',
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
			row_name({row, rowIndex}){
				row.ridx = rowIndex;
			},
			
			formatter(row, column ,cellValue) {
				return this.rowsPerPage * (this.curPage - 1)  + (1+ row.ridx);
			},
			
			invokeSearch(e) {
				if(e.keyCode == 13) {
					this.searchReq();
				}
			},

			addAdmin(){
				this.$router.push('/adminadd');
			},

			deleteRow(row){
				var _this = this;
				Utils.lconfirm("确定删除后台用户？", function(){_this.delAdmin(row)});				
			},

			delAdmin(row){
				var api = global_.admin_delete;
				let data = {
					'id': row.id
				}
				this.$http.post(api, data).then((resp)=>{
					Utils.lalert('删除后台用户成功');
					this.loadPage(this.curPage);

				}, (err)=>{
					Utils.err_process.call(this, err, '删除后台用户失败');
				});
			},

			reqAdmList(username, realname, status, page){
				let api = global_.admin_list
						+ '?page=' 
						+ page 
						+ '&pagesize=' 
						+ this.rowsPerPage;

				let data = {
					'status': status,
					'search': {
						'username': username,
						'realname': realname
					}
				}

				this.$http.post(api, data).then((resp)=>{
			    	this.$store.commit('sign', this.mod_name);
			    	this.$store.commit('setRowNumBefore', resp.body.total);
			    	this.$store.commit('setRowNumAfter', resp.body.total);
			    	this.$store.commit('setRowsPerPage', this.rowsPerPage);

					//console.log(resp);
					this.tableData = resp.body._list;
					this.totalPage = resp.body.total_page;
					this.filterData(page);
					layer.close(this.loading);

				}, (err)=>{
					layer.close(this.loading);
					Utils.err_process.call(this, err, '请求后台用户列表失败');
				})

			},

			editRow(row){
				this.$store.commit('sign', this.mod_name);
				this.$store.commit('setEdit', true);
				this.$store.commit('pickRow', row);
				this.$store.commit('setCurPage', this.curPage);
				this.$store.commit('setCurSearch', this.search_state);
				this.$store.commit('setRowsPerPage', this.rowsPerPage);
				this.$router.push('/adminedit');				
			},

			searchReq(){
				this.reqAdmList('', this.search_state, null, 1);
			},

			filterData(page) {
				this.list = this.tableData;
				this.curPage = page;
			},

			loadPage(page) {
				this.reqAdmList('', this.search_state, null, page);
			},

			pageSizeChange(){
				this.reqAdmList('', this.search_state, null, 1);
			}
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
				//change to list start
				/*
				if(after > before) {
					this.curPage = Math.ceil(after / this.rowsPerPage);	

				} else if(curpage > 0) {
					this.curPage = curpage;
				} */				
			}
			this.reqAdmList('', this.search_state, null, 1);
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